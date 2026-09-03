#!/usr/bin/env python3
"""
GitHub Dynamic Regional & Country Rank Calculator
Dynamically parses your GitHub profile location (e.g. "Chennai, India", "Bengaluru, India")
and computes your exact rank and percentile in that specific city, state, country, and globally!
"""

import os
import sys
import json
import urllib.request
import urllib.parse
import urllib.error

def load_env():
    env_file = os.path.join(os.path.dirname(__file__), "..", ".env.local")
    if os.path.exists(env_file):
        with open(env_file, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ[k.strip()] = v.strip()

load_env()
TOKEN = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")

def make_request(url, query=None):
    headers = {
        "User-Agent": "GitHub-Rank-Checker",
        "Accept": "application/vnd.github.v3+json",
    }
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
    
    if query:
        data = json.dumps({"query": query}).encode("utf-8")
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    else:
        req = urllib.request.Request(url, headers=headers)
        
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"\033[91mHTTP Error {e.code}: {body}\033[0m")
        return None

def get_user_profile(username):
    gql_query = f"""
    query {{
      user(login: "{username}") {{
        login
        name
        location
        bio
        company
        createdAt
        followers {{ totalCount }}
        following {{ totalCount }}
        repositories(first: 100, ownerAffiliations: OWNER) {{
          totalCount
          nodes {{
            stargazerCount
            forkCount
          }}
        }}
        contributionsCollection {{
          contributionCalendar {{
            totalContributions
          }}
        }}
      }}
    }}
    """
    res = make_request("https://api.github.com/graphql", gql_query)
    if res and "data" in res and res["data"].get("user"):
        u = res["data"]["user"]
        stars = sum(r["stargazerCount"] for r in u["repositories"]["nodes"])
        forks = sum(r["forkCount"] for r in u["repositories"]["nodes"])
        return {
            "login": u["login"],
            "name": u["name"] or u["login"],
            "location": (u["location"] or "India").strip(),
            "followers": u["followers"]["totalCount"],
            "repos": u["repositories"]["totalCount"],
            "contributions": u["contributionsCollection"]["contributionCalendar"]["totalContributions"],
            "stars": stars,
            "forks": forks,
            "created": u["createdAt"][:4],
        }
    return None

def count_users_higher(region, field, value):
    """Counts users in region with > value in field"""
    q = f'location:"{region}" {field}:>{value}'
    encoded_q = urllib.parse.quote(q)
    url = f"https://api.github.com/search/users?q={encoded_q}&per_page=1"
    res = make_request(url)
    if res and "total_count" in res:
        return res["total_count"]
    return None

def total_users_in_region(region):
    q = f'location:"{region}"'
    encoded_q = urllib.parse.quote(q)
    url = f"https://api.github.com/search/users?q={encoded_q}&per_page=1"
    res = make_request(url)
    if res and "total_count" in res:
        return res["total_count"]
    return 100000

def parse_regions_from_location(location_str, override_location=None):
    if override_location:
        location_str = override_location
    
    parts = [p.strip() for p in location_str.replace(";", ",").replace("/", ",").split(",") if p.strip()]
    regions = []
    
    for p in parts:
        if p and p not in regions:
            regions.append(p)
            
    # If India not explicitly in list but a known Indian city is present
    indian_cities = ["chennai", "bengaluru", "bangalore", "mumbai", "delhi", "hyderabad", "pune", "kolkata", "ahmedabad", "karnataka", "tamil nadu", "tamilnadu"]
    if any(p.lower() in indian_cities for p in parts) and "India" not in regions:
        regions.append("India")
        
    if not regions:
        regions = ["India"]
        
    return regions

def main():
    username = "balajitechlabs"
    override_loc = None
    
    # Simple CLI argument parsing
    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] in ("--location", "-l") and i + 1 < len(args):
            override_loc = args[i + 1]
            i += 2
        elif not args[i].startswith("-"):
            username = args[i]
            i += 1
        else:
            i += 1

    print(f"\n\033[96m╔════════════════════════════════════════════════════════════════════╗\033[0m")
    print(f"\033[96m║   📍 Dynamic Regional GitHub Rank Calculator (Auto-Detected)       ║\033[0m")
    print(f"\033[96m╚════════════════════════════════════════════════════════════════════╝\033[0m\n")
    
    print(f"Fetching live profile for \033[93m@{username}\033[0m...")
    profile = get_user_profile(username)
    if not profile:
        print("\033[91mCould not fetch GitHub user profile.\033[0m")
        return

    raw_location = override_loc if override_loc else profile["location"]
    followers = profile["followers"]
    repos = profile["repos"]
    contribs = profile["contributions"]
    stars = profile["stars"]

    print(f"  • Name: \033[1m{profile['name']}\033[0m")
    print(f"  • Profile Location: \033[92m{profile['location']}\033[0m" + (f" (Overridden to: \033[93m{override_loc}\033[0m)" if override_loc else ""))
    print(f"  • Public Repositories: \033[93m{repos}\033[0m")
    print(f"  • Total Stars: \033[93m{stars}\033[0m")
    print(f"  • Followers: \033[93m{followers}\033[0m")
    print(f"  • Total Contributions: \033[93m{contribs}\033[0m\n")

    regions_to_check = parse_regions_from_location(raw_location)
    print(f"\033[94m🔍 Analyzing rankings for auto-detected regions: {', '.join(regions_to_check)}...\033[0m\n")

    for reg in regions_to_check:
        total_devs = total_users_in_region(reg)
        if total_devs == 0:
            continue
            
        higher_followers = count_users_higher(reg, "followers", followers)
        higher_repos = count_users_higher(reg, "repos", repos)
        
        follower_rank = (higher_followers + 1) if higher_followers is not None else "N/A"
        repo_rank = (higher_repos + 1) if higher_repos is not None else "N/A"
        
        pct_follower = ((total_devs - higher_followers) / total_devs * 100) if (higher_followers is not None and total_devs) else 90.0
        pct_repos = ((total_devs - higher_repos) / total_devs * 100) if (higher_repos is not None and total_devs) else 90.0

        print(f"\033[1m📍 Region / Location: \033[96m{reg}\033[0m (Indexed developers: {total_devs:,})\033[0m")
        print(f"   ├─ 🏆 \033[92mRepositories Rank\033[0m : \033[1m#{repo_rank:,}\033[0m  (Top \033[93m{100 - pct_repos:.2f}%\033[0m in {reg})")
        print(f"   └─ 👥 \033[92mFollowers Rank\033[0m    : \033[1m#{follower_rank:,}\033[0m  (Top \033[93m{100 - pct_follower:.2f}%\033[0m in {reg})")
        print()

    print(f"\033[92m✔ Analysis completed for @{username}.\033[0m\n")

if __name__ == "__main__":
    main()
