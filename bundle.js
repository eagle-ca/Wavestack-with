"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  client: () => client
});
module.exports = __toCommonJS(index_exports);
var import_discord38 = require("discord.js");
var import_node_http = require("node:http");

// src/config.ts
var import_dotenv = __toESM(require("dotenv"));
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var candidateEnvs = [
  import_path.default.resolve(process.cwd(), ".env"),
  import_path.default.resolve(__dirname, "..", ".env"),
  import_path.default.resolve(__dirname, "..", "..", ".env"),
  import_path.default.resolve(process.cwd(), ".env.example"),
  import_path.default.resolve(__dirname, "..", ".env.example"),
  import_path.default.resolve(__dirname, "..", "..", ".env.example")
];
for (const envPath of candidateEnvs) {
  if (import_fs.default.existsSync(envPath)) {
    import_dotenv.default.config({ path: envPath, override: false });
    if (process.env.DISCORD_TOKEN) break;
  }
}
var config = {
  token: process.env.DISCORD_TOKEN || "",
  clientId: process.env.CLIENT_ID || "",
  ownerId: process.env.OWNER_ID || "1520810306211807453",
  defaultPrefix: process.env.DEFAULT_PREFIX || "!",
  databasePath: process.env.DATABASE_PATH || "./data/aegis.db",
  defaultEmbedColor: 5793266,
  // Discord Blurple
  alertEmbedColor: 15548997,
  // Red
  successEmbedColor: 5763719,
  // Green
  errorEmbedColor: 15548997,
  // Red
  antiNukeEnabled: process.env.ENABLE_ANTI_NUKE !== "false",
  antiSpamEnabled: process.env.ENABLE_ANTI_SPAM !== "false",
  antiInviteEnabled: process.env.ENABLE_ANTI_INVITE !== "false",
  antiRaidEnabled: process.env.ENABLE_ANTI_RAID !== "false"
};
function validateConfig() {
  if (!config.token) {
    console.warn("\x1B[33m[WARN] DISCORD_TOKEN is not set in environment or .env file.\x1B[0m");
  }
}

// src/utils/logger.ts
var Logger = class {
  static formatTime() {
    return (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19);
  }
  static info(message, context) {
    const ctx = context ? ` [\x1B[36m${context}\x1B[0m]` : "";
    console.log(`\x1B[90m${this.formatTime()}\x1B[0m \x1B[32m[INFO]\x1B[0m${ctx} ${message}`);
  }
  static warn(message, context) {
    const ctx = context ? ` [\x1B[36m${context}\x1B[0m]` : "";
    console.warn(`\x1B[90m${this.formatTime()}\x1B[0m \x1B[33m[WARN]\x1B[0m${ctx} ${message}`);
  }
  static error(message, error, context) {
    const ctx = context ? ` [\x1B[36m${context}\x1B[0m]` : "";
    console.error(`\x1B[90m${this.formatTime()}\x1B[0m \x1B[31m[ERROR]\x1B[0m${ctx} ${message}`);
    if (error) {
      console.error(error);
    }
  }
  static security(message, context) {
    const ctx = context ? ` [\x1B[35m${context}\x1B[0m]` : "";
    console.log(`\x1B[90m${this.formatTime()}\x1B[0m \x1B[41m\x1B[37m[SECURITY DEFENSE]\x1B[0m${ctx} ${message}`);
  }
  static debug(message, context) {
    if (process.env.DEBUG === "true") {
      const ctx = context ? ` [\x1B[36m${context}\x1B[0m]` : "";
      console.log(`\x1B[90m${this.formatTime()}\x1B[0m \x1B[34m[DEBUG]\x1B[0m${ctx} ${message}`);
    }
  }
};

// src/events/ready.ts
var import_discord = require("discord.js");

// src/database/index.ts
var import_better_sqlite3 = __toESM(require("better-sqlite3"));
var import_path2 = __toESM(require("path"));
var import_fs2 = __toESM(require("fs"));
var DatabaseManager = class {
  db = null;
  init() {
    if (this.db) return this.db;
    const fullPath = import_path2.default.resolve(config.databasePath);
    const dir = import_path2.default.dirname(fullPath);
    if (!import_fs2.default.existsSync(dir)) {
      import_fs2.default.mkdirSync(dir, { recursive: true });
    }
    this.db = new import_better_sqlite3.default(fullPath);
    this.db.pragma("journal_mode = WAL");
    this.db.pragma("synchronous = NORMAL");
    this.createTables();
    Logger.info(`Connected to SQLite database at ${fullPath}`, "Database");
    return this.db;
  }
  getDb() {
    if (!this.db) {
      return this.init();
    }
    return this.db;
  }
  createTables() {
    if (!this.db) return;
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS guild_settings (
        guild_id TEXT PRIMARY KEY,
        prefix TEXT DEFAULT '!',
        mod_log_channel_id TEXT,
        alert_channel_id TEXT,
        welcome_channel_id TEXT,
        welcome_message TEXT,
        leave_channel_id TEXT,
        leave_message TEXT,
        autorole_id TEXT,
        verified_role_id TEXT,
        unverified_role_id TEXT,
        ticket_category_id TEXT,
        ticket_log_channel_id TEXT,
        ticket_support_role_id TEXT,
        punishment_escalation INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS security_settings (
        guild_id TEXT PRIMARY KEY,
        anti_invite INTEGER DEFAULT 1,
        anti_links INTEGER DEFAULT 0,
        anti_spam INTEGER DEFAULT 1,
        anti_ghostping INTEGER DEFAULT 1,
        anti_nuke INTEGER DEFAULT 1,
        anti_raid INTEGER DEFAULT 1,
        max_messages_per_5s INTEGER DEFAULT 5,
        max_duplicate_threshold REAL DEFAULT 0.82,
        max_mentions INTEGER DEFAULT 4,
        max_emojis INTEGER DEFAULT 8,
        anti_raid_joins INTEGER DEFAULT 6,
        anti_raid_window_sec INTEGER DEFAULT 10,
        min_account_age_hours INTEGER DEFAULT 24,
        anti_nuke_action_limit INTEGER DEFAULT 3,
        anti_nuke_window_sec INTEGER DEFAULT 15
      );

      CREATE TABLE IF NOT EXISTS whitelists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        target_id TEXT NOT NULL,
        target_type TEXT NOT NULL, -- 'user', 'role', 'channel'
        feature TEXT NOT NULL,     -- 'all', 'anti_nuke', 'anti_spam', 'anti_invite'
        added_by TEXT,
        created_at INTEGER NOT NULL,
        UNIQUE(guild_id, target_id, feature)
      );

      CREATE TABLE IF NOT EXISTS moderation_cases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        moderator_id TEXT NOT NULL,
        action TEXT NOT NULL,
        reason TEXT,
        duration INTEGER,
        created_at INTEGER NOT NULL,
        active INTEGER DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS warnings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        moderator_id TEXT NOT NULL,
        reason TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS word_filters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        pattern TEXT NOT NULL,
        is_regex INTEGER DEFAULT 0,
        severity TEXT DEFAULT 'WARN', -- 'DELETE', 'WARN', 'MUTE', 'BAN'
        added_by TEXT,
        created_at INTEGER NOT NULL,
        UNIQUE(guild_id, pattern)
      );

      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        status TEXT DEFAULT 'OPEN',
        created_at INTEGER NOT NULL,
        closed_at INTEGER
      );
    `);
    try {
      this.db.exec("ALTER TABLE guild_settings ADD COLUMN prefix TEXT DEFAULT '!'");
    } catch {
    }
  }
};
var dbManager = new DatabaseManager();

// src/events/ready.ts
var presenceInterval = null;
var isCustomPresenceActive = false;
function getServerAndMemberCounts(client2) {
  const guildCount = client2.guilds.cache.size;
  const memberCount = client2.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
  return { guildCount, memberCount };
}
function getAestheticActivities(client2) {
  const { guildCount, memberCount } = getServerAndMemberCounts(client2);
  const serverText = guildCount === 1 ? "1 Server" : `${guildCount} Servers`;
  const memberText = memberCount === 1 ? "1 Member" : `${memberCount} Members`;
  return [
    {
      name: "Custom Status",
      state: `\u{13288} \u{1F3F0} ${serverText} \u25C8 \u{1F465} ${memberText} \u{13289}`,
      type: import_discord.ActivityType.Custom
    },
    {
      name: `${memberText} across ${serverText} \u{1F3F0}`,
      state: `${memberText} across ${serverText} \u{1F3F0}`,
      type: import_discord.ActivityType.Watching
    },
    {
      name: "Custom Status",
      state: `\u{1F6E1}\uFE0F Aegis \u25C8 ${serverText} \u25C8 \u{1F465} ${memberText} \u26A1`,
      type: import_discord.ActivityType.Custom
    },
    {
      name: `Guarding ${serverText} with ${memberText} \u{1F3F0}`,
      state: `Guarding ${serverText} with ${memberText} \u{1F3F0}`,
      type: import_discord.ActivityType.Watching
    }
  ];
}
function applyPresence(client2, activity, status = "online") {
  try {
    const actPayload = {
      name: activity.name,
      state: activity.state || activity.name,
      type: activity.type
    };
    if (activity.emoji) {
      actPayload.emoji = activity.emoji;
    }
    const packet = {
      activities: [actPayload],
      status,
      afk: false,
      since: null
    };
    client2.ws.broadcast({ op: 3, d: packet });
  } catch (err) {
    client2.user?.setPresence({
      activities: [{ name: activity.state || activity.name, type: activity.type }],
      status
    });
  }
}
function clearStatus(client2, status = "online") {
  if (presenceInterval) {
    clearInterval(presenceInterval);
    presenceInterval = null;
  }
  isCustomPresenceActive = true;
  try {
    const packet = {
      activities: [],
      status,
      afk: false,
      since: null
    };
    client2.ws.broadcast({ op: 3, d: packet });
  } catch {
    client2.user?.setPresence({
      activities: [],
      status
    });
  }
}
function startPresenceRotation(client2) {
  if (presenceInterval) {
    clearInterval(presenceInterval);
    presenceInterval = null;
  }
  isCustomPresenceActive = false;
  const activities = getAestheticActivities(client2);
  let current = 0;
  applyPresence(client2, activities[current], "online");
  presenceInterval = setInterval(() => {
    if (isCustomPresenceActive) return;
    const liveActivities = getAestheticActivities(client2);
    current = (current + 1) % liveActivities.length;
    applyPresence(client2, liveActivities[current], "online");
  }, 2e4);
}
function setCustomStatus(client2, text, type = import_discord.ActivityType.Custom, status = "online", emojiName) {
  isCustomPresenceActive = true;
  applyPresence(
    client2,
    {
      name: type === import_discord.ActivityType.Custom ? "Custom Status" : text,
      state: text,
      type,
      emoji: emojiName ? { name: emojiName } : void 0
    },
    status
  );
}
function handleReady(client2) {
  dbManager.init();
  const guildCount = client2.guilds.cache.size;
  const userCount = client2.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
  Logger.info(`\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550`, "System");
  Logger.info(`\u{1F6E1}\uFE0F  AEGIS ADVANCED SECURITY & INTELLIGENCE BOT ONLINE`, "System");
  Logger.info(`\u{1F916}  Logged in as: ${client2.user?.tag} (${client2.user?.id})`, "System");
  Logger.info(`\u{1F3F0}  Guarding ${guildCount} guild(s) with ${userCount} total members`, "System");
  Logger.info(`\u26A1  Anti-Bypass, Homoglyph De-obfuscator & Anti-Nuke ACTIVE`, "System");
  Logger.info(`\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550`, "System");
  startPresenceRotation(client2);
}

// src/events/interactionCreate.ts
var import_discord31 = require("discord.js");

// src/commands/security/security.ts
var import_discord3 = require("discord.js");

// src/database/SecurityRepo.ts
var SecurityRepo = class {
  static get(guildId) {
    const db = dbManager.getDb();
    const row = db.prepare("SELECT * FROM security_settings WHERE guild_id = ?").get(guildId);
    if (!row) {
      db.prepare(`
        INSERT INTO security_settings (guild_id) VALUES (?)
      `).run(guildId);
      return {
        guild_id: guildId,
        anti_invite: 1,
        anti_links: 0,
        anti_spam: 1,
        anti_ghostping: 1,
        anti_nuke: 1,
        anti_raid: 1,
        max_messages_per_5s: 5,
        max_duplicate_threshold: 0.82,
        max_mentions: 4,
        max_emojis: 8,
        anti_raid_joins: 6,
        anti_raid_window_sec: 10,
        min_account_age_hours: 24,
        anti_nuke_action_limit: 3,
        anti_nuke_window_sec: 15
      };
    }
    return row;
  }
  static update(guildId, updates) {
    const db = dbManager.getDb();
    this.get(guildId);
    const keys = Object.keys(updates).filter((k) => k !== "guild_id");
    if (keys.length === 0) return;
    const setClauses = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => updates[k]);
    values.push(guildId);
    db.prepare(`UPDATE security_settings SET ${setClauses} WHERE guild_id = ?`).run(...values);
  }
  static addWhitelist(guildId, targetId, targetType, feature, addedBy) {
    const db = dbManager.getDb();
    db.prepare(`
      INSERT OR REPLACE INTO whitelists (guild_id, target_id, target_type, feature, added_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(guildId, targetId, targetType, feature, addedBy, Date.now());
  }
  static removeWhitelist(guildId, targetId, feature) {
    const db = dbManager.getDb();
    let query = "DELETE FROM whitelists WHERE guild_id = ? AND target_id = ?";
    const params = [guildId, targetId];
    if (feature && feature !== "all") {
      query += ' AND (feature = ? OR feature = "all")';
      params.push(feature);
    }
    const res = db.prepare(query).run(...params);
    return res.changes > 0;
  }
  static isWhitelisted(guildId, targetId, roleIds = [], channelId, feature = "anti_nuke") {
    if (config.ownerId && targetId === config.ownerId) {
      return true;
    }
    const db = dbManager.getDb();
    const directHit = db.prepare(`
      SELECT 1 FROM whitelists 
      WHERE guild_id = ? AND target_id = ? AND (feature = ? OR feature = 'all')
    `).get(guildId, targetId, feature);
    if (directHit) return true;
    if (channelId) {
      const channelHit = db.prepare(`
        SELECT 1 FROM whitelists 
        WHERE guild_id = ? AND target_id = ? AND target_type = 'channel' AND (feature = ? OR feature = 'all')
      `).get(guildId, channelId, feature);
      if (channelHit) return true;
    }
    if (roleIds.length > 0) {
      const placeholders = roleIds.map(() => "?").join(",");
      const roleHit = db.prepare(`
        SELECT 1 FROM whitelists
        WHERE guild_id = ? AND target_type = 'role' AND target_id IN (${placeholders}) AND (feature = ? OR feature = 'all')
      `).get(guildId, ...roleIds, feature);
      if (roleHit) return true;
    }
    return false;
  }
  static getWhitelists(guildId) {
    const db = dbManager.getDb();
    return db.prepare("SELECT * FROM whitelists WHERE guild_id = ? ORDER BY created_at DESC").all(guildId);
  }
};

// src/database/FilterRepo.ts
var FilterRepo = class {
  static addRule(guildId, pattern, isRegex, severity, addedBy) {
    const db = dbManager.getDb();
    db.prepare(`
      INSERT OR REPLACE INTO word_filters (guild_id, pattern, is_regex, severity, added_by, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(guildId, pattern.toLowerCase(), isRegex ? 1 : 0, severity, addedBy, Date.now());
  }
  static removeRule(guildId, pattern) {
    const db = dbManager.getDb();
    const res = db.prepare("DELETE FROM word_filters WHERE guild_id = ? AND pattern = ?").run(guildId, pattern.toLowerCase());
    return res.changes > 0;
  }
  static getRules(guildId) {
    const db = dbManager.getDb();
    return db.prepare("SELECT * FROM word_filters WHERE guild_id = ? ORDER BY created_at DESC").all(guildId);
  }
};

// src/utils/embeds.ts
var import_discord2 = require("discord.js");
var Embeds = class {
  static success(title, description) {
    return new import_discord2.EmbedBuilder().setColor(config.successEmbedColor).setTitle(`\u2705 ${title}`).setDescription(description).setTimestamp();
  }
  static error(title, description) {
    return new import_discord2.EmbedBuilder().setColor(config.errorEmbedColor).setTitle(`\u274C ${title}`).setDescription(description).setTimestamp();
  }
  static warning(title, description) {
    return new import_discord2.EmbedBuilder().setColor(16705372).setTitle(`\u26A0\uFE0F ${title}`).setDescription(description).setTimestamp();
  }
  static info(title, description) {
    return new import_discord2.EmbedBuilder().setColor(config.defaultEmbedColor).setTitle(`\u2139\uFE0F ${title}`).setDescription(description).setTimestamp();
  }
  static securityAlert(title, description, fields) {
    const embed = new import_discord2.EmbedBuilder().setColor(config.alertEmbedColor).setTitle(`\u{1F6A8} [SECURITY INTERCEPTION] ${title}`).setDescription(description).setFooter({ text: "Aegis Security Engine \u2022 Anti-Bypass & Defense" }).setTimestamp();
    if (fields) {
      embed.addFields(fields);
    }
    return embed;
  }
  static modAction(action, target, moderator, reason, caseId, duration) {
    const targetUser = target instanceof import_discord2.GuildMember ? target.user : target;
    const modUser = moderator instanceof import_discord2.GuildMember ? moderator.user : moderator;
    const embed = new import_discord2.EmbedBuilder().setColor(action.toLowerCase().includes("ban") ? 15548997 : 5793266).setTitle(`\u{1F6E1}\uFE0F Moderation Action: ${action.toUpperCase()}`).setThumbnail(targetUser.displayAvatarURL({ size: 256 })).addFields(
      { name: "Target User", value: `${targetUser.tag} (\`${targetUser.id}\`)`, inline: true },
      { name: "Moderator", value: `${modUser.tag} (\`${modUser.id}\`)`, inline: true },
      { name: "Reason", value: reason || "No reason provided" }
    ).setFooter({ text: caseId ? `Case #${caseId} \u2022 Aegis Moderation` : "Aegis Moderation" }).setTimestamp();
    if (duration) {
      embed.addFields({ name: "Duration", value: duration, inline: true });
    }
    return embed;
  }
};

// src/commands/security/security.ts
var securityCommand = {
  category: "security",
  userPermissions: [import_discord3.PermissionsBitField.Flags.Administrator],
  data: new import_discord3.SlashCommandBuilder().setName("security").setDescription("Configure Aegis advanced security modules and bypass defense").setDefaultMemberPermissions(import_discord3.PermissionsBitField.Flags.Administrator).addSubcommand(
    (sub) => sub.setName("status").setDescription("Display active security shield status and defense configuration")
  ).addSubcommand(
    (sub) => sub.setName("toggle").setDescription("Enable or disable a specific security protection module").addStringOption(
      (opt) => opt.setName("module").setDescription("Security module to toggle").setRequired(true).addChoices(
        { name: "Anti-Nuke (Admin watchdog & burst protection)", value: "anti_nuke" },
        { name: "Anti-Raid (Mass join gate & young accounts)", value: "anti_raid" },
        { name: "Anti-Spam (Burst, duplicate, emoji, mentions)", value: "anti_spam" },
        { name: "Anti-Invite (Obfuscated & stealth Discord links)", value: "anti_invite" },
        { name: "Anti-Links (Block all external URLs)", value: "anti_links" },
        { name: "Anti-GhostPing (Tracks deleted & edited pings)", value: "anti_ghostping" }
      )
    ).addBooleanOption(
      (opt) => opt.setName("enabled").setDescription("Enable or disable").setRequired(true)
    )
  ).addSubcommandGroup(
    (group) => group.setName("whitelist").setDescription("Manage trusted users and roles immune to anti-nuke/filters").addSubcommand(
      (sub) => sub.setName("add").setDescription("Add user or role to whitelist").addMentionableOption(
        (opt) => opt.setName("target").setDescription("User or Role to whitelist").setRequired(true)
      ).addStringOption(
        (opt) => opt.setName("feature").setDescription("Scope of exemption").setRequired(true).addChoices(
          { name: "All Security Shields", value: "all" },
          { name: "Anti-Nuke Only", value: "anti_nuke" },
          { name: "Anti-Spam Only", value: "anti_spam" },
          { name: "Anti-Invite Only", value: "anti_invite" }
        )
      )
    ).addSubcommand(
      (sub) => sub.setName("remove").setDescription("Remove target from whitelist").addMentionableOption(
        (opt) => opt.setName("target").setDescription("User or Role to remove").setRequired(true)
      )
    ).addSubcommand(
      (sub) => sub.setName("list").setDescription("View all current whitelisted entities")
    )
  ),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
      return;
    }
    const sub = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();
    if (sub === "status" && !group) {
      const sec = SecurityRepo.get(interaction.guild.id);
      const whitelists = SecurityRepo.getWhitelists(interaction.guild.id);
      const filters = FilterRepo.getRules(interaction.guild.id);
      const statusIcon = (enabled) => enabled ? "\u{1F7E2} **ONLINE**" : "\u{1F534} **DISABLED**";
      const embed = new import_discord3.EmbedBuilder().setColor(5793266).setTitle("\u{1F6E1}\uFE0F Aegis Security & Defense Matrix").setDescription("Real-time defense status for this guild.").addFields(
        {
          name: "Anti-Nuke Watchdog",
          value: `${statusIcon(sec.anti_nuke)}
Limit: ${sec.anti_nuke_action_limit} actions / ${sec.anti_nuke_window_sec}s`,
          inline: true
        },
        {
          name: "Anti-Raid Sentinel",
          value: `${statusIcon(sec.anti_raid)}
Threshold: ${sec.anti_raid_joins} joins / ${sec.anti_raid_window_sec}s
Min Age: ${sec.min_account_age_hours}h`,
          inline: true
        },
        {
          name: "Anti-Spam Shield",
          value: `${statusIcon(sec.anti_spam)}
Rate: ${sec.max_messages_per_5s} msgs / 5s
Mention Cap: ${sec.max_mentions}`,
          inline: true
        },
        {
          name: "Anti-Invite / Obfuscation",
          value: `${statusIcon(sec.anti_invite)}
Homoglyph & stealth link inspection active`,
          inline: true
        },
        {
          name: "Anti-GhostPing",
          value: `${statusIcon(sec.anti_ghostping)}
Active memory buffer: 5m TTL`,
          inline: true
        },
        {
          name: "External Links Shield",
          value: statusIcon(sec.anti_links),
          inline: true
        },
        {
          name: "Active Defense Assets",
          value: `\u2022 **${whitelists.length}** Whitelisted Entities
\u2022 **${filters.length}** Active Word Filters & Signatures
\u2022 **Homoglyph & Zero-Width Engine**: Active`,
          inline: false
        }
      ).setFooter({ text: "Aegis Security \u2022 System Operational" }).setTimestamp();
      await interaction.reply({ embeds: [embed] });
      return;
    }
    if (sub === "toggle") {
      const moduleName = interaction.options.getString("module", true);
      const enabled = interaction.options.getBoolean("enabled", true);
      SecurityRepo.update(interaction.guild.id, {
        [moduleName]: enabled ? 1 : 0
      });
      await interaction.reply({
        embeds: [
          Embeds.success(
            "Security Setting Updated",
            `Module \`${moduleName}\` has been set to **${enabled ? "ENABLED" : "DISABLED"}**.`
          )
        ]
      });
      return;
    }
    if (group === "whitelist") {
      if (sub === "add") {
        const target = interaction.options.getMentionable("target", true);
        const targetId = target.id || target.user?.id;
        const targetType = "permissions" in target && !("user" in target) ? "role" : "user";
        if (!targetId) {
          await interaction.reply({ content: "Invalid entity selected.", ephemeral: true });
          return;
        }
        const feature = interaction.options.getString("feature", true);
        SecurityRepo.addWhitelist(
          interaction.guild.id,
          targetId,
          targetType,
          feature,
          interaction.user.id
        );
        await interaction.reply({
          embeds: [
            Embeds.success(
              "Entity Whitelisted",
              `Successfully whitelisted <@${targetType === "role" ? "&" : ""}${targetId}> for **${feature}** security bypass.`
            )
          ]
        });
        return;
      }
      if (sub === "remove") {
        const target = interaction.options.getMentionable("target", true);
        const targetId = target.id || target.user?.id;
        if (!targetId) {
          await interaction.reply({ content: "Invalid entity selected.", ephemeral: true });
          return;
        }
        const removed = SecurityRepo.removeWhitelist(interaction.guild.id, targetId);
        if (removed) {
          await interaction.reply({
            embeds: [Embeds.success("Whitelist Entry Removed", `Removed <@${targetId}> from all security whitelists.`)]
          });
        } else {
          await interaction.reply({
            embeds: [Embeds.warning("Not Found", "Target was not found in the whitelist.")],
            ephemeral: true
          });
        }
        return;
      }
      if (sub === "list") {
        const list = SecurityRepo.getWhitelists(interaction.guild.id);
        if (list.length === 0) {
          await interaction.reply({
            embeds: [Embeds.info("Whitelist Empty", "There are currently no whitelisted users or roles.")],
            ephemeral: true
          });
          return;
        }
        const formatted = list.map(
          (item, index) => `**${index + 1}.** <@${item.target_type === "role" ? "&" : ""}${item.target_id}> (\`${item.target_id}\`)
   \u2022 Scope: \`${item.feature}\` \u2022 Added: <t:${Math.floor(item.created_at / 1e3)}:R>`
        ).join("\n");
        const embed = new import_discord3.EmbedBuilder().setColor(5793266).setTitle("\u{1F6E1}\uFE0F Aegis Security Whitelist").setDescription(formatted).setTimestamp();
        await interaction.reply({ embeds: [embed] });
        return;
      }
    }
  }
};

// src/commands/security/filter.ts
var import_discord4 = require("discord.js");
var filterCommand = {
  category: "security",
  userPermissions: [import_discord4.PermissionsBitField.Flags.ManageGuild],
  data: new import_discord4.SlashCommandBuilder().setName("filter").setDescription("Manage custom word & phrase filters with anti-bypass detection").setDefaultMemberPermissions(import_discord4.PermissionsBitField.Flags.ManageGuild).addSubcommand(
    (sub) => sub.setName("add").setDescription("Add a forbidden word, phrase, or regular expression").addStringOption(
      (opt) => opt.setName("pattern").setDescription("The word, phrase, or regex pattern to block").setRequired(true)
    ).addStringOption(
      (opt) => opt.setName("severity").setDescription("Enforcement action to take when matched").setRequired(false).addChoices(
        { name: "Delete Message Only", value: "DELETE" },
        { name: "Delete + Warn User", value: "WARN" },
        { name: "Delete + 10m Timeout", value: "MUTE" },
        { name: "Immediate Ban", value: "BAN" }
      )
    ).addBooleanOption(
      (opt) => opt.setName("is_regex").setDescription("Whether this pattern is a Regular Expression").setRequired(false)
    )
  ).addSubcommand(
    (sub) => sub.setName("remove").setDescription("Remove a pattern from the filter").addStringOption(
      (opt) => opt.setName("pattern").setDescription("The pattern to remove").setRequired(true)
    )
  ).addSubcommand(
    (sub) => sub.setName("list").setDescription("List all active server filters")
  ),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
      return;
    }
    const sub = interaction.options.getSubcommand();
    if (sub === "add") {
      const pattern = interaction.options.getString("pattern", true);
      const severity = interaction.options.getString("severity") || "WARN";
      const isRegex = interaction.options.getBoolean("is_regex") || false;
      if (isRegex) {
        try {
          new RegExp(pattern);
        } catch (err) {
          await interaction.reply({
            embeds: [Embeds.error("Invalid Regular Expression", `Syntax error: \`${err.message}\``)],
            ephemeral: true
          });
          return;
        }
      }
      FilterRepo.addRule(interaction.guild.id, pattern, isRegex, severity, interaction.user.id);
      await interaction.reply({
        embeds: [
          Embeds.success(
            "Word Filter Created",
            `Successfully added rule for \`${pattern}\` with action **${severity}**.
Anti-bypass homoglyph de-obfuscator is automatically active for this pattern.`
          )
        ]
      });
      return;
    }
    if (sub === "remove") {
      const pattern = interaction.options.getString("pattern", true);
      const removed = FilterRepo.removeRule(interaction.guild.id, pattern);
      if (removed) {
        await interaction.reply({
          embeds: [Embeds.success("Filter Removed", `Rule for \`${pattern}\` has been deleted.`)]
        });
      } else {
        await interaction.reply({
          embeds: [Embeds.warning("Rule Not Found", `No active filter matched \`${pattern}\`.`)],
          ephemeral: true
        });
      }
      return;
    }
    if (sub === "list") {
      const rules = FilterRepo.getRules(interaction.guild.id);
      if (rules.length === 0) {
        await interaction.reply({
          embeds: [Embeds.info("No Filters Configured", "This server has no custom filtered phrases.")],
          ephemeral: true
        });
        return;
      }
      const formatted = rules.slice(0, 25).map(
        (r, idx) => `**${idx + 1}.** \`${r.pattern}\` ${r.is_regex ? "(Regex)" : ""} \u2192 **${r.severity}** (Added by <@${r.added_by}>)`
      ).join("\n");
      const embed = new import_discord4.EmbedBuilder().setColor(5793266).setTitle(`\u{1F6E1}\uFE0F Server Word Filters (${rules.length})`).setDescription(formatted).setFooter({ text: "All filters protected by Aegis Homoglyph De-obfuscation" }).setTimestamp();
      await interaction.reply({ embeds: [embed] });
      return;
    }
  }
};

