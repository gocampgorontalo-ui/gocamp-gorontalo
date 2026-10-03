# PANDUAN GoCamp Gorontalo

Web live: https://gocampgorontalo-ui.github.io/gocamp-gorontalo/

## 1. Struktur file (semua script ada di index.html)

```
gocamp-web/
├── index.html            ← SEMUA kode web: pengaturan, teks, CSS, JavaScript
├── images/               ← gambar kamu (hero.jpg, map-1.jpg ... map-4.jpg)
├── bot/                  ← bot Discord (opsional, jalan di komputer/hosting lain)
├── .github/workflows/
│   └── update-stats.yml  ← robot GitHub: ambil online & rating Roblox tiap 5 menit
├── scripts/
│   └── update-stats.js   ← kode yang dijalankan robot itu
├── database.rules.json   ← aturan keamanan Firebase (ditempel di Firebase Console)
├── .gitignore            ← daftar file rahasia yang TIDAK di-upload
├── .nojekyll             ← biar GitHub Pages memakai file apa adanya
├── README.md
└── PANDUAN.md
```

Di dalam `index.html`, cari kata **BAGIAN** dengan `Ctrl+F`. Isinya berurutan:

| Bagian | Isi | Seberapa sering diedit |
|---|---|---|
| **BAGIAN 1 - PENGATURAN** (paling atas) | link, teks, gambar, waktu update, Firebase | Sering |
| **BAGIAN 2 - WARNA TEMA** | kode warna Tailwind | Kadang |
| **BAGIAN 3 - CSS** | efek kaca, gradasi, scrollbar | Jarang |
| (isi halaman) | kerangka & teks, misalnya judul besar `WELCOME TO` | Kadang |
| **BAGIAN 4 - FUNGSI UMUM** | menu HP, popup, partikel | Hampir tidak pernah |
| **BAGIAN 5 - MESIN REALTIME** | Firebase, Roblox, Discord | Jangan diubah dulu |

Tip: di VS Code tekan `Ctrl+Shift+O` untuk loncat ke bagian tertentu, atau `Ctrl+G` lalu ketik nomor baris.

## 2. Cara mengganti TEKS

**Teks yang ada di BAGIAN 1 (`texts: { ... }`)** diedit di sana. Isinya: `heroBadge`, `heroDesc`, `cardTitle`, `cardDesc`, `aboutTitle`, `aboutDesc`, `mapTitle`, `mapDesc`, `footerText`. Teks di bagian ini menggantikan teks yang sama di halaman, jadi kalau kamu edit di halaman tapi `texts` masih terisi, yang tampil adalah isi `texts`. Boleh memakai tag HTML sederhana, misalnya `<b>tebal</b>` atau `<span class='text-brand-cyan'>berwarna</span>`.

**Teks lain** diedit langsung di isi halaman:

1. `Ctrl+F`, ketik kata kunci dari tabel.
2. Ganti tulisan di antara tanda `>` dan `<`. Jangan hapus tanda `<` `>` atau tulisan `class="..."`.
3. `Ctrl+S`.

| Yang mau diganti | Cari kata ini |
|---|---|
| Judul besar | `WELCOME TO` (kata GOCAMP dan GORONTALO ada di baris bawahnya) |
| Teks tombol | `Mainkan Map Roblox`, `Join Discord Hub` |
| Daftar fitur map (4 kotak) | `Custom Camping Gear` (3 kotak lain tepat di bawahnya) |
| Teks popup detail map | `Detail Info Map`, lalu cari `mapModal` |
| Judul bagian Discord | `Official Discord Stream`, `Anomaly GO-Camp`, `banyak-mulu` |
| Judul guestbook | `Komunitas Guestbook` |
| Judul tab browser | `<title>` di baris atas |

Bagian **"Simulasi GitHub Repository Web"** hanya hiasan (tampilan GitHub tiruan). Kalau tidak mau, hapus dari baris `<!-- GITHUB SIMULATION -->` sampai tag `</section>` penutupnya.

## 3. Cara mengganti GAMBAR

