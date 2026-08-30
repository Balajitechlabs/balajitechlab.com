const fs = require('fs');
const path = require('path');

const PROJECTS = [
  { id: 'quickdash', repo: 'balajitechlabs/quickdash' },
  { id: 'discord-music-card', repo: 'balajitechlabs/discord-music-card' },
  { id: 'universal-updater', repo: 'balajitechlabs/universal-updater-raycast' },
  { id: 'play-console-tools', repo: 'balajitechlabs/google-play-console-tools' },
  { id: 'password-generator', repo: 'balajitechlabs/password-genaration' }
];

const PUBLIC_DIR = path.join(__dirname, '../../public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'project-details.json');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchWithAuth(url) {
  const headers = {
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'balajitechlab.com-updater'
  };
  if (GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
  }
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function run() {
  console.log('Starting GitHub project details update for balajitechlabs...');
  
  let projectData = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      projectData = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch (e) {
      console.warn('Failed to parse existing project-details.json:', e);
    }
  }

  for (const proj of PROJECTS) {
    try {
      console.log(`Fetching details for ${proj.id} (${proj.repo})...`);
      const repoDetails = await fetchWithAuth(`https://api.github.com/repos/${proj.repo}`);
      
      let totalDownloads = 0;
      let latestVersion = '';
      let latestReleaseAt = repoDetails.pushed_at || repoDetails.updated_at || '';
      
      try {
        const releases = await fetchWithAuth(`https://api.github.com/repos/${proj.repo}/releases`);
        if (releases && releases.length > 0) {
          latestVersion = releases[0].tag_name;
          latestReleaseAt = releases[0].published_at || latestReleaseAt;
          
          for (const release of releases) {
            if (release.assets) {
              for (const asset of release.assets) {
                totalDownloads += asset.download_count || 0;
              }
            }
          }
        }
      } catch (relErr) {
        console.warn(`No releases or error fetching releases for ${proj.repo}:`, relErr.message);
      }

      projectData[proj.id] = {
        stars: repoDetails.stargazers_count || 0,
        forks: repoDetails.forks_count || 0,
        downloads: totalDownloads,
        version: latestVersion,
        latestReleaseAt: latestReleaseAt,
        updatedAt: new Date().toISOString()
      };
      console.log(`Successfully updated ${proj.id}: ⭐ ${projectData[proj.id].stars} | 📦 ${projectData[proj.id].downloads} downloads`);
    } catch (err) {
      console.error(`Error updating project ${proj.id}:`, err.message);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(projectData, null, 2));
  console.log(`Saved updated project details to ${OUTPUT_FILE}`);
}

run();
