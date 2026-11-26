
# Luopan Nusantara

Aplikasi edukasi Feng Shui berbahasa Indonesia dengan asisten AI SUMMY.

## Teknologi

- React
- TypeScript
- Vite
- Vercel Functions
- OpenAI Responses API

## Menjalankan secara lokal

Pastikan Node.js sudah terpasang.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy ke Vercel

1. Buat repository GitHub bernama luopan-nusantara.
2. Upload semua file dan folder project.
3. Import repository tersebut ke Vercel.
4. Tambahkan environment variables:
   - OPENAI_API_KEY
   - OPENAI_MODEL
5. Deploy project.

## Keamanan

Jangan pernah memasukkan API key ke dalam source code frontend atau repository GitHub.

Simpan API key melalui Environment Variables di Vercel.

Untuk peluncuran publik, tambahkan rate limiting, perlindungan penyalahgunaan API, dan pembatasan biaya.

## Catatan fitur

Kompas pada halaman awal saat ini adalah ilustrasi visual, bukan sensor kompas perangkat.

Fitur analisis rumah, kalkulator Kua, dan pembacaan 24 Mountains masih memerlukan implementasi perhitungan dan validasi tersendiri.

Informasi Feng Shui disajikan sebagai edukasi mengenai tradisi dan filosofi, bukan jaminan hasil tertentu.