// src/commands/moderation/ban.ts
var import_discord6 = require("discord.js");

// src/database/ModCaseRepo.ts
var ModCaseRepo = class {
  static createCase(guildId, userId, moderatorId, action, reason, durationMs = null) {
    const db = dbManager.getDb();
    const result = db.prepare(`
      INSERT INTO moderation_cases (guild_id, user_id, moderator_id, action, reason, duration, created_at, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(guildId, userId, moderatorId, action.toUpperCase(), reason, durationMs, Date.now());
    return Number(result.lastInsertRowid);
  }
  static getCase(guildId, caseId) {
    const db = dbManager.getDb();
    const row = db.prepare("SELECT * FROM moderation_cases WHERE guild_id = ? AND id = ?").get(guildId, caseId);
    return row || null;
  }
  static getUserCases(guildId, userId) {
    const db = dbManager.getDb();
    return db.prepare("SELECT * FROM moderation_cases WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC").all(guildId, userId);
  }
  static addWarning(guildId, userId, moderatorId, reason) {
    const db = dbManager.getDb();
    const result = db.prepare(`
      INSERT INTO warnings (guild_id, user_id, moderator_id, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(guildId, userId, moderatorId, reason, Date.now());
    const countRow = db.prepare("SELECT COUNT(*) as count FROM warnings WHERE guild_id = ? AND user_id = ?").get(guildId, userId);
    return {
      warnId: Number(result.lastInsertRowid),
      count: countRow.count
    };
  }
  static getWarnings(guildId, userId) {
    const db = dbManager.getDb();
    return db.prepare("SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC").all(guildId, userId);
  }
  static getWarningCount(guildId, userId) {
    const db = dbManager.getDb();
    const res = db.prepare("SELECT COUNT(*) as count FROM warnings WHERE guild_id = ? AND user_id = ?").get(guildId, userId);
    return res.count;
  }
  static clearWarnings(guildId, userId) {
    const db = dbManager.getDb();
    const res = db.prepare("DELETE FROM warnings WHERE guild_id = ? AND user_id = ?").run(guildId, userId);
    return res.changes;
  }
  static deleteWarning(guildId, warnId) {
    const db = dbManager.getDb();
    const res = db.prepare("DELETE FROM warnings WHERE guild_id = ? AND id = ?").run(guildId, warnId);
    return res.changes > 0;
  }
};

// src/database/GuildRepo.ts
var GuildRepo = class {
  static get(guildId) {
    const db = dbManager.getDb();
    const row = db.prepare("SELECT * FROM guild_settings WHERE guild_id = ?").get(guildId);
    if (!row) {
      db.prepare(`
        INSERT INTO guild_settings (guild_id, prefix) VALUES (?, '!')
      `).run(guildId);
      return {
        guild_id: guildId,
        prefix: "!",
        mod_log_channel_id: null,
        alert_channel_id: null,
        welcome_channel_id: null,
        welcome_message: null,
        leave_channel_id: null,
        leave_message: null,
        autorole_id: null,
        verified_role_id: null,
        unverified_role_id: null,
        ticket_category_id: null,
        ticket_log_channel_id: null,
        ticket_support_role_id: null,
        punishment_escalation: 1
      };
    }
    if (!row.prefix) {
      row.prefix = "!";
    }
    return row;
  }
  static update(guildId, updates) {
    const db = dbManager.getDb();
    this.get(guildId);
    const keys = Object.keys(updates).filter((k) => k !== "guild_id");
    if (keys.length === 0) return;
    const setClauses = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => updates[k]);
    values.push(guildId);
    db.prepare(`UPDATE guild_settings SET ${setClauses} WHERE guild_id = ?`).run(...values);
  }
};

// src/services/ModLogService.ts
var import_discord5 = require("discord.js");
var ModLogService = class {
  /**
   * Dispatches an embed to the guild's designated mod-log channel.
   */
  static async log(guild, embed) {
    const settings = GuildRepo.get(guild.id);
    if (!settings.mod_log_channel_id) return;
    try {
      const channel = guild.channels.cache.get(settings.mod_log_channel_id);
      if (channel && channel.isTextBased()) {
        await channel.send({ embeds: [embed] });
      }
    } catch (err) {
      Logger.error(`Failed to send log to channel ${settings.mod_log_channel_id}`, err, "ModLogService");
    }
  }
  /**
   * Logs a message deletion with snippet and author details.
   */
  static async logMessageDelete(guild, author, channelId, content, extra) {
    const embed = new import_discord5.EmbedBuilder().setColor(15548997).setTitle("\u{1F5D1}\uFE0F Message Deleted").addFields(
      { name: "Author", value: author ? `${author.tag} (\`${author.id}\`)` : "Unknown", inline: true },
      { name: "Channel", value: `<#${channelId}>`, inline: true },
      { name: "Content", value: content ? content.slice(0, 1024) : "*[No text content or embed/attachment only]*" }
    ).setTimestamp();
    if (extra) {
      embed.addFields({ name: "Security Note", value: extra });
    }
    await this.log(guild, embed);
  }
  /**
   * Logs a message edit (before vs after).
   */
  static async logMessageEdit(guild, author, channelId, oldContent, newContent, messageUrl) {
    const embed = new import_discord5.EmbedBuilder().setColor(16705372).setTitle("\u270F\uFE0F Message Edited").addFields(
      { name: "Author", value: `${author.tag} (\`${author.id}\`)`, inline: true },
      { name: "Channel", value: `<#${channelId}>`, inline: true },
      { name: "Jump to Message", value: `[Click Here](${messageUrl})`, inline: true },
      { name: "Before", value: oldContent ? oldContent.slice(0, 1024) : "*Empty*" },
      { name: "After", value: newContent ? newContent.slice(0, 1024) : "*Empty*" }
    ).setTimestamp();
    await this.log(guild, embed);
  }
};

// src/utils/time.ts
var import_ms = __toESM(require("ms"));
function parseDuration(input) {
  if (!input) return null;
  try {
    const parsed = (0, import_ms.default)(input);
    if (typeof parsed === "number" && !isNaN(parsed) && parsed > 0) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}
function formatDuration(durationMs) {
  if (durationMs < 1e3) return `${durationMs}ms`;
  const seconds = Math.floor(durationMs / 1e3 % 60);
  const minutes = Math.floor(durationMs / (1e3 * 60) % 60);
  const hours = Math.floor(durationMs / (1e3 * 60 * 60) % 24);
  const days = Math.floor(durationMs / (1e3 * 60 * 60 * 24));
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 && days === 0) parts.push(`${seconds}s`);
  return parts.length > 0 ? parts.join(" ") : "0s";
}

// src/services/PunishmentService.ts
var PunishmentService = class {
  /**
   * Safe DM helper that notifies user about action.
   */
  static async notifyUser(user, guildName, action, reason, duration) {
    try {
      const embed = Embeds.error(
        `Action Notice: ${action}`,
        `You have received a moderation action in **${guildName}**.`
      ).addFields(
        { name: "Action", value: action, inline: true },
        { name: "Reason", value: reason || "No reason specified", inline: true }
      );
      if (duration) {
        embed.addFields({ name: "Duration", value: duration, inline: true });
      }
      await user.send({ embeds: [embed] }).catch(() => null);
    } catch {
    }
  }
  /**
   * Applies a timeout to a member.
   */
  static async timeout(guild, member, durationMs, reason, moderator) {
    if (!member.moderatable) {
      return { success: false, error: "Cannot timeout this member: insufficient bot hierarchy/permissions." };
    }
    try {
      const formatted = formatDuration(durationMs);
      await this.notifyUser(member.user, guild.name, "Timeout", reason, formatted);
      await member.timeout(durationMs, `[Mod: ${moderator.tag}] ${reason}`);
      const caseId = ModCaseRepo.createCase(
        guild.id,
        member.id,
        moderator.id,
        "TIMEOUT",
        reason,
        durationMs
      );
      const logEmbed = Embeds.modAction("TIMEOUT", member, moderator, reason, caseId, formatted);
      await ModLogService.log(guild, logEmbed);
      return { success: true, caseId };
    } catch (err) {
      Logger.error(`Failed to timeout ${member.id}`, err, "PunishmentService");
      return { success: false, error: err.message || "Unknown error occurred." };
    }
  }
  /**
   * Removes a timeout from a member.
   */
  static async removeTimeout(guild, member, reason, moderator) {
    if (!member.moderatable) {
      return { success: false, error: "Cannot untimeout this member: insufficient bot hierarchy/permissions." };
    }
    try {
      await member.timeout(null, `[Mod: ${moderator.tag}] ${reason}`);
      const caseId = ModCaseRepo.createCase(
        guild.id,
        member.id,
        moderator.id,
        "UNTIMEOUT",
        reason
      );
      const logEmbed = Embeds.modAction("UNTIMEOUT", member, moderator, reason, caseId);
      await ModLogService.log(guild, logEmbed);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  /**
   * Kicks a member from the guild.
   */
  static async kick(guild, member, reason, moderator) {
    if (!member.kickable) {
      return { success: false, error: "Cannot kick this member: higher role or missing permissions." };
    }
    try {
      await this.notifyUser(member.user, guild.name, "Kick", reason);
      await member.kick(`[Mod: ${moderator.tag}] ${reason}`);
      const caseId = ModCaseRepo.createCase(guild.id, member.id, moderator.id, "KICK", reason);
      const logEmbed = Embeds.modAction("KICK", member, moderator, reason, caseId);
      await ModLogService.log(guild, logEmbed);
      return { success: true, caseId };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  /**
   * Bans a user from the guild.
   */
  static async ban(guild, user, deleteMessageDays, reason, moderator) {
    try {
      await this.notifyUser(user, guild.name, "Ban", reason);
      await guild.bans.create(user.id, {
        deleteMessageSeconds: deleteMessageDays * 24 * 60 * 60,
        reason: `[Mod: ${moderator.tag}] ${reason}`
      });
      const caseId = ModCaseRepo.createCase(guild.id, user.id, moderator.id, "BAN", reason);
      const logEmbed = Embeds.modAction("BAN", user, moderator, reason, caseId);
      await ModLogService.log(guild, logEmbed);
      return { success: true, caseId };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  /**
   * Softbans a user (bans, wipes messages, then unbans immediately).
   */
  static async softban(guild, member, reason, moderator) {
    if (!member.bannable) {
      return { success: false, error: "Cannot softban: insufficient permissions or higher role." };
    }
    try {
      await this.notifyUser(member.user, guild.name, "Softban", reason);
      await guild.bans.create(member.id, {
        deleteMessageSeconds: 7 * 24 * 60 * 60,
        reason: `[AEGIS SOFTBAN - Mod: ${moderator.tag}] ${reason}`
      });
      await guild.bans.remove(member.id, "Aegis Softban unban step");
      const caseId = ModCaseRepo.createCase(guild.id, member.id, moderator.id, "SOFTBAN", reason);
      const logEmbed = Embeds.modAction("SOFTBAN", member, moderator, reason, caseId);
      await ModLogService.log(guild, logEmbed);
      return { success: true, caseId };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  /**
   * Issues a warning and executes progressive automatic escalation if configured.
   */
  static async warn(guild, member, reason, moderator) {
    const { warnId, count } = ModCaseRepo.addWarning(guild.id, member.id, moderator.id, reason);
    await this.notifyUser(member.user, guild.name, `Warning (#${count})`, reason);
    const logEmbed = Embeds.modAction(`WARN (#${count})`, member, moderator, reason, warnId);
    await ModLogService.log(guild, logEmbed);
    let escalationTriggered;
    const settings = GuildRepo.get(guild.id);
    if (settings.punishment_escalation) {
      if (count === 3 && member.moderatable) {
        escalationTriggered = "Auto-escalation: 1 Hour Timeout (3 warnings)";
        await this.timeout(guild, member, 60 * 60 * 1e3, escalationTriggered, guild.client.user);
      } else if (count === 5 && member.moderatable) {
        escalationTriggered = "Auto-escalation: 24 Hour Timeout (5 warnings)";
        await this.timeout(guild, member, 24 * 60 * 60 * 1e3, escalationTriggered, guild.client.user);
      } else if (count === 7 && member.kickable) {
        escalationTriggered = "Auto-escalation: Kick (7 warnings)";
        await this.kick(guild, member, escalationTriggered, guild.client.user);
      } else if (count >= 10 && member.bannable) {
        escalationTriggered = "Auto-escalation: Permanent Ban (10 warnings)";
        await this.ban(guild, member.user, 1, escalationTriggered, guild.client.user);
      }
    }
    return {
      warnId,
      totalWarns: count,
      escalationTriggered
    };
  }
};

// src/commands/moderation/ban.ts
var banCommand = {
  category: "moderation",
  userPermissions: [import_discord6.PermissionsBitField.Flags.BanMembers],
  botPermissions: [import_discord6.PermissionsBitField.Flags.BanMembers],
  data: new import_discord6.SlashCommandBuilder().setName("ban").setDescription("Permanently ban or softban a user from the server").setDefaultMemberPermissions(import_discord6.PermissionsBitField.Flags.BanMembers).addUserOption(
    (opt) => opt.setName("target").setDescription("The user to ban").setRequired(true)
  ).addStringOption(
    (opt) => opt.setName("reason").setDescription("Reason for the ban").setRequired(false)
  ).addIntegerOption(
    (opt) => opt.setName("delete_days").setDescription("Number of days of message history to delete (0-7)").setMinValue(0).setMaxValue(7).setRequired(false)
  ).addBooleanOption(
    (opt) => opt.setName("softban").setDescription("Softban: ban and immediately unban to clear recent messages").setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const targetUser = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const deleteDays = interaction.options.getInteger("delete_days") ?? 1;
    const isSoftban = interaction.options.getBoolean("softban") || false;
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (targetMember) {
      if (interaction.member instanceof import_discord6.GuildMember && targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
        await interaction.reply({
          embeds: [Embeds.error("Permission Denied", "You cannot ban someone with an equal or higher role.")],
          ephemeral: true
        });
        return;
      }
    }
    await interaction.deferReply();
    if (isSoftban) {
      if (!targetMember) {
        await interaction.editReply({
          embeds: [Embeds.error("Cannot Softban", "User is not currently in the server.")]
        });
        return;
      }
      const res2 = await PunishmentService.softban(interaction.guild, targetMember, reason, interaction.user);
      if (!res2.success) {
        await interaction.editReply({ embeds: [Embeds.error("Softban Failed", res2.error || "Unknown error")] });
        return;
      }
      await interaction.editReply({
        embeds: [
          Embeds.success("Member Softbanned", `Successfully softbanned ${targetUser.tag} and purged their recent messages.`)
        ]
      });
      return;
    }
    const res = await PunishmentService.ban(interaction.guild, targetUser, deleteDays, reason, interaction.user);
    if (!res.success) {
      await interaction.editReply({ embeds: [Embeds.error("Ban Failed", res.error || "Unknown error")] });
      return;
    }
    await interaction.editReply({
      embeds: [
        Embeds.success(
          "User Banned",
          `Successfully banned **${targetUser.tag}** (\`${targetUser.id}\`).
Reason: *${reason}*`
        )
      ]
    });
  }
};

// src/commands/moderation/kick.ts
var import_discord7 = require("discord.js");
var kickCommand = {
  category: "moderation",
  userPermissions: [import_discord7.PermissionsBitField.Flags.KickMembers],
  botPermissions: [import_discord7.PermissionsBitField.Flags.KickMembers],
  data: new import_discord7.SlashCommandBuilder().setName("kick").setDescription("Kick a member from the server").setDefaultMemberPermissions(import_discord7.PermissionsBitField.Flags.KickMembers).addUserOption(
    (opt) => opt.setName("target").setDescription("The member to kick").setRequired(true)
  ).addStringOption(
    (opt) => opt.setName("reason").setDescription("Reason for kick").setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const targetUser = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember) {
      await interaction.reply({
        embeds: [Embeds.error("Member Not Found", "This user is not in the server.")],
        ephemeral: true
      });
      return;
    }
    if (interaction.member instanceof import_discord7.GuildMember && targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply({
        embeds: [Embeds.error("Permission Denied", "You cannot kick someone with an equal or higher role.")],
        ephemeral: true
      });
      return;
    }
    await interaction.deferReply();
    const res = await PunishmentService.kick(interaction.guild, targetMember, reason, interaction.user);
    if (!res.success) {
      await interaction.editReply({ embeds: [Embeds.error("Kick Failed", res.error || "Unknown error")] });
      return;
    }
    await interaction.editReply({
      embeds: [
        Embeds.success("Member Kicked", `Successfully kicked **${targetUser.tag}**.
Reason: *${reason}*`)
      ]
    });
  }
};

// src/commands/moderation/timeout.ts
var import_discord8 = require("discord.js");
var timeoutCommand = {
  category: "moderation",
  userPermissions: [import_discord8.PermissionsBitField.Flags.ModerateMembers],
  botPermissions: [import_discord8.PermissionsBitField.Flags.ModerateMembers],
  data: new import_discord8.SlashCommandBuilder().setName("timeout").setDescription("Apply or remove a timeout/mute on a member").setDefaultMemberPermissions(import_discord8.PermissionsBitField.Flags.ModerateMembers).addSubcommand(
    (sub) => sub.setName("apply").setDescription("Place a member in timeout").addUserOption(
      (opt) => opt.setName("target").setDescription("The member to timeout").setRequired(true)
    ).addStringOption(
      (opt) => opt.setName("duration").setDescription("Duration (e.g. 10m, 1h, 1d)").setRequired(true)
    ).addStringOption(
      (opt) => opt.setName("reason").setDescription("Reason for timeout").setRequired(false)
    )
  ).addSubcommand(
    (sub) => sub.setName("remove").setDescription("Remove timeout from a member").addUserOption(
      (opt) => opt.setName("target").setDescription("The member to remove timeout from").setRequired(true)
    ).addStringOption(
      (opt) => opt.setName("reason").setDescription("Reason for removing timeout").setRequired(false)
    )
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const sub = interaction.options.getSubcommand();
    const targetUser = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember) {
      await interaction.reply({
        embeds: [Embeds.error("Member Not Found", "This user is not currently in the server.")],
        ephemeral: true
      });
      return;
    }
    if (interaction.member instanceof import_discord8.GuildMember && targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply({
        embeds: [Embeds.error("Permission Denied", "You cannot moderate someone with an equal or higher role.")],
        ephemeral: true
      });
      return;
    }
    await interaction.deferReply();
    if (sub === "apply") {
      const durationStr = interaction.options.getString("duration", true);
      const durationMs = parseDuration(durationStr);
      if (!durationMs || durationMs > 28 * 24 * 60 * 60 * 1e3) {
        await interaction.editReply({
          embeds: [
            Embeds.error(
              "Invalid Duration",
              "Please enter a valid duration between 1 minute and 28 days (e.g. `10m`, `1h`, `1d`)."
            )
          ]
        });
        return;
      }
      const res = await PunishmentService.timeout(
        interaction.guild,
        targetMember,
        durationMs,
        reason,
        interaction.user
      );
      if (!res.success) {
        await interaction.editReply({ embeds: [Embeds.error("Timeout Failed", res.error || "Unknown error")] });
        return;
      }
      await interaction.editReply({
        embeds: [
          Embeds.success(
            "Member Timed Out",
            `Successfully timed out **${targetUser.tag}** for **${formatDuration(durationMs)}**.
Reason: *${reason}*`
          )
        ]
      });
      return;
    }
    if (sub === "remove") {
      const res = await PunishmentService.removeTimeout(
        interaction.guild,
        targetMember,
        reason,
        interaction.user
      );
      if (!res.success) {
        await interaction.editReply({ embeds: [Embeds.error("Untimeout Failed", res.error || "Unknown error")] });
        return;
      }
      await interaction.editReply({
        embeds: [Embeds.success("Timeout Removed", `Removed timeout from **${targetUser.tag}**.`)]
      });
      return;
    }
  }
};

// src/commands/moderation/warn.ts
var import_discord9 = require("discord.js");
var warnCommand = {
  category: "moderation",
  userPermissions: [import_discord9.PermissionsBitField.Flags.ModerateMembers],
  data: new import_discord9.SlashCommandBuilder().setName("warn").setDescription("Issue a formal warning to a member with auto-escalation").setDefaultMemberPermissions(import_discord9.PermissionsBitField.Flags.ModerateMembers).addUserOption(
    (opt) => opt.setName("target").setDescription("The member to warn").setRequired(true)
  ).addStringOption(
    (opt) => opt.setName("reason").setDescription("Reason for warning").setRequired(true)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const targetUser = interaction.options.getUser("target", true);
    const reason = interaction.options.getString("reason", true);
    const targetMember = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember) {
      await interaction.reply({
        embeds: [Embeds.error("Member Not Found", "This user is not currently in the server.")],
        ephemeral: true
      });
      return;
    }
    if (interaction.member instanceof import_discord9.GuildMember && targetMember.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply({
        embeds: [Embeds.error("Permission Denied", "You cannot warn someone with an equal or higher role.")],
        ephemeral: true
      });
      return;
    }
    await interaction.deferReply();
    const result = await PunishmentService.warn(interaction.guild, targetMember, reason, interaction.user);
    let desc = `Successfully warned **${targetUser.tag}** (Warning #${result.totalWarns}).
Reason: *${reason}*`;
    if (result.escalationTriggered) {
      desc += `

\u26A1 **${result.escalationTriggered}**`;
    }
    await interaction.editReply({
      embeds: [Embeds.success("Warning Issued", desc)]
    });
  }
};
var warningsCommand = {
  category: "moderation",
  userPermissions: [import_discord9.PermissionsBitField.Flags.ModerateMembers],
  data: new import_discord9.SlashCommandBuilder().setName("warnings").setDescription("View all warnings recorded for a user").setDefaultMemberPermissions(import_discord9.PermissionsBitField.Flags.ModerateMembers).addUserOption(
    (opt) => opt.setName("target").setDescription("User to view warnings for").setRequired(true)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const targetUser = interaction.options.getUser("target", true);
    const warns = ModCaseRepo.getWarnings(interaction.guild.id, targetUser.id);
    if (warns.length === 0) {
      await interaction.reply({
        embeds: [Embeds.info("Clean Record", `**${targetUser.tag}** has 0 active warnings.`)]
      });
      return;
    }
    const formatted = warns.slice(0, 15).map(
      (w, idx) => `**#${w.id}** \u2022 <t:${Math.floor(w.created_at / 1e3)}:d> by <@${w.moderator_id}>
Reason: *${w.reason}*`
    ).join("\n\n");
    const embed = new import_discord9.EmbedBuilder().setColor(16705372).setTitle(`\u26A0\uFE0F Warning History: ${targetUser.tag} (${warns.length} total)`).setDescription(formatted).setThumbnail(targetUser.displayAvatarURL()).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
var clearWarnsCommand = {
  category: "moderation",
  userPermissions: [import_discord9.PermissionsBitField.Flags.Administrator],
  data: new import_discord9.SlashCommandBuilder().setName("clearwarns").setDescription("Clear all recorded warnings for a user").setDefaultMemberPermissions(import_discord9.PermissionsBitField.Flags.Administrator).addUserOption(
    (opt) => opt.setName("target").setDescription("User whose warnings should be cleared").setRequired(true)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const targetUser = interaction.options.getUser("target", true);
    const cleared = ModCaseRepo.clearWarnings(interaction.guild.id, targetUser.id);
    await interaction.reply({
      embeds: [Embeds.success("Warnings Cleared", `Successfully purged **${cleared}** warnings for ${targetUser.tag}.`)]
    });
  }
};

// src/commands/moderation/purge.ts
var import_discord10 = require("discord.js");
var purgeCommand = {
  category: "moderation",
  userPermissions: [import_discord10.PermissionsBitField.Flags.ManageMessages],
  botPermissions: [import_discord10.PermissionsBitField.Flags.ManageMessages],
  data: new import_discord10.SlashCommandBuilder().setName("purge").setDescription("Bulk delete messages with optional smart filters").setDefaultMemberPermissions(import_discord10.PermissionsBitField.Flags.ManageMessages).addIntegerOption(
    (opt) => opt.setName("amount").setDescription("Number of messages to analyze and delete (1-100)").setMinValue(1).setMaxValue(100).setRequired(true)
  ).addUserOption(
    (opt) => opt.setName("user").setDescription("Only delete messages sent by this specific user").setRequired(false)
  ).addBooleanOption(
    (opt) => opt.setName("bots_only").setDescription("Only delete messages sent by bots").setRequired(false)
  ).addBooleanOption(
    (opt) => opt.setName("links_only").setDescription("Only delete messages containing links").setRequired(false)
  ),
  async execute(interaction) {
    const channel = interaction.channel;
    if (!channel || !(channel instanceof import_discord10.TextChannel)) {
      await interaction.reply({ content: "Can only be used in text channels.", ephemeral: true });
      return;
    }
    const amount = interaction.options.getInteger("amount", true);
    const filterUser = interaction.options.getUser("user");
    const botsOnly = interaction.options.getBoolean("bots_only") || false;
    const linksOnly = interaction.options.getBoolean("links_only") || false;
    await interaction.deferReply({ ephemeral: true });
    try {
      const messages = await channel.messages.fetch({ limit: amount });
      let filtered = Array.from(messages.values());
      if (filterUser) {
        filtered = filtered.filter((m) => m.author.id === filterUser.id);
      }
      if (botsOnly) {
        filtered = filtered.filter((m) => m.author.bot);
      }
      if (linksOnly) {
        filtered = filtered.filter((m) => /(https?:\/\/[^\s]+)/g.test(m.content));
      }
      const fourteenDaysAgo = Date.now() - 14 * 24 * 60 * 60 * 1e3;
      filtered = filtered.filter((m) => m.createdTimestamp > fourteenDaysAgo);
      if (filtered.length === 0) {
        await interaction.editReply({
          embeds: [Embeds.warning("No Messages Matched", "No messages within 14 days matched your criteria.")]
        });
        return;
      }
      const deleted = await channel.bulkDelete(filtered, true);
      await interaction.editReply({
        embeds: [Embeds.success("Purge Completed", `Successfully deleted **${deleted.size}** messages.`)]
      });
    } catch (err) {
      await interaction.editReply({
        embeds: [Embeds.error("Purge Failed", err.message || "Discord API error")]
      });
    }
  }
};

// src/commands/moderation/lock.ts
var import_discord11 = require("discord.js");
var lockCommand = {
  category: "moderation",
  userPermissions: [import_discord11.PermissionsBitField.Flags.ManageChannels],
  botPermissions: [import_discord11.PermissionsBitField.Flags.ManageChannels],
  data: new import_discord11.SlashCommandBuilder().setName("lock").setDescription("Lock down a channel to prevent regular members from sending messages").setDefaultMemberPermissions(import_discord11.PermissionsBitField.Flags.ManageChannels).addChannelOption(
    (opt) => opt.setName("channel").setDescription("Channel to lock (defaults to current channel)").setRequired(false)
  ).addStringOption(
    (opt) => opt.setName("reason").setDescription("Reason for the lockdown").setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const reason = interaction.options.getString("reason") || "Emergency Server Lockdown";
    if (!channel || !(channel instanceof import_discord11.TextChannel)) {
      await interaction.reply({ content: "Invalid text channel.", ephemeral: true });
      return;
    }
    try {
      await channel.permissionOverwrites.edit(interaction.guild.id, {
        SendMessages: false,
        AddReactions: false,
        CreatePublicThreads: false,
        CreatePrivateThreads: false
      });
      await interaction.reply({
        embeds: [
          Embeds.warning(
            "Channel Locked",
            `\u{1F512} ${channel} has been locked down by ${interaction.user}.
Reason: *${reason}*`
          )
        ]
      });
    } catch (err) {
      await interaction.reply({
        embeds: [Embeds.error("Failed to Lock Channel", err.message)],
        ephemeral: true
      });
    }
  }
};
var unlockCommand = {
  category: "moderation",
  userPermissions: [import_discord11.PermissionsBitField.Flags.ManageChannels],
  botPermissions: [import_discord11.PermissionsBitField.Flags.ManageChannels],
  data: new import_discord11.SlashCommandBuilder().setName("unlock").setDescription("Unlock a previously locked channel").setDefaultMemberPermissions(import_discord11.PermissionsBitField.Flags.ManageChannels).addChannelOption(
    (opt) => opt.setName("channel").setDescription("Channel to unlock (defaults to current channel)").setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    if (!channel || !(channel instanceof import_discord11.TextChannel)) {
      await interaction.reply({ content: "Invalid text channel.", ephemeral: true });
      return;
    }
    try {
      await channel.permissionOverwrites.edit(interaction.guild.id, {
        SendMessages: null,
        AddReactions: null,
        CreatePublicThreads: null,
        CreatePrivateThreads: null
      });
      await interaction.reply({
        embeds: [Embeds.success("Channel Unlocked", `\u{1F513} ${channel} has been unlocked. Members can now speak.`)]
      });
    } catch (err) {
      await interaction.reply({
        embeds: [Embeds.error("Failed to Unlock Channel", err.message)],
        ephemeral: true
      });
    }
  }
};

// src/commands/moderation/slowmode.ts
var import_discord12 = require("discord.js");
var slowmodeCommand = {
  category: "moderation",
  userPermissions: [import_discord12.PermissionsBitField.Flags.ManageChannels],
  botPermissions: [import_discord12.PermissionsBitField.Flags.ManageChannels],
  data: new import_discord12.SlashCommandBuilder().setName("slowmode").setDescription("Set slowmode cooldown for the current or specified channel").setDefaultMemberPermissions(import_discord12.PermissionsBitField.Flags.ManageChannels).addIntegerOption(
    (opt) => opt.setName("seconds").setDescription("Cooldown duration in seconds (0 to disable, up to 21600 / 6h)").setMinValue(0).setMaxValue(21600).setRequired(true)
  ).addChannelOption(
    (opt) => opt.setName("channel").setDescription("Channel to apply slowmode to").setRequired(false)
  ),
  async execute(interaction) {
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    const seconds = interaction.options.getInteger("seconds", true);
    if (!channel || !(channel instanceof import_discord12.TextChannel)) {
      await interaction.reply({ content: "Invalid text channel.", ephemeral: true });
      return;
    }
    try {
      await channel.setRateLimitPerUser(seconds, `Set by ${interaction.user.tag}`);
      if (seconds === 0) {
        await interaction.reply({
          embeds: [Embeds.success("Slowmode Disabled", `Slowmode has been turned off in ${channel}.`)]
        });
      } else {
        await interaction.reply({
          embeds: [
            Embeds.success(
              "Slowmode Activated",
              `\u23F1\uFE0F Slowmode in ${channel} set to **${seconds}** second${seconds === 1 ? "" : "s"}.`
            )
          ]
        });
      }
    } catch (err) {
      await interaction.reply({
        embeds: [Embeds.error("Failed to Set Slowmode", err.message)],
        ephemeral: true
      });
    }
  }
};

// src/commands/utility/userinfo.ts
var import_discord13 = require("discord.js");
var userinfoCommand = {
  category: "utility",
  data: new import_discord13.SlashCommandBuilder().setName("userinfo").setDescription("Display detailed intelligence, permissions, and moderation history for a user").addUserOption(
    (opt) => opt.setName("target").setDescription("Target user (defaults to you)").setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const targetUser = interaction.options.getUser("target") || interaction.user;
    const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
    const warnCount = ModCaseRepo.getWarningCount(interaction.guild.id, targetUser.id);
    const cases = ModCaseRepo.getUserCases(interaction.guild.id, targetUser.id);
    const isWhitelisted = SecurityRepo.isWhitelisted(
      interaction.guild.id,
      targetUser.id,
      member ? Array.from(member.roles.cache.keys()) : []
    );
    const accountCreatedTimestamp = Math.floor(targetUser.createdTimestamp / 1e3);
    const joinedTimestamp = member ? Math.floor(member.joinedTimestamp / 1e3) : null;
    const accountAgeDays = Math.floor((Date.now() - targetUser.createdTimestamp) / (1e3 * 60 * 60 * 24));
    let trustScore = "\u{1F7E2} High Trust";
    if (accountAgeDays < 1) {
      trustScore = "\u{1F534} Very Suspicious (Account < 24h)";
    } else if (accountAgeDays < 7) {
      trustScore = "\u{1F7E1} Medium Trust (Account < 7d)";
    } else if (warnCount >= 3) {
      trustScore = "\u{1F7E0} Caution (Multiple Infractions)";
    }
    const embed = new import_discord13.EmbedBuilder().setColor(5793266).setTitle(`\u{1F464} User Dossier: ${targetUser.tag}`).setThumbnail(targetUser.displayAvatarURL({ size: 256 })).addFields(
      { name: "User ID", value: `\`${targetUser.id}\``, inline: true },
      { name: "Bot Account", value: targetUser.bot ? "\u{1F916} Yes" : "\u{1F464} No", inline: true },
      { name: "Security Whitelist", value: isWhitelisted ? "\u{1F6E1}\uFE0F Whitelisted" : "Standard Protection", inline: true },
      { name: "Account Created", value: `<t:${accountCreatedTimestamp}:F>
(<t:${accountCreatedTimestamp}:R>)`, inline: true },
      { name: "Server Joined", value: joinedTimestamp ? `<t:${joinedTimestamp}:F>
(<t:${joinedTimestamp}:R>)` : "Not in server", inline: true },
      { name: "Trust Assessment", value: trustScore, inline: true },
      {
        name: "Disciplinary Record",
        value: `\u2022 **${warnCount}** Warnings
\u2022 **${cases.length}** Total Mod Cases`,
        inline: true
      }
    ).setTimestamp();
    if (member) {
      const roles = member.roles.cache.filter((r) => r.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map((r) => `<@&${r.id}>`);
      embed.addFields({
        name: `Roles (${roles.length})`,
        value: roles.length > 0 ? roles.slice(0, 15).join(" ") + (roles.length > 15 ? "..." : "") : "No assigned roles"
      });
    }
    await interaction.reply({ embeds: [embed] });
  }
};

// src/commands/utility/serverinfo.ts
var import_discord14 = require("discord.js");
var serverinfoCommand = {
  category: "utility",
  data: new import_discord14.SlashCommandBuilder().setName("serverinfo").setDescription("Display comprehensive server statistics and security posture"),
  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) return;
    await guild.members.fetch();
    const textChannels = guild.channels.cache.filter((c) => c.type === import_discord14.ChannelType.GuildText).size;
    const voiceChannels = guild.channels.cache.filter((c) => c.type === import_discord14.ChannelType.GuildVoice).size;
    const categories = guild.channels.cache.filter((c) => c.type === import_discord14.ChannelType.GuildCategory).size;
    const botCount = guild.members.cache.filter((m) => m.user.bot).size;
    const humanCount = guild.memberCount - botCount;
    const sec = SecurityRepo.get(guild.id);
    const activeDefenses = [
      sec.anti_nuke ? "Anti-Nuke" : null,
      sec.anti_raid ? "Anti-Raid" : null,
      sec.anti_spam ? "Anti-Spam" : null,
      sec.anti_invite ? "Anti-Invite" : null,
      sec.anti_ghostping ? "Anti-GhostPing" : null
    ].filter(Boolean);
    const embed = new import_discord14.EmbedBuilder().setColor(5793266).setTitle(`\u{1F3F0} Server Intelligence: ${guild.name}`).setThumbnail(guild.iconURL({ size: 256 }) || null).addFields(
      { name: "Server Owner", value: `<@${guild.ownerId}>`, inline: true },
      { name: "Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1e3)}:d>`, inline: true },
      { name: "Verification Level", value: `${guild.verificationLevel}`, inline: true },
      {
        name: `Members (${guild.memberCount})`,
        value: `\u{1F464} **${humanCount}** Humans \u2022 \u{1F916} **${botCount}** Bots`,
        inline: true
      },
      {
        name: `Channels (${guild.channels.cache.size})`,
        value: `\u{1F4AC} **${textChannels}** Text \u2022 \u{1F50A} **${voiceChannels}** Voice \u2022 \u{1F4C1} **${categories}** Categories`,
        inline: true
      },
      {
        name: "Roles",
        value: `\u{1F6E1}\uFE0F **${guild.roles.cache.size}** Roles`,
        inline: true
      },
      {
        name: "Aegis Active Shields",
        value: activeDefenses.length > 0 ? activeDefenses.map((d) => `\u2705 \`${d}\``).join(" ") : "\u274C None",
        inline: false
      }
    ).setFooter({ text: `Guild ID: ${guild.id}` }).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};

// src/commands/utility/botinfo.ts
var import_discord15 = require("discord.js");
var import_os = __toESM(require("os"));
var botinfoCommand = {
  category: "utility",
  data: new import_discord15.SlashCommandBuilder().setName("botinfo").setDescription("Display Aegis Bot system status, performance, and uptime metrics"),
  async execute(interaction) {
    const client2 = interaction.client;
    const uptime = formatDuration(client2.uptime || 0);
    const memoryUsedMb = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
    const totalMemoryMb = (import_os.default.totalmem() / 1024 / 1024).toFixed(0);
    const embed = new import_discord15.EmbedBuilder().setColor(5793266).setTitle("\u{1F6E1}\uFE0F Aegis Security & Intelligence Core").setDescription(
      "Aegis is an enterprise-grade Discord Security and Multipurpose Bot powered by deep anti-bypass homoglyph de-obfuscation and autonomous defensive countermeasures."
    ).addFields(
      { name: "Bot Latency", value: `\u26A1 ${client2.ws.ping}ms`, inline: true },
      { name: "System Uptime", value: `\u23F1\uFE0F ${uptime}`, inline: true },
      { name: "Servers Guarded", value: `\u{1F3F0} ${client2.guilds.cache.size}`, inline: true },
      { name: "Memory Usage", value: `\u{1F4BE} ${memoryUsedMb} MB / ${totalMemoryMb} MB`, inline: true },
      { name: "Node.js", value: `\u{1F7E2} ${process.version}`, inline: true },
      { name: "Discord.js", value: `\u{1F4E6} v${import_discord15.version}`, inline: true },
      {
        name: "Core Security Engines",
        value: "\u2022 **Homoglyph & Confusable Normalizer** (Unicode NFKD + Cyrillic/Greek/Math)\n\u2022 **Anti-Bypass Invite & Phishing Shield**\n\u2022 **Token Bucket Anti-Spam & Burst Limiter**\n\u2022 **Audit-Log Anti-Nuke Watchdog**\n\u2022 **Join-Burst Anti-Raid Sentinel**"
      }
    ).setFooter({ text: "Aegis Security Engine \u2022 Pair Programming Build" }).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};
var avatarCommand = {
  category: "utility",
  data: new import_discord15.SlashCommandBuilder().setName("avatar").setDescription("Get full-resolution avatar of a user").addUserOption(
    (opt) => opt.setName("target").setDescription("Target user").setRequired(false)
  ),
  async execute(interaction) {
    const target = interaction.options.getUser("target") || interaction.user;
    const avatarUrl = target.displayAvatarURL({ size: 1024 });
    const embed = new import_discord15.EmbedBuilder().setColor(5793266).setTitle(`Avatar for ${target.tag}`).setImage(avatarUrl).setDescription(`[Download High-Res Image](${avatarUrl})`).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};

// src/commands/utility/status.ts
var import_discord16 = require("discord.js");
var statusCommand = {
  category: "utility",
  data: new import_discord16.SlashCommandBuilder().setName("status").setDescription("Change, reset, or clear the bot's online presence status").addSubcommand(
    (sub) => sub.setName("set").setDescription("Set a custom presence text and status symbol").addStringOption(
      (opt) => opt.setName("text").setDescription("Status text with custom symbols (e.g. \u{13288} \u26A1 \u{1D416}\u{1D400}\u{1D415}\u{1D404}\u{1D412}\u{1D413}\u{1D400}\u{1D402}\u{1D40A} \u26A1 \u{13289})").setRequired(true)
    ).addStringOption(
      (opt) => opt.setName("state").setDescription("Online status indicator").setRequired(false).addChoices(
        { name: "\u{1F7E2} Online", value: "online" },
        { name: "\u26D4 Do Not Disturb (DND)", value: "dnd" },
        { name: "\u{1F319} Idle", value: "idle" }
      )
    ).addStringOption(
      (opt) => opt.setName("type").setDescription("Activity type").setRequired(false).addChoices(
        { name: "Custom (Text)", value: "custom" },
        { name: "Listening (\u266B)", value: "listening" },
        { name: "Watching (\u{1F441}\uFE0F)", value: "watching" },
        { name: "Playing (\u{1F3AE})", value: "playing" }
      )
    )
  ).addSubcommand(
    (sub) => sub.setName("reset").setDescription("Display live Server Count & Member Count presence")
  ).addSubcommand(
    (sub) => sub.setName("clear").setDescription("Clear the status completely (clean online status with no text or activity)")
  ),
  async execute(interaction) {
    if (interaction.user.id !== config.ownerId) {
      await interaction.reply({
        content: "\u274C Only the **Bot Owner** (`" + config.ownerId + "`) can change the global bot presence.",
        ephemeral: true
      });
      return;
    }
    const sub = interaction.options.getSubcommand();
    const client2 = interaction.client;
    if (sub === "clear") {
      clearStatus(client2);
      const embed = new import_discord16.EmbedBuilder().setColor(5763719).setTitle("\u{1F9F9} Status Cleared").setDescription("The bot status has been cleared. The bot is now clean **Online** with no custom text or activity.").setTimestamp();
      await interaction.reply({ embeds: [embed] });
      return;
    }
    if (sub === "reset") {
      startPresenceRotation(client2);
      const { guildCount, memberCount } = getServerAndMemberCounts(client2);
      const embed = new import_discord16.EmbedBuilder().setColor(5763719).setTitle("\u{1F4CA} Server & Member Count Status Active").setDescription(`Online status set to live Server & Member counts:

\u2022 \`\u{13288} \u{1F3F0} ${guildCount} Servers \u25C8 \u{1F465} ${memberCount} Members \u{13289}\`
\u2022 \`Watching ${memberCount} Members across ${guildCount} Servers \u{1F3F0}\`
\u2022 \`\u{1F6E1}\uFE0F Aegis \u25C8 ${guildCount} Servers \u25C8 \u{1F465} ${memberCount} Members \u26A1\`
\u2022 \`Guarding ${guildCount} Servers with ${memberCount} Members \u{1F3F0}\``).setTimestamp();
      await interaction.reply({ embeds: [embed] });
      return;
    }
    if (sub === "set") {
      const text = interaction.options.getString("text", true);
      const state = interaction.options.getString("state") || "online";
      const typeStr = interaction.options.getString("type") || "custom";
      let activityType = import_discord16.ActivityType.Custom;
      if (typeStr === "listening") activityType = import_discord16.ActivityType.Listening;
      else if (typeStr === "watching") activityType = import_discord16.ActivityType.Watching;
      else if (typeStr === "playing") activityType = import_discord16.ActivityType.Playing;
      setCustomStatus(client2, text, activityType, state);
      const embed = new import_discord16.EmbedBuilder().setColor(5763719).setTitle("\u2728 Bot Status Updated").setDescription(`**Presence Text:** \`${text}\`
**Status:** \`${state.toUpperCase()}\`
**Activity Type:** \`${typeStr.toUpperCase()}\``).setFooter({ text: "Unique Symbol Presence \u2022 Global" }).setTimestamp();
      await interaction.reply({ embeds: [embed] });
    }
  }
};

// src/commands/utility/serverProfile.ts
var import_discord17 = require("discord.js");
async function downloadImageBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image (HTTP ${res.status})`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    throw new Error("Provided URL does not point to a valid image format (PNG, JPEG, WEBP, or GIF).");
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error("Image file is too large (maximum size is 10 MB).");
  }
  return buffer;
}
async function updateServerAvatar(guild, imageUrl, reset = false) {
  try {
    if (reset) {
      await guild.members.editMe({ avatar: null, reason: "Reset bot server avatar to default" });
      return { success: true, message: "Bot server avatar has been reset to default." };
    }
    if (!imageUrl) {
      return { success: false, message: "Please provide an image URL or upload an attachment." };
    }
    const buffer = await downloadImageBuffer(imageUrl);
    await guild.members.editMe({ avatar: buffer, reason: "Updated bot server avatar" });
    const me = await guild.members.fetchMe();
    return {
      success: true,
      message: "Bot server avatar updated successfully! (Only affects this server, not the main bot avatar)",
      avatarUrl: me.displayAvatarURL({ size: 1024 })
    };
  } catch (err) {
    Logger.error(`Failed to update bot server avatar in guild ${guild.name}: ${err.message}`, err, "ServerProfile");
    return { success: false, message: err.message || "Failed to update bot server avatar." };
  }
}
async function updateServerBanner(guild, imageUrl, reset = false) {
  try {
    if (reset) {
      await guild.members.editMe({ banner: null, reason: "Reset bot server banner to default" });
      return { success: true, message: "Bot server banner has been reset to default." };
    }
    if (!imageUrl) {
      return { success: false, message: "Please provide an image URL or upload an attachment." };
    }
    const buffer = await downloadImageBuffer(imageUrl);
    await guild.members.editMe({ banner: buffer, reason: "Updated bot server banner" });
    return {
      success: true,
      message: "Bot server banner updated successfully! (Only affects this server, not the main bot banner)"
    };
  } catch (err) {
    Logger.error(`Failed to update bot server banner in guild ${guild.name}: ${err.message}`, err, "ServerProfile");
    return { success: false, message: err.message || "Failed to update bot server banner." };
  }
}
async function updateGuildIcon(guild, imageUrl, reset = false) {
  try {
    if (reset) {
      await guild.setIcon(null, "Reset server icon via command");
      return { success: true, message: "Server icon has been reset to none." };
    }
    if (!imageUrl) {
      return { success: false, message: "Please provide an image URL or upload an attachment." };
    }
    const buffer = await downloadImageBuffer(imageUrl);
    await guild.setIcon(buffer, "Updated server icon via command");
    return {
      success: true,
      message: "Discord server icon updated successfully!",
      iconUrl: guild.iconURL({ size: 1024 }) || void 0
    };
  } catch (err) {
    Logger.error(`Failed to update server icon for ${guild.name}: ${err.message}`, err, "GuildProfile");
    return { success: false, message: err.message || "Failed to update server icon." };
  }
}
async function updateGuildBanner(guild, imageUrl, reset = false) {
  try {
    if (reset) {
      await guild.setBanner(null, "Reset server banner via command");
      return { success: true, message: "Server banner has been removed." };
    }
    if (!imageUrl) {
      return { success: false, message: "Please provide an image URL or upload an attachment." };
    }
    const buffer = await downloadImageBuffer(imageUrl);
    await guild.setBanner(buffer, "Updated server banner via command");
    return {
      success: true,
      message: "Discord server banner updated successfully!",
      bannerUrl: guild.bannerURL({ size: 1024 }) || void 0
    };
  } catch (err) {
    Logger.error(`Failed to update server banner for ${guild.name}: ${err.message}`, err, "GuildProfile");
    if (err.message?.includes("Missing Access") || err.message?.includes("feature") || err.code === 50035) {
      return {
        success: false,
        message: "This server cannot set a server banner because it requires Discord Server Boost Level 2. (Note: To change the **Bot's** server banner instead, use `/botbanner` or `!botbanner`!)"
      };
    }
    return { success: false, message: err.message || "Failed to update server banner." };
  }
}
var botAvatarCommand = {
  category: "utility",
  data: new import_discord17.SlashCommandBuilder().setName("botavatar").setDescription("Change or reset the bot's avatar for this server only (Bot Server Profile)").addAttachmentOption((opt) => opt.setName("image").setDescription("Upload an avatar image file").setRequired(false)).addStringOption((opt) => opt.setName("url").setDescription("Direct image URL").setRequired(false)).addBooleanOption((opt) => opt.setName("reset").setDescription("Reset avatar back to default").setRequired(false)),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: "\u274C This command can only be used inside a server.", ephemeral: true });
      return;
    }
    const member = interaction.member;
    if (!member?.permissions.has(import_discord17.PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== config.ownerId) {
      await interaction.reply({
        embeds: [Embeds.error("Permission Denied", "You need the **Manage Server** permission to change the bot's server profile.")],
        ephemeral: true
      });
      return;
    }
    await interaction.deferReply();
    const attachment = interaction.options.getAttachment("image");
    const url = interaction.options.getString("url");
    const reset = interaction.options.getBoolean("reset") || false;
    const targetUrl = attachment?.url || url || null;
    const result = await updateServerAvatar(interaction.guild, targetUrl, reset);
    if (result.success) {
      const embed = new import_discord17.EmbedBuilder().setColor(5763719).setTitle("\u{1F5BC}\uFE0F Bot Server Avatar Updated").setDescription(result.message || "Bot server avatar changed!").setFooter({ text: "Server Profile \u2022 Main bot avatar remains unchanged" }).setTimestamp();
      if (result.avatarUrl) embed.setThumbnail(result.avatarUrl);
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.editReply({ embeds: [Embeds.error("Error", result.message || "Failed to update bot avatar.")] });
    }
  }
};
var serverAvatarCommand = {
  ...botAvatarCommand,
  data: new import_discord17.SlashCommandBuilder().setName("serveravatar").setDescription("Change or reset the bot's avatar for this server only (Bot Server Profile)").addAttachmentOption((opt) => opt.setName("image").setDescription("Upload an avatar image file").setRequired(false)).addStringOption((opt) => opt.setName("url").setDescription("Direct image URL").setRequired(false)).addBooleanOption((opt) => opt.setName("reset").setDescription("Reset avatar back to default").setRequired(false))
};
var botBannerCommand = {
  category: "utility",
  data: new import_discord17.SlashCommandBuilder().setName("botbanner").setDescription("Change or reset the bot's banner for this server only (Bot Server Profile)").addAttachmentOption((opt) => opt.setName("image").setDescription("Upload a banner image file").setRequired(false)).addStringOption((opt) => opt.setName("url").setDescription("Direct banner image URL").setRequired(false)).addBooleanOption((opt) => opt.setName("reset").setDescription("Reset banner back to default").setRequired(false)),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: "\u274C This command can only be used inside a server.", ephemeral: true });
      return;
    }
    const member = interaction.member;
    if (!member?.permissions.has(import_discord17.PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== config.ownerId) {
      await interaction.reply({
        embeds: [Embeds.error("Permission Denied", "You need the **Manage Server** permission to change the bot's server profile.")],
        ephemeral: true
      });
      return;
    }
    await interaction.deferReply();
    const attachment = interaction.options.getAttachment("image");
    const url = interaction.options.getString("url");
    const reset = interaction.options.getBoolean("reset") || false;
    const targetUrl = attachment?.url || url || null;
    const result = await updateServerBanner(interaction.guild, targetUrl, reset);
    if (result.success) {
      const embed = new import_discord17.EmbedBuilder().setColor(5763719).setTitle("\u{1F3A8} Bot Server Banner Updated").setDescription(result.message || "Bot server banner changed!").setFooter({ text: "Server Profile \u2022 Main bot banner remains unchanged" }).setTimestamp();
      if (targetUrl && !reset) embed.setImage(targetUrl);
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.editReply({ embeds: [Embeds.error("Error", result.message || "Failed to update bot banner.")] });
    }
  }
};
var serverBannerCommand = {
  ...botBannerCommand,
  data: new import_discord17.SlashCommandBuilder().setName("serverbanner").setDescription("Change or reset the bot's banner for this server only (Bot Server Profile)").addAttachmentOption((opt) => opt.setName("image").setDescription("Upload a banner image file").setRequired(false)).addStringOption((opt) => opt.setName("url").setDescription("Direct banner image URL").setRequired(false)).addBooleanOption((opt) => opt.setName("reset").setDescription("Reset banner back to default").setRequired(false))
};
var guildIconCommand = {
  category: "utility",
  data: new import_discord17.SlashCommandBuilder().setName("guildicon").setDescription("Change or reset the actual Discord Server's Icon").addAttachmentOption((opt) => opt.setName("image").setDescription("Upload an icon image file").setRequired(false)).addStringOption((opt) => opt.setName("url").setDescription("Direct icon image URL").setRequired(false)).addBooleanOption((opt) => opt.setName("reset").setDescription("Reset server icon").setRequired(false)),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: "\u274C This command can only be used inside a server.", ephemeral: true });
      return;
    }
    const member = interaction.member;
    if (!member?.permissions.has(import_discord17.PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== config.ownerId) {
      await interaction.reply({
        embeds: [Embeds.error("Permission Denied", "You need the **Manage Server** permission to change the server icon.")],
        ephemeral: true
      });
      return;
    }
    await interaction.deferReply();
    const attachment = interaction.options.getAttachment("image");
    const url = interaction.options.getString("url");
    const reset = interaction.options.getBoolean("reset") || false;
    const targetUrl = attachment?.url || url || null;
    const result = await updateGuildIcon(interaction.guild, targetUrl, reset);
    if (result.success) {
      const embed = new import_discord17.EmbedBuilder().setColor(5763719).setTitle("\u{1F3F0} Server Icon Updated").setDescription(result.message || "Server icon updated!").setTimestamp();
      if (result.iconUrl) embed.setThumbnail(result.iconUrl);
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.editReply({ embeds: [Embeds.error("Error", result.message || "Failed to update server icon.")] });
    }
  }
};
var guildBannerCommand = {
  category: "utility",
  data: new import_discord17.SlashCommandBuilder().setName("guildbanner").setDescription("Change or reset the actual Discord Server's Banner (Requires Boost Level 2)").addAttachmentOption((opt) => opt.setName("image").setDescription("Upload a server banner image file").setRequired(false)).addStringOption((opt) => opt.setName("url").setDescription("Direct banner image URL").setRequired(false)).addBooleanOption((opt) => opt.setName("reset").setDescription("Reset server banner").setRequired(false)),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: "\u274C This command can only be used inside a server.", ephemeral: true });
      return;
    }
    const member = interaction.member;
    if (!member?.permissions.has(import_discord17.PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== config.ownerId) {
      await interaction.reply({
        embeds: [Embeds.error("Permission Denied", "You need the **Manage Server** permission to change the server banner.")],
        ephemeral: true
      });
      return;
    }
    await interaction.deferReply();
    const attachment = interaction.options.getAttachment("image");
    const url = interaction.options.getString("url");
    const reset = interaction.options.getBoolean("reset") || false;
    const targetUrl = attachment?.url || url || null;
    const result = await updateGuildBanner(interaction.guild, targetUrl, reset);
    if (result.success) {
      const embed = new import_discord17.EmbedBuilder().setColor(5763719).setTitle("\u{1F6A9} Server Banner Updated").setDescription(result.message || "Server banner updated!").setTimestamp();
      if (targetUrl && !reset) embed.setImage(targetUrl);
      await interaction.editReply({ embeds: [embed] });
    } else {
      await interaction.editReply({ embeds: [Embeds.error("Error", result.message || "Failed to update server banner.")] });
    }
  }
};
var serverProfileCommand = {
  category: "utility",
  data: new import_discord17.SlashCommandBuilder().setName("serverprofile").setDescription("Customize the bot's server avatar and banner for this guild only").addSubcommand(
    (sub) => sub.setName("avatar").setDescription("Set or reset the bot's server avatar for this server").addAttachmentOption((opt) => opt.setName("image").setDescription("Upload an avatar image").setRequired(false)).addStringOption((opt) => opt.setName("url").setDescription("Direct image URL").setRequired(false)).addBooleanOption((opt) => opt.setName("reset").setDescription("Reset avatar to default").setRequired(false))
  ).addSubcommand(
    (sub) => sub.setName("banner").setDescription("Set or reset the bot's server banner for this server").addAttachmentOption((opt) => opt.setName("image").setDescription("Upload a banner image").setRequired(false)).addStringOption((opt) => opt.setName("url").setDescription("Direct image URL").setRequired(false)).addBooleanOption((opt) => opt.setName("reset").setDescription("Reset banner to default").setRequired(false))
  ),
  async execute(interaction) {
    if (!interaction.guild) {
      await interaction.reply({ content: "\u274C This command can only be used inside a server.", ephemeral: true });
      return;
    }
    const member = interaction.member;
    if (!member?.permissions.has(import_discord17.PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== config.ownerId) {
      await interaction.reply({
        embeds: [Embeds.error("Permission Denied", "You need the **Manage Server** permission to change the bot's server profile.")],
        ephemeral: true
      });
      return;
    }
    const subcommand = interaction.options.getSubcommand();
    await interaction.deferReply();
    const attachment = interaction.options.getAttachment("image");
    const url = interaction.options.getString("url");
    const reset = interaction.options.getBoolean("reset") || false;
    const targetUrl = attachment?.url || url || null;
    if (subcommand === "avatar") {
      const result = await updateServerAvatar(interaction.guild, targetUrl, reset);
      if (result.success) {
        const embed = new import_discord17.EmbedBuilder().setColor(5763719).setTitle("\u{1F5BC}\uFE0F Bot Server Avatar Updated").setDescription(result.message || "Bot server avatar updated!").setFooter({ text: "Server Profile \u2022 Main bot avatar remains unchanged" }).setTimestamp();
        if (result.avatarUrl) embed.setThumbnail(result.avatarUrl);
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.editReply({ embeds: [Embeds.error("Error", result.message || "Failed")] });
      }
    } else if (subcommand === "banner") {
      const result = await updateServerBanner(interaction.guild, targetUrl, reset);
      if (result.success) {
        const embed = new import_discord17.EmbedBuilder().setColor(5763719).setTitle("\u{1F3A8} Bot Server Banner Updated").setDescription(result.message || "Bot server banner updated!").setFooter({ text: "Server Profile \u2022 Main bot banner remains unchanged" }).setTimestamp();
        if (targetUrl && !reset) embed.setImage(targetUrl);
        await interaction.editReply({ embeds: [embed] });
      } else {
        await interaction.editReply({ embeds: [Embeds.error("Error", result.message || "Failed")] });
      }
    }
  }
};

// src/commands/multipurpose/setupVerify.ts
var import_discord18 = require("discord.js");
var setupVerifyCommand = {
  category: "multipurpose",
  userPermissions: [import_discord18.PermissionsBitField.Flags.Administrator],
  data: new import_discord18.SlashCommandBuilder().setName("setup-verify").setDescription("Deploy an interactive button verification portal to protect against automated bots").setDefaultMemberPermissions(import_discord18.PermissionsBitField.Flags.Administrator).addRoleOption(
    (opt) => opt.setName("verified_role").setDescription("Role granted once member verifies").setRequired(true)
  ).addChannelOption(
    (opt) => opt.setName("channel").setDescription("Channel to deploy the portal (defaults to current)").setRequired(false)
  ).addRoleOption(
    (opt) => opt.setName("unverified_role").setDescription("Role stripped once member verifies").setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const verifiedRole = interaction.options.getRole("verified_role", true);
    const unverifiedRole = interaction.options.getRole("unverified_role");
    const channel = interaction.options.getChannel("channel") || interaction.channel;
    if (!channel || !(channel instanceof import_discord18.TextChannel)) {
      await interaction.reply({ content: "Invalid text channel.", ephemeral: true });
      return;
    }
    GuildRepo.update(interaction.guild.id, {
      verified_role_id: verifiedRole.id,
      unverified_role_id: unverifiedRole?.id || null
    });
    const verifyEmbed = new import_discord18.EmbedBuilder().setColor(5793266).setTitle("\u{1F6E1}\uFE0F Server Verification Gate").setDescription(
      `Welcome to **${interaction.guild.name}**!

To access channels and interact with the community, you must verify that you are a human.

Click the **Verify Myself** button below to complete verification.`
    ).setFooter({ text: "Protected by Aegis Verification Shield" }).setTimestamp();
    const row = new import_discord18.ActionRowBuilder().addComponents(
      new import_discord18.ButtonBuilder().setCustomId("btn_verify_member").setLabel("Verify Myself").setStyle(import_discord18.ButtonStyle.Success).setEmoji("\u{1F6E1}\uFE0F")
    );
    await channel.send({ embeds: [verifyEmbed], components: [row] });
    await interaction.reply({
      embeds: [
        Embeds.success(
          "Verification Gate Deployed",
          `Verification portal posted in ${channel}.
\u2022 Verified Role: ${verifiedRole}
\u2022 Unverified Role: ${unverifiedRole || "None"}`
        )
      ],
      ephemeral: true
    });
  }
};

// src/commands/multipurpose/setupTickets.ts
var import_discord19 = require("discord.js");
var setupTicketsCommand = {
  category: "multipurpose",
  userPermissions: [import_discord19.PermissionsBitField.Flags.Administrator],
  data: new import_discord19.SlashCommandBuilder().setName("setup-tickets").setDescription("Deploy a professional private ticket panel").setDefaultMemberPermissions(import_discord19.PermissionsBitField.Flags.Administrator).addRoleOption(
    (opt) => opt.setName("support_role").setDescription("Staff role that can view and respond to tickets").setRequired(true)
  ).addChannelOption(
    (opt) => opt.setName("panel_channel").setDescription("Channel to post the ticket creation panel").setRequired(false)
  ).addChannelOption(
    (opt) => opt.setName("category").setDescription("Category where new ticket channels will be created").addChannelTypes(import_discord19.ChannelType.GuildCategory).setRequired(false)
  ).addChannelOption(
    (opt) => opt.setName("log_channel").setDescription("Channel where closed ticket transcripts will be sent").setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const supportRole = interaction.options.getRole("support_role", true);
    const panelChannel = interaction.options.getChannel("panel_channel") || interaction.channel;
    const category = interaction.options.getChannel("category");
    const logChannel = interaction.options.getChannel("log_channel");
    if (!panelChannel || !(panelChannel instanceof import_discord19.TextChannel)) {
      await interaction.reply({ content: "Invalid panel channel.", ephemeral: true });
      return;
    }
    GuildRepo.update(interaction.guild.id, {
      ticket_support_role_id: supportRole.id,
      ticket_category_id: category?.id || null,
      ticket_log_channel_id: logChannel?.id || null
    });
    const panelEmbed = new import_discord19.EmbedBuilder().setColor(5793266).setTitle("\u{1F3AB} Server Support & Assistance").setDescription(
      "Need help, want to report a security issue, or contact server staff?\n\nClick the button below to open a private ticket. Only you and server staff will have access to the channel."
    ).setFooter({ text: "Aegis Ticketing Engine" }).setTimestamp();
    const row = new import_discord19.ActionRowBuilder().addComponents(
      new import_discord19.ButtonBuilder().setCustomId("btn_ticket_create").setLabel("Create Ticket").setStyle(import_discord19.ButtonStyle.Primary).setEmoji("\u{1F4E9}")
    );
    await panelChannel.send({ embeds: [panelEmbed], components: [row] });
    await interaction.reply({
      embeds: [
        Embeds.success(
          "Ticket System Configured",
          `Ticket panel posted in ${panelChannel}.
\u2022 Support Role: ${supportRole}
\u2022 Category: ${category || "None"}
\u2022 Log Channel: ${logChannel || "None"}`
        )
      ],
      ephemeral: true
    });
  }
};

// src/commands/multipurpose/setupWelcome.ts
var import_discord20 = require("discord.js");
var setupWelcomeCommand = {
  category: "multipurpose",
  userPermissions: [import_discord20.PermissionsBitField.Flags.Administrator],
  data: new import_discord20.SlashCommandBuilder().setName("setup-welcome").setDescription("Configure automated welcome announcements, goodbye alerts, and auto-roles").setDefaultMemberPermissions(import_discord20.PermissionsBitField.Flags.Administrator).addChannelOption(
    (opt) => opt.setName("welcome_channel").setDescription("Channel to send welcome messages").setRequired(false)
  ).addStringOption(
    (opt) => opt.setName("welcome_message").setDescription("Message format (Use {user}, {username}, {guild}, {memberCount})").setRequired(false)
  ).addChannelOption(
    (opt) => opt.setName("leave_channel").setDescription("Channel to send goodbye announcements").setRequired(false)
  ).addRoleOption(
    (opt) => opt.setName("autorole").setDescription("Role automatically assigned to new members on join").setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const welcomeChannel = interaction.options.getChannel("welcome_channel");
    const welcomeMsg = interaction.options.getString("welcome_message");
    const leaveChannel = interaction.options.getChannel("leave_channel");
    const autoRole = interaction.options.getRole("autorole");
    const updates = {};
    if (welcomeChannel) updates.welcome_channel_id = welcomeChannel.id;
    if (welcomeMsg) updates.welcome_message = welcomeMsg;
    if (leaveChannel) updates.leave_channel_id = leaveChannel.id;
    if (autoRole) updates.autorole_id = autoRole.id;
    if (Object.keys(updates).length === 0) {
      await interaction.reply({
        embeds: [Embeds.warning("No Options Provided", "Please provide at least one setting to update.")],
        ephemeral: true
      });
      return;
    }
    GuildRepo.update(interaction.guild.id, updates);
    await interaction.reply({
      embeds: [
        Embeds.success(
          "Welcome & Auto-Role Settings Saved",
          `Updated configuration:
\u2022 **Welcome Channel:** ${welcomeChannel ? welcomeChannel : "Unchanged"}
\u2022 **Leave Channel:** ${leaveChannel ? leaveChannel : "Unchanged"}
\u2022 **Auto-Role:** ${autoRole ? autoRole : "Unchanged"}`
        )
      ]
    });
  }
};
var setupLogsCommand = {
  category: "multipurpose",
  userPermissions: [import_discord20.PermissionsBitField.Flags.Administrator],
  data: new import_discord20.SlashCommandBuilder().setName("setup-logs").setDescription("Configure moderation audit logs and high-priority security alert channels").setDefaultMemberPermissions(import_discord20.PermissionsBitField.Flags.Administrator).addChannelOption(
    (opt) => opt.setName("mod_logs").setDescription("Channel for general moderation and message edit/delete logs").setRequired(false)
  ).addChannelOption(
    (opt) => opt.setName("alerts").setDescription("Channel for critical security intercepts and anti-nuke alerts").setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const modLogs = interaction.options.getChannel("mod_logs");
    const alerts = interaction.options.getChannel("alerts");
    const updates = {};
    if (modLogs) updates.mod_log_channel_id = modLogs.id;
    if (alerts) updates.alert_channel_id = alerts.id;
    if (Object.keys(updates).length === 0) {
      await interaction.reply({
        embeds: [Embeds.warning("No Channels Provided", "Please specify at least one logging channel.")],
        ephemeral: true
      });
      return;
    }
    GuildRepo.update(interaction.guild.id, updates);
    await interaction.reply({
      embeds: [
        Embeds.success(
          "Audit Log Channels Configured",
          `\u2022 **Mod Log Channel:** ${modLogs ? modLogs : "Unchanged"}
\u2022 **Security Alert Channel:** ${alerts ? alerts : "Unchanged"}`
        )
      ]
    });
  }
};

// src/commands/utility/prefix.ts
var import_discord21 = require("discord.js");
var prefixCommand = {
  category: "utility",
  data: new import_discord21.SlashCommandBuilder().setName("prefix").setDescription("View, configure, or reset this server's custom text command prefix").addSubcommand(
    (sub) => sub.setName("set").setDescription("Set a new custom prefix for THIS SERVER only (does not change the main prefix)").addStringOption(
      (opt) => opt.setName("new_prefix").setDescription("New prefix (e.g. ?, ., $, m!, a!)").setMaxLength(5).setRequired(true)
    )
  ).addSubcommand(
    (sub) => sub.setName("show").setDescription("Display the current text command prefix for this server")
  ).addSubcommand(
    (sub) => sub.setName("reset").setDescription("Reset this server's prefix back to the default (!)")
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const sub = interaction.options.getSubcommand();
    const settings = GuildRepo.get(interaction.guild.id);
    if (sub === "show") {
      await interaction.reply({
        embeds: [
          Embeds.info(
            "Server Prefix",
            `The text command prefix for **${interaction.guild.name}** is: \`${settings.prefix || "!"}\`

\u2022 Change for this server: \`/prefix set new_prefix:<prefix>\` or \`${settings.prefix || "!"}prefix <prefix>\`
\u2022 Reset to default: \`/prefix reset\` or \`${settings.prefix || "!"}prefix reset\`

*(Note: Server prefixes are saved individually per server. Changing this does not change the main global prefix.)*`
          )
        ]
      });
      return;
    }
    if (sub === "reset") {
      if (!interaction.memberPermissions?.has(import_discord21.PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== config.ownerId) {
        await interaction.reply({
          embeds: [Embeds.error("Permission Denied", "You need **Manage Server** permission to reset the server prefix.")],
          ephemeral: true
        });
        return;
      }
      GuildRepo.update(interaction.guild.id, { prefix: "!" });
      await interaction.reply({
        embeds: [
          Embeds.success(
            "Server Prefix Reset",
            `Successfully reset the prefix for **${interaction.guild.name}** back to the default: \`!\`

You can now run commands like: \`!play\`, \`!volume 150\`, \`!help\``
          )
        ]
      });
      return;
    }
    if (sub === "set") {
      if (!interaction.memberPermissions?.has(import_discord21.PermissionsBitField.Flags.ManageGuild) && interaction.user.id !== config.ownerId) {
        await interaction.reply({
          embeds: [Embeds.error("Permission Denied", "You need **Manage Server** permission to change the server prefix.")],
          ephemeral: true
        });
        return;
      }
      const newPrefix = interaction.options.getString("new_prefix", true).trim();
      if (!newPrefix || newPrefix.length > 5 || newPrefix.includes(" ")) {
        await interaction.reply({
          embeds: [Embeds.error("Invalid Prefix", "Prefix must be 1-5 characters and cannot contain spaces.")],
          ephemeral: true
        });
        return;
      }
      GuildRepo.update(interaction.guild.id, { prefix: newPrefix });
      await interaction.reply({
        embeds: [
          Embeds.success(
            "Server Prefix Updated",
            `Successfully updated the prefix for **${interaction.guild.name}** to: \`${newPrefix}\`

\u2022 Run commands on this server: \`${newPrefix}play\`, \`${newPrefix}volume 150\`, \`${newPrefix}help\`
*(This custom prefix only applies to this server. Other servers and the default prefix remain unaffected.)*`
          )
        ]
      });
    }
  }
};

// src/commands/music/play.ts
var import_discord24 = require("discord.js");

// src/music/MusicManager.ts
var import_voice4 = require("@discordjs/voice");

// src/music/GuildQueue.ts
var import_voice3 = require("@discordjs/voice");
var import_discord23 = require("discord.js");

// src/music/AudioExtractor.ts
var import_ytdl_core = require("@distube/ytdl-core");
var import_prism_media = __toESM(require("prism-media"));
var import_voice = require("@discordjs/voice");
var AudioExtractor = class {
  static ytdl = new import_ytdl_core.Ytdl();
  static formatDuration(seconds) {
    if (!seconds || isNaN(seconds) || seconds <= 0) return "Live Stream";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds % 3600 / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
  /**
   * Scrapes Spotify embed JSON metadata without requiring tokens or authorization.
   */
  static async parseSpotify(url) {
    try {
      const match = url.match(/open\.spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);
      if (!match) return null;
      const type = match[1];
      const id = match[2];
      const embedUrl = `https://open.spotify.com/embed/${type}/${id}`;
      const res = await fetch(embedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      });
      if (!res.ok) return null;
      const html = await res.text();
      const idx = html.indexOf("__NEXT_DATA__");
      if (idx === -1) return null;
      const start = html.indexOf(">", idx) + 1;
      const end = html.indexOf("</script>", start);
      const json = JSON.parse(html.substring(start, end));
      const entity = json.props?.pageProps?.state?.data?.entity;
      if (!entity) return null;
      if (type === "track") {
        return {
          type: "track",
          name: entity.name,
          artist: entity.artists?.map((a) => a.name).join(" ") || "",
          thumbnail: entity.coverArt?.sources?.[0]?.url || entity.visualIdentity?.image?.[0]?.url || ""
        };
      } else {
        const tracks = entity.trackList?.map((t) => ({
          name: t.title || "",
          artist: t.subtitle || ""
        })) || [];
        return {
          type,
          name: entity.name || "Spotify Collection",
          tracks
        };
      }
    } catch (err) {
      Logger.warn(`Spotify embed fetch error: ${err}`, "AudioExtractor");
      return null;
    }
  }
  /**
   * Resolves a search string, YouTube URL, Spotify URL, or direct audio link into playable Track(s).
   */
  static async resolve(query, requestedBy) {
    const trimmed = query.trim();
    if (trimmed.includes("spotify.com/")) {
      const spData = await this.parseSpotify(trimmed);
      if (spData) {
        if (spData.type === "track") {
          const searchTitle = `${spData.name} ${spData.artist || ""}`.trim();
          const ytResults = await this.ytdl.search(searchTitle);
          if (ytResults && ytResults.length > 0) {
            const best2 = ytResults[0];
            return {
              isPlaylist: false,
              tracks: [
                {
                  title: spData.name,
                  url: best2.url,
                  duration: this.formatDuration(best2.lengthSeconds || 0),
                  durationSec: best2.lengthSeconds || 0,
                  thumbnail: spData.thumbnail || best2.thumbnails?.[0]?.url || "",
                  channel: spData.artist || best2.author?.name || "Spotify",
                  requestedBy,
                  source: "spotify"
                }
              ]
            };
          }
        } else if (spData.tracks && spData.tracks.length > 0) {
          const resolvedTracks = [];
          const slice = spData.tracks.slice(0, 30);
          for (const item of slice) {
            const searchTitle = `${item.name} ${item.artist}`.trim();
            const ytResults = await this.ytdl.search(searchTitle);
            if (ytResults && ytResults.length > 0) {
              const best2 = ytResults[0];
              resolvedTracks.push({
                title: item.name,
                url: best2.url,
                duration: this.formatDuration(best2.lengthSeconds || 0),
                durationSec: best2.lengthSeconds || 0,
                thumbnail: best2.thumbnails?.[0]?.url || "",
                channel: item.artist || best2.author?.name || "Spotify",
                requestedBy,
                source: "spotify"
              });
            }
          }
          if (resolvedTracks.length > 0) {
            return {
              isPlaylist: true,
              playlistTitle: spData.name,
              tracks: resolvedTracks
            };
          }
        }
      }
    }
    const videoId = (0, import_ytdl_core.parseVideoId)(trimmed);
    if (videoId) {
      try {
        const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
        const info = await this.ytdl.getInfo(cleanUrl);
        const details = info.videoDetails;
        return {
          isPlaylist: false,
          tracks: [
            {
              title: details.title,
              url: cleanUrl,
              duration: this.formatDuration(Number(details.lengthSeconds) || 0),
              durationSec: Number(details.lengthSeconds) || 0,
              thumbnail: details.thumbnails?.[0]?.url || "",
              channel: details.author?.name || "YouTube",
              requestedBy,
              source: "youtube"
            }
          ]
        };
      } catch (err) {
        Logger.warn(`Single video fetch failed for ${videoId}, checking search: ${err}`, "AudioExtractor");
      }
    }
    if (trimmed.includes("playlist?list=")) {
      try {
        const playlist = await this.ytdl.getPlaylist(trimmed);
        if (playlist && playlist.videos && playlist.videos.length > 0) {
          const tracks = playlist.videos.slice(0, 50).map((v) => ({
            title: v.title || "Unknown Title",
            url: v.url,
            duration: this.formatDuration(v.lengthSeconds || 0),
            durationSec: v.lengthSeconds || 0,
            thumbnail: v.thumbnails?.[0]?.url || "",
            channel: v.author?.name || "YouTube",
            requestedBy,
            source: "youtube"
          }));
          return {
            isPlaylist: true,
            playlistTitle: playlist.title,
            tracks
          };
        }
      } catch (err) {
        Logger.warn(`Playlist parse failed: ${err}`, "AudioExtractor");
      }
    }
    if (/^https?:\/\/.+\.(mp3|wav|ogg|flac|m4a|aac)(\?.*)?$/i.test(trimmed)) {
      const filename = trimmed.split("/").pop()?.split("?")[0] || "Direct Audio Stream";
      return {
        isPlaylist: false,
        tracks: [
          {
            title: decodeURIComponent(filename),
            url: trimmed,
            duration: "Direct Stream",
            durationSec: 0,
            thumbnail: "https://cdn-icons-png.flaticon.com/512/3844/3844724.png",
            channel: "Web Audio",
            requestedBy,
            source: "direct"
          }
        ]
      };
    }
    const searchResults = await this.ytdl.search(trimmed);
    if (!searchResults || searchResults.length === 0) {
      return {
        isPlaylist: false,
        tracks: []
      };
    }
    const best = searchResults[0];
    return {
      isPlaylist: false,
      tracks: [
        {
          title: best.title,
          url: best.url,
          duration: this.formatDuration(best.lengthSeconds || 0),
          durationSec: best.lengthSeconds || 0,
          thumbnail: best.thumbnails?.[0]?.url || "",
          channel: best.author?.name || "YouTube",
          requestedBy,
          source: "youtube"
        }
      ]
    };
  }
  /**
   * Generates ultra-fast, zero-lag DSP audio filter chain: crystal-clean vocals, deep punchy matching bass,
   * high-end sheen, and loud clear volume gain with zero distortion or lag.
   */
  static getFilterString(volumePercent = 100, preset = "BALANCED_VOCAL_BASS" /* BALANCED_VOCAL_BASS */) {
    const baseGain = volumePercent / 100 * 1.35;
    const volStr = `volume=${baseGain.toFixed(2)}`;
    switch (preset) {
      case "HEAVY_BASS" /* HEAVY_BASS */:
        return `equalizer=f=60:t=q:w=1.0:g=4.5,equalizer=f=120:t=q:w=1.0:g=3.5,equalizer=f=2500:t=q:w=1.0:g=2.0,equalizer=f=10000:t=q:w=1.0:g=1.5,${volStr}`;
      case "VOCAL_FOCUS" /* VOCAL_FOCUS */:
        return `equalizer=f=80:t=q:w=1.0:g=1.5,equalizer=f=1500:t=q:w=1.0:g=3.5,equalizer=f=3500:t=q:w=1.0:g=4.5,equalizer=f=10000:t=q:w=1.0:g=2.5,${volStr}`;
      case "FLAT" /* FLAT */:
        return `${volStr}`;
      case "BALANCED_VOCAL_BASS" /* BALANCED_VOCAL_BASS */:
      default:
        return `equalizer=f=60:t=q:w=1.0:g=3.0,equalizer=f=120:t=q:w=1.0:g=2.5,equalizer=f=2500:t=q:w=1.0:g=2.5,equalizer=f=10000:t=q:w=1.0:g=2.0,${volStr}`;
    }
  }
  /**
   * Spawns an optimized DSP audio stream via direct CDN connection for ZERO BUFFERING, ZERO LAG and high quality.
   */
  static async createResource(track, volumePercent = 100, preset = "BALANCED_VOCAL_BASS" /* BALANCED_VOCAL_BASS */) {
    const filterArg = this.getFilterString(volumePercent, preset);
    const outputAudioOptions = [
      "-analyzeduration",
      "0",
      "-loglevel",
      "0",
      "-af",
      filterArg,
      "-c:a",
      "libopus",
      "-b:a",
      "128k",
      "-vbr",
      "on",
      "-compression_level",
      "5",
      "-application",
      "audio",
      "-page_duration",
      "20000",
      "-f",
      "opus",
      "-ar",
      "48000",
      "-ac",
      "2"
    ];
    const getHttpInputArgs = (url) => [
      "-reconnect",
      "1",
      "-reconnect_streamed",
      "1",
      "-reconnect_on_network_error",
      "1",
      "-reconnect_delay_max",
      "5",
      "-i",
      url,
      ...outputAudioOptions
    ];
    if (track.source === "direct") {
      const ffmpegStream = new import_prism_media.default.FFmpeg({
        args: getHttpInputArgs(track.url)
      });
      return (0, import_voice.createAudioResource)(ffmpegStream, {
        inputType: import_voice.StreamType.OggOpus
      });
    }
    try {
      const info = await this.ytdl.getInfo(track.url);
      const format = (0, import_ytdl_core.chooseFormat)(info.formats, {
        quality: "highestaudio",
        filter: { hasAudio: true, hasVideo: false }
      });
      if (format && format.url) {
        const directFfmpegStream = new import_prism_media.default.FFmpeg({
          args: getHttpInputArgs(format.url)
        });
        return (0, import_voice.createAudioResource)(directFfmpegStream, {
          inputType: import_voice.StreamType.OggOpus
        });
      }
    } catch (err) {
      Logger.warn(`YouTube stream extraction failed: ${err}`, "AudioExtractor");
      throw new Error(
        "YouTube could not provide this audio stream. The video may require sign-in or bot verification; try another track or retry later.",
        { cause: err }
      );
    }
    const stream = this.ytdl.download(track.url, {
      quality: "highestaudio",
      filter: { hasAudio: true, hasVideo: false },
      highWaterMark: 1024 * 1024 * 64,
      chunkSize: 1024 * 1024 * 8
    });
    const fallbackFfmpegStream = new import_prism_media.default.FFmpeg({
      args: outputAudioOptions
    });
    const pcmStream = stream.pipe(fallbackFfmpegStream);
    return (0, import_voice.createAudioResource)(pcmStream, {
      inputType: import_voice.StreamType.OggOpus
    });
  }
};

// src/music/MusicButtons.ts
var import_discord22 = require("discord.js");
var import_voice2 = require("@discordjs/voice");
var MusicButtons = class {
  /**
   * Generates interactive button rows for controlling playback.
   */
  static createRows(queue) {
    const isPaused = queue.audioPlayer.state.status === import_voice2.AudioPlayerStatus.Paused;
    const row1 = new import_discord22.ActionRowBuilder().addComponents(
      new import_discord22.ButtonBuilder().setCustomId("btn_music_prev").setEmoji("\u23EE\uFE0F").setStyle(import_discord22.ButtonStyle.Secondary),
      new import_discord22.ButtonBuilder().setCustomId("btn_music_pause_resume").setEmoji(isPaused ? "\u25B6\uFE0F" : "\u23F8\uFE0F").setLabel(isPaused ? "Resume" : "Pause").setStyle(isPaused ? import_discord22.ButtonStyle.Success : import_discord22.ButtonStyle.Primary),
      new import_discord22.ButtonBuilder().setCustomId("btn_music_skip").setEmoji("\u23ED\uFE0F").setLabel("Skip").setStyle(import_discord22.ButtonStyle.Secondary),
      new import_discord22.ButtonBuilder().setCustomId("btn_music_stop").setEmoji("\u23F9\uFE0F").setLabel("Stop").setStyle(import_discord22.ButtonStyle.Danger),
      new import_discord22.ButtonBuilder().setCustomId("btn_music_queue").setEmoji("\u{1F4DC}").setLabel("Queue").setStyle(import_discord22.ButtonStyle.Secondary)
    );
    const row2 = new import_discord22.ActionRowBuilder().addComponents(
      new import_discord22.ButtonBuilder().setCustomId("btn_music_voldown").setEmoji("\u{1F509}").setLabel("Vol -15%").setStyle(import_discord22.ButtonStyle.Secondary),
      new import_discord22.ButtonBuilder().setCustomId("btn_music_volup").setEmoji("\u{1F50A}").setLabel("Vol +15%").setStyle(import_discord22.ButtonStyle.Secondary),
      new import_discord22.ButtonBuilder().setCustomId("btn_music_loop").setEmoji("\u{1F501}").setLabel(`Loop: ${queue.loopMode}`).setStyle(queue.loopMode === "OFF" /* OFF */ ? import_discord22.ButtonStyle.Secondary : import_discord22.ButtonStyle.Primary),
      new import_discord22.ButtonBuilder().setCustomId("btn_music_shuffle").setEmoji("\u{1F500}").setLabel("Shuffle").setStyle(import_discord22.ButtonStyle.Secondary)
    );
    return [row1, row2];
  }
  /**
   * Handles button click interactions for music controls.
   */
  static async handleInteraction(interaction) {
    if (!interaction.customId.startsWith("btn_music_")) {
      return false;
    }
    if (!interaction.guild || !(interaction.member instanceof import_discord22.GuildMember)) {
      return false;
    }
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        content: "\u26A0\uFE0F No music is currently playing in this server.",
        ephemeral: true
      });
      return true;
    }
    const userVoice = interaction.member.voice.channel;
    const botVoiceId = interaction.guild.members.me?.voice.channelId;
    if (!userVoice || userVoice.id !== botVoiceId) {
      await interaction.reply({
        content: "\u274C You must be in the same voice channel as the bot to use music buttons!",
        ephemeral: true
      });
      return true;
    }
    const action = interaction.customId;
    switch (action) {
      case "btn_music_pause_resume": {
        const isPaused = queue.audioPlayer.state.status === import_voice2.AudioPlayerStatus.Paused;
        if (isPaused) {
          queue.resume();
          await interaction.reply({ content: `\u25B6\uFE0F **Resumed playback** by ${interaction.user}.` });
        } else {
          queue.pause();
          await interaction.reply({ content: `\u23F8\uFE0F **Paused playback** by ${interaction.user}.` });
        }
        break;
      }
      case "btn_music_skip": {
        const skippedTrack = queue.currentTrack;
        const success = queue.skip();
        if (success) {
          await interaction.reply({ content: `\u23ED\uFE0F **Skipped:** [${skippedTrack.title}](${skippedTrack.url}) by ${interaction.user}.` });
        } else {
          await interaction.reply({ content: "\u26A0\uFE0F Could not skip track.", ephemeral: true });
        }
        break;
      }
      case "btn_music_stop": {
        queue.destroy();
        await interaction.reply({ content: `\u23F9\uFE0F **Music stopped and disconnected** by ${interaction.user}.` });
        break;
      }
      case "btn_music_prev": {
        if (queue.currentTrack) {
          const track = queue.currentTrack;
          queue.tracks.unshift(track);
          queue.skip();
          await interaction.reply({ content: `\u23EE\uFE0F **Replaying:** [${track.title}](${track.url}) by ${interaction.user}.` });
        }
        break;
      }
      case "btn_music_voldown": {
        const newVol = Math.max(10, queue.volume - 15);
        queue.setVolume(newVol);
        await interaction.reply({ content: `\u{1F509} **Volume reduced to ${newVol}%** by ${interaction.user}.`, ephemeral: true });
        break;
      }
      case "btn_music_volup": {
        const newVol = Math.min(200, queue.volume + 15);
        queue.setVolume(newVol);
        await interaction.reply({ content: `\u{1F50A} **Volume increased to ${newVol}%** by ${interaction.user}.`, ephemeral: true });
        break;
      }
      case "btn_music_loop": {
        let nextMode = "OFF" /* OFF */;
        if (queue.loopMode === "OFF" /* OFF */) nextMode = "TRACK" /* TRACK */;
        else if (queue.loopMode === "TRACK" /* TRACK */) nextMode = "QUEUE" /* QUEUE */;
        else nextMode = "OFF" /* OFF */;
        queue.setLoop(nextMode);
        await interaction.reply({ content: `\u{1F501} **Loop mode set to \`${nextMode}\`** by ${interaction.user}.`, ephemeral: true });
        break;
      }
      case "btn_music_shuffle": {
        if (queue.tracks.length < 2) {
          await interaction.reply({ content: "\u26A0\uFE0F Need at least 2 upcoming songs in the queue to shuffle.", ephemeral: true });
        } else {
          queue.shuffle();
          await interaction.reply({ content: `\u{1F500} **Shuffled ${queue.tracks.length} songs** in queue by ${interaction.user}.` });
        }
        break;
      }
      case "btn_music_queue": {
        const upcoming = queue.tracks.slice(0, 10).map((t, i) => `**${i + 1}.** [${t.title}](${t.url}) \`[${t.duration}]\``).join("\n") || "*No upcoming tracks.*";
        const embed = new import_discord22.EmbedBuilder().setColor(5793266).setTitle("\u{1F3B6} Current Music Queue").setDescription(`**Now Playing:** [${queue.currentTrack.title}](${queue.currentTrack.url})

**Upcoming:**
${upcoming}`).setFooter({ text: `Total Queue: ${queue.tracks.length} tracks \u2022 Volume: ${queue.volume}% \u2022 Loop: ${queue.loopMode}` });
        await interaction.reply({ embeds: [embed], ephemeral: true });
        break;
      }
    }
    return true;
  }
};

// src/music/GuildQueue.ts
var GuildQueue = class {
  guild;
  voiceConnection;
  audioPlayer;
  textChannel;
  tracks = [];
  currentTrack = null;
  currentResource = null;
  volume = 100;
  loopMode = "OFF" /* OFF */;
  preset = "BALANCED_VOCAL_BASS" /* BALANCED_VOCAL_BASS */;
  disconnectTimeout = null;
  isDestroyed = false;
  constructor(guild, voiceConnection, textChannel) {
    this.guild = guild;
    this.voiceConnection = voiceConnection;
    this.textChannel = textChannel;
    this.audioPlayer = (0, import_voice3.createAudioPlayer)({
      behaviors: {
        noSubscriber: import_voice3.NoSubscriberBehavior.Play,
        maxMissedFrames: 250
        // 5,000ms jitter buffer tolerance against micro-stutter & premature stops
      }
    });
    this.voiceConnection.subscribe(this.audioPlayer);
    this.setupListeners();
  }
  setupListeners() {
    this.audioPlayer.on(import_voice3.AudioPlayerStatus.Idle, () => {
      this.handleSongEnd();
    });
    this.audioPlayer.on("error", (error) => {
      Logger.error(`Audio player error in guild ${this.guild.name}: ${error.message}`, error, "GuildQueue");
      this.textChannel.send({
        content: `\u26A0\uFE0F Error playing **${this.currentTrack?.title || "current track"}**: ${error.message}. Skipping to next track...`
      }).catch(() => null);
      this.handleSongEnd();
    });
    this.voiceConnection.on(import_voice3.VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          (0, import_voice3.entersState)(this.voiceConnection, import_voice3.VoiceConnectionStatus.Signalling, 5e3),
          (0, import_voice3.entersState)(this.voiceConnection, import_voice3.VoiceConnectionStatus.Connecting, 5e3)
        ]);
      } catch {
        this.destroy();
      }
    });
  }
  /**
   * Adds tracks to the queue. If nothing is playing, starts playback immediately.
   */
  async enqueue(newTracks) {
    this.clearDisconnectTimer();
    if (Array.isArray(newTracks)) {
      this.tracks.push(...newTracks);
    } else {
      this.tracks.push(newTracks);
    }
    if (!this.currentTrack && this.audioPlayer.state.status === import_voice3.AudioPlayerStatus.Idle) {
      await this.playNext();
    }
  }
  /**
   * Plays the next track in the queue.
   */
  async playNext() {
    if (this.isDestroyed) return;
    if (this.tracks.length === 0) {
      this.currentTrack = null;
      this.currentResource = null;
      this.audioPlayer.stop();
      const embed = new import_discord23.EmbedBuilder().setColor(5793266).setDescription("\u{1F3B5} **Queue ended.** Aegis will disconnect in 3 minutes if no new songs are added.").setTimestamp();
      await this.textChannel.send({ embeds: [embed] }).catch(() => null);
      this.startDisconnectTimer();
      return;
    }
    const nextTrack = this.tracks.shift();
    this.currentTrack = nextTrack;
    try {
      const resource = await AudioExtractor.createResource(nextTrack, this.volume, this.preset);
      this.currentResource = resource;
      if (resource.volume) {
        resource.volume.setVolume(this.volume / 100);
      }
      this.audioPlayer.play(resource);
      const npEmbed = new import_discord23.EmbedBuilder().setColor(5763719).setTitle("\u{1F3B6} Now Playing").setDescription(`[${nextTrack.title}](${nextTrack.url})`).addFields(
        { name: "Channel / Artist", value: nextTrack.channel, inline: true },
        { name: "Duration", value: nextTrack.duration, inline: true },
        { name: "Requested By", value: `<@${nextTrack.requestedBy.id}>`, inline: true }
      ).setThumbnail(nextTrack.thumbnail || null).setFooter({ text: `Volume: ${this.volume}% \u2022 Loop: ${this.loopMode}` }).setTimestamp();
      await this.textChannel.send({
        embeds: [npEmbed],
        components: MusicButtons.createRows(this)
      }).catch(() => null);
    } catch (err) {
      Logger.error(`Failed to stream track "${nextTrack.title}"`, err, "GuildQueue");
      await this.textChannel.send({
        content: `\u274C Could not stream **${nextTrack.title}**: ${err.message || "Stream extraction error"}. Skipping...`
      }).catch(() => null);
      await this.playNext();
    }
  }
  async handleSongEnd() {
    if (this.loopMode === "TRACK" /* TRACK */ && this.currentTrack) {
      this.tracks.unshift(this.currentTrack);
    } else if (this.loopMode === "QUEUE" /* QUEUE */ && this.currentTrack) {
      this.tracks.push(this.currentTrack);
    }
    await this.playNext();
  }
  skip() {
    if (!this.currentTrack) return false;
    this.audioPlayer.stop();
    return true;
  }
  pause() {
    if (this.audioPlayer.state.status === import_voice3.AudioPlayerStatus.Playing) {
      return this.audioPlayer.pause();
    }
    return false;
  }
  resume() {
    if (this.audioPlayer.state.status === import_voice3.AudioPlayerStatus.Paused) {
      return this.audioPlayer.unpause();
    }
    return false;
  }
  stop() {
    this.tracks = [];
    this.currentTrack = null;
    this.currentResource = null;
    this.audioPlayer.stop();
    this.destroy();
  }
  setVolume(vol) {
    if (vol < 0 || vol > 200) return false;
    this.volume = vol;
    if (this.currentResource && this.currentResource.volume) {
      this.currentResource.volume.setVolume(vol / 100);
      return true;
    }
    return true;
  }
  setLoop(mode) {
    this.loopMode = mode;
  }
  setPreset(preset) {
    this.preset = preset;
  }
  shuffle() {
    for (let i = this.tracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
    }
  }
  getProgressBar(barLength = 15) {
    if (!this.currentTrack || !this.currentResource) return "\u{1F518}" + "\u25AC".repeat(barLength);
    const currentSec = Math.floor(this.currentResource.playbackDuration / 1e3);
    const totalSec = this.currentTrack.durationSec;
    if (!totalSec || totalSec <= 0) {
      return "\u{1F534} Live Stream";
    }
    const progress = Math.min(Math.max(currentSec / totalSec, 0), 1);
    const filled = Math.round(barLength * progress);
    const bar = "\u25AC".repeat(filled) + "\u{1F518}" + "\u25AC".repeat(Math.max(barLength - filled, 0));
    return `\`${bar}\` [${AudioExtractor.formatDuration(currentSec)} / ${this.currentTrack.duration}]`;
  }
  startDisconnectTimer() {
    this.clearDisconnectTimer();
    this.disconnectTimeout = setTimeout(() => {
      this.destroy();
    }, 3 * 60 * 1e3);
  }
  clearDisconnectTimer() {
    if (this.disconnectTimeout) {
      clearTimeout(this.disconnectTimeout);
      this.disconnectTimeout = null;
    }
  }
  destroy() {
    if (this.isDestroyed) return;
    this.isDestroyed = true;
    this.clearDisconnectTimer();
    this.audioPlayer.stop(true);
    try {
      this.voiceConnection.destroy();
    } catch {
    }
  }
};

