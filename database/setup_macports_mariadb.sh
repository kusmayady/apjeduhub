#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# Script Setup MariaDB Lokal via MacPorts (macOS) untuk APJ EduHub
# Jalankan script ini di terminal macOS lokal Anda.
# ============================================================================

MARIADB_PORT_PKG="${MARIADB_PORT_PKG:-mariadb-10.11}"
MARIADB_SERVER_PKG="${MARIADB_PORT_PKG}-server"
DB_NAME="${MARIADB_DATABASE:-apjeduhub}"
DB_USER="${MARIADB_USER:-apj_user}"
DB_PASS="${MARIADB_PASSWORD:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "Script ini ditujukan untuk macOS dengan MacPorts."
  exit 1
fi

if ! command -v port >/dev/null 2>&1; then
  echo "MacPorts ('port') tidak ditemukan. Install MacPorts terlebih dahulu dari https://www.macports.org/"
  exit 1
fi

if [[ -z "$DB_PASS" ]]; then
  read -r -s -p "Masukkan password baru untuk user MariaDB '${DB_USER}': " DB_PASS
  echo ""
  if [[ -z "$DB_PASS" ]]; then
    echo "Password tidak boleh kosong."
    exit 1
  fi
fi

echo "==> 1. Menginstal ${MARIADB_PORT_PKG} dan ${MARIADB_SERVER_PKG} via MacPorts..."
sudo port install "${MARIADB_PORT_PKG}" "${MARIADB_SERVER_PKG}"
sudo port select --set mysql "${MARIADB_PORT_PKG}" || true

DATA_DIR="/opt/local/var/db/${MARIADB_PORT_PKG}"
SOCKET_PATH="/opt/local/var/run/${MARIADB_PORT_PKG}/mysqld.sock"
INSTALL_DB_BIN="/opt/local/lib/${MARIADB_PORT_PKG}/bin/mariadb-install-db"
CLIENT_BIN="/opt/local/lib/${MARIADB_PORT_PKG}/bin/mariadb"

if [[ ! -d "${DATA_DIR}/mysql" ]]; then
  echo "==> 2. Menginisialisasi direktori data MariaDB..."
  sudo -u _mysql "${INSTALL_DB_BIN}"
else
  echo "==> 2. Direktori data MariaDB sudah ada (${DATA_DIR}), melewati inisialisasi."
fi

echo "==> 3. Menjalankan service MariaDB MacPorts..."
sudo port load "${MARIADB_SERVER_PKG}"
sleep 2

echo "==> 4. Membuat database '${DB_NAME}' dan user '${DB_USER}'..."
sudo "${CLIENT_BIN}" --socket="${SOCKET_PATH}" <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

echo "==> 5. Mengimpor skema dan data awal (seed)..."
"${CLIENT_BIN}" --socket="${SOCKET_PATH}" -u "${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" < "${SCRIPT_DIR}/mariadb_schema.sql"
"${CLIENT_BIN}" --socket="${SOCKET_PATH}" -u "${DB_USER}" -p"${DB_PASS}" "${DB_NAME}" < "${SCRIPT_DIR}/mariadb_seed.sql"

echo ""
echo "Selesai! Tambahkan konfigurasi berikut ke file .env lokal Anda:"
echo "DB_PROVIDER=mariadb"
echo "MARIADB_HOST=127.0.0.1"
echo "MARIADB_PORT=3306"
echo "MARIADB_SOCKET=${SOCKET_PATH}"
echo "MARIADB_USER=${DB_USER}"
echo "MARIADB_PASSWORD=<password_anda>"
echo "MARIADB_DATABASE=${DB_NAME}"
