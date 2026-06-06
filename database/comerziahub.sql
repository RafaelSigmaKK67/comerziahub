-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: estoque_delivery
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `estoque_delivery`
--

/*!40000 DROP DATABASE IF EXISTS `estoque_delivery`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `estoque_delivery` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `estoque_delivery`;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `providerAccountId` varchar(191) NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(191) DEFAULT NULL,
  `scope` varchar(191) DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `session_state` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  KEY `Account_userId_fkey` (`userId`),
  CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `address`
--

DROP TABLE IF EXISTS `address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `address` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) DEFAULT NULL,
  `storeId` varchar(191) DEFAULT NULL,
  `label` varchar(191) DEFAULT NULL,
  `recipientName` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `zip` varchar(191) DEFAULT NULL,
  `street` varchar(191) DEFAULT NULL,
  `number` varchar(191) DEFAULT NULL,
  `complement` varchar(191) DEFAULT NULL,
  `district` varchar(191) DEFAULT NULL,
  `city` varchar(191) DEFAULT NULL,
  `state` varchar(191) DEFAULT NULL,
  `country` varchar(191) NOT NULL DEFAULT 'BR',
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `isDefault` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Address_storeId_key` (`storeId`),
  KEY `Address_userId_idx` (`userId`),
  CONSTRAINT `Address_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `address`
--

LOCK TABLES `address` WRITE;
/*!40000 ALTER TABLE `address` DISABLE KEYS */;
INSERT INTO `address` VALUES ('cmpt5qc39000uidw4uw51ss76',NULL,'cmpt5qc39000lidw4jwy1bqzj',NULL,NULL,NULL,'01310-100','Av. Paulista','1000',NULL,'Bela Vista','São Paulo','SP','BR',-23.5605,-46.6553,0,'2026-05-31 02:25:14.421'),('cmpt5qc4x001qidw4sqikpx9q',NULL,'cmpt5qc4x001hidw4knfsf1r3',NULL,NULL,NULL,'01310-100','Av. Paulista','1000',NULL,'Bela Vista','São Paulo','SP','BR',-23.5605,-46.6553,0,'2026-05-31 02:25:14.481'),('cmpt5qc6l002oidw49kvg7znt',NULL,'cmpt5qc6l002fidw42nedf7hv',NULL,NULL,NULL,'01310-100','Av. Paulista','1000',NULL,'Bela Vista','São Paulo','SP','BR',-23.5605,-46.6553,0,'2026-05-31 02:25:14.541');
/*!40000 ALTER TABLE `address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `badge`
--

DROP TABLE IF EXISTS `badge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `badge` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `iconUrl` text DEFAULT NULL,
  `criteria` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`criteria`)),
  PRIMARY KEY (`id`),
  KEY `Badge_storeId_fkey` (`storeId`),
  CONSTRAINT `Badge_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `badge`
--

LOCK TABLES `badge` WRITE;
/*!40000 ALTER TABLE `badge` DISABLE KEYS */;
INSERT INTO `badge` VALUES ('cmpt6pl630004idxoo0brzt2h','cmpt5qc39000lidw4jwy1bqzj','Cliente Fiel','Comprou mais de uma vez nesta loja.','https://picsum.photos/seed/badge-fiel/800/800',NULL),('cmpt6pl680005idxoqy8shxzc',NULL,'Pioneiro','Entre os primeiros usuários da plataforma.','https://picsum.photos/seed/badge-pioneiro/800/800',NULL);
/*!40000 ALTER TABLE `badge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `block`
--

DROP TABLE IF EXISTS `block`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `block` (
  `id` varchar(191) NOT NULL,
  `blockerId` varchar(191) NOT NULL,
  `blockedId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Block_blockerId_blockedId_key` (`blockerId`,`blockedId`),
  KEY `Block_blockedId_fkey` (`blockedId`),
  CONSTRAINT `Block_blockedId_fkey` FOREIGN KEY (`blockedId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Block_blockerId_fkey` FOREIGN KEY (`blockerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `block`
--

LOCK TABLES `block` WRITE;
/*!40000 ALTER TABLE `block` DISABLE KEYS */;
/*!40000 ALTER TABLE `block` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `businesshour`
--

DROP TABLE IF EXISTS `businesshour`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `businesshour` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `weekday` int(11) NOT NULL,
  `opensAt` varchar(191) NOT NULL,
  `closesAt` varchar(191) NOT NULL,
  `isClosed` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `BusinessHour_storeId_weekday_key` (`storeId`,`weekday`),
  CONSTRAINT `BusinessHour_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `businesshour`
--

LOCK TABLES `businesshour` WRITE;
/*!40000 ALTER TABLE `businesshour` DISABLE KEYS */;
INSERT INTO `businesshour` VALUES ('cmpt5qc39000nidw4exh4ahsk','cmpt5qc39000lidw4jwy1bqzj',0,'08:00','22:00',1),('cmpt5qc39000oidw45z0gkr88','cmpt5qc39000lidw4jwy1bqzj',1,'08:00','22:00',0),('cmpt5qc39000pidw48ewyz4hi','cmpt5qc39000lidw4jwy1bqzj',2,'08:00','22:00',0),('cmpt5qc39000qidw4olqgtpr9','cmpt5qc39000lidw4jwy1bqzj',3,'08:00','22:00',0),('cmpt5qc39000ridw43kquqqe8','cmpt5qc39000lidw4jwy1bqzj',4,'08:00','22:00',0),('cmpt5qc39000sidw4mmhcz8ml','cmpt5qc39000lidw4jwy1bqzj',5,'08:00','22:00',0),('cmpt5qc39000tidw4s8m7667r','cmpt5qc39000lidw4jwy1bqzj',6,'08:00','22:00',0),('cmpt5qc4x001jidw4lk0lonsb','cmpt5qc4x001hidw4knfsf1r3',0,'08:00','22:00',1),('cmpt5qc4x001kidw4iyypdl4b','cmpt5qc4x001hidw4knfsf1r3',1,'08:00','22:00',0),('cmpt5qc4x001lidw43q7y9oge','cmpt5qc4x001hidw4knfsf1r3',2,'08:00','22:00',0),('cmpt5qc4x001midw415qnw3l3','cmpt5qc4x001hidw4knfsf1r3',3,'08:00','22:00',0),('cmpt5qc4x001nidw4m1dx1gat','cmpt5qc4x001hidw4knfsf1r3',4,'08:00','22:00',0),('cmpt5qc4x001oidw41ls7wnyu','cmpt5qc4x001hidw4knfsf1r3',5,'08:00','22:00',0),('cmpt5qc4x001pidw4gmkw14xu','cmpt5qc4x001hidw4knfsf1r3',6,'08:00','22:00',0),('cmpt5qc6l002hidw4q6xpnqnk','cmpt5qc6l002fidw42nedf7hv',0,'08:00','22:00',1),('cmpt5qc6l002iidw4retb4d7q','cmpt5qc6l002fidw42nedf7hv',1,'08:00','22:00',0),('cmpt5qc6l002jidw4qtnkhtvp','cmpt5qc6l002fidw42nedf7hv',2,'08:00','22:00',0),('cmpt5qc6l002kidw4vk3tu46v','cmpt5qc6l002fidw42nedf7hv',3,'08:00','22:00',0),('cmpt5qc6l002lidw4qp1ccxcr','cmpt5qc6l002fidw42nedf7hv',4,'08:00','22:00',0),('cmpt5qc6l002midw4j01yg73n','cmpt5qc6l002fidw42nedf7hv',5,'08:00','22:00',0),('cmpt5qc6l002nidw4g85d0wun','cmpt5qc6l002fidw42nedf7hv',6,'08:00','22:00',0);
/*!40000 ALTER TABLE `businesshour` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Cart_userId_key` (`userId`),
  CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES ('cmpt6y6fh0001idtoxd1apuhx','cmpt5qc1w0009idw4tcxkxqnn','2026-05-31 02:59:19.950','2026-05-31 02:59:19.950');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cartitem`
--

DROP TABLE IF EXISTS `cartitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cartitem` (
  `id` varchar(191) NOT NULL,
  `cartId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `variantId` varchar(191) DEFAULT NULL,
  `quantity` decimal(12,3) NOT NULL DEFAULT 1.000,
  `unitPrice` decimal(12,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `CartItem_cartId_productId_variantId_key` (`cartId`,`productId`,`variantId`),
  KEY `CartItem_cartId_idx` (`cartId`),
  KEY `CartItem_productId_fkey` (`productId`),
  KEY `CartItem_variantId_fkey` (`variantId`),
  CONSTRAINT `CartItem_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CartItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CartItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cartitem`
--

LOCK TABLES `cartitem` WRITE;
/*!40000 ALTER TABLE `cartitem` DISABLE KEYS */;
INSERT INTO `cartitem` VALUES ('cmpt6y6ft0003idtohvspfdud','cmpt6y6fh0001idtoxd1apuhx','cmpt5qc7e003bidw42zw6cqod',NULL,2.000,19.90,'2026-05-31 02:59:19.961');
/*!40000 ALTER TABLE `cartitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cashbackrule`
--

DROP TABLE IF EXISTS `cashbackrule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cashbackrule` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `type` enum('PERCENT','FIXED') NOT NULL DEFAULT 'PERCENT',
  `value` decimal(12,2) NOT NULL,
  `maxValue` decimal(12,2) DEFAULT NULL,
  `minOrderValue` decimal(12,2) NOT NULL DEFAULT 0.00,
  `releaseAfterDays` int(11) NOT NULL DEFAULT 0,
  `validityDays` int(11) NOT NULL DEFAULT 90,
  `excludePromoProducts` tinyint(1) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `startsAt` datetime(3) DEFAULT NULL,
  `endsAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `CashbackRule_storeId_idx` (`storeId`),
  CONSTRAINT `CashbackRule_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cashbackrule`
--

LOCK TABLES `cashbackrule` WRITE;
/*!40000 ALTER TABLE `cashbackrule` DISABLE KEYS */;
INSERT INTO `cashbackrule` VALUES ('cmpt5qc390010idw4jbomlee3','cmpt5qc39000lidw4jwy1bqzj','Cashback de boas-vindas','PERCENT',5.00,NULL,0.00,7,90,0,1,NULL,NULL,'2026-05-31 02:25:14.421'),('cmpt5qc4x001widw4orhq0yew','cmpt5qc4x001hidw4knfsf1r3','Cashback de boas-vindas','PERCENT',5.00,NULL,0.00,7,90,0,1,NULL,NULL,'2026-05-31 02:25:14.481'),('cmpt5qc6l002uidw4ecfs5kjc','cmpt5qc6l002fidw42nedf7hv','Cashback de boas-vindas','PERCENT',5.00,NULL,0.00,7,90,0,1,NULL,NULL,'2026-05-31 02:25:14.541');
/*!40000 ALTER TABLE `cashbackrule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cashbacktransaction`
--

DROP TABLE IF EXISTS `cashbacktransaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cashbacktransaction` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `orderId` varchar(191) DEFAULT NULL,
  `ruleId` varchar(191) DEFAULT NULL,
  `type` enum('EARNED','REDEEMED','EXPIRED','REVERSED') NOT NULL,
  `status` enum('PENDING','AVAILABLE','USED','EXPIRED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `amount` decimal(12,2) NOT NULL,
  `availableAt` datetime(3) DEFAULT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `CashbackTransaction_userId_idx` (`userId`),
  KEY `CashbackTransaction_storeId_idx` (`storeId`),
  KEY `CashbackTransaction_orderId_fkey` (`orderId`),
  KEY `CashbackTransaction_ruleId_fkey` (`ruleId`),
  CONSTRAINT `CashbackTransaction_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CashbackTransaction_ruleId_fkey` FOREIGN KEY (`ruleId`) REFERENCES `cashbackrule` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CashbackTransaction_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CashbackTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cashbacktransaction`
--

LOCK TABLES `cashbacktransaction` WRITE;
/*!40000 ALTER TABLE `cashbacktransaction` DISABLE KEYS */;
INSERT INTO `cashbacktransaction` VALUES ('cmpt6pl6z000aidxol1s0y275','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc8o003sidw4y9o5lgvp',NULL,'EARNED','AVAILABLE',0.74,'2026-05-31 02:52:39.177','2026-08-29 02:52:39.177','2026-05-31 02:52:39.179');
/*!40000 ALTER TABLE `cashbacktransaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cashbackwallet`
--

DROP TABLE IF EXISTS `cashbackwallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cashbackwallet` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CashbackWallet_userId_storeId_key` (`userId`,`storeId`),
  KEY `CashbackWallet_storeId_fkey` (`storeId`),
  CONSTRAINT `CashbackWallet_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CashbackWallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cashbackwallet`
--

LOCK TABLES `cashbackwallet` WRITE;
/*!40000 ALTER TABLE `cashbackwallet` DISABLE KEYS */;
INSERT INTO `cashbackwallet` VALUES ('cmpt5qc900045idw455g0m9gn','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc39000lidw4jwy1bqzj',0.74);
/*!40000 ALTER TABLE `cashbackwallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `icon` varchar(191) DEFAULT NULL,
  `parentId` varchar(191) DEFAULT NULL,
  `storeId` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`),
  KEY `Category_parentId_idx` (`parentId`),
  KEY `Category_storeId_idx` (`storeId`),
  CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Category_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES ('cmpt5qc2h000eidw4u3291jlz','Mercado','mercado','🛒',NULL,NULL),('cmpt5qc2o000fidw4jrxflfrj','Restaurantes','restaurantes','🍔',NULL,NULL),('cmpt5qc2s000gidw4erexq1i1','Moda','moda','👕',NULL,NULL),('cmpt5qc2w000hidw4uevhew1w','Eletrônicos','eletronicos','📱',NULL,NULL),('cmpt5qc30000iidw4vo5cy6ve','Beleza','beleza','💄',NULL,NULL),('cmpt5qc34000jidw4r7avfdui','Casa','casa','🏠',NULL,NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `id` varchar(191) NOT NULL,
  `postId` varchar(191) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `parentId` varchar(191) DEFAULT NULL,
  `content` text NOT NULL,
  `likeCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Comment_postId_idx` (`postId`),
  KEY `Comment_authorId_idx` (`authorId`),
  KEY `Comment_parentId_fkey` (`parentId`),
  CONSTRAINT `Comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `comment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES ('cmpt5qcaj004pidw4w2cjxtca','cmpt5qc9o004gidw4b1ggp075','cmpt5qc1w0009idw4tcxkxqnn',NULL,'Vou aproveitar!',0,'2026-05-31 02:25:14.683');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commentlike`
--

DROP TABLE IF EXISTS `commentlike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commentlike` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `commentId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `CommentLike_userId_commentId_key` (`userId`,`commentId`),
  KEY `CommentLike_commentId_fkey` (`commentId`),
  CONSTRAINT `CommentLike_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `comment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CommentLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commentlike`
--

LOCK TABLES `commentlike` WRITE;
/*!40000 ALTER TABLE `commentlike` DISABLE KEYS */;
/*!40000 ALTER TABLE `commentlike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conversation` (
  `id` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversation`
--

LOCK TABLES `conversation` WRITE;
/*!40000 ALTER TABLE `conversation` DISABLE KEYS */;
INSERT INTO `conversation` VALUES ('cmpt6pl77000bidxohu8lo6fm','2026-05-31 02:52:39.187','2026-05-31 02:52:39.187');
/*!40000 ALTER TABLE `conversation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversationparticipant`
--

DROP TABLE IF EXISTS `conversationparticipant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conversationparticipant` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `lastReadAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ConversationParticipant_conversationId_userId_key` (`conversationId`,`userId`),
  KEY `ConversationParticipant_userId_idx` (`userId`),
  CONSTRAINT `ConversationParticipant_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ConversationParticipant_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversationparticipant`
--

LOCK TABLES `conversationparticipant` WRITE;
/*!40000 ALTER TABLE `conversationparticipant` DISABLE KEYS */;
INSERT INTO `conversationparticipant` VALUES ('cmpt6pl77000didxo72a7hhzp','cmpt6pl77000bidxohu8lo6fm','cmpt5qc1w0009idw4tcxkxqnn',NULL),('cmpt6pl77000eidxotiyqfbu4','cmpt6pl77000bidxohu8lo6fm','cmpt5qc1l0007idw47etpuwok',NULL);
/*!40000 ALTER TABLE `conversationparticipant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupon` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) DEFAULT NULL,
  `code` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `type` enum('PERCENT','FIXED','FREE_SHIPPING') NOT NULL DEFAULT 'PERCENT',
  `value` decimal(12,2) NOT NULL,
  `minOrderValue` decimal(12,2) NOT NULL DEFAULT 0.00,
  `maxDiscount` decimal(12,2) DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usageCount` int(11) NOT NULL DEFAULT 0,
  `perUserLimit` int(11) DEFAULT NULL,
  `requiresLoyaltyTierId` varchar(191) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `startsAt` datetime(3) DEFAULT NULL,
  `endsAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Coupon_storeId_code_key` (`storeId`,`code`),
  KEY `Coupon_storeId_idx` (`storeId`),
  CONSTRAINT `Coupon_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
INSERT INTO `coupon` VALUES ('cmpt6pl5r0000idxo5qqj8aem','cmpt5qc39000lidw4jwy1bqzj','BEMVINDO10','10% na primeira compra','PERCENT',10.00,20.00,NULL,NULL,0,NULL,NULL,1,NULL,NULL,'2026-05-31 02:52:39.136'),('cmpt6pl5r0001idxoc3z8ca9q','cmpt5qc4x001hidw4knfsf1r3','FRETEGRATIS','Frete grátis acima de R$ 50','FREE_SHIPPING',0.00,50.00,NULL,NULL,0,NULL,NULL,1,NULL,NULL,'2026-05-31 02:52:39.136'),('cmpt6pl5s0002idxoayr5fs1u','cmpt5qc6l002fidw42nedf7hv','MODA15','R$ 15 de desconto em moda','FIXED',15.00,80.00,NULL,NULL,0,NULL,NULL,1,NULL,NULL,'2026-05-31 02:52:39.136');
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `couponredemption`
--

DROP TABLE IF EXISTS `couponredemption`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `couponredemption` (
  `id` varchar(191) NOT NULL,
  `couponId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `orderId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `CouponRedemption_couponId_idx` (`couponId`),
  KEY `CouponRedemption_userId_idx` (`userId`),
  KEY `CouponRedemption_orderId_fkey` (`orderId`),
  CONSTRAINT `CouponRedemption_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CouponRedemption_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `CouponRedemption_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `couponredemption`
--

LOCK TABLES `couponredemption` WRITE;
/*!40000 ALTER TABLE `couponredemption` DISABLE KEYS */;
/*!40000 ALTER TABLE `couponredemption` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courierdocument`
--

DROP TABLE IF EXISTS `courierdocument`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courierdocument` (
  `id` varchar(191) NOT NULL,
  `courierId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `url` text NOT NULL,
  `approved` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `CourierDocument_courierId_idx` (`courierId`),
  CONSTRAINT `CourierDocument_courierId_fkey` FOREIGN KEY (`courierId`) REFERENCES `courierprofile` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courierdocument`
--

LOCK TABLES `courierdocument` WRITE;
/*!40000 ALTER TABLE `courierdocument` DISABLE KEYS */;
/*!40000 ALTER TABLE `courierdocument` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courierprofile`
--

DROP TABLE IF EXISTS `courierprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courierprofile` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','SUSPENDED') NOT NULL DEFAULT 'PENDING',
  `isOnline` tinyint(1) NOT NULL DEFAULT 0,
  `vehicleType` enum('BIKE','MOTORCYCLE','CAR','FOOT') NOT NULL DEFAULT 'MOTORCYCLE',
  `pixKey` varchar(191) DEFAULT NULL,
  `bankInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`bankInfo`)),
  `documentsApproved` tinyint(1) NOT NULL DEFAULT 0,
  `currentLat` double DEFAULT NULL,
  `currentLng` double DEFAULT NULL,
  `ratingAvg` double NOT NULL DEFAULT 0,
  `ratingCount` int(11) NOT NULL DEFAULT 0,
  `deliveriesCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `CourierProfile_userId_key` (`userId`),
  CONSTRAINT `CourierProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courierprofile`
--

LOCK TABLES `courierprofile` WRITE;
/*!40000 ALTER TABLE `courierprofile` DISABLE KEYS */;
INSERT INTO `courierprofile` VALUES ('cmpt5qc2a000didw4jo6b7gbx','cmpt5qc26000bidw4c80nfxf6','APPROVED',1,'MOTORCYCLE','carlos@pix.com',NULL,1,-23.5605,-46.6553,0,0,0,'2026-05-31 02:25:14.386');
/*!40000 ALTER TABLE `courierprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery`
--

DROP TABLE IF EXISTS `delivery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `courierId` varchar(191) DEFAULT NULL,
  `status` enum('PENDING','ASSIGNED','ACCEPTED','PICKED_UP','IN_TRANSIT','DELIVERED','CANCELLED','FAILED') NOT NULL DEFAULT 'PENDING',
  `distanceKm` double NOT NULL DEFAULT 0,
  `fee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `courierEarnings` decimal(12,2) NOT NULL DEFAULT 0.00,
  `platformFee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `estimatedMinutes` int(11) NOT NULL DEFAULT 45,
  `pickupLat` double DEFAULT NULL,
  `pickupLng` double DEFAULT NULL,
  `dropoffLat` double DEFAULT NULL,
  `dropoffLng` double DEFAULT NULL,
  `currentLat` double DEFAULT NULL,
  `currentLng` double DEFAULT NULL,
  `acceptedAt` datetime(3) DEFAULT NULL,
  `pickedUpAt` datetime(3) DEFAULT NULL,
  `deliveredAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Delivery_orderId_key` (`orderId`),
  KEY `Delivery_courierId_idx` (`courierId`),
  KEY `Delivery_status_idx` (`status`),
  CONSTRAINT `Delivery_courierId_fkey` FOREIGN KEY (`courierId`) REFERENCES `courierprofile` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Delivery_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery`
--

LOCK TABLES `delivery` WRITE;
/*!40000 ALTER TABLE `delivery` DISABLE KEYS */;
INSERT INTO `delivery` VALUES ('cmpt5qc8o0043idw42pqfnlw3','cmpt5qc8o003sidw4y9o5lgvp','cmpt5qc2a000didw4jo6b7gbx','DELIVERED',3.2,7.50,6.00,1.50,35,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-31 02:25:14.613','2026-05-31 02:25:14.616'),('cmpt5qc9c004eidw4hj4dy2tq','cmpt5qc9c0049idw4p36cf3ek',NULL,'PENDING',2.1,6.00,4.80,1.20,30,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-31 02:25:14.641');
/*!40000 ALTER TABLE `delivery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliveryzone`
--

DROP TABLE IF EXISTS `deliveryzone`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `deliveryzone` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `maxDistanceKm` double NOT NULL,
  `fee` decimal(12,2) NOT NULL,
  `minOrderValue` decimal(12,2) NOT NULL DEFAULT 0.00,
  `estimatedMinutes` int(11) NOT NULL DEFAULT 45,
  PRIMARY KEY (`id`),
  KEY `DeliveryZone_storeId_idx` (`storeId`),
  CONSTRAINT `DeliveryZone_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveryzone`
--

LOCK TABLES `deliveryzone` WRITE;
/*!40000 ALTER TABLE `deliveryzone` DISABLE KEYS */;
/*!40000 ALTER TABLE `deliveryzone` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `follow`
--

DROP TABLE IF EXISTS `follow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `follow` (
  `id` varchar(191) NOT NULL,
  `followerId` varchar(191) NOT NULL,
  `followingId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Follow_followerId_followingId_key` (`followerId`,`followingId`),
  KEY `Follow_followingId_fkey` (`followingId`),
  CONSTRAINT `Follow_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Follow_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `follow`
--

LOCK TABLES `follow` WRITE;
/*!40000 ALTER TABLE `follow` DISABLE KEYS */;
/*!40000 ALTER TABLE `follow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friendship`
--

DROP TABLE IF EXISTS `friendship`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `friendship` (
  `id` varchar(191) NOT NULL,
  `requesterId` varchar(191) NOT NULL,
  `addresseeId` varchar(191) NOT NULL,
  `status` enum('PENDING','ACCEPTED','BLOCKED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Friendship_requesterId_addresseeId_key` (`requesterId`,`addresseeId`),
  KEY `Friendship_addresseeId_fkey` (`addresseeId`),
  CONSTRAINT `Friendship_addresseeId_fkey` FOREIGN KEY (`addresseeId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Friendship_requesterId_fkey` FOREIGN KEY (`requesterId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friendship`
--

LOCK TABLES `friendship` WRITE;
/*!40000 ALTER TABLE `friendship` DISABLE KEYS */;
/*!40000 ALTER TABLE `friendship` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loyaltystatus`
--

DROP TABLE IF EXISTS `loyaltystatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loyaltystatus` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `tierId` varchar(191) DEFAULT NULL,
  `totalOrders` int(11) NOT NULL DEFAULT 0,
  `totalSpend` decimal(12,2) NOT NULL DEFAULT 0.00,
  `points` int(11) NOT NULL DEFAULT 0,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `LoyaltyStatus_userId_storeId_key` (`userId`,`storeId`),
  KEY `LoyaltyStatus_storeId_idx` (`storeId`),
  KEY `LoyaltyStatus_tierId_fkey` (`tierId`),
  CONSTRAINT `LoyaltyStatus_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `LoyaltyStatus_tierId_fkey` FOREIGN KEY (`tierId`) REFERENCES `loyaltytier` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `LoyaltyStatus_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyaltystatus`
--

LOCK TABLES `loyaltystatus` WRITE;
/*!40000 ALTER TABLE `loyaltystatus` DISABLE KEYS */;
INSERT INTO `loyaltystatus` VALUES ('cmpt5qc960047idw48a7on66q','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc39000lidw4jwy1bqzj',NULL,1,22.30,0,'2026-05-31 02:25:14.634');
/*!40000 ALTER TABLE `loyaltystatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loyaltytier`
--

DROP TABLE IF EXISTS `loyaltytier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `loyaltytier` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `level` int(11) NOT NULL,
  `minOrders` int(11) NOT NULL DEFAULT 0,
  `minSpend` decimal(12,2) NOT NULL DEFAULT 0.00,
  `color` varchar(191) DEFAULT NULL,
  `benefits` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`benefits`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `LoyaltyTier_storeId_level_key` (`storeId`,`level`),
  KEY `LoyaltyTier_storeId_idx` (`storeId`),
  CONSTRAINT `LoyaltyTier_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyaltytier`
--

LOCK TABLES `loyaltytier` WRITE;
/*!40000 ALTER TABLE `loyaltytier` DISABLE KEYS */;
INSERT INTO `loyaltytier` VALUES ('cmpt5qc39000vidw46pzx4129','cmpt5qc39000lidw4jwy1bqzj','Bronze',1,0,0.00,'#b45309',NULL),('cmpt5qc39000widw4rofs1ja0','cmpt5qc39000lidw4jwy1bqzj','Prata',2,5,250.00,'#64748b',NULL),('cmpt5qc39000xidw4u8gf97py','cmpt5qc39000lidw4jwy1bqzj','Ouro',3,15,800.00,'#ca8a04',NULL),('cmpt5qc39000yidw4ti3rw6k7','cmpt5qc39000lidw4jwy1bqzj','Diamante',4,30,2000.00,'#0891b2',NULL),('cmpt5qc39000zidw4ughh4dul','cmpt5qc39000lidw4jwy1bqzj','VIP',5,60,5000.00,'#7c3aed',NULL),('cmpt5qc4x001ridw4l6hvjoow','cmpt5qc4x001hidw4knfsf1r3','Bronze',1,0,0.00,'#b45309',NULL),('cmpt5qc4x001sidw4rao6poo6','cmpt5qc4x001hidw4knfsf1r3','Prata',2,5,250.00,'#64748b',NULL),('cmpt5qc4x001tidw414l40uwh','cmpt5qc4x001hidw4knfsf1r3','Ouro',3,15,800.00,'#ca8a04',NULL),('cmpt5qc4x001uidw4bwrqvki8','cmpt5qc4x001hidw4knfsf1r3','Diamante',4,30,2000.00,'#0891b2',NULL),('cmpt5qc4x001vidw42hselxta','cmpt5qc4x001hidw4knfsf1r3','VIP',5,60,5000.00,'#7c3aed',NULL),('cmpt5qc6l002pidw4v07e1jce','cmpt5qc6l002fidw42nedf7hv','Bronze',1,0,0.00,'#b45309',NULL),('cmpt5qc6l002qidw4qpztdw5b','cmpt5qc6l002fidw42nedf7hv','Prata',2,5,250.00,'#64748b',NULL),('cmpt5qc6l002ridw4c9yvsz0s','cmpt5qc6l002fidw42nedf7hv','Ouro',3,15,800.00,'#ca8a04',NULL),('cmpt5qc6l002sidw4zsdkv0u6','cmpt5qc6l002fidw42nedf7hv','Diamante',4,30,2000.00,'#0891b2',NULL),('cmpt5qc6l002tidw4yabz5a8c','cmpt5qc6l002fidw42nedf7hv','VIP',5,60,5000.00,'#7c3aed',NULL);
/*!40000 ALTER TABLE `loyaltytier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `senderId` varchar(191) NOT NULL,
  `content` text NOT NULL,
  `readAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Message_conversationId_idx` (`conversationId`),
  KEY `Message_senderId_fkey` (`senderId`),
  CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Message_senderId_fkey` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
INSERT INTO `message` VALUES ('cmpt6pl77000gidxovde3s8lc','cmpt6pl77000bidxohu8lo6fm','cmpt5qc1w0009idw4tcxkxqnn','Olá! O X-Burger Artesanal ainda está na promoção?',NULL,'2026-05-31 02:48:39.186'),('cmpt6pl77000hidxot5dkr5cy','cmpt6pl77000bidxohu8lo6fm','cmpt5qc1l0007idw47etpuwok','Oi! Sim 😄 válida até o fim de semana, com 5% de cashback.',NULL,'2026-05-31 02:49:39.186'),('cmpt6pl77000iidxoskyaj16b','cmpt6pl77000bidxohu8lo6fm','cmpt5qc1w0009idw4tcxkxqnn','Perfeito! Vou pedir agora mesmo. Obrigado!',NULL,'2026-05-31 02:50:39.186'),('cmpt6pl77000jidxoi71zd7jg','cmpt6pl77000bidxohu8lo6fm','cmpt5qc1l0007idw47etpuwok','Maravilha! Qualquer dúvida é só chamar. 🚀',NULL,'2026-05-31 02:51:39.186');
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` enum('ORDER','DELIVERY','SOCIAL','CASHBACK','LOYALTY','MESSAGE','PROMOTION','SYSTEM') NOT NULL,
  `title` varchar(191) NOT NULL,
  `body` text DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `readAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Notification_userId_idx` (`userId`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order` (
  `id` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `customerId` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED','PREPARING','READY','OUT_FOR_DELIVERY','DELIVERED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `fulfillmentType` enum('DELIVERY','PICKUP') NOT NULL DEFAULT 'DELIVERY',
  `subtotal` decimal(12,2) NOT NULL,
  `discountTotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `cashbackUsed` decimal(12,2) NOT NULL DEFAULT 0.00,
  `deliveryFee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL,
  `cashbackEarned` decimal(12,2) NOT NULL DEFAULT 0.00,
  `couponId` varchar(191) DEFAULT NULL,
  `addressId` varchar(191) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `placedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `acceptedAt` datetime(3) DEFAULT NULL,
  `readyAt` datetime(3) DEFAULT NULL,
  `deliveredAt` datetime(3) DEFAULT NULL,
  `cancelledAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `commissionFee` decimal(12,2) NOT NULL DEFAULT 0.00,
  `costTotal` decimal(12,2) NOT NULL DEFAULT 0.00,
  `netProfit` decimal(12,2) NOT NULL DEFAULT 0.00,
  `paymentFee` decimal(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Order_code_key` (`code`),
  KEY `Order_customerId_idx` (`customerId`),
  KEY `Order_storeId_idx` (`storeId`),
  KEY `Order_status_idx` (`status`),
  KEY `Order_couponId_fkey` (`couponId`),
  KEY `Order_addressId_fkey` (`addressId`),
  KEY `Order_createdAt_idx` (`createdAt`),
  CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `address` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Order_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Order_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES ('cmpt5qc8o003sidw4y9o5lgvp','CMZ-DEMO01','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc39000lidw4jwy1bqzj','DELIVERED','DELIVERY',14.80,0.00,0.00,7.50,22.30,0.74,NULL,NULL,NULL,'2026-05-31 02:25:14.616',NULL,NULL,'2026-05-31 02:25:14.611',NULL,'2026-05-31 02:25:14.616','2026-05-31 02:25:14.616',0.00,0.00,0.00,0.00),('cmpt5qc9c0049idw4p36cf3ek','CMZ-DEMO02','cmpt5qc21000aidw4dujgv7dw','cmpt5qc4x001hidw4knfsf1r3','PENDING','DELIVERY',19.90,0.00,0.00,6.00,25.90,0.00,NULL,NULL,NULL,'2026-05-31 02:25:14.641',NULL,NULL,NULL,NULL,'2026-05-31 02:25:14.641','2026-05-31 02:25:14.641',0.00,0.00,0.00,0.00);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitem`
--

DROP TABLE IF EXISTS `orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderitem` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `productId` varchar(191) DEFAULT NULL,
  `variantId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `unitPrice` decimal(12,2) NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `cashbackPercent` decimal(5,2) NOT NULL DEFAULT 0.00,
  `costPrice` decimal(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `OrderItem_orderId_idx` (`orderId`),
  KEY `OrderItem_productId_fkey` (`productId`),
  KEY `OrderItem_variantId_fkey` (`variantId`),
  CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitem`
--

LOCK TABLES `orderitem` WRITE;
/*!40000 ALTER TABLE `orderitem` DISABLE KEYS */;
INSERT INTO `orderitem` VALUES ('cmpt5qc8o003uidw4fue1evwj','cmpt5qc8o003sidw4y9o5lgvp','cmpt5qc420015idw4hgc7q9wr',NULL,'Banana Prata (kg)',6.90,1.000,6.90,5.00,0.00),('cmpt5qc8o003vidw4hhiqooo7','cmpt5qc8o003sidw4y9o5lgvp','cmpt5qc4a0018idw49yia2qbr',NULL,'Maçã Gala (kg)',7.90,1.000,7.90,5.00,0.00),('cmpt5qc9c004bidw4qf76yolm','cmpt5qc9c0049idw4p36cf3ek','cmpt5qc5s0020idw4eb9nccqg',NULL,'X-Burger Artesanal',19.90,1.000,19.90,0.00,0.00);
/*!40000 ALTER TABLE `orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderstatushistory`
--

DROP TABLE IF EXISTS `orderstatushistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orderstatushistory` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `status` enum('PENDING','ACCEPTED','REJECTED','PREPARING','READY','OUT_FOR_DELIVERY','DELIVERED','COMPLETED','CANCELLED') NOT NULL,
  `note` varchar(191) DEFAULT NULL,
  `createdById` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `OrderStatusHistory_orderId_idx` (`orderId`),
  KEY `OrderStatusHistory_createdById_fkey` (`createdById`),
  CONSTRAINT `OrderStatusHistory_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `OrderStatusHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderstatushistory`
--

LOCK TABLES `orderstatushistory` WRITE;
/*!40000 ALTER TABLE `orderstatushistory` DISABLE KEYS */;
INSERT INTO `orderstatushistory` VALUES ('cmpt5qc8o003xidw4rhvxegtj','cmpt5qc8o003sidw4y9o5lgvp','PENDING',NULL,NULL,'2026-05-31 02:25:14.616'),('cmpt5qc8o003yidw46b1n3hgz','cmpt5qc8o003sidw4y9o5lgvp','ACCEPTED',NULL,NULL,'2026-05-31 02:25:14.616'),('cmpt5qc8o003zidw45j2qpqpz','cmpt5qc8o003sidw4y9o5lgvp','PREPARING',NULL,NULL,'2026-05-31 02:25:14.616'),('cmpt5qc8o0040idw4brzvz0oy','cmpt5qc8o003sidw4y9o5lgvp','OUT_FOR_DELIVERY',NULL,NULL,'2026-05-31 02:25:14.616'),('cmpt5qc8o0041idw4zi2fz2uu','cmpt5qc8o003sidw4y9o5lgvp','DELIVERED',NULL,NULL,'2026-05-31 02:25:14.616'),('cmpt5qc9c004didw4pg8v6tgx','cmpt5qc9c0049idw4p36cf3ek','PENDING',NULL,NULL,'2026-05-31 02:25:14.641');
/*!40000 ALTER TABLE `orderstatushistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passwordresettoken`
--

DROP TABLE IF EXISTS `passwordresettoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passwordresettoken` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  `usedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `PasswordResetToken_token_key` (`token`),
  KEY `PasswordResetToken_userId_idx` (`userId`),
  CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passwordresettoken`
--

LOCK TABLES `passwordresettoken` WRITE;
/*!40000 ALTER TABLE `passwordresettoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `passwordresettoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `method` enum('PIX','CREDIT_CARD','DEBIT_CARD','CASH_ON_DELIVERY','WALLET','CASHBACK') NOT NULL,
  `status` enum('PENDING','PAID','FAILED','REFUNDED','PARTIALLY_REFUNDED') NOT NULL DEFAULT 'PENDING',
  `amount` decimal(12,2) NOT NULL,
  `provider` varchar(191) DEFAULT NULL,
  `providerRef` varchar(191) DEFAULT NULL,
  `paidAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Payment_orderId_key` (`orderId`),
  CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES ('cmpt5qc8o003widw4rsd5mgzc','cmpt5qc8o003sidw4y9o5lgvp','PIX','PAID',22.30,NULL,NULL,'2026-05-31 02:25:14.611','2026-05-31 02:25:14.616'),('cmpt5qc9c004cidw48yraawoa','cmpt5qc9c0049idw4p36cf3ek','CASH_ON_DELIVERY','PENDING',25.90,NULL,NULL,NULL,'2026-05-31 02:25:14.641');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission`
--

DROP TABLE IF EXISTS `permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permission` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Permission_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission`
--

LOCK TABLES `permission` WRITE;
/*!40000 ALTER TABLE `permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plan` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `interval` enum('MONTHLY','YEARLY') NOT NULL DEFAULT 'MONTHLY',
  `commissionRate` decimal(5,2) NOT NULL DEFAULT 0.00,
  `maxProducts` int(11) DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Plan_name_key` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan`
--

LOCK TABLES `plan` WRITE;
/*!40000 ALTER TABLE `plan` DISABLE KEYS */;
INSERT INTO `plan` VALUES ('cmpt5qc010000idw4agdkeg45','FREE','Para começar',0.00,'MONTHLY',12.00,30,NULL,1,'2026-05-31 02:25:14.305'),('cmpt5qc0c0001idw4cnyam2p0','PRO','Para crescer',49.90,'MONTHLY',8.00,500,NULL,1,'2026-05-31 02:25:14.316'),('cmpt5qc0n0002idw42xycfcyz','BUSINESS','Para escalar',149.90,'MONTHLY',5.00,NULL,NULL,1,'2026-05-31 02:25:14.328');
/*!40000 ALTER TABLE `plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platformsetting`
--

DROP TABLE IF EXISTS `platformsetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `platformsetting` (
  `id` varchar(191) NOT NULL,
  `key` varchar(191) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`value`)),
  `description` text DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `PlatformSetting_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platformsetting`
--

LOCK TABLES `platformsetting` WRITE;
/*!40000 ALTER TABLE `platformsetting` DISABLE KEYS */;
INSERT INTO `platformsetting` VALUES ('cmpt5qc0t0003idw4bgxbm9nz','general','{\"appName\":\"ComerziaHub\",\"defaultCommission\":10,\"currency\":\"BRL\"}','Configurações gerais','2026-05-31 02:25:14.333');
/*!40000 ALTER TABLE `platformsetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post` (
  `id` varchar(191) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `storeId` varchar(191) DEFAULT NULL,
  `type` enum('TEXT','IMAGE','PROMOTION','PRODUCT','NEWS') NOT NULL DEFAULT 'TEXT',
  `content` text DEFAULT NULL,
  `productId` varchar(191) DEFAULT NULL,
  `status` enum('PUBLISHED','HIDDEN','REMOVED') NOT NULL DEFAULT 'PUBLISHED',
  `likeCount` int(11) NOT NULL DEFAULT 0,
  `commentCount` int(11) NOT NULL DEFAULT 0,
  `shareCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Post_authorId_idx` (`authorId`),
  KEY `Post_storeId_idx` (`storeId`),
  KEY `Post_status_idx` (`status`),
  KEY `Post_productId_fkey` (`productId`),
  CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Post_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Post_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES ('cmpt5qc9o004gidw4b1ggp075','cmpt5qc1f0006idw4dimthr8p','cmpt5qc39000lidw4jwy1bqzj','PROMOTION','🍏 Semana da fruta! Maçã Gala com 20% de desconto. Aproveite e ainda ganhe 5% de cashback!',NULL,'PUBLISHED',2,1,0,'2026-05-31 02:25:14.653','2026-05-31 02:25:14.688'),('cmpt5qc9v004jidw4p8vnkn1t','cmpt5qc1l0007idw47etpuwok','cmpt5qc4x001hidw4knfsf1r3','PRODUCT','Novo X-Burger Artesanal no precinho de lançamento! 🍔','cmpt5qc5s0020idw4eb9nccqg','PUBLISHED',0,0,0,'2026-05-31 02:25:14.660','2026-05-31 02:25:14.660'),('cmpt5qca2004lidw4h1dyj92o','cmpt5qc1w0009idw4tcxkxqnn',NULL,'TEXT','Comprei na Hortifruti do Bairro e a entrega foi super rápida. Recomendo! 🚀',NULL,'PUBLISHED',0,0,0,'2026-05-31 02:25:14.666','2026-05-31 02:25:14.666');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postimage`
--

DROP TABLE IF EXISTS `postimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postimage` (
  `id` varchar(191) NOT NULL,
  `postId` varchar(191) NOT NULL,
  `url` text NOT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `PostImage_postId_idx` (`postId`),
  CONSTRAINT `PostImage_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postimage`
--

LOCK TABLES `postimage` WRITE;
/*!40000 ALTER TABLE `postimage` DISABLE KEYS */;
INSERT INTO `postimage` VALUES ('cmpt5qc9o004hidw4thtgwdtt','cmpt5qc9o004gidw4b1ggp075','https://picsum.photos/seed/promo-frutas/800/800',0);
/*!40000 ALTER TABLE `postimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `postlike`
--

DROP TABLE IF EXISTS `postlike`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `postlike` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `postId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `PostLike_userId_postId_key` (`userId`,`postId`),
  KEY `PostLike_postId_fkey` (`postId`),
  CONSTRAINT `PostLike_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `PostLike_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `postlike`
--

LOCK TABLES `postlike` WRITE;
/*!40000 ALTER TABLE `postlike` DISABLE KEYS */;
INSERT INTO `postlike` VALUES ('cmpt5qca8004midw47dfacqep','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc9o004gidw4b1ggp075','2026-05-31 02:25:14.672'),('cmpt5qca8004nidw44tsa09uh','cmpt5qc21000aidw4dujgv7dw','cmpt5qc9o004gidw4b1ggp075','2026-05-31 02:25:14.672');
/*!40000 ALTER TABLE `postlike` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `categoryId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `brand` varchar(191) DEFAULT NULL,
  `sku` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','PAUSED','OUT_OF_STOCK','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `basePrice` decimal(12,2) NOT NULL,
  `promoPrice` decimal(12,2) DEFAULT NULL,
  `promoStartsAt` datetime(3) DEFAULT NULL,
  `promoEndsAt` datetime(3) DEFAULT NULL,
  `manageStock` tinyint(1) NOT NULL DEFAULT 1,
  `stock` decimal(12,3) NOT NULL DEFAULT 0.000,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `allowCashback` tinyint(1) NOT NULL DEFAULT 1,
  `ratingAvg` double NOT NULL DEFAULT 0,
  `ratingCount` int(11) NOT NULL DEFAULT 0,
  `salesCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `costPrice` decimal(12,2) DEFAULT NULL,
  `minQuantity` decimal(12,3) NOT NULL DEFAULT 1.000,
  `unit` enum('UN','KG','G','L','ML','PACOTE','CAIXA','DUZIA','METRO','PORCAO') NOT NULL DEFAULT 'UN',
  `unitStep` decimal(12,3) NOT NULL DEFAULT 1.000,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Product_storeId_slug_key` (`storeId`,`slug`),
  KEY `Product_storeId_idx` (`storeId`),
  KEY `Product_categoryId_idx` (`categoryId`),
  KEY `Product_status_idx` (`status`),
  KEY `Product_isFeatured_idx` (`isFeatured`),
  CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Product_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES ('cmpt5qc420015idw4hgc7q9wr','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc2h000eidw4u3291jlz','Banana Prata','banana-prata-kg','Banana Prata (kg) — produto de demonstração da Hortifruti do Bairro.',NULL,NULL,'ACTIVE',6.90,NULL,NULL,NULL,1,120.000,1,1,4.5,8,2,'2026-05-31 02:25:14.451','2026-06-06 21:44:07.277',4.14,0.100,'KG',0.100),('cmpt5qc4a0018idw49yia2qbr','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc2h000eidw4u3291jlz','Maçã Gala','maca-gala-kg','Maçã Gala (kg) — produto de demonstração da Hortifruti do Bairro.',NULL,NULL,'ACTIVE',9.90,7.90,NULL,NULL,1,80.000,1,1,4.5,8,43,'2026-05-31 02:25:14.459','2026-06-06 21:44:07.288',5.94,0.100,'KG',0.100),('cmpt5qc4l001bidw4fkwxg9zh','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc2h000eidw4u3291jlz','Tomate Italiano','tomate-italiano-kg','Tomate Italiano (kg) — produto de demonstração da Hortifruti do Bairro.',NULL,NULL,'ACTIVE',8.50,NULL,NULL,NULL,1,60.000,0,1,4.5,8,13,'2026-05-31 02:25:14.470','2026-06-06 21:44:07.293',5.10,0.100,'KG',0.100),('cmpt5qc4r001eidw4f643lsg5','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc2h000eidw4u3291jlz','Alface Crespa','alface-crespa','Alface Crespa (un) — produto de demonstração da Hortifruti do Bairro.',NULL,NULL,'ACTIVE',3.50,NULL,NULL,NULL,1,40.000,0,1,4.5,8,39,'2026-05-31 02:25:14.475','2026-06-06 21:44:07.298',2.10,1.000,'UN',1.000),('cmpt5qc5s0020idw4eb9nccqg','cmpt5qc4x001hidw4knfsf1r3','cmpt5qc2o000fidw4jrxflfrj','X-Burger Artesanal','x-burger-artesanal','X-Burger Artesanal — produto de demonstração da Lanchonete Sabor.',NULL,NULL,'ACTIVE',24.90,19.90,NULL,NULL,1,50.000,1,1,4.5,8,40,'2026-05-31 02:25:14.512','2026-06-06 21:44:07.307',14.94,1.000,'UN',1.000),('cmpt5qc5x0023idw4l4djh4ij','cmpt5qc4x001hidw4knfsf1r3','cmpt5qc2o000fidw4jrxflfrj','Batata Frita Cheddar','batata-cheddar','Batata Frita Cheddar — produto de demonstração da Lanchonete Sabor.',NULL,NULL,'ACTIVE',18.00,NULL,NULL,NULL,1,50.000,0,1,4.5,8,19,'2026-05-31 02:25:14.517','2026-06-06 21:44:07.312',10.80,1.000,'UN',1.000),('cmpt5qc680026idw487mxlbm9','cmpt5qc4x001hidw4knfsf1r3','cmpt5qc2o000fidw4jrxflfrj','Combo Casal','combo-casal','Combo Casal — produto de demonstração da Lanchonete Sabor.',NULL,NULL,'ACTIVE',59.90,NULL,NULL,NULL,1,30.000,1,1,4.5,8,29,'2026-05-31 02:25:14.529','2026-06-06 21:44:07.318',35.94,1.000,'UN',1.000),('cmpt5qc6d0029idw4jrefpegt','cmpt5qc4x001hidw4knfsf1r3','cmpt5qc2o000fidw4jrxflfrj','Refrigerante Lata','refri-lata','Refrigerante Lata — produto de demonstração da Lanchonete Sabor.',NULL,NULL,'ACTIVE',6.00,NULL,NULL,NULL,1,200.000,0,1,4.5,8,37,'2026-05-31 02:25:14.534','2026-06-06 21:44:07.324',3.60,1.000,'UN',1.000),('cmpt5qc6y002yidw4rx3vueqm','cmpt5qc6l002fidw42nedf7hv','cmpt5qc2s000gidw4erexq1i1','Camiseta Básica','camiseta-basica','Camiseta Básica — produto de demonstração da Moda Urbana.',NULL,NULL,'ACTIVE',49.90,39.90,NULL,NULL,1,100.000,1,1,4.5,8,26,'2026-05-31 02:25:14.554','2026-06-06 21:44:07.332',29.94,1.000,'UN',1.000),('cmpt5qc730035idw4zu8xmmw5','cmpt5qc6l002fidw42nedf7hv','cmpt5qc2s000gidw4erexq1i1','Moletom Canguru','moletom-canguru','Moletom Canguru — produto de demonstração da Moda Urbana.',NULL,NULL,'ACTIVE',129.90,NULL,NULL,NULL,1,40.000,0,1,4.5,8,20,'2026-05-31 02:25:14.560','2026-06-06 21:44:07.339',77.94,1.000,'UN',1.000),('cmpt5qc780038idw4enak4fww','cmpt5qc6l002fidw42nedf7hv','cmpt5qc2s000gidw4erexq1i1','Boné Aba Reta','bone-aba-reta','Boné Aba Reta — produto de demonstração da Moda Urbana.',NULL,NULL,'ACTIVE',59.90,NULL,NULL,NULL,1,60.000,1,1,4.5,8,0,'2026-05-31 02:25:14.564','2026-06-06 21:44:07.345',35.94,1.000,'UN',1.000),('cmpt5qc7e003bidw42zw6cqod','cmpt5qc6l002fidw42nedf7hv','cmpt5qc2s000gidw4erexq1i1','Meia Cano Alto','meia-cano-alto','Meia Cano Alto — produto de demonstração da Moda Urbana.',NULL,NULL,'ACTIVE',19.90,NULL,NULL,NULL,1,150.000,0,1,4.5,8,26,'2026-05-31 02:25:14.571','2026-06-06 21:44:07.351',11.94,1.000,'UN',1.000);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productfavorite`
--

DROP TABLE IF EXISTS `productfavorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productfavorite` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ProductFavorite_userId_productId_key` (`userId`,`productId`),
  KEY `ProductFavorite_userId_idx` (`userId`),
  KEY `ProductFavorite_productId_fkey` (`productId`),
  CONSTRAINT `ProductFavorite_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ProductFavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productfavorite`
--

LOCK TABLES `productfavorite` WRITE;
/*!40000 ALTER TABLE `productfavorite` DISABLE KEYS */;
INSERT INTO `productfavorite` VALUES ('cmpt5qc7r003gidw4m35ydul1','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc420015idw4hgc7q9wr','2026-05-31 02:25:14.583'),('cmpt5qc7r003hidw4uu1vl8wz','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc4a0018idw49yia2qbr','2026-05-31 02:25:14.583'),('cmpt5qc7r003iidw4b7kdykx8','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc4l001bidw4fkwxg9zh','2026-05-31 02:25:14.583');
/*!40000 ALTER TABLE `productfavorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productimage`
--

DROP TABLE IF EXISTS `productimage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productimage` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `url` text NOT NULL,
  `alt` varchar(191) DEFAULT NULL,
  `position` int(11) NOT NULL DEFAULT 0,
  `isPrimary` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ProductImage_productId_idx` (`productId`),
  CONSTRAINT `ProductImage_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productimage`
--

LOCK TABLES `productimage` WRITE;
/*!40000 ALTER TABLE `productimage` DISABLE KEYS */;
INSERT INTO `productimage` VALUES ('cmpt5qc420016idw4mcrp5ct6','cmpt5qc420015idw4hgc7q9wr','https://picsum.photos/seed/banana-prata-kg/800/800',NULL,0,1),('cmpt5qc4a0019idw4xios4gtn','cmpt5qc4a0018idw49yia2qbr','https://picsum.photos/seed/maca-gala-kg/800/800',NULL,0,1),('cmpt5qc4l001cidw48vqi3382','cmpt5qc4l001bidw4fkwxg9zh','https://picsum.photos/seed/tomate-italiano-kg/800/800',NULL,0,1),('cmpt5qc4r001fidw4mkhf98fi','cmpt5qc4r001eidw4f643lsg5','https://picsum.photos/seed/alface-crespa/800/800',NULL,0,1),('cmpt5qc5s0021idw4d7l4x28w','cmpt5qc5s0020idw4eb9nccqg','https://picsum.photos/seed/x-burger-artesanal/800/800',NULL,0,1),('cmpt5qc5x0024idw4dd364ks1','cmpt5qc5x0023idw4l4djh4ij','https://picsum.photos/seed/batata-cheddar/800/800',NULL,0,1),('cmpt5qc680027idw4elz379sm','cmpt5qc680026idw487mxlbm9','https://picsum.photos/seed/combo-casal/800/800',NULL,0,1),('cmpt5qc6d002aidw4s960h3ds','cmpt5qc6d0029idw4jrefpegt','https://picsum.photos/seed/refri-lata/800/800',NULL,0,1),('cmpt5qc6y002zidw4q2ehls6b','cmpt5qc6y002yidw4rx3vueqm','https://picsum.photos/seed/camiseta-basica/800/800',NULL,0,1),('cmpt5qc730036idw4cwj62fyk','cmpt5qc730035idw4zu8xmmw5','https://picsum.photos/seed/moletom-canguru/800/800',NULL,0,1),('cmpt5qc780039idw46grt50a7','cmpt5qc780038idw4enak4fww','https://picsum.photos/seed/bone-aba-reta/800/800',NULL,0,1),('cmpt5qc7e003cidw4ruwn0slf','cmpt5qc7e003bidw42zw6cqod','https://picsum.photos/seed/meia-cano-alto/800/800',NULL,0,1);
/*!40000 ALTER TABLE `productimage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productvariant`
--

DROP TABLE IF EXISTS `productvariant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productvariant` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `sku` varchar(191) DEFAULT NULL,
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  `price` decimal(12,2) DEFAULT NULL,
  `priceModifier` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stock` decimal(12,3) NOT NULL DEFAULT 0.000,
  `status` enum('ACTIVE','PAUSED','OUT_OF_STOCK','DRAFT') NOT NULL DEFAULT 'ACTIVE',
  `position` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `ProductVariant_productId_idx` (`productId`),
  CONSTRAINT `ProductVariant_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productvariant`
--

LOCK TABLES `productvariant` WRITE;
/*!40000 ALTER TABLE `productvariant` DISABLE KEYS */;
INSERT INTO `productvariant` VALUES ('cmpt5qc6d002bidw4dkzmlxwd','cmpt5qc6d0029idw4jrefpegt','Cola',NULL,NULL,NULL,0.00,80.000,'ACTIVE',0),('cmpt5qc6d002cidw4hxn6ea0y','cmpt5qc6d0029idw4jrefpegt','Guaraná',NULL,NULL,NULL,0.00,80.000,'ACTIVE',1),('cmpt5qc6d002didw4pe8epd0e','cmpt5qc6d0029idw4jrefpegt','Laranja',NULL,NULL,NULL,0.00,40.000,'ACTIVE',2),('cmpt5qc6y0030idw4hehu5374','cmpt5qc6y002yidw4rx3vueqm','P',NULL,NULL,NULL,0.00,20.000,'ACTIVE',0),('cmpt5qc6y0031idw430kn3s09','cmpt5qc6y002yidw4rx3vueqm','M',NULL,NULL,NULL,0.00,40.000,'ACTIVE',1),('cmpt5qc6y0032idw4v5xq549v','cmpt5qc6y002yidw4rx3vueqm','G',NULL,NULL,NULL,0.00,30.000,'ACTIVE',2),('cmpt5qc6y0033idw4b87ew7tf','cmpt5qc6y002yidw4rx3vueqm','GG',NULL,NULL,NULL,0.00,10.000,'ACTIVE',3);
/*!40000 ALTER TABLE `productvariant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `report` (
  `id` varchar(191) NOT NULL,
  `reporterId` varchar(191) NOT NULL,
  `targetType` enum('POST','COMMENT','USER','STORE','PRODUCT') NOT NULL,
  `targetId` varchar(191) NOT NULL,
  `reason` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('PENDING','REVIEWING','RESOLVED','DISMISSED') NOT NULL DEFAULT 'PENDING',
  `resolvedById` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Report_status_idx` (`status`),
  KEY `Report_targetType_idx` (`targetType`),
  KEY `Report_reporterId_fkey` (`reporterId`),
  KEY `Report_resolvedById_fkey` (`resolvedById`),
  CONSTRAINT `Report_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Report_resolvedById_fkey` FOREIGN KEY (`resolvedById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review` (
  `id` varchar(191) NOT NULL,
  `authorId` varchar(191) NOT NULL,
  `type` enum('STORE','PRODUCT','COURIER') NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `storeId` varchar(191) DEFAULT NULL,
  `productId` varchar(191) DEFAULT NULL,
  `courierId` varchar(191) DEFAULT NULL,
  `orderId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Review_storeId_idx` (`storeId`),
  KEY `Review_productId_idx` (`productId`),
  KEY `Review_courierId_idx` (`courierId`),
  KEY `Review_authorId_fkey` (`authorId`),
  KEY `Review_orderId_fkey` (`orderId`),
  CONSTRAINT `Review_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Review_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Review_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES ('cmpt5qc7x003kidw4mqr3ncao','cmpt5qc21000aidw4dujgv7dw','PRODUCT',5,'Produto excelente, recomendo!','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc420015idw4hgc7q9wr',NULL,NULL,'2026-05-31 02:25:14.589'),('cmpt5qc88003midw4rkqw7vzn','cmpt5qc21000aidw4dujgv7dw','PRODUCT',5,'Produto excelente, recomendo!','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc4a0018idw49yia2qbr',NULL,NULL,'2026-05-31 02:25:14.600'),('cmpt5qc8c003oidw4gxshfrne','cmpt5qc21000aidw4dujgv7dw','PRODUCT',5,'Produto excelente, recomendo!','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc4l001bidw4fkwxg9zh',NULL,NULL,'2026-05-31 02:25:14.604'),('cmpt5qc8g003qidw49h694mpb','cmpt5qc21000aidw4dujgv7dw','PRODUCT',5,'Produto excelente, recomendo!','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc4r001eidw4f643lsg5',NULL,NULL,'2026-05-31 02:25:14.608');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `id` varchar(191) NOT NULL,
  `sessionToken` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  KEY `Session_userId_fkey` (`userId`),
  CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `share`
--

DROP TABLE IF EXISTS `share`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `share` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `postId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Share_postId_idx` (`postId`),
  KEY `Share_userId_fkey` (`userId`),
  CONSTRAINT `Share_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Share_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `share`
--

LOCK TABLES `share` WRITE;
/*!40000 ALTER TABLE `share` DISABLE KEYS */;
/*!40000 ALTER TABLE `share` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stockmovement`
--

DROP TABLE IF EXISTS `stockmovement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stockmovement` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `variantId` varchar(191) DEFAULT NULL,
  `type` enum('IN','OUT','ADJUSTMENT','SALE','RETURN') NOT NULL,
  `quantity` decimal(12,3) NOT NULL,
  `reason` varchar(191) DEFAULT NULL,
  `reference` varchar(191) DEFAULT NULL,
  `createdById` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `StockMovement_storeId_idx` (`storeId`),
  KEY `StockMovement_productId_idx` (`productId`),
  KEY `StockMovement_variantId_fkey` (`variantId`),
  KEY `StockMovement_createdById_fkey` (`createdById`),
  CONSTRAINT `StockMovement_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `StockMovement_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StockMovement_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StockMovement_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `productvariant` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stockmovement`
--

LOCK TABLES `stockmovement` WRITE;
/*!40000 ALTER TABLE `stockmovement` DISABLE KEYS */;
/*!40000 ALTER TABLE `stockmovement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store`
--

DROP TABLE IF EXISTS `store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `store` (
  `id` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text DEFAULT NULL,
  `segment` varchar(191) DEFAULT NULL,
  `logoUrl` text DEFAULT NULL,
  `bannerUrl` text DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `document` varchar(191) DEFAULT NULL,
  `status` enum('PENDING','ACTIVE','PAUSED','SUSPENDED') NOT NULL DEFAULT 'PENDING',
  `isOpen` tinyint(1) NOT NULL DEFAULT 1,
  `ratingAvg` double NOT NULL DEFAULT 0,
  `ratingCount` int(11) NOT NULL DEFAULT 0,
  `followerCount` int(11) NOT NULL DEFAULT 0,
  `lat` double DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `ownerId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Store_slug_key` (`slug`),
  KEY `Store_status_idx` (`status`),
  KEY `Store_ownerId_idx` (`ownerId`),
  CONSTRAINT `Store_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store`
--

LOCK TABLES `store` WRITE;
/*!40000 ALTER TABLE `store` DISABLE KEYS */;
INSERT INTO `store` VALUES ('cmpt5qc39000lidw4jwy1bqzj','hortifruti-do-bairro','Hortifruti do Bairro','Frutas, verduras e legumes fresquinhos todos os dias.','Mercado','https://picsum.photos/seed/hortifruti-do-bairro-logo/800/800','https://picsum.photos/seed/hortifruti-do-bairro-banner/800/800',NULL,NULL,NULL,'ACTIVE',1,4.6,12,1,-23.5605,-46.6553,'cmpt5qc1f0006idw4dimthr8p','2026-05-31 02:25:14.421','2026-05-31 02:25:14.421'),('cmpt5qc4x001hidw4knfsf1r3','lanchonete-sabor','Lanchonete Sabor','Os melhores lanches artesanais da região, com entrega rápida.','Restaurante','https://picsum.photos/seed/lanchonete-sabor-logo/800/800','https://picsum.photos/seed/lanchonete-sabor-banner/800/800',NULL,NULL,NULL,'ACTIVE',1,4.6,12,1,-23.5605,-46.6553,'cmpt5qc1l0007idw47etpuwok','2026-05-31 02:25:14.481','2026-05-31 02:25:14.481'),('cmpt5qc6l002fidw42nedf7hv','moda-urbana','Moda Urbana','Roupas e acessórios com estilo para o dia a dia.','Moda','https://picsum.photos/seed/moda-urbana-logo/800/800','https://picsum.photos/seed/moda-urbana-banner/800/800',NULL,NULL,NULL,'ACTIVE',1,4.6,12,1,-23.5605,-46.6553,'cmpt5qc1f0006idw4dimthr8p','2026-05-31 02:25:14.541','2026-05-31 02:25:14.541');
/*!40000 ALTER TABLE `store` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storefavorite`
--

DROP TABLE IF EXISTS `storefavorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storefavorite` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `StoreFavorite_userId_storeId_key` (`userId`,`storeId`),
  KEY `StoreFavorite_userId_idx` (`userId`),
  KEY `StoreFavorite_storeId_fkey` (`storeId`),
  CONSTRAINT `StoreFavorite_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StoreFavorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storefavorite`
--

LOCK TABLES `storefavorite` WRITE;
/*!40000 ALTER TABLE `storefavorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `storefavorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storefollow`
--

DROP TABLE IF EXISTS `storefollow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storefollow` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `StoreFollow_userId_storeId_key` (`userId`,`storeId`),
  KEY `StoreFollow_storeId_fkey` (`storeId`),
  CONSTRAINT `StoreFollow_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StoreFollow_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storefollow`
--

LOCK TABLES `storefollow` WRITE;
/*!40000 ALTER TABLE `storefollow` DISABLE KEYS */;
INSERT INTO `storefollow` VALUES ('cmpt5qc7m003didw42bykev71','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc39000lidw4jwy1bqzj','2026-05-31 02:25:14.579'),('cmpt5qc7m003eidw4zki96qns','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc4x001hidw4knfsf1r3','2026-05-31 02:25:14.579'),('cmpt5qc7m003fidw4ct5dhl7m','cmpt5qc1w0009idw4tcxkxqnn','cmpt5qc6l002fidw42nedf7hv','2026-05-31 02:25:14.579');
/*!40000 ALTER TABLE `storefollow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storemember`
--

DROP TABLE IF EXISTS `storemember`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storemember` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `role` enum('OWNER','MANAGER','STAFF','SELLER') NOT NULL DEFAULT 'STAFF',
  `title` varchar(191) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `StoreMember_storeId_userId_key` (`storeId`,`userId`),
  KEY `StoreMember_userId_idx` (`userId`),
  CONSTRAINT `StoreMember_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `StoreMember_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storemember`
--

LOCK TABLES `storemember` WRITE;
/*!40000 ALTER TABLE `storemember` DISABLE KEYS */;
INSERT INTO `storemember` VALUES ('cmpt5qc3a0012idw4grgxhe0m','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc1f0006idw4dimthr8p','OWNER',NULL,1,'2026-05-31 02:25:14.421'),('cmpt5qc3a0013idw45oy8ddgm','cmpt5qc39000lidw4jwy1bqzj','cmpt5qc1r0008idw4zqahby6z','STAFF',NULL,1,'2026-05-31 02:25:14.421'),('cmpt5qc4x001yidw4pe7q0pek','cmpt5qc4x001hidw4knfsf1r3','cmpt5qc1l0007idw47etpuwok','OWNER',NULL,1,'2026-05-31 02:25:14.481'),('cmpt5qc6l002widw45amf2z20','cmpt5qc6l002fidw42nedf7hv','cmpt5qc1f0006idw4dimthr8p','OWNER',NULL,1,'2026-05-31 02:25:14.541');
/*!40000 ALTER TABLE `storemember` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storesettings`
--

DROP TABLE IF EXISTS `storesettings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storesettings` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `currency` varchar(191) NOT NULL DEFAULT 'BRL',
  `minOrderValue` decimal(12,2) NOT NULL DEFAULT 0.00,
  `prepTimeMinutes` int(11) NOT NULL DEFAULT 30,
  `acceptsDelivery` tinyint(1) NOT NULL DEFAULT 1,
  `acceptsPickup` tinyint(1) NOT NULL DEFAULT 1,
  `autoAcceptOrders` tinyint(1) NOT NULL DEFAULT 0,
  `deliveryFeeBase` decimal(12,2) NOT NULL DEFAULT 0.00,
  `deliveryFeePerKm` decimal(12,2) NOT NULL DEFAULT 0.00,
  `freeDeliveryThreshold` decimal(12,2) DEFAULT NULL,
  `maxDeliveryRadiusKm` double NOT NULL DEFAULT 10,
  `cashbackEnabled` tinyint(1) NOT NULL DEFAULT 0,
  `loyaltyEnabled` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `StoreSettings_storeId_key` (`storeId`),
  CONSTRAINT `StoreSettings_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storesettings`
--

LOCK TABLES `storesettings` WRITE;
/*!40000 ALTER TABLE `storesettings` DISABLE KEYS */;
INSERT INTO `storesettings` VALUES ('cmpt5qc39000midw4nmhqghat','cmpt5qc39000lidw4jwy1bqzj','BRL',10.00,30,1,1,0,5.00,1.50,80.00,10,1,1),('cmpt5qc4x001iidw4r5pd0q0d','cmpt5qc4x001hidw4knfsf1r3','BRL',10.00,30,1,1,0,5.00,1.50,80.00,10,1,1),('cmpt5qc6l002gidw4ltj70454','cmpt5qc6l002fidw42nedf7hv','BRL',10.00,30,1,1,0,5.00,1.50,80.00,10,1,1);
/*!40000 ALTER TABLE `storesettings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription` (
  `id` varchar(191) NOT NULL,
  `storeId` varchar(191) NOT NULL,
  `planId` varchar(191) NOT NULL,
  `status` enum('TRIALING','ACTIVE','PAST_DUE','CANCELLED') NOT NULL DEFAULT 'TRIALING',
  `startedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `currentPeriodEnd` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Subscription_storeId_key` (`storeId`),
  KEY `Subscription_planId_fkey` (`planId`),
  CONSTRAINT `Subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `plan` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Subscription_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `emailVerified` datetime(3) DEFAULT NULL,
  `passwordHash` varchar(191) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `document` varchar(191) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `role` enum('ADMIN','STORE_OWNER','STORE_EMPLOYEE','SELLER','CUSTOMER','COURIER','MODERATOR') NOT NULL DEFAULT 'CUSTOMER',
  `status` enum('ACTIVE','PENDING','SUSPENDED','BANNED') NOT NULL DEFAULT 'ACTIVE',
  `isPrivate` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  KEY `User_role_idx` (`role`),
  KEY `User_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('cmpt5qc100004idw43nl73uge','Admin Geral','admin@comerziahub.com',NULL,'$2a$10$A2KoVLOWGz4Lum1PgxulP.tEqHqwr/3A8BDahXuileHiAqmPI07.S',NULL,NULL,NULL,NULL,'ADMIN','ACTIVE',0,'2026-05-31 02:25:14.341','2026-05-31 02:25:14.341'),('cmpt5qc170005idw4hegagbr7','Moderador Social','moderador@comerziahub.com',NULL,'$2a$10$A2KoVLOWGz4Lum1PgxulP.tEqHqwr/3A8BDahXuileHiAqmPI07.S',NULL,NULL,NULL,NULL,'MODERATOR','ACTIVE',0,'2026-05-31 02:25:14.348','2026-05-31 02:25:14.348'),('cmpt5qc1f0006idw4dimthr8p','Marina Lojista','loja@comerziahub.com',NULL,'$2a$10$A2KoVLOWGz4Lum1PgxulP.tEqHqwr/3A8BDahXuileHiAqmPI07.S',NULL,NULL,NULL,NULL,'STORE_OWNER','ACTIVE',0,'2026-05-31 02:25:14.356','2026-05-31 02:25:14.356'),('cmpt5qc1l0007idw47etpuwok','Rafael Comerciante','loja2@comerziahub.com',NULL,'$2a$10$A2KoVLOWGz4Lum1PgxulP.tEqHqwr/3A8BDahXuileHiAqmPI07.S',NULL,NULL,NULL,NULL,'STORE_OWNER','ACTIVE',0,'2026-05-31 02:25:14.362','2026-05-31 02:25:14.362'),('cmpt5qc1r0008idw4zqahby6z','Júlia Funcionária','funcionario@comerziahub.com',NULL,'$2a$10$A2KoVLOWGz4Lum1PgxulP.tEqHqwr/3A8BDahXuileHiAqmPI07.S',NULL,NULL,NULL,NULL,'STORE_EMPLOYEE','ACTIVE',0,'2026-05-31 02:25:14.367','2026-05-31 02:25:14.367'),('cmpt5qc1w0009idw4tcxkxqnn','Pedro Cliente','cliente@comerziahub.com',NULL,'$2a$10$A2KoVLOWGz4Lum1PgxulP.tEqHqwr/3A8BDahXuileHiAqmPI07.S',NULL,NULL,NULL,NULL,'CUSTOMER','ACTIVE',0,'2026-05-31 02:25:14.373','2026-05-31 02:25:14.373'),('cmpt5qc21000aidw4dujgv7dw','Ana Compradora','cliente2@comerziahub.com',NULL,'$2a$10$A2KoVLOWGz4Lum1PgxulP.tEqHqwr/3A8BDahXuileHiAqmPI07.S',NULL,NULL,NULL,NULL,'CUSTOMER','ACTIVE',0,'2026-05-31 02:25:14.378','2026-05-31 02:25:14.378'),('cmpt5qc26000bidw4c80nfxf6','Carlos Entregador','entregador@comerziahub.com',NULL,'$2a$10$A2KoVLOWGz4Lum1PgxulP.tEqHqwr/3A8BDahXuileHiAqmPI07.S',NULL,NULL,NULL,NULL,'COURIER','ACTIVE',0,'2026-05-31 02:25:14.383','2026-05-31 02:25:14.383'),('cmpu4yam80000id3wc1nw22gn','Usuario Teste','novo_1780253468616@teste.com',NULL,'$2a$10$dWwbxOfzdvkF6fI1qjyEqOmXIZKeJ8Lx7veJ2.X/aKkQd6XA.Yzjq',NULL,'',NULL,NULL,'CUSTOMER','ACTIVE',0,'2026-05-31 18:51:12.320','2026-05-31 18:51:12.320'),('cmq2vr8xs0008idb8w8i7cvvg','Júlia Vendedora','vendedor@comerziahub.com',NULL,'$2a$10$gH98C07bmGVA.PP.Azr/c.VtHRNDZxiweUPZbQSaRhtnPswF37i6K',NULL,NULL,NULL,NULL,'SELLER','ACTIVE',0,'2026-06-06 21:43:42.593','2026-06-06 21:43:42.593');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userbadge`
--

DROP TABLE IF EXISTS `userbadge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userbadge` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `badgeId` varchar(191) NOT NULL,
  `awardedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UserBadge_userId_badgeId_key` (`userId`,`badgeId`),
  KEY `UserBadge_badgeId_fkey` (`badgeId`),
  CONSTRAINT `UserBadge_badgeId_fkey` FOREIGN KEY (`badgeId`) REFERENCES `badge` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserBadge_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userbadge`
--

LOCK TABLES `userbadge` WRITE;
/*!40000 ALTER TABLE `userbadge` DISABLE KEYS */;
INSERT INTO `userbadge` VALUES ('cmpt6pl6j0006idxokveo31ua','cmpt5qc1w0009idw4tcxkxqnn','cmpt6pl630004idxoo0brzt2h','2026-05-31 02:52:39.164'),('cmpt6pl6j0007idxoux6hc5bb','cmpt5qc1w0009idw4tcxkxqnn','cmpt6pl680005idxoqy8shxzc','2026-05-31 02:52:39.164'),('cmpt6pl6j0008idxo5b2swj0d','cmpt5qc21000aidw4dujgv7dw','cmpt6pl680005idxoqy8shxzc','2026-05-31 02:52:39.164');
/*!40000 ALTER TABLE `userbadge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userpermission`
--

DROP TABLE IF EXISTS `userpermission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userpermission` (
  `userId` varchar(191) NOT NULL,
  `permissionId` varchar(191) NOT NULL,
  PRIMARY KEY (`userId`,`permissionId`),
  KEY `UserPermission_permissionId_fkey` (`permissionId`),
  CONSTRAINT `UserPermission_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `UserPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userpermission`
--

LOCK TABLES `userpermission` WRITE;
/*!40000 ALTER TABLE `userpermission` DISABLE KEYS */;
/*!40000 ALTER TABLE `userpermission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verificationtoken`
--

DROP TABLE IF EXISTS `verificationtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verificationtoken` (
  `identifier` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  `id` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verificationtoken`
--

LOCK TABLES `verificationtoken` WRITE;
/*!40000 ALTER TABLE `verificationtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `verificationtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet`
--

DROP TABLE IF EXISTS `wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallet` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `balance` decimal(12,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Wallet_userId_key` (`userId`),
  CONSTRAINT `Wallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet`
--

LOCK TABLES `wallet` WRITE;
/*!40000 ALTER TABLE `wallet` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallettransaction`
--

DROP TABLE IF EXISTS `wallettransaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallettransaction` (
  `id` varchar(191) NOT NULL,
  `walletId` varchar(191) NOT NULL,
  `type` enum('CREDIT','DEBIT') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` text DEFAULT NULL,
  `reference` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `WalletTransaction_walletId_idx` (`walletId`),
  CONSTRAINT `WalletTransaction_walletId_fkey` FOREIGN KEY (`walletId`) REFERENCES `wallet` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallettransaction`
--

LOCK TABLES `wallettransaction` WRITE;
/*!40000 ALTER TABLE `wallettransaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `wallettransaction` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-06 18:48:09
