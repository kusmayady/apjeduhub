# Panduan Setup Database Lokal MariaDB di MacPorts (macOS)

Proyek ini mendukung koneksi ke **MariaDB lokal** yang diinstal melalui **MacPorts** di macOS sebagai alternatif atau pengganti mode Firestore/localStorage saat dijalankan secara lokal.

> **Catatan:** Saat dijalankan di preview cloud AI Studio (Linux), aplikasi otomatis tetap berjalan menggunakan Firebase Firestore / `localStorage` kecuali `DB_PROVIDER=mariadb` diaktifkan bersama instance MariaDB yang berjalan.

---

## 1. Instalasi Otomatis (Direkomendasikan)

Di komputer macOS lokal Anda, masuk ke folder proyek lalu jalankan:

```bash
chmod +x database/setup_macports_mariadb.sh
./database/setup_macports_mariadb.sh
```

Script tersebut akan:
1. Menginstal `mariadb-10.11` dan `mariadb-10.11-server` melalui MacPorts.
2. Menjalankan `mariadb-install-db` untuk membuat sistem tabel di `/opt/local/var/db/mariadb-10.11`.
3. Mengaktifkan service MariaDB melalui `sudo port load mariadb-10.11-server`.
4. Membuat database `apjeduhub` dan user `apj_user`.
5. Mengimpor `database/mariadb_schema.sql` dan `database/mariadb_seed.sql`.

---

## 2. Langkah Manual via MacPorts

Jika Anda ingin menjalankan perintah secara manual:

```bash
# Install MariaDB dari MacPorts
sudo port install mariadb-10.11 mariadb-10.11-server
sudo port select --set mysql mariadb-10.11

# Inisialisasi DB (jika baru pertama kali)
sudo -u _mysql /opt/local/lib/mariadb-10.11/bin/mariadb-install-db

# Jalankan daemon MariaDB
sudo port load mariadb-10.11-server
```

Buat database dan user:

```bash
sudo /opt/local/lib/mariadb-10.11/bin/mariadb --socket=/opt/local/var/run/mariadb-10.11/mysqld.sock -e "
CREATE DATABASE IF NOT EXISTS apjeduhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'apj_user'@'localhost' IDENTIFIED BY 'GANTI_PASSWORD_KUAT';
CREATE USER IF NOT EXISTS 'apj_user'@'127.0.0.1' IDENTIFIED BY 'GANTI_PASSWORD_KUAT';
GRANT ALL PRIVILEGES ON apjeduhub.* TO 'apj_user'@'localhost';
GRANT ALL PRIVILEGES ON apjeduhub.* TO 'apj_user'@'127.0.0.1';
FLUSH PRIVILEGES;
"
```

Impor skema dan data awal:

```bash
/opt/local/lib/mariadb-10.11/bin/mariadb --socket=/opt/local/var/run/mariadb-10.11/mysqld.sock -u apj_user -p apjeduhub < database/mariadb_schema.sql
/opt/local/lib/mariadb-10.11/bin/mariadb --socket=/opt/local/var/run/mariadb-10.11/mysqld.sock -u apj_user -p apjeduhub < database/mariadb_seed.sql
```

---

## 3. Konfigurasi `.env` Lokal

Salin `.env.example` menjadi `.env` di komputer macOS Anda:

```env
GEMINI_API_KEY=isi_api_key_anda
PORT=3000

# Aktifkan mode MariaDB lokal
DB_PROVIDER=mariadb
MARIADB_HOST=127.0.0.1
MARIADB_PORT=3306
MARIADB_SOCKET=/opt/local/var/run/mariadb-10.11/mysqld.sock
MARIADB_USER=apj_user
MARIADB_PASSWORD=GANTI_PASSWORD_KUAT
MARIADB_DATABASE=apjeduhub

# Kredensial admin lokal (opsional; jika kosong, halaman Admin menyediakan form setup pertama kali)
ADMIN_EMAIL=admin@apj.ac.id
ADMIN_PASSCODE=
```

Lalu jalankan aplikasi secara lokal:

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

---

## 4. Alur Kerja GitHub Desktop & Sinkronisasi Rutin (`github.com/kusmayady`)

1. **File Aman & Terproteksi (`.gitignore`)**
   * File `.env` (berisi `MARIADB_PASSWORD`, `GEMINI_API_KEY`, `ADMIN_PASSCODE`), folder `node_modules/`, `dist/`, `.DS_Store`, dan `database/backups/` otomatis diabaikan oleh Git/GitHub Desktop sehingga tidak akan bocor ke repositori `github.com/kusmayady/apjeduhub`.
   * File skema dan seed (`database/mariadb_schema.sql`, `database/mariadb_seed.sql`, `database/setup_macports_mariadb.sh`) tetap tersinkron di GitHub.

2. **Siklus Kerja Harian di Mac Lokal**
   * Sebelum mulai bekerja, klik **Fetch origin / Pull origin** di GitHub Desktop.
   * Pastikan service MariaDB MacPorts berjalan (`sudo port load mariadb-10.11-server` jika belum otomatis aktif).
   * Jalankan `npm run dev` dan kembangkan aplikasi dengan database lokal.
   * Sebelum **Commit & Push** ke `github.com/kusmayady`, periksa daftar perubahan di GitHub Desktop agar hanya kode/skema yang ter-commit (bukan `.env` atau data sensitif).
   * Jika ada perubahan struktur tabel, perbarui `database/mariadb_schema.sql` agar rekan/perangkat lain mendapatkan skema terbaru saat pull.