// src/music/MusicManager.ts
var MusicManager = class _MusicManager {
  static instance;
  // guildId -> GuildQueue
  queues = /* @__PURE__ */ new Map();
  static getInstance() {
    if (!_MusicManager.instance) {
      _MusicManager.instance = new _MusicManager();
    }
    return _MusicManager.instance;
  }
  get(guildId) {
    return this.queues.get(guildId);
  }
  getOrCreate(guild, voiceChannel, textChannel) {
    let queue = this.queues.get(guild.id);
    if (queue) {
      queue.textChannel = textChannel;
      return queue;
    }
    const connection = (0, import_voice4.joinVoiceChannel)({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false
    });
    queue = new GuildQueue(guild, connection, textChannel);
    this.queues.set(guild.id, queue);
    connection.on(import_voice4.VoiceConnectionStatus.Destroyed, () => {
      this.queues.delete(guild.id);
    });
    Logger.info(`Joined voice channel "${voiceChannel.name}" in guild "${guild.name}"`, "MusicManager");
    return queue;
  }
  destroy(guildId) {
    const queue = this.queues.get(guildId);
    if (queue) {
      queue.destroy();
      this.queues.delete(guildId);
      Logger.info(`Destroyed music queue for guild ${guildId}`, "MusicManager");
    }
  }
  /**
   * Disconnects bot if all humans left the voice channel.
   */
  handleVoiceStateUpdate(oldState, newState) {
    const guild = oldState.guild || newState.guild;
    const queue = this.queues.get(guild.id);
    if (!queue) return;
    const botMember = guild.members.me;
    if (!botMember || !botMember.voice.channel) return;
    const botChannel = botMember.voice.channel;
    const humanListeners = botChannel.members.filter((m) => !m.user.bot).size;
    if (humanListeners === 0) {
      Logger.info(`No listeners remaining in voice channel for guild ${guild.name}. Leaving...`, "MusicManager");
      queue.textChannel.send("\u{1F44B} **All members left the voice channel.** Stopping playback and leaving...").catch(() => null);
      this.destroy(guild.id);
    }
  }
};
var musicManager = MusicManager.getInstance();

