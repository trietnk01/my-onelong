-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `fullname` VARCHAR(191) NOT NULL,
    `token` TEXT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `category_product_category_name_key`(`category_name`),
    UNIQUE INDEX `category_product_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sku` VARCHAR(191) NOT NULL,
    `category_product_id` INTEGER NOT NULL,
    `price` DOUBLE NOT NULL,
    `stock` INTEGER NOT NULL,
    `image` TEXT NULL,
    `thumbnail` TEXT NULL,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_method` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `payment_method_title_key`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orders_sku` VARCHAR(191) NOT NULL,
    `orders_name` VARCHAR(191) NOT NULL,
    `orders_mobile` VARCHAR(191) NOT NULL,
    `orders_date` DATETIME(3) NOT NULL,
    `orders_address` VARCHAR(191) NOT NULL DEFAULT '',
    `payment_method_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders_detail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orders_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `orders_product_sku` VARCHAR(191) NOT NULL,
    `orders_product_name` VARCHAR(191) NOT NULL,
    `orders_product_image` VARCHAR(191) NULL,
    `orders_price` DOUBLE NOT NULL,
    `orders_quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product` ADD CONSTRAINT `product_category_product_id_fkey` FOREIGN KEY (`category_product_id`) REFERENCES `category_product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_detail` ADD CONSTRAINT `orders_detail_orders_id_fkey` FOREIGN KEY (`orders_id`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_detail` ADD CONSTRAINT `orders_detail_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
