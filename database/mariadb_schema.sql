-- ============================================================================
-- MariaDB Schema for Akademi Pariwisata Jakarta (APJ EduHub)
-- Compatible with MacPorts MariaDB 10.6+ / 10.11+ / 11.x (utf8mb4)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `apjeduhub`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `apjeduhub`;

-- 1. Admin Users (untuk autentikasi lokal saat menggunakan mode MariaDB)
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(200) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'Super Admin',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_admin_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PMB Applications
CREATE TABLE IF NOT EXISTS `pmb_applications` (
  `id` VARCHAR(64) NOT NULL,
  `application_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `phone` VARCHAR(100) NOT NULL,
  `high_school` VARCHAR(200) NOT NULL,
  `grad_year` VARCHAR(10) NOT NULL,
  `major` VARCHAR(150) NOT NULL,
  `class_type` VARCHAR(50) NOT NULL,
  `status` ENUM('Pending', 'Verified', 'Lulus Seleksi', 'Tidak Lulus') NOT NULL DEFAULT 'Pending',
  `notes` TEXT NULL,
  `created_at` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_pmb_application_id` (`application_id`),
  KEY `idx_pmb_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Contact Messages
CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `reply_note` TEXT NULL,
  `created_at` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_contact_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Announcements / Berita Kampus
CREATE TABLE IF NOT EXISTS `announcements` (
  `id` VARCHAR(64) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `date` VARCHAR(50) NOT NULL,
  `title` VARCHAR(300) NOT NULL,
  `desc_text` TEXT NOT NULL,
  `image` MEDIUMTEXT NOT NULL,
  `content` LONGTEXT NULL,
  `created_at` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_announcements_created_at` (`created_at`),
  KEY `idx_announcements_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. News Categories
CREATE TABLE IF NOT EXISTS `news_categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_news_categories_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Website General Settings
CREATE TABLE IF NOT EXISTS `website_settings` (
  `setting_key` VARCHAR(64) NOT NULL,
  `director_name` VARCHAR(200) NOT NULL,
  `director_title` VARCHAR(200) NOT NULL,
  `established_year` VARCHAR(10) NOT NULL,
  `foundation_name` VARCHAR(200) NOT NULL,
  `address` VARCHAR(500) NOT NULL,
  `phone_lines` VARCHAR(200) NOT NULL,
  `pmb_email` VARCHAR(200) NOT NULL,
  `consultation_hours` VARCHAR(300) NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Board Members (Pimpinan APJ & Yayasan)
CREATE TABLE IF NOT EXISTS `board_members` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `role` VARCHAR(200) NOT NULL,
  `education` VARCHAR(200) NOT NULL,
  `avatar` MEDIUMTEXT NOT NULL,
  `category` ENUM('APJ', 'Yayasan') NOT NULL DEFAULT 'APJ',
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_board_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Joomla Template Styles
CREATE TABLE IF NOT EXISTS `joomla_template_styles` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `primary_color` VARCHAR(32) NOT NULL,
  `secondary_color` VARCHAR(32) NOT NULL,
  `accent_color` VARCHAR(32) NOT NULL,
  `background_color` VARCHAR(32) NOT NULL,
  `font_family` VARCHAR(50) NOT NULL DEFAULT 'font-sans',
  `heading_font_name` VARCHAR(100) NOT NULL DEFAULT 'Inter',
  `card_radius` VARCHAR(50) NOT NULL DEFAULT 'rounded-xl',
  `header_style` VARCHAR(50) NOT NULL DEFAULT 'sticky',
  `show_hero_background` TINYINT(1) NOT NULL DEFAULT 1,
  `badge_style` VARCHAR(50) NOT NULL DEFAULT 'pill',
  `is_system` TINYINT(1) NOT NULL DEFAULT 0,
  `extra_config` LONGTEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Joomla Menu Items
CREATE TABLE IF NOT EXISTS `joomla_menu_items` (
  `id` VARCHAR(64) NOT NULL,
  `label` VARCHAR(150) NOT NULL,
  `section_id` VARCHAR(100) NOT NULL,
  `tab_id` VARCHAR(100) NOT NULL DEFAULT '',
  `parent_id` VARCHAR(64) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `template_style_id` VARCHAR(64) NOT NULL DEFAULT 'tpl-default',
  PRIMARY KEY (`id`),
  KEY `idx_menu_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. EduFin Student SPP Payments
CREATE TABLE IF NOT EXISTS `edufin_spp` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `nim` VARCHAR(100) NOT NULL,
  `major` ENUM('D3 Perhotelan', 'D3 Usaha Perjalanan Wisata') NOT NULL,
  `class_type` ENUM('Reguler', 'Kelas Karyawan') NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL DEFAULT 0,
  `status` ENUM('Lunas', 'Menunggu', 'Tunggakan') NOT NULL DEFAULT 'Menunggu',
  `last_paid` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_spp_nim` (`nim`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. EduFin Campus Expenses
CREATE TABLE IF NOT EXISTS `edufin_expenses` (
  `id` VARCHAR(64) NOT NULL,
  `category` ENUM('Bahan Lab Praktik', 'Utilitas Kampus', 'Perbaikan Lab Hotel', 'Gaji & Staf', 'Promosi & PMB', 'Lain-lain') NOT NULL,
  `amount` DECIMAL(15, 2) NOT NULL DEFAULT 0,
  `date` VARCHAR(100) NOT NULL,
  `description` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_expenses_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
