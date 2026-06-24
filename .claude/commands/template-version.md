Report the ai-dev-template version status: what's installed vs the latest published, and whether an update is needed.

Steps:
1. Read the install stamp — `./.ai-dev-template.json` (repo) or `~/.claude/.ai-dev-template.json` (global).
   Report the installed `version` + `installedAt` + `mode`. If neither exists, say it wasn't installed
   via apply-template and stop (suggest running the install one-liner from README).
2. Get the latest published version from GitHub:
   `gh api repos/nqthaitn/ai-dev-template/contents/VERSION -q '.content' | base64 -d`
   (fallback: curl `https://raw.githubusercontent.com/nqthaitn/ai-dev-template/master/VERSION`).
3. Compare installed vs latest:
   - Equal → "✓ Up to date (vX.Y.Z)".
   - Installed older → "⚠ Update available: X → Y", summarize what changed from `CHANGELOG.md`,
     and give the update command:
     `gh api repos/nqthaitn/ai-dev-template/contents/install.sh -q '.content' | base64 -d | MODE=both FORCE=1 bash -s .`
4. Keep it short — 3-5 lines.

Note: `scripts/check-update.sh` / `scripts/check-update.ps1` do the same check from the shell (e.g. for CI).
