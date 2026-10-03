// Bot Discord -> Firebase Realtime Database
// Menyalin pesan baru dari 1 channel ke node "discordChat" agar tampil di website.
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const admin = require("firebase-admin");

const { DISCORD_TOKEN, CHANNEL_ID, FIREBASE_DB_URL } = process.env;
if (!DISCORD_TOKEN || !CHANNEL_ID || !FIREBASE_DB_URL) {
  console.error("Isi DISCORD_TOKEN, CHANNEL_ID, FIREBASE_DB_URL di file .env");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
  databaseURL: FIREBASE_DB_URL
});
const chatRef = admin.database().ref("discordChat");
const MAX_KEEP = 50;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent   // aktifkan juga di Developer Portal > Bot
  ]
});

client.once("ready", () => console.log(`Bot online sebagai ${client.user.tag}`));

client.on("messageCreate", async (m) => {
  if (m.channelId !== CHANNEL_ID || m.author.bot) return;
  const text = (m.cleanContent || (m.attachments.size ? "[lampiran]" : "")).slice(0, 300);
  if (!text) return;

  await chatRef.push({
    name: (m.member?.displayName || m.author.username).slice(0, 32),
    avatar: m.author.displayAvatarURL({ extension: "png", size: 64 }),
    text,
    timestamp: Date.now()
  });

  // simpan hanya MAX_KEEP pesan terakhir
  const snap = await chatRef.orderByChild("timestamp").once("value");
  const keys = [];
  snap.forEach(c => { keys.push(c.key); });
  const extra = keys.slice(0, Math.max(0, keys.length - MAX_KEEP));
  await Promise.all(extra.map(k => chatRef.child(k).remove()));
});

client.login(DISCORD_TOKEN);
