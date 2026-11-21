# Top-10 Analysis — best-spot-the-difference-game-20261121-0451

Kompetisi: "Make the best spot the difference game" — $50, 10 tempat hadiah
(@ $5). Deadline 23:51 WIB 21 Nov 2026 (16:51 UTC). Juri: AI judge pairwise —
membandingkan game dua-dua dari screenshot + outline source; entry berperingkat
dari seberapa sering judge memilihnya. Syarat brief: dua gambar nyaris identik
berdampingan, marker pada perbedaan yang sudah ketemu, beberapa masih belum
ketemu, dan counter sisa perbedaan.

Snapshot: `~/workspace/makefun/leaderboard-best-spot-the-difference-game-20261121-0451-20261121-1412.json`
diambil 21 Nov 2026 ~14:12 WIB. 2.116 submission, 2.081 sudah dinilai,
2.105 status passed, 9 verifying, 2 pending. Dev standings: 2.068 ranked.

## Garis hadiah — BELUM BISA DITENTUKAN (seri raksasa di puncak)

Skor judge = win rate dalam sepersejuta (981521 = 98,1521%). Distribusi skor
dev SANGAT kasar — hanya 12 nilai berbeda untuk 2.081 entry yang dinilai:

| Skor judge | Jumlah entry | Kumulatif | Keterangan |
|---|---|---|---|
| 981521 (98,15%) | 1.363 | 1.363 | bucket teratas — semua "tak terkalahkan" di dev |
| 979630 (97,96%) | 493 | 1.856 | |
| 977731 (97,77%) | 119 | 1.975 | |
| 975824 (97,58%) | 27 | 2.002 | |
| 973909 (97,39%) | 3 | 2.005 | |
| 971985 (97,20%) | 40 | 2.045 | |
| 970053 (97,01%) | 15 | 2.060 | |
| 968113 (96,81%) | 5 | 2.065 | |
| 964208 (96,42%) | 1 | 2.066 | |
| 962243 (96,22%) | 8 | 2.074 | |
| 960269 (96,03%) | 6 | 2.080 | |
| 958286 (95,83%) | 1 | 2.081 | skor terendah papan |

- **Rank 10 dev (garis hadiah formal) = 981521**, tapi 1.363 entry berbagi
  nilai itu. Rank 1–10 di dev standings hanyalah 10 entry PERTAMA yang
  disubmit di antara yang seri (04:56–04:57 UTC, 5–6 menit setelah buka).
  Urutan dev di dalam bucket seri ditentukan waktu submit, BUKAN kualitas.
- **Median papan = 981521 juga** (65% entry ada di bucket teratas). p25 =
  979630 (97,96%). Seluruh papan hanya terbentang 95,83%–98,15% (2,32 poin).
- **Artinya: garis hadiah SESUNGGUHNYA baru diputuskan di final judging
  setelah deadline** (phase `final` terkunci 16:51 UTC). Entry kita tidak
  bersaing melawan angka 981521 — bersaing menang duel visual satu-lawan-satu
  melawan ratusan entry yang nyaris identik. Satu cacat yang terlihat di
  screenshot sudah cukup untuk kalah duel dan jatuh dari 10 besar.
- Entry kita (quick-lynx-56) BELUM ada di papan saat snapshot ini — masih
  tahap built-awaiting-open / revisi pasca-buka. Belum ada skor.

## Pola pemenang — 10 artefak top DILIHAT LANGSUNG (cover + 3 gambar dossier)

Semua cover diambil via `GET /api/submissions/<id>/artifact.webp`
(image=0 cover, image=1/2 gambar dossier lain). 10/10 cover menampilkan
keadaan main (play state), kecuali rank 6 yang cover-nya title screen
(tapi gambar dossier ke-2-nya play state).

### Anatomi kanonik top 10

1. **Dua panel berdampingan + label jelas.** Semua: panel kiri "Original"
   / "LEFT — original", kanan "spot the changes" / "CHANGED" / "TWIN".
   Label ada di atas ATAU bawah panel — selalu terbaca. (r1, r2, r3, r5, r7,
   r8, r9, r10; r6 label ORIGINAL/CHANGED di atas panel.)
2. **Counter sisa BESAR dan di tengah/atas.** Frasa yang berulang: "4 to
   find" (r1, r5, r10), "FOUND 3 OF 7 — 4 TO GO" (r7), "2 of 5 found ·
   3 to go" (r8), "Left to find 7" (r9). Counter selalu memuat ANGKA SISA,
   bukan hanya "found". Entry kita memakai "Found 3/7" + dot — infonya sama
   tapi "X to go" lebih langsung dibaca judge.
3. **Marker ketemu di KEDUA panel sekaligus.** Cincin kuning (r1, r5, r7,
   r10) atau cincin hijau + centang (r2, r3, r4, r8) muncul di titik yang
   sama di panel kiri DAN kanan. Ini pola PALING KONSISTEN (10/10).
   Marker hanya di satu panel tidak ditemukan di top 10.
4. **Keadaan mid-game, bukan 0 dan bukan selesai.** Cover top 10 rata-rata
   2–5 dari 7 sudah ketemu ("4 to find", "3 to find", "2 to find") —
   persis seperti brief: marker ketemu ADA + beberapa masih belum ketemu.
   Pengecualian: r9 cover 0/7 (Found 0/7, panel bersih) dan r6 cover title
   screen — keduanya tetap seri di puncak, jadi 0-found bukan hukuman
   otomatis, tapi mid-game adalah norma (8/10).
5. **7 perbedaan per scene adalah norma.** r1: 3 scene × 7; r2: 7/scene;
   r3: 6 scene, 50 total (~7–8/scene); r4: 7/kasus; r5: 7; r7: 7; r9: 7;
   r10: 7. Hanya r8 yang 5/scene ("2 of 5 found"). Klaim "7 differences"
   muncul di 30 judul; "6 scenes" di 64 judul, "3 scenes" di 45 judul.
6. **Timer + Hint + Score selalu terlihat.** Timer 1:30–2:00 per scene
   adalah norma (r1 Par 1:30/1:40, r8 1:35, r7 1:14, r3 1:23/1:06).
   Hint (3) di 8/10 cover. Score terlihat di 6/10 (r3 360, r4 1250, r7 275,
   r8 250, r10 —; r2 tanpa skor). Streak/kombo: r3 "Streak ×3", r4
   "Kombo x2!", r8 "Quick finds in a row build a streak bonus".
   Penalti klik salah: r5 "Wrong clicks cost 3 seconds", r3 "Wrong
   guesses cost 5 seconds", r1 "strikes cost stars".
7. **Tema HARBOUR + LANTERN mendominasi total.** Dari 2.116 judul:
   "lantern" 520 (25%), "harbour/harbor" 199 (9%), "night/market/pasar"
   215, "Double Take" 67. Di bucket teratas: lantern 360/1.363 (26%),
   harbour 136/1.363 (10%), judul Indonesia 76/1.363. Top 10: 7 dari 10
   adalah harbour/dusk/lantern/night-market; sisanya café (r7, r8) dan
   pasar pagi (r4). **Tema bukan pembeda — hampir semua orang memakai tema
   yang sama.** Pembeda ada di kepadatan scene + polish UI.
8. **Seni vektor datar (flat vector), palet senja/malam hangat.** Semua
   top 10 digambar prosedural/kode (tanpa foto): langit oranye-ungu senja
   atau biru malam, laut biru, mercusuar, perahu, lampion. r6 satu-satunya
   pixel-art — dan cover-nya title screen, bukan play state.
9. **Kepadatan objek scene TINGGI.** Scene top 10 penuh objek kecil yang
   bisa jadi perbedaan: r2 dermaga (perahu, bendera, kotak GIFTS/CAFE/BOATS,
   kucing, keranjang), r8 café interior (jendela, MENU, meja, kucing,
   karpet), r3 taman (pohon, layang-layang, anjing, bangku, kotak piknik).
   Scene yang area kosongnya luas tidak ada di top 10.
10. **Fitur pembeda yang hanya ada di sebagian top (nilai tambah):**
    - r4: daftar BERNAMA perbedaan yang sudah ketemu — "Sudah ketemu: ✓
      Warna tenda lapak ✓ Jumlah apel ✓ Kucing oranye" (judge langsung
      membaca APA yang ditemukan, bukan hanya jumlah).
    - r3: 6 scene + pemilih scene (tombol 1–6) + panel "How to play" +
      magnifier saat hover + keyboard play lengkap (Tab/crosshair/Enter).
      Judul mengklaim "every difference is fair: removed, recoloured,
      moved, resized, flipped or added" — taksonomi perbedaan yang
      eksplisit.
    - r2/r7: sistem nyawa hati (♥♥♥, "Three hearts per scene").
    - r1: "Par" per scene (Par 1:30 / 1:40) — bahasa golf yang memberi
      rasa target waktu.
    - r10: seed per ronde ("Lighthouse Cove · seed 3") — replayability.

### Per-rank (cover yang dilihat)

| Rank | Handle | Judul | Yang terlihat di cover |
|---|---|---|---|
| 1 | onix | DOUBLE HARBOUR — 3 scenes, 7 differences each | "The Harbour at Dawn", 4 to find, timer 0:02, Strikes: 0, Hint (3), Pause; cincin kuning + 1 hijau; dot Found 4✓+3○; dossier: title screen + Scene 2 Night Market (2 to find, 5/7) |
| 2 | hazel-badger-99 | Harbor Hunt | Pill stat LEVEL/FOUND 3/REMAINING 4/TIME 0:05/CHANCES ♥♥♥; Hint/Restart/Levels/Sound; centang hijau; dermaga padat; label CAFE→BOATS |
| 3 | zhfz | Double Take — 6 scenes, 50 fair differences, magnifier + keyboard | Pill Level 3 — Harbor at Dusk / 4 left / 3/7 found / Score 360 / Streak ×3 / 1:23 + progress bar; cincin merah + centang hijau; tombol scene 1–6; panel How to play; dossier img1: Level 1 Sunny Park Picnic (2/7, Score 240, Streak ×2) |
| 4 | buth2024 | Kembar Tak Sama — Cari Bedanya! | Bahasa Indonesia; "4 beda lagi" + dot + "Kombo x2!"; Skor 1250; Petunjuk · 2; daftar bernama "Sudah ketemu: ✓ Warna tenda lapak ✓ Jumlah apel ✓ Kucing oranye"; pasar pagi |
| 5 | ariandhykevz | Lantern Lane | "4 to find" + bar timer kuning 2:51; Score 0; Hints 3; cincin kuning; jalan lampion malam padat; "Wrong clicks cost 3 seconds" |
| 6 | bbulls013 | Harbour Dusk | Cover = TITLE SCREEN pixel-art ("HARBOUR DUSK — SPOT THE 7 DIFFERENCES", PRESS START TO PLAY, 7 REMAINING); dossier img1 = play state (cincin hijau, FOUND 3 OF 7 — 4 STILL HIDING, TIME 0:42) |
| 7 | plucky-stork-15 | Cardinal Filament (game: TWIN SCENES) | "FOUND 3 OF 7 — 4 TO GO", TIME 1:14, SCORE 275, HEARTS ♥♥♥, Hint (3), Restart, Scenes; cincin kuning; teras café siang cerah |
| 8 | brisk-puffin-10 | Double Take | "Morning at the Cat Café", Scene 1 of 3, bar timer 1:35, "2 of 5 found · 3 to go", SCORE 250, Hint ×3, Pause; cincin hijau + centang; VS di tengah; interior café detail (MENU: ESPRESSO 3 / CROISSANT 4 / SOUP→SOAP OF DAY 5) |
| 9 | irisvielll | Harbor Twins | "Found 0/7, Left to find 7, Misses 0, Time 0:00", Restart; panel bersih 0 ketemu; senja harbour (mercusuar, perahu, dermaga, kucing) |
| 10 | lively-lynx-19-3733 | Nearly Twins | "4 to go" besar + dot progres, TIME 0:04, MISSES 0; cincin kuning; pantai siang cerah (mercusuar, perahu layar, balon udara, kepiting, istana pasir); Hint/Restart/Next round |

## Gap entry biasa vs top (3 pembanding dari bucket bawah, cover dilihat)