1. Siapkan gambar, usahakan di bawah 500 KB (kompres di squoosh.app).
2. Seret ke folder `images/` di VS Code.
3. Di BAGIAN 1, bagian `images: { ... }`, tulis nama filenya, misalnya `hero: "images/foto-camp.jpg"`. Boleh juga link lengkap `https://...`.
4. Simpan, commit, dan push (bagian 6).

Nama default: `hero` (gambar besar kartu atas), `map1` (kiri-atas), `map2` (kiri-bawah), `map3` (kanan-atas), `map4` (kanan-bawah). Kalau file tidak ditemukan, web memakai gambar cadangan dari internet.

Nama file di GitHub Pages membedakan huruf besar dan kecil: `Hero.JPG` tidak sama dengan `hero.jpg`.

**Ganti link tombol Roblox/Discord:** ubah `robloxUrl` atau `discordUrl` di BAGIAN 1. Semua tombol di web ikut berubah.

**Ganti warna tema:** di BAGIAN 2 ubah `#00f2fe` (cyan) atau `#ff8e53` (oranye).

## 4. Mencoba web di komputer sebelum upload

1. Di VS Code buka menu Extensions (ikon kotak), cari **Live Server** (Ritwick Dey), lalu Install.
2. Klik kanan `index.html` → **Open with Live Server**.
3. Setiap kali kamu menekan `Ctrl+S`, halaman di browser otomatis ter-refresh.

Jangan buka dengan klik dua kali file `index.html`. Beberapa fitur (Firebase, modul JS) bisa gagal kalau dibuka dengan alamat `file://`.

## 5. Setup Firebase (Realtime Database) sampai benar-benar realtime

### 5.1 Ambil config web

1. Firebase Console → project **WebGocamp** → ikon ⚙️ → **Project settings** → tab **General**.
2. Gulir ke **Your apps**. Kalau belum ada app web, klik ikon **`</>`**, beri nama (misalnya `gocamp-web`), lalu **Register app** (tidak perlu centang Hosting).
3. Salin `apiKey`, `projectId`, dan `appId`.
4. Buka `index.html`, di BAGIAN 1 ganti tiga nilai `ISI_...` pada bagian `firebase`. `authDomain` isinya `PROJECTID.firebaseapp.com`.

### 5.2 Aktifkan Anonymous Auth (supaya tamu bisa menulis pesan)

1. Firebase Console → **Authentication** → **Get started** (kalau belum).
2. Tab **Sign-in method** → pilih **Anonymous** → **Enable** → **Save**.

### 5.3 Daftarkan domain GitHub Pages

1. Authentication → tab **Settings** → **Authorized domains** → **Add domain**.
2. Isi `gocampgorontalo-ui.github.io` (hanya domain, tanpa `https://` dan tanpa `/gocamp-gorontalo`).

### 5.4 Pasang Rules

1. **Realtime Database** → tab **Rules**.
2. Hapus semua isi lama (yang berbatas waktu 1 November 2026), tempel isi `database.rules.json`, lalu **Publish**.

### 5.5 (Disarankan) Batasi API key

1. Buka console.cloud.google.com → pilih project yang sama → **APIs & Services → Credentials**.
2. Klik **Browser key (auto created by Firebase)** → **Application restrictions: Websites** → **Add**: `https://gocampgorontalo-ui.github.io/*`, dan untuk uji coba `http://127.0.0.1:5500/*` serta `http://localhost:5500/*` (sesuaikan port Live Server) → biarkan API restrictions **Don't restrict key** → **Save**.

### 5.7 Roblox online & rating (GitHub Actions) - WAJIB

Browser tidak bisa mengambil data Roblox langsung (diblokir CORS), dan proxy publik seperti roproxy sudah memblokir endpoint rating (error 403). Jadi pengambilan data dilakukan oleh robot GitHub, lalu hasilnya ditulis ke Firebase. Web hanya membaca dari Firebase, jadi tetap realtime bagi pengunjung.

