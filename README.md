# AffiliateAlfa

Daily HighLevel CRM coverage site. Static Jekyll site on GitHub Pages, with a
GitHub Action that drafts a new post every day from HighLevel's own blog/changelog
feed, using Gemini. Nothing publishes automatically, every draft becomes a Pull
Request that you review and merge yourself.

## One-time setup

1. **Create the repo**
   - On GitHub, create a new repository named exactly `affiliate_shiwal` under your `shiwal50` account.
   - Push this folder's contents to it as the initial commit.

2. **Enable GitHub Pages**
   - Repo → Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main`, folder `/ (root)`.
   - Site will be live at `https://shiwal50.github.io/affiliate_shiwal/` within a few minutes.

3. **Add repository secrets** (Settings → Secrets and variables → Actions → New repository secret)
   - `GEMINI_API_KEY` — the same key you use in Loopback's `lib/ai.js`.
   - `UNSPLASH_ACCESS_KEY` — free from https://unsplash.com/developers (create an app, use the Access Key). Optional: without it, posts publish without a cover image.

4. **Set your Web3Forms access key**
   - Sign up free at https://web3forms.com, create a form, copy the Access Key.
   - Open `index.html`, replace `YOUR_WEB3FORMS_ACCESS_KEY` with your real key.
   - Web3Forms will email new lead submissions (name, email, agency ID, agency email) straight to the address you registered with.

5. **Confirm the daily Action is scheduled**
   - Repo → Actions tab → you should see "Daily HighLevel Post Draft" listed.
   - It runs automatically at 07:00 IST daily (01:30 UTC). Edit the `cron` line in `.github/workflows/daily-post.yml` if you want a different time. You can also trigger it manually anytime via Actions → Daily HighLevel Post Draft → Run workflow.

## Daily workflow (your part)

1. Action runs, generates a draft, opens a Pull Request.
2. You get a GitHub notification. Open the PR, read the post like you'd read a diff.
3. Edit directly in the PR's "Files changed" tab if anything needs a tweak.
4. Merge the PR to publish. Close it (don't merge) to discard that day's draft.

## Files that matter

- `_posts/` — published posts (Markdown, one file per post).
- `_data/affiliate_links.yml` — your 8 affiliate links, tagged by topic. The automation reads this to pick the right link per post.
- `scripts/generate_post.js` — the automation logic (feed fetch → Gemini draft → image → file write).
- `scripts/used_sources.json` — auto-maintained, tracks which HighLevel articles have already been turned into posts so you don't get duplicates.
- `.github/workflows/daily-post.yml` — the schedule and PR-creation logic (uses `peter-evans/create-pull-request` to open the review PR).

## Before your first real post goes live

- Double check HighLevel's affiliate program terms for any content restrictions (trademark use, disclosure wording, prohibited claims).
- Confirm the RSS feed URLs in `scripts/generate_post.js` actually resolve, HighLevel may not expose all of them publicly, adjust as needed.
- Replace the placeholder Web3Forms key (step 4 above) before the contact form will work.
