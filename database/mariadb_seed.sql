-- ============================================================================
-- MariaDB Initial Seed Data for Akademi Pariwisata Jakarta (APJ EduHub)
-- ============================================================================

USE `apjeduhub`;

-- 1. Website General Settings
INSERT INTO `website_settings` (
  `setting_key`, `director_name`, `director_title`, `established_year`,
  `foundation_name`, `address`, `phone_lines`, `pmb_email`, `consultation_hours`
) VALUES (
  'general',
  'Assoc. Prof. Kusmayadi',
  'Direktur Akademi Pariwisata Jakarta',
  '1972',
  'Yayasan Pendidikan Jayakarta',
  'Jl. Cempaka Putih Tengah XXXII No. 8, Cempaka Putih, Jakarta Pusat.',
  '(021) 8613388, 8623344',
  'pmb@apj.ac.id',
  'Senin-Sabtu pukul 08:00 - 17:00 WIB'
) ON DUPLICATE KEY UPDATE `setting_key` = VALUES(`setting_key`);

-- 2. News Categories
INSERT IGNORE INTO `news_categories` (`name`, `sort_order`) VALUES
  ('Kegiatan Akademik', 1),
  ('Prestasi Mahasiswa', 2),
  ('Kerjasama Kemitraan', 3),
  ('Pengumuman Penting', 4);

-- 3. Announcements
INSERT IGNORE INTO `announcements` (`id`, `category`, `date`, `title`, `desc_text`, `image`, `content`, `created_at`) VALUES
  (
    'ann-seed-1',
    'Prestasi Mahasiswa',
    '14 Mei 2026',
    'APJ Sabet Juara Umum Culinary Cup dan Barista Guild Competition DKI Jakarta 2026',
    'Tim mahasiswa D3 Perhotelan APJ membawa pulang piala utama dalam kategori Classic Cocktail Mixology dan Nusantara Main Course Presentation.',
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=500',
    'Pencapaian luar biasa diraih oleh Unit Kegiatan Mahasiswa (UKM) Culinary & Hospitality Club Akademi Pariwisata Jakarta (APJ) setelah dinobatkan sebagai Juara Umum dalam perhelatan akbar Culinary Cup dan Barista Guild Competition DKI Jakarta 2026.',
    '2026-05-14T08:00:00.000Z'
  ),
  (
    'ann-seed-2',
    'Kerjasama Kemitraan',
    '28 April 2026',
    'Dua Belas Lulusan APJ Diterima Kontrak Kerja di Luxury Hotel Arab Saudi & Dubai',
    'Program penempatan langsung Job Placement Center APJ berhasil menyalurkan alumni ke Ritz-Carlton Jeddah dan JW Marriott Dubai Marina melalui jalur prioritas.',
    'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=80&w=500',
    'Sebanyak 12 alumni lulusan program studi D3 Perhotelan APJ secara resmi menandatangani kontrak kerja profesional eksklusif bersama manajemen resort dan luxury hotel bintang 5 di kawasan Timur Tengah.',
    '2026-04-28T08:00:00.000Z'
  ),
  (
    'ann-seed-3',
    'Kegiatan Akademik',
    '10 April 2026',
    'MoU Terbaru APJ dengan Tokyo Hospitality College Jepang',
    'Kerjasama strategis ini memfasilitasi mahasiswa D3 Usaha Perjalanan Wisata dan Perhotelan untuk mengikuti magang bersubsidi selama 1 tahun di Tokyo.',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500',
    'Akademi Pariwisata Jakarta (APJ) resmi melakukan penandatanganan MoU kemitraan tripartit strategis bersama Tokyo Hospitality College dan jaringan akomodasi Ryokan tradisional Shizuoka Prefecture di Tokyo, Jepang.',
    '2026-04-10T08:00:00.000Z'
  );