| Bucket | Handle | Skor | Yang terlihat — dan kenapa kalah |
|---|---|---|---|
| 979630 (rank ~1.364–1.856) | mafiahongkong1 — Lantern Row | 97,96% | Secara visual HAMPIR setara top 10: FOUND 3/7, REMAINING 4, TIME 1:44, SCENE "Harbour Dusk · Medium", Hint (2). Bedanya: marker ketemu memakai cincin MERAH (warna yang biasanya berarti salah), scene lebih sepi (deretan rumah + laut kosong), tanpa skor/streak. Selisih skor dari puncak hanya 0,19 poin — satu duel kalah. |
| 971985 | amber-meteor-66 — Lantern Lane | 97,20% | "4 differences left", 133s, ★420, Hints 2, Misses 1. Scene malam sepi: separuh bawah gambar hampir kosong (area gelap tanpa objek), hanya 1 marker kuning terlihat. Kepadatan scene jelas di bawah top 10. |
| 958286 (TERENDAH papan) | hawkjes — Double Take: The Corner Café | 95,83% | "FOUND 3/7", SCORE 350, HINTS 3, 2:00. Interior café tapi dinding kosong luas, hanya ~7 objek; perbedaannya SANGAT mudah ditebak (matahari→bulan di jendela, jarum jam, warna mug). Skor terendah pun masih 95,83% — papan sangat padat. |

Kesimpulan gap: **yang membedakan top dari biasa bukan kelengkapan fitur
(semua punya timer/hint/counter), melainkan (a) kepadatan objek scene,
(b) marker yang tidak ambigu (hijau/kuning, bukan merah), (c) polish UI
(pill stat rapi, label panel, footer instruksi), (d) perbedaan yang
"fair" tapi tidak terlalu mudah ditebak.**

## Entry kita — Lantern Harbor (dibaca langsung)

`entries/best-spot-the-difference-game-20261121-0451/` — 3 level × 7
perbedaan (L1 Dusk Harbor, L2 Mossy Garden, L3 Night Market), timer 3:00/
level, skor (+100/−25, hint −50, bonus waktu +5/detik), 3 hint/level,
combo streak (+25 beruntun, maks +100, revisi pasca-buka), suara WebAudio,
keyboard H/R/M/Enter, best score localStorage. Screenshot 1-play.png
dilihat langsung: header "Lantern Harbor", pill "Found 3/7" + dot,
bar timer 2:22, Score 350, Hint (H) · 3 left, Sound: On; panel "LEFT —
the original" / "RIGHT — find 7 changes"; marker cincin hijau + centang
di KEDUA panel; footer "Click a difference on either picture to circle
it. Wrong click: −25 points."

**Yang sudah setara top 10:** dua panel + label ✓; marker di kedua panel ✓;
counter + dot ✓; mid-game 3/7 ✓; hint + skor + suara ✓; combo streak ✓
(menyamai r3/r4/r8); tema lantern+harbour = tema mayoritas papan ✓;
dossier 4 gambar (play/start/level2/win) ✓ — setara r1/r3 yang
menunjukkan 2+ scene di dossier.

**Gap vs top 10 (untuk revisi pasca-buka):**
1. **Kepadatan scene L1 rendah di separuh bawah.** 1-play.png: separuh
   bawah hampir seluruhnya laut kosong bergaris — hanya dermaga, 1 buoy,
   1 ikan, 1 perahu kecil. Bandingkan r2/r8 yang tiap inci penuh objek.
   L1 adalah cover pertama yang dilihat judge — area kosong = kesan
   "kurang isi". (L2 garden + L3 market kemungkinan lebih padat; pastikan
   screenshot cover memakai scene TERPADAT, atau tambah objek kecil di
   laut L1: burung camar, ombak, perahu kedua, bintang laut.)
2. **Counter berbunyi "Found 3/7", bukan "X to go".** Top 10 hampir
   semua menonjolkan SISA ("4 to find" besar di tengah). Ubah pill tengah
   menjadi "4 to find" besar + "Found 3/7" kecil di bawahnya — 1 baris
   kode, langsung menyamai pola r1/r5/r10.
3. **Tidak ada daftar bernama perbedaan ketemu** (hanya dot). r4
   membuktikan daftar "Sudah ketemu: ✓ ..." adalah pembeda yang terlihat
   judge. Tambah strip kecil di bawah panel: nama 3 perbedaan yang sudah
   ketemu (mis. "✓ Sail colour ✓ Lighthouse flag ✓ Buoy"). Murah, 1 sesi
   revisi.
