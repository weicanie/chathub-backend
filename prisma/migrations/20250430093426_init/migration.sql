-- CreateTable
CREATE TABLE `ai_conversation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `keyname` VARCHAR(100) NOT NULL,
    `label` VARCHAR(100) NOT NULL,
    `content` JSON NULL,
    `user_id` INTEGER NOT NULL,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(500) NOT NULL,
    `avatar_url` VARCHAR(100) NULL,
    `create_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `sign` VARCHAR(255) NULL,
    `nickName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `online_status` VARCHAR(100) NULL,

    UNIQUE INDEX `username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` LONGTEXT NOT NULL,
    `type` INTEGER NOT NULL,
    `chatroomId` INTEGER NOT NULL,
    `senderId` INTEGER NOT NULL,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `chatroomId`(`chatroomId`),
    INDEX `senderId`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatroom` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `type` BOOLEAN NOT NULL DEFAULT false,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chatRecordId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `chatRecordId`(`chatRecordId`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friendRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from` INTEGER NOT NULL,
    `to` INTEGER NOT NULL,
    `reason` VARCHAR(100) NOT NULL,
    `status` INTEGER NOT NULL,
    `create_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `update_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friendship` (
    `userId` INTEGER NOT NULL,
    `friendId` INTEGER NOT NULL,

    INDEX `friendId`(`friendId`),
    PRIMARY KEY (`userId`, `friendId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friendGroup` (
    `userId` INTEGER NOT NULL,
    `friendId` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    INDEX `friendId`(`friendId`),
    PRIMARY KEY (`userId`, `friendId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_chatroom` (
    `userId` INTEGER NOT NULL,
    `chatroomId` INTEGER NOT NULL,

    INDEX `chatroomId`(`chatroomId`),
    PRIMARY KEY (`userId`, `chatroomId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ai_conversation` ADD CONSTRAINT `ai_conversation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chatRecord` ADD CONSTRAINT `chatRecord_ibfk_1` FOREIGN KEY (`chatroomId`) REFERENCES `chatroom`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chatRecord` ADD CONSTRAINT `chatRecord_ibfk_2` FOREIGN KEY (`senderId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_ibfk_1` FOREIGN KEY (`chatRecordId`) REFERENCES `chatRecord`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `friendship` ADD CONSTRAINT `friendship_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `friendship` ADD CONSTRAINT `friendship_ibfk_2` FOREIGN KEY (`friendId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_chatroom` ADD CONSTRAINT `user_chatroom_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_chatroom` ADD CONSTRAINT `user_chatroom_ibfk_2` FOREIGN KEY (`chatroomId`) REFERENCES `chatroom`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
