## Notion To Instagram

![instagram](./thumbnail.png)

## Publish posts to instagram from Notion

# Demo

![demo](./demo.gif)

# Features

- Convert text content to an image and publish it to instagram
- Post Scheduling

# How to Use it

## 1. Clone this repository

## 2. Duplicate This Notion Database

https://yudax.notion.site/bb7fd5992fc64f828b1c5cfaa4bbb5a6?v=d9b83e659c9347369961283bcae9846b

## 3. Setup Notion Integration

1. Create a Notion integration from https://www.notion.so/my-integrations
2. Invite your integration to the duplicated notion database

## 3. Install Dependencies

```bash
 npm install
```

### 4. Create `.env` File (copy from `.env.template`)

```
IG_USERNAME= /*  Instagram username */
IG_PASSWORD= /*  Instagram password */
NT_DB= /*  Notion Database */
NT_SECRET= /* Notion Integration Secret */
TIME_ZONE= /* Country Timezone */
```

## 5. Run the script

```bash
    npm run start
```

After running the script, it should automatically check for new posts and publish to instagram if found.