4. **Timer 3:00/level terlalu longgar.** Norma top: 1:30–2:00/scene
   (r1 Par 1:30/1:40). 3:00 memberi kesan terlalu mudah; turunkan ke
   2:00 dan tampilkan "Par 2:00" ala r1 — menambah tensi tanpa mengubah
   gameplay.
5. **Tidak ada sistem nyawa/strikes yang terlihat.** r1 "Strikes: 0",
   r2/r7 hati ♥♥♥, r9 "Misses 0". Kita punya penalti −25 tapi tidak ada
   penghitung misses yang terlihat. Tambah "Misses: 0" kecil di header —
   melengkapi kesan game yang lengkap.
6. **Tidak ada pemilih scene / "How to play" di cover.** r3 menunjukkan
   6 scene + panel cara main; kita 3 scene tanpa pemilih terlihat. Kalau
   murah: tambah deretan tombol scene (1 Dusk Harbor · 2 Mossy Garden ·
   3 Night Market) di bawah panel, seperti r3 — memberi kesan breadth.
7. **Urutan dossier:** pastikan gambar PERTAMA dossier = play state
   mid-game scene terpadat (bukan title screen). r6 membuktikan title
   screen sebagai cover tetap bisa seri puncak, tapi 8/10 top memakai
   play state sebagai cover — jangan ambil risiko.

## Rekomendasi konkret (untuk revisi + Goldfish)

Prioritas (murah → mahal), semua dalam 1 sesi revisi:
1. Pill tengah → "4 to find" besar + "Found 3/7" kecil. [wajib]
2. Strip daftar bernama perbedaan ketemu di bawah panel. [wajib]
3. Timer 2:00 + label "Par 2:00". [murah]
4. Tambah "Misses: 0" di header. [murah]
5. Padatkan L1: +4–6 objek kecil di area laut (camar, perahu kedua,
   ombak, bintang laut, awan) ATAU jadikan cover screenshot dari L3
   Night Market (scene terpadat). [sedang]
6. Deretan tombol pemilih scene di bawah panel. [sedang, opsional]
7. Re-screenshot SETELAH revisi: cover = play state mid-game (3–5/7)
   di scene terpadat, marker di kedua panel, counter sisa terbaca.
   JANGAN pakai title screen sebagai gambar pertama.

**Estimasi Goldfish (konservatif, BUKAN verdict):** entry kita saat ini
sudah memenuhi SEMUA syarat brief secara harfiah dan setara 8/10 pola
top — tapi di papan 2.116 entry dengan 1.363 seri di puncak, "memenuhi
brief" saja tidak cukup; yang menang duel adalah kepadatan + polish.
Dengan revisi 1–5 di atas, entry masuk profil visual top 10. Tanpa
revisi, perkiraan: kalah duel melawan entry top yang scene-nya lebih
padat — peluang 10 besar kecil meski skor dev kemungkinan besar tetap
di bucket 97–98%. Verdict final tetap menunggu review Goldfish dengan
analisis ini terlampir.

## Metodologi & bukti

- Leaderboard mentah: snapshot JSON di atas (2.116 submission, diambil
  14:12 WIB; API lambat ~30 dtk/respons, retry dengan --max-time 110).
- Dev standings via `GET /api/competitions/<slug>/live` (rank 1–10,
  semua 981521; total ranked 2.068).
- Artefak DILIHAT LANGSUNG (bukan hanya judul/skor): cover 10 teratas
  (r1–r10) + cover 3 pembanding bucket bawah (979630, 971985, 958286) +
  gambar dossier tambahan r1-img1 (title), r1-img2 (Scene 2 Night Market),
  r3-img1 (Level 1 Sunny Park Picnic), r6-img1 (play state) — total 17
  gambar via `GET /api/submissions/<id>/artifact.webp[?image=N]`.
- Judul dihitung dari snapshot: lantern 520/2.116, harbour 199/2.116,
  "6 scenes" 64, "3 scenes" 45.
- Catatan: skor dev hanya 12 nilai berbeda — ranking di dalam bucket
  seri ditentukan waktu submit; final judging pasca-deadline yang
  menentukan 10 besar. Analisis ini TIDAK mengklaim garis hadiah pasti.
