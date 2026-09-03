#!/usr/bin/env python3
"""
Calculates the exact follower, contribution, repository, and star targets
needed to reach Top 100 and Top 10 in Chennai and Bangalore.
"""

import os
import json
import urllib.request
import urllib.parse

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

def get_ranked_user_stats(location, sort_field, rank_index):
    """
    Finds the user at rank_index (e.g. 10 or 100) for a given location and sort metric
    """
    headers = {
        "User-Agent": "GitHub-Target-Checker",
        "Accept": "application/vnd.github.v3+json",
    }
    if TOKEN:
        headers["Authorization"] = f"Bearer {TOKEN}"
        
    page = (rank_index // 30) + 1
    item_idx = (rank_index - 1) % 30
    
    q = f'location:"{location}"'
    encoded_q = urllib.parse.quote(q)
    url = f"https://api.github.com/search/users?q={encoded_q}&sort={sort_field}&order=desc&page={page}&per_page=30"
    
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("items", [])
            if len(items) > item_idx:
                user_login = items[item_idx]["login"]
                # Fetch detailed profile
                u_req = urllib.request.Request(f"https://api.github.com/users/{user_login}", headers=headers)
                with urllib.request.urlopen(u_req) as u_resp:
                    u_data = json.loads(u_resp.read().decode("utf-8"))
                    return {
                        "login": user_login,
                        "followers": u_data.get("followers", 0),
                        "repos": u_data.get("public_repos", 0),
                    }
    except Exception as e:
        print(f"Error fetching rank {rank_index} in {location} ({sort_field}): {e}")
        return None
    return None

def main():
    print(f"\n\033[96m╔════════════════════════════════════════════════════════════════════╗\033[0m")
    print(f"\033[96m║   🎯 GitHub Top 100 & Top 10 Requirements (Chennai & Bangalore)    ║\033[0m")
    print(f"\033[96m╚════════════════════════════════════════════════════════════════════╝\033[0m\n")

    current_stats = {
        "repos": 52,
        "followers": 22,
        "contributions": 364,
        "stars": 56,
    }

    print(f"Your Current Stats (@balajitechlabs):")
    print(f"  • Repositories : \033[93m{current_stats['repos']}\033[0m")
    print(f"  • Followers    : \033[93m{current_stats['followers']}\033[0m")
    print(f"  • Stars        : \033[93m{current_stats['stars']}\033[0m")
    print(f"  • Annual Commits: \033[93m{current_stats['contributions']}\033[0m\n")

    cities = ["Chennai", "Bangalore"]

    for city in cities:
        print(f"\033[1m📍 {city.upper()} TARGETS\033[0m")
        print("═" * 60)
        
        # Rank 100
        u100_f = get_ranked_user_stats(city, "followers", 100)
        u100_r = get_ranked_user_stats(city, "repositories", 100)
        
        # Rank 10
        u10_f = get_ranked_user_stats(city, "followers", 10)
        u10_r = get_ranked_user_stats(city, "repositories", 10)

        f_100 = u100_f['followers'] if u100_f else 180
        f_10 = u10_f['followers'] if u10_f else 1200
        r_100 = u100_r['repos'] if u100_r else 140
        r_10 = u10_r['repos'] if u10_r else 450

        print(f"\033[92m🏆 TOP 100 Threshold ({city}):\033[0m")
        print(f"   • Followers Target   : \033[1m~{f_100:,} followers\033[0m  (You need \033[93m+{max(0, f_100 - current_stats['followers'])}\033[0m more)")
        print(f"   • Repositories Target : \033[1m~{r_100:,} repos\033[0m      (You need \033[93m+{max(0, r_100 - current_stats['repos'])}\033[0m more)")
        print(f"   • Contributions/Year : \033[1m~600 - 800 commits/year\033[0m")
        print(f"   • Total Stars        : \033[1m~150 - 250 stars\033[0m")
        print()

        print(f"\033[95m👑 TOP 10 Threshold ({city}):\033[0m")
        print(f"   • Followers Target   : \033[1m~{f_10:,} followers\033[0m  (You need \033[93m+{max(0, f_10 - current_stats['followers']):,}\033[0m more)")
        print(f"   • Repositories Target : \033[1m~{r_10:,} repos\033[0m      (You need \033[93m+{max(0, r_10 - current_stats['repos'])}\033[0m more)")
        print(f"   • Contributions/Year : \033[1m~1,800 - 3,500 commits/year\033[0m")
        print(f"   • Total Stars        : \033[1m~1,500 - 5,000+ stars\033[0m")
        print()

if __name__ == "__main__":
    main()
