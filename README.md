# 🛡️ Aegis — Advanced Discord Security & Multipurpose Bot

[![Discord.js v14](https://img.shields.io/badge/discord.js-v14.28.0-blue.svg?logo=discord&logoColor=white)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite3%20(WAL)-blue.svg?logo=sqlite&logoColor=white)](https://github.com/WiseLibs/better-sqlite3)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Aegis** is an enterprise-grade, all-in-one Discord security, intelligent auto-moderation, and multipurpose server management bot. Built on **Discord.js v14**, **TypeScript**, and high-performance **SQLite (Write-Ahead Logging)**, Aegis delivers real-time anti-bypass defense against obfuscated raids, rogue administrator attacks, homoglyph filter evaders, stealth invites, ghost pings, and automated spam floods.

---

## 🌟 Key Pillars & Features

```
                                      ┌─────────────────────────────────────────┐
                                      │        Aegis Security Shield            │
                                      └────────────────────┬────────────────────┘
                                                           │
         ┌─────────────────────────┬───────────────────────┼───────────────────────┬─────────────────────────┐
         │                         │                       │                       │                         │
┌────────┴────────┐       ┌────────┴────────┐     ┌────────┴────────┐     ┌────────┴────────┐       ┌────────┴────────┐
│   Anti-Bypass   │       │    Anti-Nuke    │     │    Anti-Raid    │     │   Intelligent   │       │   All-in-One    │
│     Defense     │       │    Watchdog     │     │    Sentinel     │     │   Moderation    │       │  Multipurpose   │
├─────────────────┤       ├─────────────────┤     ├─────────────────┤     ├─────────────────┤       ├─────────────────┤
│ • Zero-width    │       │ • Burst action  │     │ • Join velocity │     │ • Auto warning  │       │ • Verification  │
│   character strip│      │   rate limiting │     │   detection     │     │   escalation    │       │   button gate   │
│ • Cyrillic/Greek│       │ • Dangerous perm│     │ • Young account │     │ • Timeout, ban, │       │ • Support ticket│
│   homoglyphs    │       │   escalation    │     │   quarantine    │     │   softban, kick │       │   panels & logs │
│ • Leetspeak &   │       │ • Rogue role    │     │ • Anti-botnet   │     │ • Smart purge   │       │ • Welcomer &    │
│   spacing strip │       │   stripping     │     │   lockdown      │     │ • Ghost-ping    │       │   auto-roles    │
│ • Masked links  │       │ • Owner alert   │     │ • Verified role │     │   interception  │       │ • Dossiers &    │
│   & phishing    │       │   dispatch      │     │   gateways      │     │ • Audit-trail   │       │   server stats  │
└─────────────────┘       └─────────────────┘     └─────────────────┘     └─────────────────┘       └─────────────────┘
```

---

### 1. 🔍 Deep Anti-Bypass Defense Layer
Attackers frequently use Unicode obfuscation, invisible characters, and leetspeak to evade auto-moderation rules. Aegis completely de-obfuscates text before matching:
* **Invisible Character Neutralization:** Strips zero-width spaces (`\u200B`), non-joiners (`\u200C`), directional overrides (`\u202A-\u202E`), BOMs (`\uFEFF`), and soft-hyphens (`\u00AD`).
* **Homoglyph & Confusable Mapping:** Translates Cyrillic (e.g. `а`, `е`, `о`, `р`, `с`), Greek (`α`, `ο`), mathematical alphanumerics, full-width, and accented letters back to ASCII.
* **Leetspeak Decoding:** Neutralizes symbolic evasion (`@` ➔ `a`, `0` ➔ `o`, `$` ➔ `s`, `3` ➔ `e`, `!` ➔ `i`, `7` ➔ `t`, `8` ➔ `b`).
* **Spacing & Punctuation Condensation:** Detects deliberate spacing (`d . i . s . c . o . r . d`) and collapsed repeated spam (`fuuuuuck` ➔ `fuuck`).
* **Stealth Invite & Phishing Blocker:** Intercepts markdown masked links (e.g. `[Google](discord.gg/xyz)`), obfuscated links (`discord(dot)gg`), shorteners, and known malicious exploit domains (`grabify`, `iplogger`, `discord-nitro.link`).
* **Stealth Edit Scanner:** Re-evaluates messages on edit so users cannot bypass filters by editing an innocent message into a phishing link or slur.

### 2. ⚡ Anti-Nuke Watchdog (Rogue Admin & Compromised Bot Defense)
Even administrators with full permissions can be compromised. Aegis monitors real-time Discord Audit Logs:
* Tracks burst actions: channel deletions, role deletions, mass bans, mass kicks, webhook creations, and guild modifications.
* Detects permission escalations (granting `Administrator` or dangerous rights to `@everyone`).
* **Instant Countermeasure:** Automatically strips dangerous administrative permissions from the rogue actor and quarantines/auto-bans them.
* Pings the Server Owner directly in DMs and dispatches high-priority embeds to the emergency alert channel.
* Granular **Whitelist System** allows trusted bot integrations and server co-owners to perform batch maintenance safely.

### 3. 🚨 Anti-Raid & Verification Sentinel
* **Join Velocity Gate:** Tracks join velocity via sliding time windows. If a burst is detected (e.g., >6 joins in 10s), Aegis triggers emergency raid lockdown protocols.
* **Account Age Quarantine:** Automatically flags or quarantines accounts younger than a configurable threshold (e.g. < 24 hours).
* **Interactive Button Verification:** Deploy a sleek verification portal (`/setup-verify`) requiring new members to click an interactive button before accessing server channels.

### 4. ⚖️ Intelligent Auto-Moderation & Escalation
* **Progressive Warning Escalation:**
  * **3 Warnings:** 1-Hour Timeout
  * **5 Warnings:** 24-Hour Timeout
  * **7 Warnings:** Kick from Server
  * **10 Warnings:** Permanent Ban
* **Anti-GhostPing Watchdog:** Caches message mentions for 5 minutes. If a user pings a member/role and deletes or edits the message, Aegis exposes the sender, original content, and pinged targets.
* **Rate-Limited Anti-Spam:** Token-bucket rate limiter detects rapid message bursts, wall-of-text line flood, duplicate message similarity (using Dice coefficient), and emoji floods.

### 5. 🧰 All-in-One Multipurpose Suite
* **Interactive Ticket System (`/setup-tickets`):** Private ticket channels with support role access, closure confirmation, and text transcript archiving sent to log channels.
* **Welcome & Goodbye Engine (`/setup-welcome`):** Customizable welcome embeds with placeholders (`{user}`, `{username}`, `{guild}`, `{memberCount}`) and auto-roles on join.
* **Comprehensive Utilities:** `/userinfo` (with trust score & infraction history), `/serverinfo`, `/botinfo`, `/avatar`.

### 6. 🎵 High-Fidelity Music & Voice Streaming
* **Universal Audio Resolution:** Play songs or playlists directly from YouTube, Spotify, SoundCloud, or direct audio webstreams (`.mp3`, `.wav`, `.ogg`, `.flac`).
* **Interactive Visual Progress Bar:** `/nowplaying` renders a live progress track (`🔘▬▬▬▬▬▬▬▬▬▬▬▬ 1:12 / 3:45`) with active loop and volume status.
* **Full Playback Controls:** `/play`, `/pause`, `/resume`, `/skip`, `/stop`, `/shuffle`, `/loop` (Off, Track, Queue), `/volume` (1-100%).
* **Smart Auto-Disconnect:** Disconnects automatically when the music queue finishes or when all human members leave the voice channel.

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js 20.x or 22.x LTS**
* **Discord Bot Token & Client ID** from [Discord Developer Portal](https://discord.com/developers/applications)

### Privileged Gateway Intents Setup
In the [Discord Developer Portal](https://discord.com/developers/applications):
1. Navigate to your application ➔ **Bot** tab.
2. Under **Privileged Gateway Intents**, turn **ON**:
   - ✅ **Presence Intent** (optional, recommended)
   - ✅ **Server Members Intent** (Required for join detection, auto-roles, and anti-raid)
   - ✅ **Message Content Intent** (Required for anti-bypass de-obfuscation and chat filters)
3. Under **Bot Permissions**, invite the bot with `Administrator` or `Manage Server`, `Manage Roles`, `Manage Channels`, `Kick Members`, `Ban Members`, `Moderate Members`, `Manage Messages`, `Send Messages`, `Embed Links`, `View Audit Log`.

### Installation Steps

1. **Clone or Navigate to the directory:**
   ```bash
   git clone <repo-url> aegis-bot
   cd aegis-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   CLIENT_ID=your_bot_application_id_here
   TEST_GUILD_ID=your_server_id_here  # Optional: for instant slash command registration
   ```

4. **Register Slash Commands:**
   ```bash
   npm run deploy-commands
   ```

5. **Start the Bot:**
   * **Development (auto-reload):**
     ```bash
     npm run dev
     ```
   * **Production:**
     ```bash
     npm run build
     npm start
     ```

### Render Deployment

For a Discord bot, use a Render **Background Worker** when available; the bot does not need HTTP traffic. If deploying it as a **Web Service**, the app listens on Render's `PORT` and responds with `OK` at `/` and `/health` so Render's port check succeeds. Set the build command to `npm ci && npm run build`, the start command to `npm start`, and add `DISCORD_TOKEN` and other required environment variables in Render.

6. **Run Test Suite:**
   ```bash
   npm test
   ```

---

## 🐳 Docker Deployment

A multi-stage `Dockerfile` and `docker-compose.yml` are included for 24/7 containerized hosting:

```bash
# Build and start container in background
docker compose up -d

# View real-time logs
docker compose logs -f aegis
```

The database is persisted in `./data/aegis.db` through a Docker volume mount.

---

## 📜 Slash Commands Reference

| Category | Command | Description | Permissions Required |
| :--- | :--- | :--- | :--- |
| **Security** | `/security status` | Display real-time defense matrix and active shields | Administrator |
| **Security** | `/security toggle` | Enable or disable specific security modules | Administrator |
| **Security** | `/security whitelist add` | Whitelist users or roles from anti-nuke / spam filters | Administrator |
| **Security** | `/security whitelist remove` | Remove users or roles from whitelist | Administrator |
| **Security** | `/security whitelist list` | View all active whitelisted entities | Administrator |
| **Security** | `/filter add` | Add word, phrase, or Regex with severity (DELETE, WARN, MUTE, BAN) | Manage Guild |
| **Security** | `/filter remove` | Remove word or phrase from safety filter | Manage Guild |
| **Security** | `/filter list` | View all configured guild filters | Manage Guild |
| **Moderation** | `/ban` | Permanently ban or softban with message deletion days | Ban Members |
| **Moderation** | `/kick` | Kick a member from the server | Kick Members |
| **Moderation** | `/timeout apply` | Timeout a member (`10m`, `1h`, `1d`, etc.) | Moderate Members |
| **Moderation** | `/timeout remove` | Remove timeout from a member | Moderate Members |
| **Moderation** | `/warn` | Issue warning with automated punishment escalation | Moderate Members |
| **Moderation** | `/warnings` | View detailed warning history of a member | Moderate Members |
| **Moderation** | `/clearwarns` | Clear all warnings recorded for a user | Administrator |
| **Moderation** | `/purge` | Bulk delete messages with bot/link/user filters | Manage Messages |
| **Moderation** | `/lock` | Lockdown a text channel for `@everyone` | Manage Channels |
| **Moderation** | `/unlock` | Unlock a previously locked text channel | Manage Channels |
| **Moderation** | `/slowmode` | Set user message cooldown on a channel | Manage Channels |
| **Multipurpose** | `/setup-verify` | Deploy interactive button verification portal | Administrator |
| **Multipurpose** | `/setup-tickets` | Deploy private support ticket panel with transcripts | Administrator |
| **Multipurpose** | `/setup-welcome` | Configure welcome, leave announcements, and auto-role | Administrator |
| **Multipurpose** | `/setup-logs` | Configure mod-log channel and security alert channel | Administrator |
| **Utility** | `/prefix set` | Configure custom server prefix (e.g. `!`, `?`, `.`, `$`) | Manage Server |
| **Utility** | `/prefix show` | Display current server command prefix | Everyone |
| **Utility** | `/userinfo` | Deep user dossier (trust score, joined date, mod history) | Everyone |
| **Utility** | `/serverinfo` | Server intelligence, channel breakdown, security shields | Everyone |
| **Utility** | `/botinfo` | Aegis system health, memory usage, latency, and uptime | Everyone |
| **Utility** | `/avatar` | High-resolution avatar downloader | Everyone |
| **Music** | `/play` | Play a song or playlist from YouTube, Spotify, SoundCloud, or search | Everyone |
| **Music** | `/pause` | Pause active music playback | Everyone |
| **Music** | `/resume` | Resume paused music playback | Everyone |
| **Music** | `/skip` | Skip to the next song in the queue | Everyone |
| **Music** | `/stop` | Clear music queue, stop playback, and leave voice channel | Everyone |
| **Music** | `/queue` | View upcoming songs with pagination and loop status | Everyone |
| **Music** | `/nowplaying` | Visual audio progress bar, title, artist, and volume | Everyone |
| **Music** | `/volume` | Set music stream volume & boost (1-200% loud audio) | Everyone |
| **Music** | `/loop` | Set loop mode (Off, Track, Queue) | Everyone |
| **Music** | `/shuffle` | Randomize upcoming songs in the queue | Everyone |
| **Music** | `/leave` | Disconnect bot from the voice channel | Everyone |

---

## 🛠️ Project Structure

```
├── .env.example                     # Environment template
├── Dockerfile                       # Multi-stage production container image
├── docker-compose.yml               # Docker Compose configuration
├── package.json                     # Scripts & dependencies
├── tsconfig.json                    # Modern TypeScript configuration
├── tests/
│   └── security.test.ts             # Unit & integration test suite
└── src/
    ├── config.ts                    # Environment validation & defaults
    ├── index.ts                     # Main entrypoint & Gateway client
    ├── deploy.ts                    # Slash command deployment tool
    ├── database/
    │   ├── index.ts                 # SQLite connection & WAL schema migrations
    │   ├── GuildRepo.ts             # Guild settings repository
    │   ├── SecurityRepo.ts          # Security thresholds & whitelists repository
    │   ├── ModCaseRepo.ts           # Warnings & moderation cases repository
    │   └── FilterRepo.ts            # Word & Regex filter repository
    ├── security/
    │   ├── Homoglyphs.ts            # Zero-width stripper & Cyrillic/Greek normalizer
    │   ├── AntiInvite.ts            # Obfuscated invite & markdown link shield
    │   ├── AntiSpam.ts              # Sliding-window token bucket & duplicate detector
    │   ├── AntiGhostPing.ts         # Mentions cache & ghost ping interceptor
    │   ├── AntiNuke.ts              # Audit log watchdog & rogue actor neutralizer
    │   ├── AntiRaid.ts              # Join velocity monitor & account age quarantine
    │   └── WordFilter.ts            # Anti-bypass content filter engine
    ├── services/
    │   ├── ModLogService.ts         # Mod-log audit dispatcher
    │   ├── PunishmentService.ts     # Centralized timeout, kick, ban & auto-escalation
    │   └── TicketService.ts         # Support ticket channel & transcript generator
    ├── commands/
    │   ├── index.ts                 # Central command registry
    │   ├── types.ts                 # Command definitions
    │   ├── security/                # /security and /filter
    │   ├── moderation/              # /ban, /kick, /timeout, /warn, /purge, /lock, /slowmode
    │   ├── multipurpose/            # /setup-verify, /setup-tickets, /setup-welcome, /setup-logs
    │   └── utility/                 # /userinfo, /serverinfo, /botinfo, /avatar
    ├── events/
    │   ├── ready.ts                 # Client ready & presence status rotator
    │   ├── interactionCreate.ts     # Slash commands & button interactions router
    │   ├── messageCreate.ts         # Inbound chat security defense pipeline
    │   ├── messageDelete.ts         # Ghost-ping detection & deletion logs
    │   ├── messageUpdate.ts         # Stealth-edit inspection & edit logs
    │   ├── guildMemberAdd.ts        # Anti-raid, welcome & auto-role router
    │   ├── guildMemberRemove.ts     # Member leave logger
    │   └── guildAuditLogEntryCreate.ts # Anti-nuke audit log listener
    └── utils/
        ├── logger.ts                # ANSI-formatted structured logger
        ├── embeds.ts                # Standardized Discord embed builder
        └── time.ts                  # Millisecond parser & duration formatter
```

---

## 🔒 Security Best Practices for Server Owners

1. **Keep Aegis's Highest Role at the Top:** Place Aegis's role directly beneath the Server Owner role in Discord Server Settings ➔ Roles. The bot cannot punish rogue administrators or strip roles from members with a higher role than itself.
2. **Never Whitelist Regular Members:** Only place verified secondary bot tokens or trustworthy co-owners in the anti-nuke whitelist.
3. **Set Up an Alert Channel:** Use `/setup-logs alerts:#security-alerts` to have immediate notifications delivered to a private staff channel when a raid or exploit is neutralized.
4. **Deploy the Verification Gate:** Use `/setup-verify` in a public `#verify` channel to immediately neutralize automated self-bots from viewing chat channels without completing the verification prompt.