// src/commands/music/play.ts
var playCommand = {
  category: "multipurpose",
  data: new import_discord24.SlashCommandBuilder().setName("play").setDescription("Play a song or playlist from YouTube, Spotify, SoundCloud, or search query").addStringOption(
    (opt) => opt.setName("query").setDescription("Song title, artist, YouTube URL, Spotify URL, or audio link").setRequired(true)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const member = interaction.member;
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      await interaction.reply({
        embeds: [Embeds.error("Voice Channel Required", "You must be connected to a voice channel to play music.")],
        ephemeral: true
      });
      return;
    }
    const permissions = voiceChannel.permissionsFor(interaction.client.user);
    if (!permissions?.has(import_discord24.PermissionsBitField.Flags.Connect) || !permissions?.has(import_discord24.PermissionsBitField.Flags.Speak)) {
      await interaction.reply({
        embeds: [
          Embeds.error("Missing Permissions", "I need permissions to **Connect** and **Speak** in your voice channel!")
        ],
        ephemeral: true
      });
      return;
    }
    const query = interaction.options.getString("query", true);
    await interaction.deferReply();
    try {
      const searchResult = await AudioExtractor.resolve(query, interaction.user);
      if (!searchResult.tracks || searchResult.tracks.length === 0) {
        await interaction.editReply({
          embeds: [Embeds.warning("No Results Found", `Could not find any playable audio matching: \`${query}\``)]
        });
        return;
      }
      const queue = musicManager.getOrCreate(
        interaction.guild,
        voiceChannel,
        interaction.channel
      );
      const isFirst = !queue.currentTrack && queue.tracks.length === 0;
      await queue.enqueue(searchResult.tracks);
      if (searchResult.isPlaylist) {
        const embed = new import_discord24.EmbedBuilder().setColor(5763719).setTitle("\u{1F4D1} Playlist Enqueued").setDescription(`Added **${searchResult.tracks.length}** songs from **${searchResult.playlistTitle || "Playlist"}** to the queue.`).setFooter({ text: `Requested by ${interaction.user.tag}` }).setTimestamp();
        await interaction.editReply({ embeds: [embed] });
      } else {
        const track = searchResult.tracks[0];
        if (isFirst) {
          await interaction.editReply({
            embeds: [
              Embeds.success(
                "Starting Playback",
                `\u{1F3B6} Now playing [**${track.title}**](${track.url}) in **${voiceChannel.name}**`
              )
            ]
          });
        } else {
          const embed = new import_discord24.EmbedBuilder().setColor(5793266).setTitle("\u2795 Added to Queue").setDescription(`[${track.title}](${track.url})`).addFields(
            { name: "Channel", value: track.channel, inline: true },
            { name: "Duration", value: track.duration, inline: true },
            { name: "Position in Queue", value: `#${queue.tracks.length}`, inline: true }
          ).setThumbnail(track.thumbnail || null).setFooter({ text: `Requested by ${interaction.user.tag}` }).setTimestamp();
          await interaction.editReply({ embeds: [embed] });
        }
      }
    } catch (err) {
      await interaction.editReply({
        embeds: [Embeds.error("Playback Error", err.message || "An error occurred while resolving the track.")]
      });
    }
  }
};