1. Firebase Console → ⚙️ **Project settings → Service accounts → Generate new private key** → unduh file JSON. **Jangan di-commit dan jangan dibagikan.**
2. GitHub → repo `gocamp-gorontalo` → **Settings → Secrets and variables → Actions → New repository secret**.
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Secret: buka file JSON tadi dengan Notepad, salin **seluruh isinya**, tempel.
   - Klik **Add secret**.
3. Pastikan folder `.github/workflows/` dan `scripts/` ikut ter-commit dan ter-push (folder `.github` tersembunyi di Windows, tapi VS Code menampilkannya).
4. GitHub → tab **Actions**. Kalau ada tombol *I understand my workflows, go ahead and enable them*, klik.
5. Pilih **Update Roblox stats** → **Run workflow** → **Run workflow** (jalankan manual sekali untuk tes).
6. Klik hasil run-nya. Log harus berisi `OK -> online=..., rating=...%`. Lalu cek Firebase Data: node `stats` muncul, dan angka di web ikut terisi.
7. Selanjutnya robot jalan sendiri tiap 5 menit. Jadwal GitHub bisa tertunda beberapa menit saat sibuk. Kalau repo tidak ada aktivitas 60 hari, GitHub bisa menonaktifkan jadwal otomatis, tinggal klik **Enable workflow** di tab Actions.

Ganti ID map: ubah `ROBLOX_PLACE_ID` di `.github/workflows/update-stats.yml`.

Jika log menunjukkan `HTTP 403` atau `429` dari Roblox, berarti Roblox menolak permintaan dari server GitHub saat itu. Coba jalankan lagi beberapa menit kemudian, dan kabari kalau terus gagal.

### 5.6 Cara cek realtime sudah jalan

1. Buka web, tekan `F12` → tab **Console**.
2. Lencana di guestbook harus hijau: **Firebase Live Connected**.
3. Kirim satu pesan di guestbook. Pesan muncul di web dan di Firebase **Realtime Database → Data → guestbook**.
4. Buka web di dua perangkat/tab sekaligus. Pesan baru di satu sisi harus langsung muncul di sisi lain tanpa refresh.
5. Di Data harus ada node `stats` berisi `online`, `rating`, `updatedAt`. Node ini diisi robot GitHub (bagian 5.7) dan berubah tiap sekitar 5 menit.

| Pesan di lencana / Console | Artinya | Solusi |
|---|---|---|
| Firebase belum dikonfigurasi | `ISI_...` belum diganti | Langkah 5.1 |
| Aktifkan Anonymous Auth di Firebase | Auth anonim mati / domain belum didaftarkan | Langkah 5.2 dan 5.3 |
| Rules database menolak akses | Rules belum dipublish | Langkah 5.4 |
| `PERMISSION_DENIED` saat kirim pesan | Rules belum cocok atau pesan > 300 huruf | Langkah 5.4 |

## 6. Upload ke GitHub dari VS Code (step by step)

Badge angka di ikon Explorer artinya ada file yang belum disimpan. Tekan `Ctrl+K S` (Save All) dulu.

### 6.1 Sekali saja: hubungkan folder ke repo

