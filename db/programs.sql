-- MySQL dump 10.13  Distrib 5.5.40, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: pex_openbroadcaster_pro
-- ------------------------------------------------------
-- Server version	5.5.40-1-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for PEX
--

DROP TABLE IF EXISTS `credit_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `credit_roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit_roles`
--

LOCK TABLES `credit_roles` WRITE;
/*!40000 ALTER TABLE `credit_roles` DISABLE KEYS */;
INSERT INTO `credit_roles` VALUES (1,'host'),(2,'producer'),(3,'label'),(4,'guest'),(5,'sponsor'),(6,'station'),(7,'executive producer'),(8,'composer');
/*!40000 ALTER TABLE `credit_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery_media_ids`
--

DROP TABLE IF EXISTS `gallery_media_ids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gallery_media_ids` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `program_id` int(10) unsigned NOT NULL,
  `media_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `gallery_program_id` (`program_id`)
) ENGINE=MyISAM AUTO_INCREMENT=88 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `license_attributes`
--

DROP TABLE IF EXISTS `license_attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `license_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `shortform` varchar(16) NOT NULL,
  `description` varchar(254) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `license_attributes`
--

LOCK TABLES `license_attributes` WRITE;
/*!40000 ALTER TABLE `license_attributes` DISABLE KEYS */;
INSERT INTO `license_attributes` VALUES (0,'Public Domain','PD','The Public Domain Mark is recommended for works that are free of known copyright around the world. These will typically be very old works.  It is not recommended for use with works that are in the public domain in some jurisdictions if they also known to'),(1,'Creative Commons - Attribution','CC BY','This license lets others distribute, remix, tweak, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of lic'),(2,'Creative Commons - Attribution-ShareAlike','CC BY-SA','This license lets others remix, tweak, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software'),(3,'Creative Commons - Attibution-NoDerivs','CC BY-ND','This license allows for redistribution, commercial and non-commercial, as long as it is passed along unchanged and in whole, with credit to you.'),(4,'Creative Commons - Attribution-NonCommercial','CC BY-NC','This license lets others remix, tweak, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.'),(5,'Creative Commons - Attribution-NonCommercial-ShareAlike','CC BY-NC-SA','This license lets others remix, tweak, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.'),(6,'Creative Commons - Attribution-NonCommercial_NoDerivs','CC BY-NC-ND','This license is the most restrictive of our six main licenses, only allowing others to download your works and share them with others as long as they credit you, but they can’t change them in any way or use them commercially.');
/*!40000 ALTER TABLE `license_attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media_credit_roles`
--

DROP TABLE IF EXISTS `media_credit_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_credit_roles` (
  `media_id` int(11) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  `role` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  KEY `media_id` (`media_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `media_meta`
--

DROP TABLE IF EXISTS `media_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media_meta` (
  `id` int(11) unsigned NOT NULL,
  `recording_location` varchar(255) DEFAULT NULL,
  `recording_date` date DEFAULT NULL,
  `tracklist` text,
  `license` varchar(64) DEFAULT NULL,
  `cancon` char(4) DEFAULT NULL,
  `advisory` char(5) DEFAULT NULL,
  `accessibility` char(3) DEFAULT NULL,
  `placard_id` varchar(16) DEFAULT NULL,
  KEY `meta_id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `program_keywords`
--

DROP TABLE IF EXISTS `program_keywords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `program_keywords` (
  `program_id` int(11) unsigned NOT NULL,
  `tag` varchar(255) NOT NULL,
  PRIMARY KEY (`program_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `program_themes`
--

DROP TABLE IF EXISTS `program_themes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `program_themes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_themes`
--

LOCK TABLES `program_themes` WRITE;
/*!40000 ALTER TABLE `program_themes` DISABLE KEYS */;
INSERT INTO `program_themes` VALUES (1,'Strange Noises'),(2,'Education'),(3,'Arts, Culture, and Entertainment'),(4,'Crime, Law and Justice'),(5,'Economy, Business and Finance'),(6,'Food'),(7,'Health'),(8,'Human Interest'),(9,'Lifestyle and Leisure'),(10,'Politics'),(11,'Religion and Belief'),(12,'Science and Technology'),(13,'Society'),(14,'Sport'),(15,'Weather'),(16,'Indigenous First Peoples'),(17,'Conflicts, War and Peace'),(18,'Disaster and Accident'),(19,'Environment'),(20,'Music');
/*!40000 ALTER TABLE `program_themes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programs`
--

DROP TABLE IF EXISTS `programs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programs` (
  `pid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `producer` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `theme_id` int(11) NOT NULL,
  `country_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `copyright` varchar(255) NOT NULL,
  `link_url` varchar(255) NOT NULL,
  `owner_id` int(11) NOT NULL DEFAULT '0',
  `created` int(11) unsigned NOT NULL,
  `updated` int(10) unsigned NOT NULL,
  `explicit_flag` tinyint(1) NOT NULL DEFAULT '0',
  `dynamic_select` tinyint(1) NOT NULL DEFAULT '1',
  `latest_media` int(10) DEFAULT NULL,
  `duration` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`pid`),
  KEY `module_program_manager_ibfk_1` (`producer`),
  KEY `module_program_manager_ibfk_2` (`title`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `programs_credit_roles`
--

DROP TABLE IF EXISTS `programs_credit_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programs_credit_roles` (
  `program_id` int(11) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  `role` varchar(64) NOT NULL,
  `name` varchar(64) NOT NULL,
  KEY `program_id` (`program_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `programs_media_ids`
--

DROP TABLE IF EXISTS `programs_media_ids`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programs_media_ids` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `program_id` int(10) unsigned NOT NULL,
  `media_id` int(10) unsigned NOT NULL,
  `episode` int(4) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `program_id` (`program_id`)
) ENGINE=MyISAM AUTO_INCREMENT=95 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `artist` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `album` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `year` int(4) DEFAULT NULL,
  `type` enum('audio','image','video') NOT NULL DEFAULT 'audio',
  `category_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `language_id` int(11) DEFAULT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT '0',
  `genre_id` int(11) DEFAULT NULL,
  `comments` text NOT NULL,
  `filename` text NOT NULL,
  `file_hash` varchar(255) NOT NULL,
  `file_location` varchar(2) NOT NULL,
  `format` varchar(12) NOT NULL,
  `is_copyright_owner` tinyint(4) NOT NULL DEFAULT '1',
  `duration` decimal(10,3) DEFAULT NULL,
  `owner_id` int(11) NOT NULL DEFAULT '0',
  `created` int(11) unsigned NOT NULL,
  `updated` int(10) unsigned NOT NULL,
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('private','public') NOT NULL,
  `dynamic_select` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `artist` (`artist`),
  KEY `title` (`title`),
  KEY `duration` (`duration`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 COMMENT='Dynamic table of tracks uploaded';