// src/commands/music/control.ts
var import_discord25 = require("discord.js");
var pauseCommand = {
  category: "multipurpose",
  data: new import_discord25.SlashCommandBuilder().setName("pause").setDescription("Pause current music playback"),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        embeds: [Embeds.warning("Nothing Playing", "There is no active music stream to pause.")],
        ephemeral: true
      });
      return;
    }
    const paused = queue.pause();
    if (paused) {
      await interaction.reply({
        embeds: [Embeds.success("Playback Paused", "\u23F8\uFE0F The music has been paused. Use `/resume` to continue.")]
      });
    } else {
      await interaction.reply({
        embeds: [Embeds.warning("Already Paused", "The playback is already paused.")],
        ephemeral: true
      });
    }
  }
};
var resumeCommand = {
  category: "multipurpose",
  data: new import_discord25.SlashCommandBuilder().setName("resume").setDescription("Resume paused music playback"),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        embeds: [Embeds.warning("Nothing Playing", "There is no music stream to resume.")],
        ephemeral: true
      });
      return;
    }
    const resumed = queue.resume();
    if (resumed) {
      await interaction.reply({
        embeds: [Embeds.success("Playback Resumed", "\u25B6\uFE0F Resumed music playback.")]
      });
    } else {
      await interaction.reply({
        embeds: [Embeds.warning("Not Paused", "The playback is not currently paused.")],
        ephemeral: true
      });
    }
  }
};
var skipCommand = {
  category: "multipurpose",
  data: new import_discord25.SlashCommandBuilder().setName("skip").setDescription("Skip the currently playing song"),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        embeds: [Embeds.warning("Nothing Playing", "There is no song playing to skip.")],
        ephemeral: true
      });
      return;
    }
    const skippedTitle = queue.currentTrack.title;
    queue.skip();
    await interaction.reply({
      embeds: [Embeds.success("Song Skipped", `\u23ED\uFE0F Skipped [**${skippedTitle}**](${queue.currentTrack.url})`)]
    });
  }
};
var stopCommand = {
  category: "multipurpose",
  data: new import_discord25.SlashCommandBuilder().setName("stop").setDescription("Stop playback, clear queue, and leave the voice channel"),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue) {
      await interaction.reply({
        embeds: [Embeds.warning("Not Connected", "Aegis is not currently connected to any voice channel.")],
        ephemeral: true
      });
      return;
    }
    queue.stop();
    await interaction.reply({
      embeds: [Embeds.success("Music Stopped", "\u23F9\uFE0F Cleared the queue and left the voice channel.")]
    });
  }
};

// src/commands/music/queue.ts
var import_discord26 = require("discord.js");
var queueCommand = {
  category: "multipurpose",
  data: new import_discord26.SlashCommandBuilder().setName("queue").setDescription("View the current song and upcoming music queue").addIntegerOption(
    (opt) => opt.setName("page").setDescription("Page number of the queue").setMinValue(1).setRequired(false)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack && queue.tracks.length === 0) {
      await interaction.reply({
        embeds: [Embeds.info("Queue Empty", "There are no songs in the queue right now. Use `/play` to add some!")]
      });
      return;
    }
    const page = interaction.options.getInteger("page") || 1;
    const itemsPerPage = 10;
    const totalPages = Math.max(Math.ceil(queue.tracks.length / itemsPerPage), 1);
    if (page > totalPages) {
      await interaction.reply({
        embeds: [Embeds.warning("Invalid Page", `Page ${page} does not exist. Total pages: ${totalPages}`)],
        ephemeral: true
      });
      return;
    }
    const startIdx = (page - 1) * itemsPerPage;
    const currentTracksPage = queue.tracks.slice(startIdx, startIdx + itemsPerPage);
    const upcomingList = currentTracksPage.length > 0 ? currentTracksPage.map(
      (t, i) => `**${startIdx + i + 1}.** [${t.title}](${t.url}) \`[${t.duration}]\` \u2022 <@${t.requestedBy.id}>`
    ).join("\n") : "*No upcoming songs. Add more with `/play`!*";
    const embed = new import_discord26.EmbedBuilder().setColor(5793266).setTitle(`\u{1F3B5} Music Queue for ${interaction.guild.name}`).setDescription(
      `**Now Playing:**
[${queue.currentTrack?.title}](${queue.currentTrack?.url}) \`[${queue.currentTrack?.duration}]\`

**Upcoming Tracks (${queue.tracks.length} total):**
${upcomingList}`
    ).setFooter({
      text: `Page ${page}/${totalPages} \u2022 Loop: ${queue.loopMode} \u2022 Volume: ${queue.volume}%`
    }).setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};

// src/commands/music/nowplaying.ts
var import_discord27 = require("discord.js");
var nowplayingCommand = {
  category: "multipurpose",
  data: new import_discord27.SlashCommandBuilder().setName("nowplaying").setDescription("Display current track progress, volume, and playback status"),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        embeds: [Embeds.info("Nothing Playing", "There is no music currently playing.")],
        ephemeral: true
      });
      return;
    }
    const track = queue.currentTrack;
    const progressBar = queue.getProgressBar(18);
    const embed = new import_discord27.EmbedBuilder().setColor(5763719).setTitle("\u{1F3B6} Now Playing").setDescription(`[**${track.title}**](${track.url})`).setThumbnail(track.thumbnail || null).addFields(
      { name: "Progress", value: progressBar, inline: false },
      { name: "Uploader / Artist", value: track.channel, inline: true },
      { name: "Requested By", value: `<@${track.requestedBy.id}>`, inline: true },
      { name: "Playback Status", value: `\u{1F50A} **Volume:** ${queue.volume}%
\u{1F501} **Loop:** ${queue.loopMode}`, inline: true }
    ).setFooter({ text: "Aegis High-Fidelity Audio Engine" }).setTimestamp();
    await interaction.reply({
      embeds: [embed],
      components: MusicButtons.createRows(queue)
    });
  }
};

// src/commands/music/extras.ts
var import_discord28 = require("discord.js");
var volumeCommand = {
  category: "multipurpose",
  data: new import_discord28.SlashCommandBuilder().setName("volume").setDescription("Adjust and boost playback volume (1-200%)").addIntegerOption(
    (opt) => opt.setName("level").setDescription("Volume level from 1 to 200% (boost past 100 for loud audio)").setMinValue(1).setMaxValue(200).setRequired(true)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        embeds: [Embeds.warning("Nothing Playing", "There is no active music stream.")],
        ephemeral: true
      });
      return;
    }
    const level = interaction.options.getInteger("level", true);
    queue.setVolume(level);
    await interaction.reply({
      embeds: [Embeds.success("Volume Adjusted", `\u{1F50A} Playback volume set to **${level}%**`)]
    });
  }
};
var loopCommand = {
  category: "multipurpose",
  data: new import_discord28.SlashCommandBuilder().setName("loop").setDescription("Set repeat mode for single track or entire queue").addStringOption(
    (opt) => opt.setName("mode").setDescription("Loop mode").setRequired(true).addChoices(
      { name: "Disable Loop (Off)", value: "OFF" },
      { name: "Repeat Current Song (Track)", value: "TRACK" },
      { name: "Repeat Entire Queue (Queue)", value: "QUEUE" }
    )
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        embeds: [Embeds.warning("Nothing Playing", "There is no music stream active.")],
        ephemeral: true
      });
      return;
    }
    const mode = interaction.options.getString("mode", true);
    queue.setLoop(mode);
    await interaction.reply({
      embeds: [Embeds.success("Loop Mode Updated", `\u{1F501} Repeat mode set to **${mode}**`)]
    });
  }
};
var shuffleCommand = {
  category: "multipurpose",
  data: new import_discord28.SlashCommandBuilder().setName("shuffle").setDescription("Randomize and shuffle the upcoming songs in the queue"),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || queue.tracks.length < 2) {
      await interaction.reply({
        embeds: [Embeds.warning("Insufficient Songs", "You need at least 2 upcoming songs in the queue to shuffle.")],
        ephemeral: true
      });
      return;
    }
    queue.shuffle();
    await interaction.reply({
      embeds: [Embeds.success("Queue Shuffled", `\u{1F500} Shuffled **${queue.tracks.length}** songs in the queue.`)]
    });
  }
};
var leaveCommand = {
  category: "multipurpose",
  data: new import_discord28.SlashCommandBuilder().setName("leave").setDescription("Disconnect Aegis from the voice channel and clear music"),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue) {
      await interaction.reply({
        embeds: [Embeds.warning("Not Connected", "Aegis is not currently in a voice channel.")],
        ephemeral: true
      });
      return;
    }
    queue.stop();
    await interaction.reply({
      embeds: [Embeds.success("Disconnected", "\u{1F44B} Left the voice channel and cleared playback.")]
    });
  }
};

// src/commands/music/audiofx.ts
var import_discord29 = require("discord.js");
var audiofxCommand = {
  category: "multipurpose",
  data: new import_discord29.SlashCommandBuilder().setName("audiofx").setDescription("Configure hardware DSP audio equalizer: loud vocals, matching punchy bass, or flat").addStringOption(
    (opt) => opt.setName("preset").setDescription("Audio DSP filter preset").setRequired(true).addChoices(
      { name: "\u{1F525} Balanced Vocal & Bass Boost (Loud, Clear Vocals + Punchy Bass)", value: "BALANCED_VOCAL_BASS" },
      { name: "\u{1F50A} Heavy Bass Boost (Deep & Heavy Sub-Bass)", value: "HEAVY_BASS" },
      { name: "\u{1F3A4} Vocal Focus (Front-and-Center Vocal Clarity)", value: "VOCAL_FOCUS" },
      { name: "\u{1F3A7} Flat / Standard (Unprocessed Neutral Audio)", value: "FLAT" }
    )
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        embeds: [Embeds.warning("Nothing Playing", "There is no active music stream to apply audio filters to.")],
        ephemeral: true
      });
      return;
    }
    const preset = interaction.options.getString("preset", true);
    queue.setPreset(preset);
    const presetNames = {
      ["BALANCED_VOCAL_BASS" /* BALANCED_VOCAL_BASS */]: "Balanced Vocal & Punchy Bass (Loud & Clear)",
      ["HEAVY_BASS" /* HEAVY_BASS */]: "Heavy Bass Boost (Deep Low-End)",
      ["VOCAL_FOCUS" /* VOCAL_FOCUS */]: "Vocal Focus (Crisp Mids & Highs)",
      ["FLAT" /* FLAT */]: "Flat / Standard (Neutral)"
    };
    await interaction.reply({
      embeds: [
        Embeds.success(
          "Audio DSP Preset Updated",
          `\u{1F39B}\uFE0F Active Audio Preset set to: **${presetNames[preset]}**
*New DSP equalization and anti-distortion limiting is automatically active with zero buffer.*`
        )
      ]
    });
  }
};
var bassboostCommand = {
  category: "multipurpose",
  data: new import_discord29.SlashCommandBuilder().setName("bassboost").setDescription("Quickly toggle punchy matching bass boost for current audio").addBooleanOption(
    (opt) => opt.setName("enabled").setDescription("Enable or disable matching bass boost").setRequired(true)
  ),
  async execute(interaction) {
    if (!interaction.guild) return;
    const queue = musicManager.get(interaction.guild.id);
    if (!queue || !queue.currentTrack) {
      await interaction.reply({
        embeds: [Embeds.warning("Nothing Playing", "There is no music currently playing.")],
        ephemeral: true
      });
      return;
    }
    const enabled = interaction.options.getBoolean("enabled", true);
    queue.setPreset(enabled ? "BALANCED_VOCAL_BASS" /* BALANCED_VOCAL_BASS */ : "FLAT" /* FLAT */);
    await interaction.reply({
      embeds: [
        Embeds.success(
          "Bass Boost Updated",
          enabled ? "\u{1F50A} **Matching Bass Boost + Vocal Enhancement ACTIVE** (+6dB Bass / +4dB Vocals with zero buffer)." : "\u{1F3A7} **Bass Boost Disabled** (Standard Flat Output)."
        )
      ]
    });
  }
};