1. Install Git dari git-scm.com, lalu tutup dan buka lagi VS Code.
2. `File → Open Folder` → pilih `gocamp-web`.
3. Buka terminal: `` Ctrl+` ``. Jalankan satu per satu:

```bash
git config --global user.name "NamaKamu"
git config --global user.email "email-github-kamu@gmail.com"
git init
git branch -M main
git remote add origin https://github.com/gocampgorontalo-ui/gocamp-gorontalo.git
git fetch origin
git reset origin/main
```

`git reset origin/main` menyamakan riwayat dengan GitHub tanpa menghapus file di komputermu.

### 6.2 Setiap kali selesai mengedit

1. Klik ikon **Source Control** (cabang) di sisi kiri.
2. **Cek daftar file.** Tidak boleh ada `.env`, `serviceAccountKey.json`, atau `node_modules`. Repo ini Public, file rahasia tidak boleh ikut.
3. Tulis pesan di kotak, misalnya `ganti gambar hero`.
4. Klik **Commit** → pilih **Yes** jika ditanya stage all.
5. Klik **Sync Changes**. Login GitHub jika diminta.

Alternatif lewat terminal:

```bash
git add .
git commit -m "ganti gambar hero"
git push -u origin main
```

## 7. Aktifkan GitHub Pages (hosting gratis)

1. Buka https://github.com/gocampgorontalo-ui/gocamp-gorontalo → tab **Settings**.
2. Menu kiri **Pages**.
3. **Source**: Deploy from a branch. **Branch**: `main`, folder `/ (root)` → **Save**.
4. Tunggu 1–3 menit. Cek progres di tab **Actions** (ada proses "pages build and deployment").
5. Buka https://gocampgorontalo-ui.github.io/gocamp-gorontalo/

Setiap kali kamu push, web ikut diperbarui otomatis dalam 1–3 menit. Kalau perubahan belum terlihat, tekan `Ctrl+F5` untuk refresh paksa.

Catatan: GitHub Pages gratis untuk repo Public, dengan batas pemakaian yang wajar. Cek dokumentasi GitHub untuk batas terbarunya.

## 8. Bot Discord untuk chat #banyak-mulu (opsional)

Browser tidak bisa membaca chat Discord langsung. Bot kecil di folder `bot/` menyalin pesan baru ke Firebase, lalu web menampilkannya.

1. discord.com/developers/applications → **New Application** → **Bot** → **Reset Token** (simpan, jangan dibagikan).
2. Di halaman Bot, aktifkan **Message Content Intent**.
3. **OAuth2 → URL Generator** → centang `bot`, permission *View Channels* dan *Read Message History* → buka URL hasilnya untuk mengundang bot ke server.
4. Discord: Settings → Advanced → aktifkan **Developer Mode**. Klik kanan channel `#banyak-mulu` → **Copy Channel ID**.
5. Firebase → Project settings → **Service accounts** → **Generate new private key**. Simpan sebagai `bot/serviceAccountKey.json`.
6. Di folder `bot/`, salin `.env.example` menjadi `.env`, isi `DISCORD_TOKEN`, `CHANNEL_ID`, `FIREBASE_DB_URL`.
7. Terminal: `cd bot`, lalu `npm install`, lalu `npm start`.

Bot harus tetap menyala agar chat terus masuk (komputer yang hidup terus atau layanan hosting Node.js; syarat paket gratis sering berubah, cek dulu).

Keamanan: token bot dan `serviceAccountKey.json` jangan pernah di-commit. Jika sempat ter-upload, segera reset token dan buat ulang kunci service account. Pesan member akan tampil publik di web, jadi umumkan dulu ke komunitas.

## 9. Masalah umum

| Masalah | Penyebab | Solusi |
|---|---|---|
| Halaman GitHub Pages 404 | Pages belum aktif atau belum selesai build | Langkah 7, tunggu beberapa menit |
| Gambar tidak berubah | Nama file beda huruf besar/kecil atau cache | Samakan nama persis, `Ctrl+F5` |
| Online/rating tetap `--` | Robot GitHub belum jalan atau gagal | Bagian 5.7: cek tab Actions, secret, dan node `stats` di Firebase |
| Member Discord `--` | Invite kedaluwarsa | Buat invite "Never expire", ubah `discordInviteCode` di BAGIAN 1 |
| Tombol Roblox/Discord tidak jalan | Tanda kutip/koma di BAGIAN 1 terhapus | Cek BAGIAN 1, VS Code menandai garis merah |
| Angka merah di `index.html` (Problems) | Peringatan penulisan kode | `Ctrl+Shift+M` untuk melihat daftar |

## 10. Pengingat penting

- Jangan upload: token bot, `serviceAccountKey.json`, `.env`.
- `apiKey` di BAGIAN 1 boleh publik, tetapi Rules (5.4) wajib dipasang dan pembatasan key (5.5) sangat disarankan.
- Angka online/rating ditulis oleh robot GitHub (server), bukan browser, dan Rules menolak tulisan dari pengunjung. Jadi angkanya tidak bisa dipalsukan lewat web.
- File JSON service account hanya boleh ada di GitHub Secrets (dan di `bot/` bila memakai bot), tidak pernah di-commit.
