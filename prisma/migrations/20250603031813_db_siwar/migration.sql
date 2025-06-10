/*
  Warnings:

  - You are about to alter the column `role_id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Char(10)` to `UnsignedInt`.
  - A unique constraint covering the columns `[nik]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `nik` VARCHAR(16) NULL,
    MODIFY `password` VARCHAR(60) NOT NULL,
    MODIFY `role_id` INTEGER UNSIGNED NULL;

-- CreateTable
CREATE TABLE `iuran` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `deskripsi` VARCHAR(255) NULL,
    `nominal` DECIMAL(12, 2) NOT NULL,
    `tanggal_nagih` DATE NULL,
    `tanggal_tempo` DATE NOT NULL,
    `status` ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
    `kategori_id` INTEGER UNSIGNED NULL,

    INDEX `kategori_id`(`kategori_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jabatan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nik` VARCHAR(16) NOT NULL,
    `role_id` INTEGER UNSIGNED NULL,
    `status` ENUM('aktif', 'nonaktif') NULL DEFAULT 'aktif',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `nik`(`nik`),
    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kk` (
    `no_kk` VARCHAR(20) NOT NULL,
    `rt_id` INTEGER UNSIGNED NULL,
    `nik` VARCHAR(16) NULL,
    `kategori_id` INTEGER UNSIGNED NULL,

    UNIQUE INDEX `kk_no_kk_key`(`no_kk`),
    UNIQUE INDEX `kk_nik_key`(`nik`),
    INDEX `kategori_id`(`kategori_id`),
    PRIMARY KEY (`no_kk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengumuman` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `judul` VARCHAR(100) NOT NULL,
    `subjek` VARCHAR(100) NULL,
    `isi` TEXT NULL,
    `tanggal` DATE NOT NULL,
    `rt_id` INTEGER UNSIGNED NULL,

    INDEX `rt_id`(`rt_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rukun_tetangga` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tagihan` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `no_kk` VARCHAR(20) NULL,
    `status` ENUM('lunas', 'belum_lunas') NULL DEFAULT 'belum_lunas',
    `tanggal_bayar` DATE NULL,
    `iuran_id` INTEGER UNSIGNED NULL,

    INDEX `iuran_id`(`iuran_id`),
    INDEX `no_kk`(`no_kk`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `warga` (
    `nik` VARCHAR(16) NOT NULL,
    `nama` VARCHAR(100) NOT NULL,
    `no_kk` VARCHAR(20) NULL,
    `jenis_kelamin` ENUM('laki-laki', 'perempuan') NOT NULL,
    `tempat_lahir` VARCHAR(100) NULL,
    `tanggal_lahir` DATE NULL,
    `agama` VARCHAR(50) NULL,
    `pendidikan` VARCHAR(100) NULL,
    `jenis_pekerjaan` VARCHAR(100) NULL,
    `golongan_darah` VARCHAR(3) NULL,
    `status_perkawinan` ENUM('kawin_tercatat', 'belum_kawin', 'cerai_hidup', 'cerai_mati') NULL DEFAULT 'belum_kawin',
    `tanggal_perkawinan` DATE NULL,
    `status_hubungan_dalam_keluarga` VARCHAR(50) NULL,
    `kewarganegaraan` VARCHAR(50) NULL,
    `no_paspor` VARCHAR(20) NULL,
    `no_kitap` VARCHAR(20) NULL,
    `ayah` VARCHAR(100) NULL,
    `ibu` VARCHAR(100) NULL,

    INDEX `no_kk`(`no_kk`),
    PRIMARY KEY (`nik`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategori` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `nik_3` ON `user`(`nik`);

-- CreateIndex
CREATE INDEX `fk_user_role` ON `user`(`role_id`);

-- CreateIndex
CREATE INDEX `nik` ON `user`(`nik`);

-- CreateIndex
CREATE INDEX `nik_2` ON `user`(`nik`);

-- AddForeignKey
ALTER TABLE `iuran` ADD CONSTRAINT `iuran_ibfk_1` FOREIGN KEY (`kategori_id`) REFERENCES `kategori`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `jabatan` ADD CONSTRAINT `jabatan_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `jabatan` ADD CONSTRAINT `jabatan_ibfk_2` FOREIGN KEY (`nik`) REFERENCES `warga`(`nik`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `kk` ADD CONSTRAINT `kk_kategori_id_fkey` FOREIGN KEY (`kategori_id`) REFERENCES `kategori`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kk` ADD CONSTRAINT `kk_ibfk_1` FOREIGN KEY (`nik`) REFERENCES `warga`(`nik`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengumuman` ADD CONSTRAINT `pengumuman_ibfk_1` FOREIGN KEY (`rt_id`) REFERENCES `rukun_tetangga`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tagihan` ADD CONSTRAINT `tagihan_ibfk_1` FOREIGN KEY (`no_kk`) REFERENCES `kk`(`no_kk`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tagihan` ADD CONSTRAINT `tagihan_ibfk_2` FOREIGN KEY (`iuran_id`) REFERENCES `iuran`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`nik`) REFERENCES `warga`(`nik`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `warga` ADD CONSTRAINT `warga_ibfk_1` FOREIGN KEY (`no_kk`) REFERENCES `kk`(`no_kk`) ON DELETE SET NULL ON UPDATE RESTRICT;
