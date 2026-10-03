// Mengambil jumlah pemain online + rating map dari API Roblox (di server GitHub),
// lalu menulisnya ke Firebase Realtime Database (node "stats").
// Dijalankan otomatis oleh .github/workflows/update-stats.yml
const admin = require("firebase-admin");

const PLACE_ID = process.env.ROBLOX_PLACE_ID;
const DB_URL = process.env.FIREBASE_DB_URL;
const SA = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!PLACE_ID || !DB_URL || !SA) {
  console.error("Kurang: ROBLOX_PLACE_ID / FIREBASE_DB_URL / secret FIREBASE_SERVICE_ACCOUNT");
  process.exit(1);
}

async function getJson(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "gocamp-stats/1.0", Accept: "application/json" } });
      if (res.ok) return await res.json();
      console.warn(`Percobaan ${i}: ${url} -> HTTP ${res.status}`);
    } catch (e) {
      console.warn(`Percobaan ${i}: ${url} -> ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 2000 * i));
  }
  throw new Error("Gagal mengambil " + url);
}

(async () => {
  const uni = await getJson(`https://apis.roblox.com/universes/v1/places/${PLACE_ID}/universe`);
  const uid = uni.universeId;
  if (!uid) throw new Error("universeId tidak ditemukan. Cek ROBLOX_PLACE_ID.");

  const game = await getJson(`https://games.roblox.com/v1/games?universeIds=${uid}`);
  const votes = await getJson(`https://games.roblox.com/v1/games/votes?universeIds=${uid}`);

  const online = game.data?.[0]?.playing ?? 0;
  const up = votes.data?.[0]?.upVotes ?? 0;
  const down = votes.data?.[0]?.downVotes ?? 0;
  const rating = up + down > 0 ? Math.round((up / (up + down)) * 100) : 100;

  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(SA)), databaseURL: DB_URL });
  await admin.database().ref("stats").set({ online, rating, updatedAt: Date.now() });
  console.log(`OK -> online=${online}, rating=${rating}%`);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });
