## Notion To Instagram

![instagram](./thumbnail.png)

## Publish posts to instagram from Notion

# Demo

![demo](./demo.gif)

# Features

- Convert text content to an image and publish it to instagram
- Post Scheduling
- Publish Images

# How to Use it

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/yudax42/notion-instagram)

## Or

## 1. Clone this repository

## 2. Duplicate This Notion Database

https://yudax.notion.site/8128dba3101846cba789adb35a8375f7

## 3. Setup Notion Integration

1. Create a Notion integration from https://www.notion.so/my-integrations
2. Invite your integration to the duplicated notion database

## 3. Install Dependencies

```bash
 npm install
```

### 4. Create `.env` File (copy from `.env.template`)

```
IG_USERNAME= /*  Instagram account username */
IG_PASSWORD= /* Instagram account password */
NT_DB= /*  Notion Database ID */
NT_SECRET= /* Notion integration secret */
NT_TOKEN= /* token_v2 value (check the documentation to know how find it) */
INTERVAL= /* Interval to check new posts on Notion in ms default is 15s (15000 ms) */
```

## 5. Run the script

```bash
    npm run start
```

After running the script, it should automatically check for new posts and publish to instagram if found.