-- 4. Board Members
INSERT IGNORE INTO `board_members` (`id`, `name`, `role`, `education`, `avatar`, `category`, `sort_order`) VALUES
  ('board-1', 'Assoc. Prof. Kusmayadi', 'Direktur Akademi Pariwisata Jakarta', 'S3 Pariwisata Universitas Trisakti', '👨‍🏫', 'APJ', 1),
  ('board-2', 'Dra. Herlina Ningrum, M.Par.', 'Pudir I Bidang Akademik', 'S2 Hospitality Management STP Bandung', '👩‍🏫', 'APJ', 2),
  ('board-3', 'Ir. Bambang Wisnu, M.M.', 'Pudir II Bidang Keuangan & Umum', 'S2 Magister Manajemen Universitas Indonesia', '👨‍💻', 'APJ', 3),
  ('board-4', 'Rudi Hartono, S.ST.Par., M.Par.', 'Pudir III Bidang Kemahasiswaan & Kemitraan', 'S2 Pariwisata STP Trisakti', '👨‍💼', 'APJ', 4),
  ('board-5', 'Yulia Herawati, S.E., M.MM.', 'Ketua Program Studi D3 Perhotelan', 'S2 Manajemen Perhotelan Universitas Pelita Harapan', '👩‍🍳', 'APJ', 5),
  ('board-6', 'Andi Saputra, M.Par.', 'Ketua Program Studi D3 Usaha Perjalanan Wisata', 'S2 Destinasi Pariwisata Institut Teknologi Bandung', '👨‍✈️', 'APJ', 6),
  ('board-7', 'Kusmayadi, M.M.', 'Ketua Yayasan Pendidikan Jayakarta', 'S2 Manajemen Universitas Jayakarta', '🏛️', 'Yayasan', 7),
  ('board-8', 'Dr. H. Ahmad Fauzi', 'Dewan Pembina Yayasan', 'S3 Hukum & Kebijakan Publik Universitas Indonesia', '⚖️', 'Yayasan', 8),
  ('board-9', 'Hj. Ratna Sari, S.E.', 'Bendahara Yayasan', 'S1 Akuntansi Universitas Jayakarta', '💼', 'Yayasan', 9);

-- 5. Joomla Template Styles
INSERT IGNORE INTO `joomla_template_styles` (
  `id`, `name`, `primary_color`, `secondary_color`, `accent_color`, `background_color`,
  `font_family`, `heading_font_name`, `card_radius`, `header_style`, `show_hero_background`,
  `badge_style`, `is_system`, `extra_config`
) VALUES
  (
    'tpl-default', 'APJ Royal Navy (Default)', '#002f5a', '#1e3a8a', '#FFC46A', '#f8fafc',
    'font-sans', 'Inter', 'rounded-xl', 'sticky', 1, 'pill', 1,
    '{"logoHeader":"/input_file_0.png","logoFooter":"/input_file_1.png","favicon":"/input_file_1.png","titleFontFamily":"Montserrat","titleFontColor":"#002f5a","titleFontSize":"2.5rem","subtitleFontFamily":"Plus Jakarta Sans","subtitleFontColor":"#475569","subtitleFontSize":"1.25rem"}'
  ),
  (
    'tpl-sand', 'Joomla Terracotta Sand', '#7c2d12', '#ea580c', '#fbbf24', '#fff1e6',
    'font-sans', 'Playfair Display', 'rounded-3xl', 'glass', 1, 'pill', 1,
    '{"logoHeader":"/input_file_0.png","logoFooter":"/input_file_1.png","favicon":"/input_file_1.png"}'
  ),
  (
    'tpl-midnight', 'Midnight Anthracite', '#0f172a', '#475569', '#10b981', '#f1f5f9',
    'font-mono', 'Space Grotesk', 'rounded-md', 'minimal', 0, 'sharp', 1,
    '{"logoHeader":"/input_file_0.png","logoFooter":"/input_file_1.png","favicon":"/input_file_1.png"}'
  ),
  (
    'tpl-forest', 'Forest Eco Sage', '#064e3b', '#047857', '#facc15', '#f0fdf4',
    'font-sans', 'Inter', 'rounded-xl', 'sticky', 1, 'pill', 1,
    '{"logoHeader":"/input_file_0.png","logoFooter":"/input_file_1.png","favicon":"/input_file_1.png"}'
  ),
  (
    'tpl-wine', 'Luxury Wine Accent', '#4c0519', '#9d174d', '#fda4af', '#fff1f2',
    'font-serif', 'Playfair Display', 'rounded-3xl', 'glass', 1, 'outline', 1,
    '{"logoHeader":"/input_file_0.png","logoFooter":"/input_file_1.png","favicon":"/input_file_1.png"}'
  );

-- 6. Joomla Menu Items
INSERT IGNORE INTO `joomla_menu_items` (`id`, `label`, `section_id`, `tab_id`, `parent_id`, `sort_order`, `template_style_id`) VALUES
  ('menu-home', 'Beranda', 'home', '', NULL, 1, 'tpl-default'),
  ('menu-profil', 'Profil Kampus', 'profil', 'sejarah', NULL, 2, 'tpl-default'),
  ('menu-akademik', 'Akademik', 'akademik', 'd3perhotelan', NULL, 3, 'tpl-default'),
  ('menu-pmb', 'Penerimaan (PMB)', 'pmb', 'syarat', NULL, 4, 'tpl-default'),
  ('menu-kemahasiswaan', 'Kemahasiswaan', 'kemahasiswaan', 'ukm', NULL, 5, 'tpl-default'),
  ('menu-kontak', 'Hubungi & Chatbot', 'kontak', '', NULL, 6, 'tpl-default'),
  ('menu-admin', 'Kelola Website ⚙️', 'admin', '', NULL, 7, 'tpl-default');