// src/commands/index.ts
var commands = [
  // Security Suite
  securityCommand,
  filterCommand,
  // Moderation Suite
  banCommand,
  kickCommand,
  timeoutCommand,
  warnCommand,
  warningsCommand,
  clearWarnsCommand,
  purgeCommand,
  lockCommand,
  unlockCommand,
  slowmodeCommand,
  // Utility Suite
  prefixCommand,
  userinfoCommand,
  serverinfoCommand,
  botinfoCommand,
  avatarCommand,
  statusCommand,
  botAvatarCommand,
  botBannerCommand,
  guildIconCommand,
  guildBannerCommand,
  serverAvatarCommand,
  serverBannerCommand,
  serverProfileCommand,
  // Multipurpose / Setup
  setupVerifyCommand,
  setupTicketsCommand,
  setupWelcomeCommand,
  setupLogsCommand,
  // High-Performance Music Suite
  playCommand,
  pauseCommand,
  resumeCommand,
  skipCommand,
  stopCommand,
  queueCommand,
  nowplayingCommand,
  volumeCommand,
  loopCommand,
  shuffleCommand,
  leaveCommand,
  audiofxCommand,
  bassboostCommand
];
var commandMap = /* @__PURE__ */ new Map();
for (const cmd of commands) {
  commandMap.set(cmd.data.name, cmd);
}

// src/services/TicketService.ts
var import_discord30 = require("discord.js");
var TicketService = class {
  /**
   * Opens a new private support ticket channel.
   */
  static async createTicket(guild, user) {
    const settings = GuildRepo.get(guild.id);
    const db = dbManager.getDb();
    const existing = db.prepare('SELECT channel_id FROM tickets WHERE guild_id = ? AND user_id = ? AND status = "OPEN"').get(guild.id, user.id);
    if (existing) {
      const existingChannel = guild.channels.cache.get(existing.channel_id);
      if (existingChannel) {
        return { success: false, error: `You already have an open ticket: <#${existing.channel_id}>` };
      }
    }
    try {
      const permissionOverwrites = [
        {
          id: guild.id,
          // @everyone
          deny: [import_discord30.PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: user.id,
          // Ticket Author
          allow: [
            import_discord30.PermissionsBitField.Flags.ViewChannel,
            import_discord30.PermissionsBitField.Flags.SendMessages,
            import_discord30.PermissionsBitField.Flags.AttachFiles,
            import_discord30.PermissionsBitField.Flags.ReadMessageHistory,
            import_discord30.PermissionsBitField.Flags.EmbedLinks
          ]
        },
        {
          id: guild.client.user.id,
          // Bot itself
          allow: [
            import_discord30.PermissionsBitField.Flags.ViewChannel,
            import_discord30.PermissionsBitField.Flags.SendMessages,
            import_discord30.PermissionsBitField.Flags.ManageChannels,
            import_discord30.PermissionsBitField.Flags.EmbedLinks
          ]
        }
      ];
      if (settings.ticket_support_role_id) {
        permissionOverwrites.push({
          id: settings.ticket_support_role_id,
          allow: [
            import_discord30.PermissionsBitField.Flags.ViewChannel,
            import_discord30.PermissionsBitField.Flags.SendMessages,
            import_discord30.PermissionsBitField.Flags.AttachFiles,
            import_discord30.PermissionsBitField.Flags.ReadMessageHistory
          ]
        });
      }
      const channel = await guild.channels.create({
        name: `ticket-${user.username.slice(0, 15)}`,
        type: import_discord30.ChannelType.GuildText,
        parent: settings.ticket_category_id || void 0,
        permissionOverwrites
      });
      db.prepare(`
        INSERT INTO tickets (guild_id, channel_id, user_id, status, created_at)
        VALUES (?, ?, ?, 'OPEN', ?)
      `).run(guild.id, channel.id, user.id, Date.now());
      const ticketEmbed = new import_discord30.EmbedBuilder().setColor(5793266).setTitle(`\u{1F3AB} Support Ticket - ${user.tag}`).setDescription(
        `Hello ${user}! Support will be with you shortly.
Please describe your issue in detail.

Click the button below when you are ready to close this ticket.`
      ).setTimestamp();
      const row = new import_discord30.ActionRowBuilder().addComponents(
        new import_discord30.ButtonBuilder().setCustomId("btn_ticket_close").setLabel("Close Ticket").setStyle(import_discord30.ButtonStyle.Danger).setEmoji("\u{1F512}")
      );
      await channel.send({ content: `${user} | Staff Notification`, embeds: [ticketEmbed], components: [row] });
      return { success: true, channel };
    } catch (err) {
      Logger.error("Failed to create ticket channel", err, "TicketService");
      return { success: false, error: err.message };
    }
  }
  /**
   * Closes ticket, generates transcript, and deletes channel.
   */
  static async closeTicket(channel, closedBy) {
    const db = dbManager.getDb();
    const row = db.prepare("SELECT user_id, created_at FROM tickets WHERE channel_id = ?").get(channel.id);
    const messages = await channel.messages.fetch({ limit: 100 }).catch(() => null);
    let transcriptText = `--- TICKET TRANSCRIPT FOR #${channel.name} ---
`;
    transcriptText += `Guild: ${channel.guild.name} (${channel.guild.id})
`;
    transcriptText += `Closed by: ${closedBy.tag} (${closedBy.id})
`;
    transcriptText += `Date: ${(/* @__PURE__ */ new Date()).toISOString()}

`;
    if (messages) {
      const sorted = Array.from(messages.values()).reverse();
      for (const msg of sorted) {
        transcriptText += `[${new Date(msg.createdTimestamp).toLocaleTimeString()}] ${msg.author.tag}: ${msg.content}
`;
      }
    }
    const transcriptBuffer = Buffer.from(transcriptText, "utf-8");
    const attachment = new import_discord30.AttachmentBuilder(transcriptBuffer, { name: `${channel.name}-transcript.txt` });
    db.prepare('UPDATE tickets SET status = "CLOSED", closed_at = ? WHERE channel_id = ?').run(Date.now(), channel.id);
    const settings = GuildRepo.get(channel.guild.id);
    if (settings.ticket_log_channel_id) {
      const logChannel = channel.guild.channels.cache.get(settings.ticket_log_channel_id);
      if (logChannel && logChannel.isTextBased()) {
        const embed = new import_discord30.EmbedBuilder().setColor(15548997).setTitle("\u{1F512} Ticket Closed").addFields(
          { name: "Channel", value: channel.name, inline: true },
          { name: "Closed By", value: `${closedBy.tag} (\`${closedBy.id}\`)`, inline: true },
          { name: "Creator ID", value: row ? `<@${row.user_id}>` : "Unknown", inline: true }
        ).setTimestamp();
        await logChannel.send({ embeds: [embed], files: [attachment] }).catch(() => null);
      }
    }
    await channel.send("\u{1F512} **Ticket closed.** Channel will be deleted in 5 seconds...");
    setTimeout(() => {
      channel.delete("Ticket closed").catch(() => null);
    }, 5e3);
  }
};

// src/events/interactionCreate.ts
async function handleInteractionCreate(interaction) {
  if (interaction.isChatInputCommand()) {
    const command = commandMap.get(interaction.commandName);
    if (!command) return;
    if (command.userPermissions && interaction.member instanceof import_discord31.GuildMember && interaction.user.id !== config.ownerId) {
      const missing = command.userPermissions.filter(
        (perm) => !interaction.memberPermissions?.has(perm)
      );
      if (missing.length > 0) {
        await interaction.reply({
          embeds: [
            Embeds.error(
              "Insufficient Permissions",
              `You lack the required permissions to run this command: \`${missing.join(", ")}\``
            )
          ],
          ephemeral: true
        });
        return;
      }
    }
    if (command.botPermissions && interaction.guild?.members.me) {
      const missing = command.botPermissions.filter(
        (perm) => !interaction.guild.members.me.permissions.has(perm)
      );
      if (missing.length > 0) {
        await interaction.reply({
          embeds: [
            Embeds.error(
              "Bot Missing Permissions",
              `I need the following permissions to execute this command: \`${missing.join(", ")}\``
            )
          ],
          ephemeral: true
        });
        return;
      }
    }
    try {
      await command.execute(interaction);
    } catch (err) {
      Logger.error(`Error executing slash command /${interaction.commandName}`, err, "CommandRunner");
      const errEmbed = Embeds.error(
        "Command Execution Error",
        "An unexpected internal error occurred while processing this command."
      );
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ embeds: [errEmbed] }).catch(() => null);
      } else {
        await interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(() => null);
      }
    }
    return;
  }
  if (interaction.isButton()) {
    const { customId, guild, member, user } = interaction;
    if (!guild || !(member instanceof import_discord31.GuildMember)) return;
    if (customId.startsWith("btn_music_")) {
      await MusicButtons.handleInteraction(interaction);
      return;
    }
    if (customId === "btn_verify_member") {
      const settings = GuildRepo.get(guild.id);
      if (!settings.verified_role_id) {
        await interaction.reply({
          content: "\u26A0\uFE0F Verification role is not configured on this server.",
          ephemeral: true
        });
        return;
      }
      try {
        await member.roles.add(settings.verified_role_id, "Completed interactive verification portal");
        if (settings.unverified_role_id && member.roles.cache.has(settings.unverified_role_id)) {
          await member.roles.remove(settings.unverified_role_id, "Verified member");
        }
        await interaction.reply({
          content: "\u2705 **Verification Complete!** You now have full access to the server.",
          ephemeral: true
        });
      } catch (err) {
        Logger.error("Verification role assignment failed", err, "Verification");
        await interaction.reply({
          content: "\u274C Failed to assign verified role. Please contact a server administrator.",
          ephemeral: true
        });
      }
      return;
    }
    if (customId === "btn_ticket_create") {
      await interaction.deferReply({ ephemeral: true });
      const result = await TicketService.createTicket(guild, user);
      if (result.success && result.channel) {
        await interaction.editReply({
          content: `\u2705 Your private ticket has been created: ${result.channel}`
        });
      } else {
        await interaction.editReply({
          content: `\u274C ${result.error || "Could not open ticket channel."}`
        });
      }
      return;
    }
    if (customId === "btn_ticket_close") {
      if (interaction.channel instanceof import_discord31.TextChannel) {
        await interaction.reply({ content: "Closing ticket and generating transcript..." });
        await TicketService.closeTicket(interaction.channel, user);
      }
      return;
    }
  }
}

// src/security/Homoglyphs.ts
var ZERO_WIDTH_REGEX = /[\u200B-\u200D\uFEFF\u00AD\u200E\u200F\u202A-\u202E\u2060-\u206F\u034F\u180E]/g;
var ZALGO_COMBINING_REGEX = /[\u0300-\u036F\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/g;
var HOMOGLYPHS = {
  // Cyrillic
  "\u0430": "a",
  "\u0410": "A",
  "\u0431": "b",
  "\u0411": "B",
  "\u0432": "v",
  "\u0412": "B",
  "\u0433": "g",
  "\u0413": "G",
  "\u0434": "d",
  "\u0414": "D",
  "\u0435": "e",
  "\u0415": "E",
  "\u0436": "zh",
  "\u0416": "Zh",
  "\u0437": "z",
  "\u0417": "Z",
  "\u0438": "i",
  "\u0418": "I",
  "\u0439": "i",
  "\u0419": "I",
  "\u043A": "k",
  "\u041A": "K",
  "\u043B": "l",
  "\u041B": "L",
  "\u043C": "m",
  "\u041C": "M",
  "\u043D": "n",
  "\u041D": "H",
  "\u043E": "o",
  "\u041E": "O",
  "\u043F": "p",
  "\u041F": "P",
  "\u0440": "p",
  "\u0420": "P",
  "\u0441": "c",
  "\u0421": "C",
  "\u0442": "t",
  "\u0422": "T",
  "\u0443": "y",
  "\u0423": "Y",
  "\u0444": "f",
  "\u0424": "F",
  "\u0445": "x",
  "\u0425": "X",
  "\u0446": "ts",
  "\u0426": "Ts",
  "\u0447": "ch",
  "\u0427": "Ch",
  "\u0448": "sh",
  "\u0428": "Sh",
  "\u0449": "shch",
  "\u0429": "Shch",
  "\u044A": "",
  "\u042A": "",
  "\u044B": "y",
  "\u042B": "Y",
  "\u044C": "",
  "\u042C": "",
  "\u044D": "e",
  "\u042D": "E",
  "\u044E": "yu",
  "\u042E": "Yu",
  "\u044F": "ya",
  "\u042F": "Ya",
  "\u0456": "i",
  "\u0406": "I",
  "\u0457": "yi",
  "\u0407": "Yi",
  "\u0454": "ye",
  "\u0404": "Ye",
  "\u0455": "s",
  "\u0405": "S",
  "\u0458": "j",
  "\u0408": "J",
  "\u04CF": "l",
  "\u04C0": "I",
  // Greek
  "\u03B1": "a",
  "\u0391": "A",
  "\u03B2": "b",
  "\u0392": "B",
  "\u03B3": "g",
  "\u0393": "G",
  "\u03B4": "d",
  "\u0394": "D",
  "\u03B5": "e",
  "\u0395": "E",
  "\u03B6": "z",
  "\u0396": "Z",
  "\u03B7": "h",
  "\u0397": "H",
  "\u03B8": "th",
  "\u0398": "Th",
  "\u03B9": "i",
  "\u0399": "I",
  "\u03BA": "k",
  "\u039A": "K",
  "\u03BB": "l",
  "\u039B": "L",
  "\u03BC": "m",
  "\u039C": "M",
  "\u03BD": "n",
  "\u039D": "N",
  "\u03BE": "x",
  "\u039E": "X",
  "\u03BF": "o",
  "\u039F": "O",
  "\u03C0": "p",
  "\u03A0": "P",
  "\u03C1": "r",
  "\u03A1": "P",
  "\u03C3": "s",
  "\u03A3": "S",
  "\u03C2": "s",
  "\u03C4": "t",
  "\u03A4": "T",
  "\u03C5": "u",
  "\u03A5": "Y",
  "\u03C6": "f",
  "\u03A6": "F",
  "\u03C7": "x",
  "\u03A7": "X",
  "\u03C8": "ps",
  "\u03A8": "Ps",
  "\u03C9": "o",
  "\u03A9": "O"
};
var LEET_MAP = {
  "@": "a",
  "4": "a",
  "8": "b",
  "(": "c",
  "[": "c",
  "{": "c",
  "3": "e",
  "\u20AC": "e",
  "6": "g",
  "9": "g",
  "#": "h",
  "!": "i",
  "1": "i",
  "|": "i",
  "0": "o",
  "$": "s",
  "5": "s",
  "7": "t",
  "+": "t",
  "v": "u",
  "\\/": "v",
  "vv": "w",
  "%": "x",
  "2": "z"
};
var HomoglyphEngine = class {
  /**
   * Strips all zero-width characters, non-breaking formatting, and zalgo combining accents.
   */
  static stripInvisibles(text) {
    return text.replace(ZERO_WIDTH_REGEX, "").replace(ZALGO_COMBINING_REGEX, "");
  }
  /**
   * Normalizes Unicode NFKD, strips accents, replaces homoglyphs from Cyrillic/Greek/Math fonts.
   */
  static dehomoglyph(text) {
    let cleaned = this.stripInvisibles(text);
    cleaned = cleaned.normalize("NFKD");
    let result = "";
    for (const char of cleaned) {
      if (HOMOGLYPHS[char]) {
        result += HOMOGLYPHS[char];
      } else {
        result += char;
      }
    }
    return result;
  }
  /**
   * Converts leetspeak numbers/symbols to letters.
   */
  static deLeet(text) {
    let lower = text.toLowerCase();
    for (const [leet, char] of Object.entries(LEET_MAP)) {
      lower = lower.split(leet).join(char);
    }
    return lower;
  }
  /**
   * Condenses text by stripping whitespace, symbols, and reducing repetitive characters (e.g. 'coooom' -> 'com')
   */
  static condense(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/(.)\1{2,}/g, "$1$1");
  }
  /**
   * Returns a suite of normalized representations of the input string for thorough matching.
   */
  static getNormalizedVariants(text) {
    const rawClean = this.stripInvisibles(text);
    const dehomo = this.dehomoglyph(rawClean);
    const deLeet = this.deLeet(dehomo);
    const condensed = this.condense(deLeet);
    return {
      raw: rawClean,
      dehomoglyphed: dehomo,
      deLeeted: deLeet,
      condensed
    };
  }
};

// src/security/WordFilter.ts
var BUILTIN_MALICIOUS_DOMAINS = [
  "grabify.link",
  "iplogger.org",
  "2no.co",
  "discorcl.gift",
  "dlscord.gift",
  "discord-nitro.link",
  "discord-app.net",
  "steamcommunilty.com",
  "steamcomminuty.com",
  "roblox-api.org"
];
var WordFilterEngine = class {
  /**
   * Scans content against custom server filters and malicious threat signatures.
   */
  static scan(guildId, content) {
    const rules = FilterRepo.getRules(guildId);
    const variants = HomoglyphEngine.getNormalizedVariants(content);
    for (const domain of BUILTIN_MALICIOUS_DOMAINS) {
      if (content.toLowerCase().includes(domain) || variants.dehomoglyphed.toLowerCase().includes(domain) || variants.condensed.includes(domain.replace(/[^a-z0-9]/g, ""))) {
        return {
          hasViolation: true,
          matchedWord: domain,
          severity: "BAN",
          isObfuscated: content !== variants.dehomoglyphed
        };
      }
    }
    if (rules.length === 0) {
      return { hasViolation: false };
    }
    for (const rule of rules) {
      if (rule.is_regex) {
        try {
          const regex = new RegExp(rule.pattern, "i");
          if (regex.test(content) || regex.test(variants.dehomoglyphed) || regex.test(variants.deLeeted)) {
            return {
              hasViolation: true,
              rule,
              matchedWord: rule.pattern,
              severity: rule.severity,
              isObfuscated: !regex.test(content)
            };
          }
        } catch {
        }
      } else {
        const target = rule.pattern.toLowerCase();
        const condensedTarget = HomoglyphEngine.condense(target);
        const wordRegex = new RegExp(`\\b${this.escapeRegex(target)}\\b`, "i");
        if (wordRegex.test(content)) {
          return {
            hasViolation: true,
            rule,
            matchedWord: target,
            severity: rule.severity,
            isObfuscated: false
          };
        }
        if (wordRegex.test(variants.dehomoglyphed)) {
          return {
            hasViolation: true,
            rule,
            matchedWord: target,
            severity: rule.severity,
            isObfuscated: true
          };
        }
        if (wordRegex.test(variants.deLeeted)) {
          return {
            hasViolation: true,
            rule,
            matchedWord: target,
            severity: rule.severity,
            isObfuscated: true
          };
        }
        if (condensedTarget.length >= 4 && variants.condensed.includes(condensedTarget)) {
          return {
            hasViolation: true,
            rule,
            matchedWord: target,
            severity: rule.severity,
            isObfuscated: true
          };
        }
      }
    }
    return { hasViolation: false };
  }
  static escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
};

// src/security/AntiInvite.ts
var DISCORD_INVITE_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?(?:discord\.(?:gg|io|me|li)|discordapp\.com\/invite|discord\.com\/invite)\/([a-zA-Z0-9-]{2,32})/i,
  /(?:https?:\/\/)?(?:www\.)?(?:dsc\.gg|invite\.gg)\/([a-zA-Z0-9-]{2,32})/i
];
var OBFUSCATED_PATTERNS = [
  /discord\s*(?:\[|\(|\{)?\s*(?:\.|\bdot\b)\s*(?:\]|\)|\})?\s*gg\s*[\/\\]\s*([a-zA-Z0-9-]{2,32})/i,
  /dsc\s*(?:\[|\(|\{)?\s*(?:\.|\bdot\b)\s*(?:\]|\)|\})?\s*gg\s*[\/\\]\s*([a-zA-Z0-9-]{2,32})/i,
  /discordapp\s*(?:\[|\(|\{)?\s*(?:\.|\bdot\b)\s*(?:\]|\)|\})?\s*com\s*[\/\\]\s*invite\s*[\/\\]\s*([a-zA-Z0-9-]{2,32})/i
];
var MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
var AntiInviteEngine = class {
  /**
   * Scans text for any direct or obfuscated Discord invite links.
   */
  static async scan(content, guild, whitelistedCodes = []) {
    const variants = HomoglyphEngine.getNormalizedVariants(content);
    let isObfuscated = false;
    let markdownMatch;
    while ((markdownMatch = MARKDOWN_LINK_REGEX.exec(content)) !== null) {
      const displayText = markdownMatch[1];
      const targetUrl = markdownMatch[2];
      for (const pattern of DISCORD_INVITE_PATTERNS) {
        const inviteMatch = pattern.exec(targetUrl);
        if (inviteMatch) {
          const code = inviteMatch[1];
          const isOwn = await this.isGuildInvite(guild, code, whitelistedCodes);
          if (!isOwn) {
            return {
              hasInvite: true,
              hasDisguisedLink: true,
              inviteCode: code,
              matchedPattern: `Markdown link disguised as "${displayText.slice(0, 30)}"`,
              isObfuscated: true
            };
          }
        }
      }
    }
    for (const pattern of DISCORD_INVITE_PATTERNS) {
      const match = pattern.exec(content);
      if (match) {
        const code = match[1];
        const isOwn = await this.isGuildInvite(guild, code, whitelistedCodes);
        if (!isOwn) {
          return {
            hasInvite: true,
            hasDisguisedLink: false,
            inviteCode: code,
            matchedPattern: match[0],
            isObfuscated: false
          };
        }
      }
    }
    for (const pattern of OBFUSCATED_PATTERNS) {
      const match = pattern.exec(content);
      if (match) {
        const code = match[1];
        const isOwn = await this.isGuildInvite(guild, code, whitelistedCodes);
        if (!isOwn) {
          return {
            hasInvite: true,
            hasDisguisedLink: false,
            inviteCode: code,
            matchedPattern: match[0],
            isObfuscated: true
          };
        }
      }
    }
    for (const testText of [variants.dehomoglyphed, variants.deLeeted]) {
      for (const pattern of [...DISCORD_INVITE_PATTERNS, ...OBFUSCATED_PATTERNS]) {
        const match = pattern.exec(testText);
        if (match) {
          const code = match[1];
          const isOwn = await this.isGuildInvite(guild, code, whitelistedCodes);
          if (!isOwn) {
            return {
              hasInvite: true,
              hasDisguisedLink: false,
              inviteCode: code,
              matchedPattern: match[0],
              isObfuscated: true
            };
          }
        }
      }
    }
    if (variants.condensed.includes("discordgg") || variants.condensed.includes("dscgg")) {
      const match = /(?:discordgg|dscgg)([a-z0-9]{2,32})/i.exec(variants.condensed);
      if (match) {
        const code = match[1];
        const isOwn = await this.isGuildInvite(guild, code, whitelistedCodes);
        if (!isOwn) {
          return {
            hasInvite: true,
            hasDisguisedLink: false,
            inviteCode: code,
            matchedPattern: "Compressed stealth invite signature",
            isObfuscated: true
          };
        }
      }
    }
    return {
      hasInvite: false,
      hasDisguisedLink: false,
      isObfuscated: false
    };
  }
  /**
   * Verifies if invite belongs to the current guild or is whitelisted.
   */
  static async isGuildInvite(guild, code, whitelistedCodes) {
    if (whitelistedCodes.includes(code.toLowerCase())) {
      return true;
    }
    if (guild.vanityURLCode && guild.vanityURLCode.toLowerCase() === code.toLowerCase()) {
      return true;
    }
    try {
      const guildInvites = await guild.invites.fetch().catch(() => null);
      if (guildInvites && guildInvites.has(code)) {
        return true;
      }
    } catch {
    }
    return false;
  }
};

// src/security/AntiSpam.ts
var AntiSpamEngine = class _AntiSpamEngine {
  // guildId:userId -> history
  static userHistories = /* @__PURE__ */ new Map();
  static {
    setInterval(() => {
      const now = Date.now();
      for (const [key, hist] of _AntiSpamEngine.userHistories.entries()) {
        const lastActivity = hist.timestamps[hist.timestamps.length - 1] || 0;
        if (now - lastActivity > 6e4) {
          _AntiSpamEngine.userHistories.delete(key);
        }
      }
    }, 5 * 60 * 1e3);
  }
  /**
   * Main spam analysis pipeline.
   */
  static checkMessage(message, limits) {
    if (!message.guild || message.author.bot) {
      return { isSpam: false };
    }
    const key = `${message.guild.id}:${message.author.id}`;
    const now = Date.now();
    let hist = this.userHistories.get(key);
    if (!hist) {
      hist = {
        timestamps: [],
        recentContents: [],
        mentionsCount: 0,
        lastMentionReset: now,
        violationsCount: 0
      };
      this.userHistories.set(key, hist);
    }
    const mentionCount = message.mentions.users.size + message.mentions.roles.size + (message.mentions.everyone ? 2 : 0);
    if (mentionCount >= limits.maxMentions) {
      hist.violationsCount++;
      return {
        isSpam: true,
        type: "MENTION_SPAM",
        details: `Dispatched ${mentionCount} mentions in a single message (limit: ${limits.maxMentions})`,
        suggestedTimeoutMs: this.getTimeoutDuration(hist.violationsCount)
      };
    }
    const customEmojiRegex = /<a?:\w+:\d+>/g;
    const unicodeEmojiRegex = new RegExp("\\p{Extended_Pictographic}", "gu");
    const customCount = (message.content.match(customEmojiRegex) || []).length;
    const unicodeCount = (message.content.match(unicodeEmojiRegex) || []).length;
    const totalEmojis = customCount + unicodeCount;
    if (totalEmojis >= limits.maxEmojis) {
      hist.violationsCount++;
      return {
        isSpam: true,
        type: "EMOJI_SPAM",
        details: `Message contained ${totalEmojis} emojis (limit: ${limits.maxEmojis})`,
        suggestedTimeoutMs: this.getTimeoutDuration(hist.violationsCount)
      };
    }
    const newlines = (message.content.match(/\n/g) || []).length;
    if (newlines >= 14 || message.content.length > 1500 && newlines >= 8) {
      hist.violationsCount++;
      return {
        isSpam: true,
        type: "WALL_OF_TEXT",
        details: `Excessive line breaks (${newlines} newlines) / wall of text`,
        suggestedTimeoutMs: this.getTimeoutDuration(hist.violationsCount)
      };
    }
    hist.timestamps.push(now);
    hist.timestamps = hist.timestamps.filter((t) => now - t <= 5e3);
    if (hist.timestamps.length > limits.maxMessagesPer5s) {
      hist.violationsCount++;
      return {
        isSpam: true,
        type: "FAST_BURST",
        details: `Sent ${hist.timestamps.length} messages in under 5 seconds (limit: ${limits.maxMessagesPer5s})`,
        suggestedTimeoutMs: this.getTimeoutDuration(hist.violationsCount)
      };
    }
    const condensed = HomoglyphEngine.condense(message.content);
    if (condensed.length >= 6) {
      for (const prev of hist.recentContents) {
        const similarity = this.calculateSimilarity(condensed, prev);
        if (similarity >= limits.maxDuplicateSimilarity) {
          hist.violationsCount++;
          return {
            isSpam: true,
            type: "DUPLICATE_FLOOD",
            details: `Repeated duplicate message (${Math.round(similarity * 100)}% identical match)`,
            suggestedTimeoutMs: this.getTimeoutDuration(hist.violationsCount)
          };
        }
      }
      hist.recentContents.push(condensed);
      if (hist.recentContents.length > 4) {
        hist.recentContents.shift();
      }
    }
    return { isSpam: false };
  }
  /**
   * Progressive timeout escalation based on violation streak.
   */
  static getTimeoutDuration(violations) {
    if (violations === 1) return 60 * 1e3;
    if (violations === 2) return 5 * 60 * 1e3;
    if (violations === 3) return 15 * 60 * 1e3;
    if (violations >= 4) return 60 * 60 * 1e3;
    return 60 * 1e3;
  }
  /**
   * Computes string similarity using Dice's bigram coefficient (fast & resilient to small edits).
   */
  static calculateSimilarity(s1, s2) {
    if (s1 === s2) return 1;
    if (s1.length < 2 || s2.length < 2) return 0;
    const bigrams1 = /* @__PURE__ */ new Map();
    for (let i = 0; i < s1.length - 1; i++) {
      const bigram = s1.substring(i, i + 2);
      bigrams1.set(bigram, (bigrams1.get(bigram) || 0) + 1);
    }
    let intersection = 0;
    for (let i = 0; i < s2.length - 1; i++) {
      const bigram = s2.substring(i, i + 2);
      const count = bigrams1.get(bigram) || 0;
      if (count > 0) {
        bigrams1.set(bigram, count - 1);
        intersection++;
      }
    }
    return 2 * intersection / (s1.length - 1 + s2.length - 1);
  }
};

