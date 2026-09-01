import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "Cloudflare-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface GraphQLRepo {
  stargazerCount: number;
  forkCount: number;
  isFork: boolean;
  primaryLanguage: { name: string } | null;
}

function calcStreaks(days: ContributionDay[]): {
  current: number;
  longest: number;
  totalThisYear: number;
} {
  const sorted = [...days].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalThisYear = sorted.reduce((s, d) => s + d.contributionCount, 0);

  let longest = 0;
  let run = 0;
  for (const d of sorted) {
    if (d.contributionCount > 0) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  // Timezone-aware today calculation (Asia/Kolkata)
  const now = new Date();
  const todayIST = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
  const todayUTC = now.toISOString().slice(0, 10);
  const effectiveToday = todayIST >= todayUTC ? todayIST : todayUTC;

  const reversed = [...sorted].reverse();
  let current = 0;

  for (const d of reversed) {
    if (d.date > effectiveToday) continue;
    if (d.date === effectiveToday && d.contributionCount === 0) {
      continue; // Today is still ongoing in IST
    }
    if (d.contributionCount > 0) {
      current++;
    } else {
      break; // Stop at first missed non-contributing day
    }
  }

  return {
    current,
    longest,
    totalThisYear,
  };
}

export async function GET() {
  try {
    let token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

    // Support Cloudflare Workers / Pages runtime bindings via @opennextjs/cloudflare
    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare");
      const cfContext = getCloudflareContext();
      if (cfContext?.env) {
        const env = cfContext.env as Record<string, string | undefined>;
        token = env.GITHUB_TOKEN || env.GH_TOKEN || token;
      }
    } catch {
      // Local Next.js node environment
    }

    // 1. Primary Engine: Direct Authenticated GitHub GraphQL API
    if (token) {
      try {
        const gqlRes = await fetch("https://api.github.com/graphql", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
            "User-Agent": "balajitechlab.com",
          },
          body: JSON.stringify({
            query: `{
              user(login: "balajitechlabs") {
                repositories(first: 100, ownerAffiliations: [OWNER]) {
                  totalCount
                  nodes {
                    stargazerCount
                    forkCount
                    isFork
                    primaryLanguage {
                      name
                    }
                  }
                }
                followers {
                  totalCount
                }
                contributionsCollection {
                  totalCommitContributions
                  restrictedContributionsCount
                  contributionCalendar {
                    totalContributions
                    weeks {
                      contributionDays {
                        date
                        contributionCount
                      }
                    }
                  }
                }
              }
            }`,
          }),
          cache: "no-store",
        });

        if (gqlRes.ok) {
          const gqlData = await gqlRes.json();
          const userData = gqlData?.data?.user;

          if (userData) {
            const reposList: GraphQLRepo[] = userData.repositories?.nodes ?? [];
            const totalRepos = userData.repositories?.totalCount ?? 33;
            const totalFollowers = userData.followers?.totalCount ?? 1;

            const totalStars = reposList.reduce(
              (sum, r) => sum + (r.isFork ? 0 : r.stargazerCount),
              0
            );

            const weeks: { contributionDays: ContributionDay[] }[] =
              userData.contributionsCollection?.contributionCalendar?.weeks ?? [];
            const allDays = weeks.flatMap((w) => w.contributionDays);

            const streak = calcStreaks(allDays);

            const calendar = allDays.map((d) => {
              let level = 0;
              if (d.contributionCount >= 11) level = 4;
              else if (d.contributionCount >= 6) level = 3;
              else if (d.contributionCount >= 3) level = 2;
              else if (d.contributionCount >= 1) level = 1;
              return {
                date: d.date,
                count: d.contributionCount,
                level,
              };
            });

            return NextResponse.json(
              {
                repos: totalRepos,
                stars: totalStars,
                followers: totalFollowers,
                totalContributions:
                  userData.contributionsCollection?.contributionCalendar
                    ?.totalContributions ?? streak.totalThisYear,
                streak,
                calendar,
                graphqlOk: true,
              },
              { headers: NO_CACHE_HEADERS }
            );
          }
        }
      } catch {
        // Fall through to public fallback engine
      }
    }

    // 2. Production Resilience Fallback Engine (Public Endpoints)
    const [userRes, reposRes, calRes] = await Promise.all([
      fetch("https://api.github.com/users/balajitechlabs", {
        headers: { "User-Agent": "balajitechlab.com" },
        cache: "no-store",
      }).catch(() => null),
      fetch("https://api.github.com/users/balajitechlabs/repos?per_page=100&type=owner", {
        headers: { "User-Agent": "balajitechlab.com" },
        cache: "no-store",
      }).catch(() => null),
      fetch("https://github-contributions-api.jogruber.de/v4/balajitechlabs?y=last", {
        cache: "no-store",
      }).catch(() => null),
    ]);

    const user = userRes && userRes.ok ? await userRes.json() : { public_repos: 33, followers: 1 };
    const repos = reposRes && reposRes.ok ? await reposRes.json() : [];
    const calData = calRes && calRes.ok ? await calRes.json() : null;

    const totalStars = Array.isArray(repos)
      ? repos.reduce(
          (sum: number, r: any) => sum + (r.fork ? 0 : r.stargazers_count || 0),
          0
        )
      : 0;

    let calendar: { date: string; count: number; level: number }[] = [];
    if (calData && Array.isArray(calData.contributions)) {
      calendar = calData.contributions.map((c: any) => ({
        date: c.date,
        count: c.count || 0,
        level: c.level || 0,
      }));
    }

    const allDays: ContributionDay[] = calendar.map((c) => ({
      date: c.date,
      contributionCount: c.count,
    }));
    const streak = allDays.length > 0 ? calcStreaks(allDays) : { current: 3, longest: 7, totalThisYear: 120 };

    return NextResponse.json(
      {
        repos: user.public_repos ?? 33,
        stars: totalStars,
        followers: user.followers ?? 1,
        totalContributions: streak.totalThisYear,
        streak,
        calendar,
        graphqlOk: false,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch {
    return NextResponse.json(
      {
        repos: 33,
        stars: 0,
        followers: 1,
        totalContributions: 120,
        streak: { current: 3, longest: 7, totalThisYear: 120 },
        calendar: [],
        graphqlOk: false,
      },
      { status: 200, headers: NO_CACHE_HEADERS }
    );
  }
}
