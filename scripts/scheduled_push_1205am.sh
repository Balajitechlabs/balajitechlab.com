#!/usr/bin/env bash
# ==============================================================================
# OS-Level Scheduled Git Commit & Push Runner (macOS Native LaunchAgent)
# Runs independently of Antigravity / IDE at 12:05 AM on 5th Sep 2026.
# ==============================================================================

PROJECT_DIR="/Users/btl/Documents/btl-all-projects/balajitechlab.com"
LOG_FILE="$HOME/Library/Logs/btl-scheduled-commit.log"
PLIST_FILE="$HOME/Library/LaunchAgents/com.btl.scheduled-commit.plist"

echo "=== [$(date)] Starting Scheduled Git Commit & Push ===" >> "$LOG_FILE"

# Export standard macOS paths for git and ssh
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

cd "$PROJECT_DIR" || {
  echo "[$(date)] ERROR: Failed to cd to $PROJECT_DIR" >> "$LOG_FILE"
  exit 1
}

# Stage files
git add src/components/LoadingScreen.tsx src/styles/common/loading-screen.css 'src/app/go/[slug]/page.tsx' src/components/RedirectBridge.tsx >> "$LOG_FILE" 2>&1

# Check if there are changes to commit
if git diff --staged --quiet; then
  echo "[$(date)] No changes staged. Skipping commit." >> "$LOG_FILE"
else
  # Commit
  git commit -m "perf(ui): optimize welcome splash screen for mobile viewports and apply pure monochrome theme" >> "$LOG_FILE" 2>&1
  
  # Push to GitHub
  git push origin main >> "$LOG_FILE" 2>&1
  echo "[$(date)] SUCCESS: Commit pushed to origin/main." >> "$LOG_FILE"
fi

# Self-clean and unload LaunchAgent
if [ -f "$PLIST_FILE" ]; then
  launchctl unload "$PLIST_FILE" 2>/dev/null
  rm -f "$PLIST_FILE" 2>/dev/null
  echo "[$(date)] Cleaned up LaunchAgent plist." >> "$LOG_FILE"
fi

echo "=== [$(date)] Scheduled Task Completed ===" >> "$LOG_FILE"