// src/security/AntiGhostPing.ts
var AntiGhostPingEngine = class _AntiGhostPingEngine {
  // messageId -> GhostPingInfo (5 minute TTL)
  static recentMentions = /* @__PURE__ */ new Map();
  static {
    setInterval(() => {
      const now = Date.now();
      for (const [id, info] of _AntiGhostPingEngine.recentMentions.entries()) {
        if (now - info.timestamp > 5 * 60 * 1e3) {
          _AntiGhostPingEngine.recentMentions.delete(id);
        }
      }
    }, 2 * 60 * 1e3);
  }
  /**
   * Tracks a message if it contains any mentions.
   */
  static trackMessage(message) {
    if (!message.guild || message.author.bot) return;
    const users = Array.from(message.mentions.users.values()).filter((u) => u.id !== message.author.id).map((u) => ({ id: u.id, tag: u.tag }));
    const roles = Array.from(message.mentions.roles.values()).map((r) => ({
      id: r.id,
      name: r.name
    }));
    const hasEveryone = message.mentions.everyone;
    if (users.length > 0 || roles.length > 0 || hasEveryone) {
      this.recentMentions.set(message.id, {
        authorId: message.author.id,
        authorTag: message.author.tag,
        channelId: message.channel.id,
        content: message.content,
        timestamp: Date.now(),
        mentionedUsers: users,
        mentionedRoles: roles,
        hasEveryone
      });
    }
  }
  /**
   * Checks if deleted message was a ghost ping.
   */
  static checkDelete(messageId) {
    const info = this.recentMentions.get(messageId);
    if (info) {
      this.recentMentions.delete(messageId);
      return info;
    }
    return null;
  }
  /**
   * Checks if an edited message removed mentions (edit ghost ping).
   */
  static checkEdit(oldMessage, newMessage) {
    if (!oldMessage.guild || oldMessage.author?.bot) return null;
    const oldUsers = Array.from(oldMessage.mentions.users.keys()).filter((id) => id !== oldMessage.author.id);
    const newUsers = new Set(newMessage.mentions.users.keys());
    const removedUsers = oldUsers.filter((id) => !newUsers.has(id));
    if (removedUsers.length > 0) {
      return {
        authorId: oldMessage.author.id,
        authorTag: oldMessage.author.tag,
        channelId: oldMessage.channel.id,
        content: oldMessage.content,
        timestamp: Date.now(),
        mentionedUsers: removedUsers.map((id) => {
          const user = oldMessage.mentions.users.get(id);
          return { id, tag: user?.tag || id };
        }),
        mentionedRoles: [],
        hasEveryone: false
      };
    }
    return null;
  }
};

// src/services/TextCommandHandler.ts
var import_discord32 = require("discord.js");
var TextCommandHandler = class {
  static async handle(message) {
    if (!message.guild || message.author.bot) return false;
    const settings = GuildRepo.get(message.guild.id);
    const prefix = settings.prefix || "!";
    const botMention = new RegExp(`^<@!?${message.client.user?.id}>$`);
    const botMentionPrefix = new RegExp(`^<@!?${message.client.user?.id}>\\s+prefix$`, "i");
    if (botMention.test(message.content.trim()) || botMentionPrefix.test(message.content.trim())) {
      await message.reply(
        `\u{1F44B} The text command prefix for **${message.guild.name}** is \`${prefix}\`

\u2022 Show prefix: \`${prefix}prefix\`
\u2022 Change server prefix: \`${prefix}prefix <new>\` (or \`/prefix set\`)
\u2022 Reset server prefix: \`${prefix}prefix reset\` (or \`/prefix reset\`)
\u2022 Help guide: \`${prefix}help\` or \`/help\``
      );
      return true;
    }
    if (!message.content.startsWith(prefix)) {
      return false;
    }
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return false;
    const member = message.member;
    const voiceChannel = member?.voice.channel;
    const textChannel = message.channel;
    if (commandName === "play" || commandName === "p") {
      const query = args.join(" ");
      if (!query) {
        await message.reply({ content: `\u26A0\uFE0F Usage: \`${prefix}play <song title / YouTube URL / Spotify URL>\`` });
        return true;
      }
      if (!voiceChannel) {
        await message.reply({ content: "\u274C You must be connected to a voice channel to play music." });
        return true;
      }
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions?.has(import_discord32.PermissionsBitField.Flags.Connect) || !permissions?.has(import_discord32.PermissionsBitField.Flags.Speak)) {
        await message.reply({ content: "\u274C I need permissions to **Connect** and **Speak** in your voice channel!" });
        return true;
      }
      const searchingMsg = await message.reply({ content: `\u{1F50D} Searching for \`${query}\`...` });
      try {
        const searchResult = await AudioExtractor.resolve(query, message.author);
        if (!searchResult.tracks || searchResult.tracks.length === 0) {
          await searchingMsg.edit({ content: `\u274C No results found matching \`${query}\`.` });
          return true;
        }
        const queue = musicManager.getOrCreate(message.guild, voiceChannel, textChannel);
        const isFirst = !queue.currentTrack && queue.tracks.length === 0;
        await queue.enqueue(searchResult.tracks);
        if (searchResult.isPlaylist) {
          const embed = new import_discord32.EmbedBuilder().setColor(5763719).setTitle("\u{1F4D1} Playlist Enqueued").setDescription(`Added **${searchResult.tracks.length}** songs from **${searchResult.playlistTitle || "Playlist"}** to the queue.`).setFooter({ text: `Requested by ${message.author.tag}` }).setTimestamp();
          await searchingMsg.edit({ content: null, embeds: [embed] });
        } else {
          const track = searchResult.tracks[0];
          if (isFirst) {
            await searchingMsg.edit({
              content: null,
              embeds: [Embeds.success("Starting Playback", `\u{1F3B6} Now playing [**${track.title}**](${track.url}) in **${voiceChannel.name}**`)]
            });
          } else {
            const embed = new import_discord32.EmbedBuilder().setColor(5793266).setTitle("\u2795 Added to Queue").setDescription(`[${track.title}](${track.url})`).addFields(
              { name: "Channel", value: track.channel, inline: true },
              { name: "Duration", value: track.duration, inline: true },
              { name: "Position", value: `#${queue.tracks.length}`, inline: true }
            ).setThumbnail(track.thumbnail || null).setFooter({ text: `Volume: ${queue.volume}%` }).setTimestamp();
            await searchingMsg.edit({ content: null, embeds: [embed] });
          }
        }
      } catch (err) {
        await searchingMsg.edit({ content: `\u274C Playback error: ${err.message || "Stream extraction failure"}` });
      }
      return true;
    }
    if (commandName === "pause") {
      const queue = musicManager.get(message.guild.id);
      if (!queue || !queue.currentTrack) {
        await message.reply("\u26A0\uFE0F No active music stream to pause.");
        return true;
      }
      queue.pause();
      await message.reply("\u23F8\uFE0F Playback paused. Run `" + prefix + "resume` to continue.");
      return true;
    }
    if (commandName === "resume") {
      const queue = musicManager.get(message.guild.id);
      if (!queue || !queue.currentTrack) {
        await message.reply("\u26A0\uFE0F No music stream to resume.");
        return true;
      }
      queue.resume();
      await message.reply("\u25B6\uFE0F Resumed music playback.");
      return true;
    }
    if (commandName === "skip" || commandName === "s") {
      const queue = musicManager.get(message.guild.id);
      if (!queue || !queue.currentTrack) {
        await message.reply("\u26A0\uFE0F Nothing is currently playing.");
        return true;
      }
      const title = queue.currentTrack.title;
      queue.skip();
      await message.reply(`\u23ED\uFE0F Skipped **${title}**`);
      return true;
    }
    if (commandName === "stop") {
      const queue = musicManager.get(message.guild.id);
      if (!queue) {
        await message.reply("\u26A0\uFE0F Aegis is not in a voice channel.");
        return true;
      }
      queue.stop();
      await message.reply("\u23F9\uFE0F Cleared queue and disconnected.");
      return true;
    }
    if (commandName === "volume" || commandName === "vol" || commandName === "v") {
      const queue = musicManager.get(message.guild.id);
      if (!queue || !queue.currentTrack) {
        await message.reply("\u26A0\uFE0F No music playing right now.");
        return true;
      }
      if (!args[0]) {
        await message.reply(`\u{1F50A} Current volume: **${queue.volume}%** (Max: 200%). To change: \`${prefix}vol <1-200>\``);
        return true;
      }
      const vol = parseInt(args[0], 10);
      if (isNaN(vol) || vol < 1 || vol > 200) {
        await message.reply("\u26A0\uFE0F Please provide a volume level between 1 and 200.");
        return true;
      }
      queue.setVolume(vol);
      await message.reply(`\u{1F50A} Volume boosted to **${vol}%**`);
      return true;
    }
    if (commandName === "np" || commandName === "nowplaying") {
      const queue = musicManager.get(message.guild.id);
      if (!queue || !queue.currentTrack) {
        await message.reply("\u26A0\uFE0F Nothing is currently playing.");
        return true;
      }
      const track = queue.currentTrack;
      const bar = queue.getProgressBar(18);
      const embed = new import_discord32.EmbedBuilder().setColor(5763719).setTitle("\u{1F3B6} Now Playing").setDescription(`[**${track.title}**](${track.url})

${bar}`).addFields(
        { name: "Channel", value: track.channel, inline: true },
        { name: "Requested By", value: `<@${track.requestedBy.id}>`, inline: true },
        { name: "Settings", value: `\u{1F50A} Volume: **${queue.volume}%** \u2022 Loop: **${queue.loopMode}**`, inline: true }
      ).setThumbnail(track.thumbnail || null);
      await message.reply({
        embeds: [embed],
        components: MusicButtons.createRows(queue)
      });
      return true;
    }
    if (commandName === "queue" || commandName === "q") {
      const queue = musicManager.get(message.guild.id);
      if (!queue || !queue.currentTrack && queue.tracks.length === 0) {
        await message.reply("\u{1F3B5} Queue is empty.");
        return true;
      }
      const page = parseInt(args[0] || "1", 10) || 1;
      const itemsPerPage = 10;
      const totalPages = Math.max(Math.ceil(queue.tracks.length / itemsPerPage), 1);
      const startIdx = (page - 1) * itemsPerPage;
      const currentTracks = queue.tracks.slice(startIdx, startIdx + itemsPerPage);
      const list = currentTracks.map((t, i) => `**${startIdx + i + 1}.** [${t.title}](${t.url}) \`[${t.duration}]\``).join("\n") || "*No more upcoming songs.*";
      const embed = new import_discord32.EmbedBuilder().setColor(5793266).setTitle(`\u{1F3B5} Music Queue (Page ${page}/${totalPages})`).setDescription(`**Now Playing:** [${queue.currentTrack?.title}](${queue.currentTrack?.url})

**Upcoming:**
${list}`).setFooter({ text: `Total Songs: ${queue.tracks.length} \u2022 Volume: ${queue.volume}%` });
      await message.reply({
        embeds: [embed],
        components: MusicButtons.createRows(queue)
      });
      return true;
    }
    if (commandName === "loop") {
      const queue = musicManager.get(message.guild.id);
      if (!queue || !queue.currentTrack) {
        await message.reply("\u26A0\uFE0F No active music stream.");
        return true;
      }
      const mode = (args[0] || "").toUpperCase();
      if (mode === "TRACK" || mode === "SONG") {
        queue.setLoop("TRACK" /* TRACK */);
        await message.reply("\u{1F501} Looping current track.");
      } else if (mode === "QUEUE" || mode === "ALL") {
        queue.setLoop("QUEUE" /* QUEUE */);
        await message.reply("\u{1F501} Looping entire queue.");
      } else {
        queue.setLoop("OFF" /* OFF */);
        await message.reply("\u27A1\uFE0F Loop disabled.");
      }
      return true;
    }
    if (commandName === "shuffle") {
      const queue = musicManager.get(message.guild.id);
      if (!queue || queue.tracks.length < 2) {
        await message.reply("\u26A0\uFE0F Need at least 2 songs in the queue to shuffle.");
        return true;
      }
      queue.shuffle();
      await message.reply(`\u{1F500} Shuffled **${queue.tracks.length}** songs in the queue.`);
      return true;
    }
    if (commandName === "leave" || commandName === "dc") {
      const queue = musicManager.get(message.guild.id);
      if (!queue) {
        await message.reply("\u26A0\uFE0F Not connected to any voice channel.");
        return true;
      }
      queue.stop();
      await message.reply("\u{1F44B} Left voice channel.");
      return true;
    }
    if (commandName === "bass" || commandName === "bassboost") {
      const queue = musicManager.get(message.guild.id);
      if (!queue) {
        await message.reply("\u26A0\uFE0F No active music stream.");
        return true;
      }
      const opt = (args[0] || "").toLowerCase();
      if (opt === "off" || opt === "disable") {
        queue.setPreset("FLAT" /* FLAT */);
        await message.reply("\u{1F3A7} **Bass boost disabled** (Flat / Neutral EQ).");
      } else if (opt === "heavy" || opt === "high" || opt === "max") {
        queue.setPreset("HEAVY_BASS" /* HEAVY_BASS */);
        await message.reply("\u{1F50A} **Heavy Sub-Bass Boost ACTIVE** (+10dB Deep Bass).");
      } else {
        queue.setPreset("BALANCED_VOCAL_BASS" /* BALANCED_VOCAL_BASS */);
        await message.reply("\u{1F525} **Matching Punchy Bass & Vocal Boost ACTIVE** (+6dB Bass / +4dB Vocals with zero buffer).");
      }
      return true;
    }
    if (commandName === "vocal" || commandName === "vocalboost") {
      const queue = musicManager.get(message.guild.id);
      if (!queue) {
        await message.reply("\u26A0\uFE0F No active music stream.");
        return true;
      }
      queue.setPreset("VOCAL_FOCUS" /* VOCAL_FOCUS */);
      await message.reply("\u{1F3A4} **Vocal Focus ACTIVE** (Clear, elevated vocals with matching bass).");
      return true;
    }
    if (commandName === "prefix" || commandName === "setprefix" || commandName === "serverprefix") {
      if (!args[0] || args[0].toLowerCase() === "show") {
        await message.reply(
          `\u2139\uFE0F Current server prefix for **${message.guild.name}** is: \`${prefix}\`

\u2022 Change prefix for this server: \`${prefix}prefix <new_prefix>\` or \`${prefix}setprefix <new_prefix>\`
\u2022 Reset to default: \`${prefix}prefix reset\`
*(This only changes the prefix for this server. The main global prefix is not affected.)*`
        );
        return true;
      }
      if (!member?.permissions.has(import_discord32.PermissionsBitField.Flags.ManageGuild) && message.author.id !== config.ownerId) {
        await message.reply("\u274C You need the **Manage Server** permission to change the server prefix.");
        return true;
      }
      const input = args[0].trim();
      if (input.toLowerCase() === "reset" || input.toLowerCase() === "default") {
        GuildRepo.update(message.guild.id, { prefix: "!" });
        await message.reply(
          `\u2705 **Server prefix reset to default \`!\` for ${message.guild.name}!**
You can now run commands like: \`!play\`, \`!volume 150\`, \`!help\``
        );
        return true;
      }
      if (input.length > 5 || input.includes(" ")) {
        await message.reply("\u274C Prefix must be between 1 and 5 characters without spaces (e.g. `?`, `.`, `$`, `m!`, `b!`).");
        return true;
      }
      GuildRepo.update(message.guild.id, { prefix: input });
      await message.reply(
        `\u2705 **Server prefix updated to \`${input}\` for ${message.guild.name}!**
This custom prefix only applies to this server.
You can now run commands like: \`${input}play\`, \`${input}volume 150\`, \`${input}help\``
      );
      return true;
    }
    if (commandName === "serveravatar" || commandName === "setavatar" || commandName === "botavatar") {
      if (!member?.permissions.has(import_discord32.PermissionsBitField.Flags.ManageGuild) && message.author.id !== config.ownerId) {
        await message.reply("\u274C You need the **Manage Server** permission to change the bot's server avatar.");
        return true;
      }
      const isReset = args[0]?.toLowerCase() === "reset" || args[0]?.toLowerCase() === "clear";
      const attachmentUrl = message.attachments.first()?.url;
      const imageUrl = attachmentUrl || args[0] || null;
      if (!isReset && !imageUrl) {
        await message.reply({
          content: `\u26A0\uFE0F Usage:
\u2022 \`${prefix}${commandName} <image_url>\`
\u2022 Upload an image with \`${prefix}${commandName}\`
\u2022 \`${prefix}${commandName} reset\` to restore the default bot avatar`
        });
        return true;
      }
      const pending = await message.reply("\u23F3 Updating server avatar...");
      const result = await updateServerAvatar(message.guild, isReset ? null : imageUrl, isReset);
      if (result.success) {
        const embed = new import_discord32.EmbedBuilder().setColor(5763719).setTitle("\u{1F5BC}\uFE0F Server Avatar Updated").setDescription(result.message || "Server avatar changed!").setFooter({ text: "Server Profile \u2022 Main bot avatar remains unchanged" }).setTimestamp();
        if (result.avatarUrl) embed.setThumbnail(result.avatarUrl);
        await pending.edit({ content: null, embeds: [embed] });
      } else {
        await pending.edit({ content: `\u274C Error: ${result.message || "Failed to update server avatar."}` });
      }
      return true;
    }
    if (commandName === "serverbanner" || commandName === "setbanner" || commandName === "botbanner") {
      if (!member?.permissions.has(import_discord32.PermissionsBitField.Flags.ManageGuild) && message.author.id !== config.ownerId) {
        await message.reply("\u274C You need the **Manage Server** permission to change the bot's server banner.");
        return true;
      }
      const isReset = args[0]?.toLowerCase() === "reset" || args[0]?.toLowerCase() === "clear";
      const attachmentUrl = message.attachments.first()?.url;
      const imageUrl = attachmentUrl || args[0] || null;
      if (!isReset && !imageUrl) {
        await message.reply({
          content: `\u26A0\uFE0F Usage:
\u2022 \`${prefix}${commandName} <banner_url>\`
\u2022 Upload a banner with \`${prefix}${commandName}\`
\u2022 \`${prefix}${commandName} reset\` to restore the default banner`
        });
        return true;
      }
      const pending = await message.reply("\u23F3 Updating server banner...");
      const result = await updateServerBanner(message.guild, isReset ? null : imageUrl, isReset);
      if (result.success) {
        const embed = new import_discord32.EmbedBuilder().setColor(5763719).setTitle("\u{1F3A8} Server Banner Updated").setDescription(result.message || "Server banner changed!").setFooter({ text: "Server Profile \u2022 Main bot banner remains unchanged" }).setTimestamp();
        if (imageUrl && !isReset) embed.setImage(imageUrl);
        await pending.edit({ content: null, embeds: [embed] });
      } else {
        await pending.edit({ content: `\u274C Error: ${result.message || "Failed to update server banner."}` });
      }
      return true;
    }
    if (commandName === "guildicon" || commandName === "servericon" || commandName === "seticon") {
      if (!member?.permissions.has(import_discord32.PermissionsBitField.Flags.ManageGuild) && message.author.id !== config.ownerId) {
        await message.reply("\u274C You need the **Manage Server** permission to change the server icon.");
        return true;
      }
      const isReset = args[0]?.toLowerCase() === "reset" || args[0]?.toLowerCase() === "clear";
      const attachmentUrl = message.attachments.first()?.url;
      const imageUrl = attachmentUrl || args[0] || null;
      if (!isReset && !imageUrl) {
        await message.reply({
          content: `\u26A0\uFE0F Usage:
\u2022 \`${prefix}${commandName} <icon_url>\`
\u2022 Upload an image with \`${prefix}${commandName}\`
\u2022 \`${prefix}${commandName} reset\` to remove the server icon`
        });
        return true;
      }
      const pending = await message.reply("\u23F3 Updating server icon...");
      const result = await updateGuildIcon(message.guild, isReset ? null : imageUrl, isReset);
      if (result.success) {
        const embed = new import_discord32.EmbedBuilder().setColor(5763719).setTitle("\u{1F3F0} Server Icon Updated").setDescription(result.message || "Server icon updated!").setTimestamp();
        if (result.iconUrl) embed.setThumbnail(result.iconUrl);
        await pending.edit({ content: null, embeds: [embed] });
      } else {
        await pending.edit({ content: `\u274C Error: ${result.message || "Failed to update server icon."}` });
      }
      return true;
    }
    if (commandName === "guildbanner" || commandName === "setguildbanner") {
      if (!member?.permissions.has(import_discord32.PermissionsBitField.Flags.ManageGuild) && message.author.id !== config.ownerId) {
        await message.reply("\u274C You need the **Manage Server** permission to change the server banner.");
        return true;
      }
      const isReset = args[0]?.toLowerCase() === "reset" || args[0]?.toLowerCase() === "clear";
      const attachmentUrl = message.attachments.first()?.url;
      const imageUrl = attachmentUrl || args[0] || null;
      if (!isReset && !imageUrl) {
        await message.reply({
          content: `\u26A0\uFE0F Usage:
\u2022 \`${prefix}${commandName} <banner_url>\`
\u2022 Upload a banner image with \`${prefix}${commandName}\`
\u2022 \`${prefix}${commandName} reset\` to remove the server banner
*(Requires Server Boost Level 2. To change the bot's banner instead, use \`${prefix}botbanner\`)*`
        });
        return true;
      }
      const pending = await message.reply("\u23F3 Updating server banner...");
      const result = await updateGuildBanner(message.guild, isReset ? null : imageUrl, isReset);
      if (result.success) {
        const embed = new import_discord32.EmbedBuilder().setColor(5763719).setTitle("\u{1F6A9} Server Banner Updated").setDescription(result.message || "Server banner updated!").setTimestamp();
        if (imageUrl && !isReset) embed.setImage(imageUrl);
        await pending.edit({ content: null, embeds: [embed] });
      } else {
        await pending.edit({ content: `\u274C Error: ${result.message || "Failed to update server banner."}` });
      }
      return true;
    }
    if (commandName === "status" || commandName === "setstatus") {
      if (message.author.id !== config.ownerId) {
        await message.reply(`\u274C Only the **Bot Owner** (\`${config.ownerId}\`) can set the bot's global presence.`);
        return true;
      }
      if (!args[0]) {
        await message.reply({
          content: `\u26A0\uFE0F Usage:
\u2022 \`${prefix}status <custom_text_with_symbols>\` (e.g. \`${prefix}status \u{13288} \u26A1 \u{1D416}\u{1D400}\u{1D415}\u{1D404}\u{1D412}\u{1D413}\u{1D400}\u{1D402}\u{1D40A} \u26A1 \u{13289}\`)
\u2022 \`${prefix}status clear\` (clears status, clean online with no text)
\u2022 \`${prefix}status reset\` (resumes automatic unique symbol rotation)`
        });
        return true;
      }
      const arg0 = args[0].toLowerCase();
      if (arg0 === "clear" || arg0 === "remove") {
        clearStatus(message.client);
        await message.reply("\u{1F9F9} **Bot status cleared!** The bot is now clean **Online** with no custom text or activity.");
        return true;
      }
      if (arg0 === "reset" || arg0 === "stats") {
        startPresenceRotation(message.client);
        const guildCount = message.client.guilds.cache.size;
        const memberCount = message.client.guilds.cache.reduce((acc, g) => acc + (g.memberCount || 0), 0);
        await message.reply(
          `\u{1F4CA} **Live Server & Member Count Status Activated!**

\u2022 \`\u{13288} \u{1F3F0} ${guildCount} Servers \u25C8 \u{1F465} ${memberCount} Members \u{13289}\`
\u2022 \`Watching ${memberCount} Members across ${guildCount} Servers \u{1F3F0}\``
        );
        return true;
      }
      const statusText = args.join(" ");
      setCustomStatus(message.client, statusText);
      await message.reply(`\u2728 **Online status set to:** \`${statusText}\``);
      return true;
    }
    if (commandName === "help" || commandName === "h") {
      const embed = new import_discord32.EmbedBuilder().setColor(5793266).setTitle("\u{1F6E1}\uFE0F Aegis Command Guide").setDescription(`Current Server Prefix: \`${prefix}\` (Slash Commands \`/\` are also available!)

**\u{1F3B5} High-Quality Music (Buffering-Free & Loud):**
\u2022 \`${prefix}play <query/url>\` - Play song from YouTube, Spotify, or SoundCloud
\u2022 \`${prefix}volume <1-200>\` - Boost volume up to 200% loud audio
\u2022 \`${prefix}pause\` / \`${prefix}resume\` - Pause or resume playback
\u2022 \`${prefix}skip\` / \`${prefix}stop\` - Skip song or stop and leave
\u2022 \`${prefix}np\` - Interactive visual progress bar
\u2022 \`${prefix}queue\` / \`${prefix}shuffle\` - View or shuffle queue
\u2022 \`${prefix}loop <off|track|queue>\` - Repeat mode

**\u{1F5BC}\uFE0F Bot Server Profile (Avatar & Banner in This Server):**
\u2022 \`${prefix}botavatar <url | upload | reset>\` - Change bot's avatar in this server only
\u2022 \`${prefix}botbanner <url | upload | reset>\` - Change bot's banner in this server only

**\u{1F3F0} Discord Server Customization:**
\u2022 \`${prefix}guildicon <url | upload | reset>\` - Change the Discord server's icon
\u2022 \`${prefix}guildbanner <url | upload | reset>\` - Change the Discord server's banner

**\u2699\uFE0F Server Configuration:**
\u2022 \`${prefix}prefix <new>\` - Set your custom server prefix
\u2022 \`/security status\` - Full security defense matrix`).setFooter({ text: "Aegis Security & Music Core" });
      await message.reply({ embeds: [embed] });
      return true;
    }
    if (commandName === "ping") {
      await message.reply(`\u{1F3D3} Pong! Latency: \`${message.client.ws.ping}ms\``);
      return true;
    }
    return false;
  }
};