-- 7. Sample PMB Applications
INSERT IGNORE INTO `pmb_applications` (
  `id`, `application_id`, `name`, `email`, `phone`, `high_school`, `grad_year`, `major`, `class_type`, `status`, `created_at`
) VALUES
  ('pmb-seed-1', 'APJ-2026-0001', 'Budi Santoso', 'budi.santoso@gmail.com', '081234567890', 'SMK Pariwisata Jakarta', '2025', 'D3 Perhotelan', 'Reguler', 'Verified', '2026-06-18T10:00:00.000Z'),
  ('pmb-seed-2', 'APJ-2026-0002', 'Siti Rahma', 'siti.rahma@yahoo.com', '082145678901', 'SMA Negeri 8 Jakarta', '2026', 'D3 Usaha Perjalanan Wisata', 'Reguler', 'Pending', '2026-06-19T14:30:00.000Z'),
  ('pmb-seed-3', 'APJ-2026-0003', 'Aditya Wijaya', 'aditya.w@outlook.com', '085734561234', 'SMK Negeri 57 Jakarta', '2025', 'D3 Perhotelan', 'Karyawan', 'Lulus Seleksi', '2026-06-15T09:15:00.000Z');

-- 8. Sample Contact Messages
INSERT IGNORE INTO `contact_messages` (`id`, `name`, `email`, `message`, `is_read`, `reply_note`, `created_at`) VALUES
  ('msg-seed-1', 'Rahmat Hidayat', 'rahmat.h@gmail.com', 'Halo admin, apakah pendaftaran gelombang kedua masih dibuka? Syarat pendaftarannya apa saja ya?', 0, NULL, '2026-06-19T08:00:00.000Z'),
  ('msg-seed-2', 'Dewi Lestari', 'dewi.l@gmail.com', 'Bagaimana proses konfirmasi pembayaran formulir pendaftaran PMB?', 1, 'Konfirmasi pembayaran dapat dikirimkan langsung melalui WhatsApp helpdesk di nomor +62-21-4288-4648.', '2026-06-17T11:24:00.000Z');

-- 9. EduFin SPP Payments
INSERT IGNORE INTO `edufin_spp` (`id`, `name`, `nim`, `major`, `class_type`, `amount`, `status`, `last_paid`) VALUES
  ('spp-seed-1', 'Rian Aditya Pratama', '20250101', 'D3 Perhotelan', 'Reguler', 3850000, 'Lunas', '2026-06-15'),
  ('spp-seed-2', 'Siska Dewi Maharani', '20250102', 'D3 Usaha Perjalanan Wisata', 'Reguler', 3600000, 'Lunas', '2026-06-18'),
  ('spp-seed-3', 'Bagas Saputra Wijaya', '20240201', 'D3 Perhotelan', 'Kelas Karyawan', 4400000, 'Tunggakan', '2026-05-10'),
  ('spp-seed-4', 'Nadia Putri Ayu', '20250103', 'D3 Usaha Perjalanan Wisata', 'Reguler', 3600000, 'Menunggu', '2026-06-19'),
  ('spp-seed-5', 'M. Farhan Rizky', '20240205', 'D3 Perhotelan', 'Reguler', 3850000, 'Lunas', '2026-06-12');

-- 10. EduFin Campus Expenses
INSERT IGNORE INTO `edufin_expenses` (`id`, `category`, `amount`, `date`, `description`) VALUES
  ('exp-seed-1', 'Bahan Lab Praktik', 12500000, '2026-06-10', 'Bahan segar masakan kontinental & pastry Lab Gastronomi'),
  ('exp-seed-2', 'Utilitas Kampus', 4200000, '2026-06-12', 'Tagihan Listrik & Internet Kecepatan Tinggi Kampus'),
  ('exp-seed-3', 'Perbaikan Lab Hotel', 8500000, '2026-06-14', 'Penggantian linen premium & toiletries kamar hotel simulator'),
  ('exp-seed-4', 'Gaji & Staf', 24000000, '2026-06-25', 'Honorarium Dosen Praktisi & Instruktur Perhotelan APJ'),
  ('exp-seed-5', 'Promosi & PMB', 3500000, '2026-06-05', 'Iklan Brosur cetak dan ads media sosial PMB APJ 2026');
