# ⚙️ GitHub Profile Setup Guide

This profile uses the highly advanced `lowlighter/metrics` system to generate dynamic SVG infographics about your coding habits, languages, and achievements.

To make this work, you **must** configure a GitHub Secret so the GitHub Action has permission to read your repository data and generate the images.

## Step 1: Create a Personal Access Token (PAT)

1. Go to your GitHub Settings.
2. Navigate to **Developer settings** -> **Personal access tokens** -> **Tokens (classic)**.
   *(Direct link: [https://github.com/settings/tokens](https://github.com/settings/tokens))*
3. Click **Generate new token (classic)**.
4. Set the **Note** to something like: `Metrics README Token`.
5. Set the **Expiration** to `No expiration` (or 1 year if you prefer to rotate it).
6. Check the following scopes:
   - `repo` (Required if you want statistics to include your private repositories)
   - `read:user` (Required to read your profile data)
   - `read:org` (Required if you want to include organizations you belong to)
7. Click **Generate token** and **copy the generated token immediately** (you won't be able to see it again).

## Step 2: Add the Token to Repository Secrets

1. Go to your GitHub Profile repository (`Omerfaruk-aydn/Omerfaruk-aydn`).
2. Navigate to the repository **Settings** tab.
3. On the left sidebar, go to **Secrets and variables** -> **Actions**.
4. Click the green **New repository secret** button.
5. Name the secret exactly: `METRICS_TOKEN`
6. Paste the token you copied in Step 1 into the **Secret** field.
7. Click **Add secret**.

## Step 3: Trigger the First Build

1. Go to the **Actions** tab in your repository.
2. On the left sidebar, click on **GitHub Metrics**.
3. On the right side, click the **Run workflow** dropdown and click the green **Run workflow** button.
4. Wait 1-2 minutes for the job to complete. It will automatically commit the generated SVGs into a `github-metrics` folder.

Once the workflow succeeds, go to your main profile page. The broken image links will be replaced with beautiful, dynamic data visualizations!

## Troubleshooting

- **Images are broken/not showing up:** Ensure you completed Step 3 and the workflow ran successfully. If the workflow fails, click on the failed run to see the logs. Usually, this means the `METRICS_TOKEN` is missing, expired, or doesn't have the correct permissions.
- **I don't see my private commits:** Ensure you checked the `repo` scope when creating your Personal Access Token.