// src/events/messageCreate.ts
async function sendTempNotice(channel, content, delayMs = 5e3) {
  if (channel && "send" in channel) {
    const notice = await channel.send({ content }).catch(() => null);
    if (notice) {
      setTimeout(() => notice.delete().catch(() => null), delayMs);
    }
  }
}
async function handleMessageCreate(message) {
  if (!message.guild || message.author.bot) return;
  const commandHandled = await TextCommandHandler.handle(message);
  if (commandHandled) return;
  const guild = message.guild;
  const author = message.author;
  const member = message.member;
  AntiGhostPingEngine.trackMessage(message);
  if (author.id === guild.ownerId) {
    return;
  }
  const roleIds = member ? Array.from(member.roles.cache.keys()) : [];
  const secSettings = SecurityRepo.get(guild.id);
  const isFilterWhitelisted = SecurityRepo.isWhitelisted(guild.id, author.id, roleIds, message.channel.id, "anti_spam");
  if (!isFilterWhitelisted) {
    const filterRes = WordFilterEngine.scan(guild.id, message.content);
    if (filterRes.hasViolation) {
      Logger.security(
        `Filter matched "${filterRes.matchedWord}" (${filterRes.severity}) from ${author.tag} in #${message.channel.name}. Obfuscated: ${filterRes.isObfuscated}`,
        "WordFilter"
      );
      await message.delete().catch(() => null);
      if (filterRes.severity === "BAN") {
        await PunishmentService.ban(
          guild,
          author,
          1,
          `[AEGIS AUTO-BAN] Malicious domain / exploit pattern: "${filterRes.matchedWord}"`,
          guild.client.user
        );
      } else if (filterRes.severity === "MUTE" && member) {
        await PunishmentService.timeout(
          guild,
          member,
          10 * 60 * 1e3,
          `[AEGIS AUTO-MOD] Filter violation: "${filterRes.matchedWord}"`,
          guild.client.user
        );
      } else if (filterRes.severity === "WARN" && member) {
        await PunishmentService.warn(
          guild,
          member,
          `[AEGIS AUTO-MOD] Forbidden phrase: "${filterRes.matchedWord}"`,
          guild.client.user
        );
      }
      const alertEmbed = Embeds.securityAlert(
        "Word Filter / Phishing Match Blocked",
        `**Author:** ${author.tag} (\`${author.id}\`)
**Channel:** ${message.channel}
**Matched Pattern:** \`${filterRes.matchedWord}\`
**De-obfuscation Intercept:** ${filterRes.isObfuscated ? "\u26A0\uFE0F **Yes (Homoglyphs / Confusables Detected)**" : "Standard Text"}
**Action Taken:** ${filterRes.severity}

**Original Message:**
\`\`\`
${message.content.slice(0, 500)}
\`\`\``
      );
      await ModLogService.log(guild, alertEmbed);
      await sendTempNotice(
        message.channel,
        `\u26A0\uFE0F ${author}, your message violated server content safety filters and was removed.`
      );
      return;
    }
  }
  if (secSettings.anti_invite) {
    const isInviteWhitelisted = SecurityRepo.isWhitelisted(guild.id, author.id, roleIds, message.channel.id, "anti_invite");
    if (!isInviteWhitelisted) {
      const inviteRes = await AntiInviteEngine.scan(message.content, guild);
      if (inviteRes.hasInvite) {
        Logger.security(
          `Unauthorized invite intercepted from ${author.tag} in #${message.channel.name}. Obfuscated: ${inviteRes.isObfuscated}`,
          "AntiInvite"
        );
        await message.delete().catch(() => null);
        if (member) {
          await PunishmentService.timeout(
            guild,
            member,
            15 * 60 * 1e3,
            `[AEGIS ANTI-INVITE] Unauthorized Discord invite advertising (${inviteRes.matchedPattern})`,
            guild.client.user
          );
        }
        const alertEmbed = Embeds.securityAlert(
          "Unauthorized Invite Link Intercepted",
          `**Author:** ${author.tag} (\`${author.id}\`)
**Channel:** ${message.channel}
**Detected Link / Code:** \`${inviteRes.inviteCode || inviteRes.matchedPattern}\`
**Obfuscation Evade Attempt:** ${inviteRes.isObfuscated ? "\u26A0\uFE0F **Detected (Confusables/Markdown Masked)**" : "Direct Link"}
**Countermeasure:** Message Deleted & 15m Timeout Applied`
        );
        await ModLogService.log(guild, alertEmbed);
        await sendTempNotice(
          message.channel,
          `\u{1F6AB} ${author}, Discord invite links are strictly prohibited in this server.`
        );
        return;
      }
    }
  }
  if (secSettings.anti_spam) {
    const isSpamWhitelisted = SecurityRepo.isWhitelisted(guild.id, author.id, roleIds, message.channel.id, "anti_spam");
    if (!isSpamWhitelisted) {
      const spamRes = AntiSpamEngine.checkMessage(message, {
        maxMessagesPer5s: secSettings.max_messages_per_5s,
        maxDuplicateSimilarity: secSettings.max_duplicate_threshold,
        maxMentions: secSettings.max_mentions,
        maxEmojis: secSettings.max_emojis
      });
      if (spamRes.isSpam) {
        Logger.security(`Spam incident (${spamRes.type}) from ${author.tag}: ${spamRes.details}`, "AntiSpam");
        await message.delete().catch(() => null);
        if (member && spamRes.suggestedTimeoutMs) {
          await PunishmentService.timeout(
            guild,
            member,
            spamRes.suggestedTimeoutMs,
            `[AEGIS ANTI-SPAM] ${spamRes.details}`,
            guild.client.user
          );
        }
        const alertEmbed = Embeds.securityAlert(
          "Spam Flood Neutralized",
          `**Author:** ${author.tag} (\`${author.id}\`)
**Channel:** ${message.channel}
**Spam Vector:** \`${spamRes.type}\`
**Details:** ${spamRes.details}
**Countermeasure:** Message Deleted & Timeout Applied`
        );
        await ModLogService.log(guild, alertEmbed);
        await sendTempNotice(
          message.channel,
          `\u26A0\uFE0F ${author}, slow down! Spamming is not permitted.`,
          4e3
        );
      }
    }
  }
}

// src/events/messageDelete.ts
var import_discord33 = require("discord.js");
async function handleMessageDelete(message) {
  if (!message.guild) return;
  const guild = message.guild;
  const ghostPing = AntiGhostPingEngine.checkDelete(message.id);
  const secSettings = SecurityRepo.get(guild.id);
  if (ghostPing && secSettings.anti_ghostping) {
    Logger.security(`Ghost ping detected in #${message.channel.id} by ${ghostPing.authorTag}`, "GhostPing");
    const mentionedStr = [
      ...ghostPing.mentionedUsers.map((u) => `<@${u.id}>`),
      ...ghostPing.mentionedRoles.map((r) => `<@&${r.id}>`),
      ghostPing.hasEveryone ? "@everyone/@here" : null
    ].filter(Boolean).join(", ");
    const ghostEmbed = new import_discord33.EmbedBuilder().setColor(15548997).setTitle("\u{1F47B} Ghost Ping Detected!").setDescription(
      `A message containing mentions was promptly deleted.

\u2022 **Sender:** <@${ghostPing.authorId}> (\`${ghostPing.authorTag}\`)
\u2022 **Channel:** <#${ghostPing.channelId}>
\u2022 **Pinged:** ${mentionedStr || "None"}

**Original Message Content:**
\`\`\`
${ghostPing.content.slice(0, 500) || "[No text content]"}
\`\`\``
    ).setFooter({ text: "Aegis Anti-GhostPing Watchdog" }).setTimestamp();
    await ModLogService.log(guild, ghostEmbed);
    return;
  }
  if (message.author && !message.author.bot) {
    await ModLogService.logMessageDelete(
      guild,
      message.author,
      message.channel.id,
      message.content || ""
    );
  }
}

// src/events/messageUpdate.ts
var import_discord34 = require("discord.js");
async function handleMessageUpdate(oldMsg, newMsg) {
  if (!newMsg.guild || !newMsg.author || newMsg.author.bot) return;
  const guild = newMsg.guild;
  const author = newMsg.author;
  const member = newMsg.member;
  const oldContent = oldMsg.content || "";
  const newContent = newMsg.content || "";
  if (oldContent === newContent) return;
  const secSettings = SecurityRepo.get(guild.id);
  const roleIds = member ? Array.from(member.roles.cache.keys()) : [];
  if (oldMsg instanceof import_discord34.Message && newMsg instanceof import_discord34.Message && secSettings.anti_ghostping) {
    const ghostPing = AntiGhostPingEngine.checkEdit(oldMsg, newMsg);
    if (ghostPing) {
      const pingedStr = ghostPing.mentionedUsers.map((u) => `<@${u.id}>`).join(", ");
      const ghostEmbed = new import_discord34.EmbedBuilder().setColor(15548997).setTitle("\u{1F47B} Ghost Ping Detected (Message Edit)").setDescription(
        `A message was edited to silently remove mentions.

\u2022 **Sender:** <@${ghostPing.authorId}> (\`${ghostPing.authorTag}\`)
\u2022 **Channel:** <#${ghostPing.channelId}>
\u2022 **Removed Mentions:** ${pingedStr}

**Original Message:**
\`\`\`
${ghostPing.content.slice(0, 500)}
\`\`\``
      ).setFooter({ text: "Aegis Anti-GhostPing Watchdog" }).setTimestamp();
      await ModLogService.log(guild, ghostEmbed);
    }
  }
  const isFilterWhitelisted = SecurityRepo.isWhitelisted(guild.id, author.id, roleIds, newMsg.channel.id, "anti_spam");
  if (!isFilterWhitelisted) {
    const filterRes = WordFilterEngine.scan(guild.id, newContent);
    if (filterRes.hasViolation) {
      Logger.security(
        `Filter matched on message edit: "${filterRes.matchedWord}" by ${author.tag} in #${newMsg.channel.name}`,
        "WordFilter"
      );
      await newMsg.delete().catch(() => null);
      if (member) {
        await PunishmentService.timeout(
          guild,
          member,
          10 * 60 * 1e3,
          `[AEGIS AUTO-MOD] Filter violation on edit: "${filterRes.matchedWord}"`,
          guild.client.user
        );
      }
      const alertEmbed = Embeds.securityAlert(
        "Stealth Edit Filter Violation Blocked",
        `**Author:** ${author.tag} (\`${author.id}\`)
**Channel:** ${newMsg.channel}
**Matched Pattern:** \`${filterRes.matchedWord}\`
**Edited Content:**
\`\`\`
${newContent.slice(0, 500)}
\`\`\``
      );
      await ModLogService.log(guild, alertEmbed);
      return;
    }
  }
  if (secSettings.anti_invite) {
    const isInviteWhitelisted = SecurityRepo.isWhitelisted(guild.id, author.id, roleIds, newMsg.channel.id, "anti_invite");
    if (!isInviteWhitelisted) {
      const inviteRes = await AntiInviteEngine.scan(newContent, guild);
      if (inviteRes.hasInvite) {
        Logger.security(`Invite stealth-injected via edit from ${author.tag}`, "AntiInvite");
        await newMsg.delete().catch(() => null);
        if (member) {
          await PunishmentService.timeout(
            guild,
            member,
            15 * 60 * 1e3,
            `[AEGIS ANTI-INVITE] Injected invite on edit (${inviteRes.matchedPattern})`,
            guild.client.user
          );
        }
        const alertEmbed = Embeds.securityAlert(
          "Stealth Invite Edit Intercepted",
          `**Author:** ${author.tag} (\`${author.id}\`)
**Channel:** ${newMsg.channel}
**Detected Link / Code:** \`${inviteRes.inviteCode || inviteRes.matchedPattern}\`
**Countermeasure:** Message Deleted & Timeout Applied`
        );
        await ModLogService.log(guild, alertEmbed);
        return;
      }
    }
  }
  await ModLogService.logMessageEdit(
    guild,
    author,
    newMsg.channel.id,
    oldContent,
    newContent,
    newMsg.url
  );
}

// src/events/guildMemberAdd.ts
var import_discord35 = require("discord.js");

// src/security/AntiRaid.ts
var AntiRaidEngine = class {
  // guildId -> timestamps of recent joins
  static recentJoins = /* @__PURE__ */ new Map();
  // guildId -> active raid mode boolean
  static activeRaids = /* @__PURE__ */ new Map();
  /**
   * Evaluates a member join against raid thresholds and account age limits.
   */
  static async handleMemberJoin(member) {
    const guild = member.guild;
    const secSettings = SecurityRepo.get(guild.id);
    if (!secSettings.anti_raid) {
      return { isRaid: false, isYoungAccount: false };
    }
    const now = Date.now();
    let joins = this.recentJoins.get(guild.id) || [];
    joins.push(now);
    const windowMs = secSettings.anti_raid_window_sec * 1e3;
    joins = joins.filter((t) => now - t <= windowMs);
    this.recentJoins.set(guild.id, joins);
    const accountAgeHours = (now - member.user.createdTimestamp) / (1e3 * 60 * 60);
    const isYoungAccount = accountAgeHours < secSettings.min_account_age_hours;
    const isRaid = joins.length >= secSettings.anti_raid_joins;
    if (isRaid && !this.activeRaids.get(guild.id)) {
      this.activeRaids.set(guild.id, true);
      Logger.security(`\u{1F6A8} RAID DETECTED in guild ${guild.name}! ${joins.length} joins in ${secSettings.anti_raid_window_sec}s`, "AntiRaid");
      await this.dispatchRaidAlert(guild, joins.length, secSettings.anti_raid_window_sec);
      setTimeout(() => {
        this.activeRaids.set(guild.id, false);
      }, 2 * 60 * 1e3);
    }
    let actionTaken;
    if (isRaid || isYoungAccount && this.activeRaids.get(guild.id)) {
      const guildSettings = GuildRepo.get(guild.id);
      if (guildSettings.unverified_role_id) {
        try {
          await member.roles.add(guildSettings.unverified_role_id, "Aegis Anti-Raid Quarantine");
          actionTaken = "Assigned Quarantine Role";
        } catch {
        }
      }
    }
    return {
      isRaid,
      isYoungAccount,
      actionTaken
    };
  }
  static async dispatchRaidAlert(guild, joinCount, windowSec) {
    const guildSettings = GuildRepo.get(guild.id);
    const alertChannelId = guildSettings.alert_channel_id || guildSettings.mod_log_channel_id;
    const alertEmbed = Embeds.securityAlert(
      "Active Server Raid Detected!",
      `**Aegis Anti-Raid Defense** has triggered lockdown protocols. High-frequency member joins detected.`,
      [
        { name: "Join Velocity", value: `**${joinCount}** joins in ${windowSec} seconds`, inline: true },
        { name: "Defensive Action", value: "Quarantine & Verification Gate Active", inline: true },
        { name: "Recommendation", value: "Use `/lock` or monitor incoming accounts in mod-logs.", inline: false }
      ]
    );
    if (alertChannelId) {
      const channel = guild.channels.cache.get(alertChannelId);
      if (channel && channel.isTextBased()) {
        await channel.send({ content: "@here \u{1F6A8} **Raid Detected**", embeds: [alertEmbed] }).catch(() => null);
      }
    }
  }
  static isRaidActive(guildId) {
    return this.activeRaids.get(guildId) || false;
  }
};

// src/events/guildMemberAdd.ts
async function handleGuildMemberAdd(member) {
  const guild = member.guild;
  const settings = GuildRepo.get(guild.id);
  const raidRes = await AntiRaidEngine.handleMemberJoin(member);
  if (raidRes.isRaid) {
    Logger.security(`Raid join logged: ${member.user.tag} (${member.id})`, "AntiRaid");
  }
  if (settings.autorole_id && !raidRes.actionTaken) {
    try {
      await member.roles.add(settings.autorole_id, "Aegis Auto-Role on join");
    } catch (err) {
      Logger.error(`Failed to assign auto-role ${settings.autorole_id} to ${member.id}`, err, "AutoRole");
    }
  }
  if (settings.welcome_channel_id) {
    try {
      const channel = guild.channels.cache.get(settings.welcome_channel_id);
      if (channel && channel.isTextBased()) {
        const rawTemplate = settings.welcome_message || "Welcome {user} to **{guild}**! We are glad to have you here. You are member #{memberCount}.";
        const formatted = rawTemplate.replace(/{user}/g, `<@${member.id}>`).replace(/{username}/g, member.user.username).replace(/{guild}/g, guild.name).replace(/{memberCount}/g, guild.memberCount.toString());
        const welcomeEmbed = new import_discord35.EmbedBuilder().setColor(5763719).setTitle(`\u{1F44B} Welcome to ${guild.name}!`).setDescription(formatted).setThumbnail(member.user.displayAvatarURL({ size: 256 })).setFooter({ text: `Member #${guild.memberCount}` }).setTimestamp();
        await channel.send({ embeds: [welcomeEmbed] });
      }
    } catch (err) {
      Logger.error("Failed to send welcome message", err, "Welcome");
    }
  }
  const logEmbed = new import_discord35.EmbedBuilder().setColor(5763719).setTitle("\u{1F4E5} Member Joined").setThumbnail(member.user.displayAvatarURL()).addFields(
    { name: "User", value: `${member.user.tag} (\`${member.id}\`)`, inline: true },
    { name: "Account Age", value: `<t:${Math.floor(member.user.createdTimestamp / 1e3)}:R>`, inline: true },
    { name: "Total Members", value: `${guild.memberCount}`, inline: true }
  ).setTimestamp();
  if (raidRes.isYoungAccount) {
    logEmbed.addFields({ name: "\u26A0\uFE0F Security Notice", value: "New Account (< 24h old)" });
  }
  await ModLogService.log(guild, logEmbed);
}

// src/events/guildMemberRemove.ts
var import_discord36 = require("discord.js");
async function handleGuildMemberRemove(member) {
  const guild = member.guild;
  const settings = GuildRepo.get(guild.id);
  if (settings.leave_channel_id) {
    try {
      const channel = guild.channels.cache.get(settings.leave_channel_id);
      if (channel && channel.isTextBased()) {
        const rawTemplate = settings.leave_message || "Goodbye **{username}**. We are now down to {memberCount} members.";
        const formatted = rawTemplate.replace(/{user}/g, member.user?.tag || "A member").replace(/{username}/g, member.user?.username || "Unknown").replace(/{guild}/g, guild.name).replace(/{memberCount}/g, guild.memberCount.toString());
        await channel.send(formatted);
      }
    } catch (err) {
      Logger.error("Failed to send leave announcement", err, "Leave");
    }
  }
  const logEmbed = new import_discord36.EmbedBuilder().setColor(15548997).setTitle("\u{1F4E4} Member Left / Kicked").addFields(
    { name: "User", value: member.user ? `${member.user.tag} (\`${member.id}\`)` : `\`${member.id}\``, inline: true },
    { name: "Remaining Members", value: `${guild.memberCount}`, inline: true }
  ).setTimestamp();
  await ModLogService.log(guild, logEmbed);
}

// src/security/AntiNuke.ts
var import_discord37 = require("discord.js");
var AntiNukeEngine = class _AntiNukeEngine {
  // guildId:actorId -> ActionRecord
  static actorHistories = /* @__PURE__ */ new Map();
  static {
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of _AntiNukeEngine.actorHistories.entries()) {
        const last = record.timestamps[record.timestamps.length - 1] || 0;
        if (now - last > 6e4) {
          _AntiNukeEngine.actorHistories.delete(key);
        }
      }
    }, 6e4);
  }
  /**
   * Evaluates an audit log action against rate limits and unauthorized escalations.
   */
  static async handleAuditLogEntry(entry, guild) {
    const { executor, action, target } = entry;
    if (!executor || executor.bot && executor.id === guild.client.user.id) {
      return;
    }
    if (executor.id === guild.ownerId) {
      return;
    }
    const secSettings = SecurityRepo.get(guild.id);
    if (!secSettings.anti_nuke) {
      return;
    }
    const isWhitelisted = SecurityRepo.isWhitelisted(guild.id, executor.id, [], void 0, "anti_nuke");
    if (isWhitelisted) {
      return;
    }
    const destructiveActions = [
      import_discord37.AuditLogEvent.ChannelDelete,
      import_discord37.AuditLogEvent.ChannelCreate,
      import_discord37.AuditLogEvent.RoleDelete,
      import_discord37.AuditLogEvent.RoleCreate,
      import_discord37.AuditLogEvent.MemberBanAdd,
      import_discord37.AuditLogEvent.MemberKick,
      import_discord37.AuditLogEvent.WebhookCreate,
      import_discord37.AuditLogEvent.WebhookDelete,
      import_discord37.AuditLogEvent.GuildUpdate
    ];
    if (!destructiveActions.includes(action)) {
      return;
    }
    const now = Date.now();
    const key = `${guild.id}:${executor.id}`;
    let record = this.actorHistories.get(key);
    if (!record) {
      record = { timestamps: [], actionType: import_discord37.AuditLogEvent[action] };
      this.actorHistories.set(key, record);
    }
    record.timestamps.push(now);
    const windowMs = secSettings.anti_nuke_window_sec * 1e3;
    record.timestamps = record.timestamps.filter((t) => now - t <= windowMs);
    const actorTag = executor.tag || executor.username || "Unknown Actor";
    Logger.security(
      `Audit action detected: ${import_discord37.AuditLogEvent[action]} by ${actorTag} (${executor.id}) in guild ${guild.name} [Count: ${record.timestamps.length}/${secSettings.anti_nuke_action_limit}]`,
      "AntiNuke"
    );
    if (record.timestamps.length >= secSettings.anti_nuke_action_limit) {
      await this.neutralizeRogueActor(
        guild,
        executor.id,
        actorTag,
        `Exceeded Anti-Nuke limit: performed ${record.timestamps.length} ${import_discord37.AuditLogEvent[action]} actions in ${secSettings.anti_nuke_window_sec}s`
      );
      record.timestamps = [];
    }
  }
  /**
   * Neutralizes a rogue administrator or compromised bot by stripping dangerous roles and banning/quarantining.
   */
  static async neutralizeRogueActor(guild, actorId, actorTag, reason) {
    Logger.security(`\u{1F6A8} TRIGGERED EMERGENCY NEUTRALIZATION ON ${actorTag} (${actorId}) in ${guild.name}! Reason: ${reason}`, "AntiNuke");
    let member = null;
    try {
      member = await guild.members.fetch(actorId).catch(() => null);
    } catch {
    }
    let rolesStripped = false;
    let banned = false;
    if (member) {
      const dangerousPerms = [
        import_discord37.PermissionsBitField.Flags.Administrator,
        import_discord37.PermissionsBitField.Flags.ManageGuild,
        import_discord37.PermissionsBitField.Flags.BanMembers,
        import_discord37.PermissionsBitField.Flags.KickMembers,
        import_discord37.PermissionsBitField.Flags.ManageChannels,
        import_discord37.PermissionsBitField.Flags.ManageRoles,
        import_discord37.PermissionsBitField.Flags.ManageWebhooks
      ];
      const rolesToRemove = member.roles.cache.filter((role) => {
        if (role.id === guild.id) return false;
        return dangerousPerms.some((perm) => role.permissions.has(perm));
      });
      if (rolesToRemove.size > 0 && guild.members.me?.permissions.has(import_discord37.PermissionsBitField.Flags.ManageRoles)) {
        try {
          await member.roles.remove(rolesToRemove, `[AEGIS ANTI-NUKE] ${reason}`);
          rolesStripped = true;
        } catch (err) {
          Logger.error("Failed to strip roles from rogue actor", err, "AntiNuke");
        }
      }
      if (guild.members.me?.permissions.has(import_discord37.PermissionsBitField.Flags.BanMembers) && member.bannable) {
        try {
          await member.ban({ reason: `[AEGIS ANTI-NUKE EMERGENCY BAN] ${reason}` });
          banned = true;
        } catch (err) {
          Logger.error("Failed to auto-ban rogue actor", err, "AntiNuke");
        }
      }
    } else {
      try {
        await guild.bans.create(actorId, { reason: `[AEGIS ANTI-NUKE EMERGENCY BAN] ${reason}` });
        banned = true;
      } catch {
      }
    }
    const guildSettings = GuildRepo.get(guild.id);
    const alertChannelId = guildSettings.alert_channel_id || guildSettings.mod_log_channel_id;
    const alertEmbed = Embeds.securityAlert(
      "Server Nuke / Raid Attempt Thwarted",
      `**Aegis Defense Shield** intercepted a destructive action burst. Immediate protective countermeasures were executed.`,
      [
        { name: "Rogue Actor", value: `${actorTag} (\`${actorId}\`)`, inline: true },
        { name: "Status", value: banned ? "\u{1F528} Auto-Banned" : rolesStripped ? "\u{1F6E1}\uFE0F Stripped of Permissions" : "\u26A0\uFE0F Alert Raised", inline: true },
        { name: "Violation Details", value: reason }
      ]
    );
    if (alertChannelId) {
      const channel = guild.channels.cache.get(alertChannelId);
      if (channel && channel.isTextBased()) {
        await channel.send({ embeds: [alertEmbed] }).catch(() => null);
      }
    }
    try {
      const owner = await guild.fetchOwner();
      if (owner) {
        await owner.send({
          content: `\u26A0\uFE0F **CRITICAL SECURITY ALERT FOR ${guild.name}**`,
          embeds: [alertEmbed]
        }).catch(() => null);
      }
    } catch {
    }
  }
};

// src/events/guildAuditLogEntryCreate.ts
async function handleGuildAuditLogEntryCreate(entry, guild) {
  try {
    await AntiNukeEngine.handleAuditLogEntry(entry, guild);
  } catch (err) {
    Logger.error("Error in anti-nuke audit log inspection", err, "AntiNuke");
  }
}

// src/index.ts
validateConfig();
var client = new import_discord38.Client({
  intents: [
    import_discord38.GatewayIntentBits.Guilds,
    import_discord38.GatewayIntentBits.GuildMembers,
    import_discord38.GatewayIntentBits.GuildMessages,
    import_discord38.GatewayIntentBits.MessageContent,
    import_discord38.GatewayIntentBits.GuildModeration,
    import_discord38.GatewayIntentBits.GuildMessageReactions,
    import_discord38.GatewayIntentBits.DirectMessages,
    import_discord38.GatewayIntentBits.GuildVoiceStates
  ],
  partials: [
    import_discord38.Partials.Message,
    import_discord38.Partials.Channel,
    import_discord38.Partials.GuildMember,
    import_discord38.Partials.User
  ]
});
var healthServer;
if (process.env.PORT) {
  const port = Number(process.env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT value: ${process.env.PORT}`);
  }
  healthServer = (0, import_node_http.createServer)((request, response) => {
    if (request.url === "/" || request.url === "/health") {
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("OK");
      return;
    }
    response.writeHead(404);
    response.end("Not Found");
  });
  healthServer.on("error", (error) => {
    Logger.error("Health check server failed to bind", error, "HTTP");
    process.exitCode = 1;
    client.destroy();
  });
  healthServer.listen(port, "0.0.0.0", () => {
    Logger.info(`Health check server listening on port ${port}`, "HTTP");
  });
}
client.once("clientReady", () => handleReady(client));
client.on("interactionCreate", (interaction) => handleInteractionCreate(interaction));
client.on("messageCreate", (message) => handleMessageCreate(message));
client.on("messageDelete", (message) => handleMessageDelete(message));
client.on("messageUpdate", (oldMsg, newMsg) => handleMessageUpdate(oldMsg, newMsg));
client.on("guildMemberAdd", (member) => handleGuildMemberAdd(member));
client.on("guildMemberRemove", (member) => handleGuildMemberRemove(member));
client.on("guildAuditLogEntryCreate", (entry, guild) => handleGuildAuditLogEntryCreate(entry, guild));
client.on("voiceStateUpdate", (oldState, newState) => musicManager.handleVoiceStateUpdate(oldState, newState));
process.on("unhandledRejection", (reason, promise) => {
  Logger.error("Unhandled Promise Rejection caught", reason, "Process");
});
process.on("uncaughtException", (error) => {
  Logger.error("Uncaught Exception caught", error, "Process");
});
var shutdown = () => {
  Logger.info("Initiating graceful shutdown...", "System");
  healthServer?.close();
  client.destroy();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
if (config.token) {
  client.login(config.token).catch((err) => {
    Logger.error("Failed to authenticate with Discord API", err, "ClientLogin");
  });
} else {
  Logger.warn('No DISCORD_TOKEN provided. Place your bot token in .env and run "npm start".', "System");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  client
});
