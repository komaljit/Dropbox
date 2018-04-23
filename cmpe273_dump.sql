
DROP database IF EXISTS `cmpe273`;
CREATE DATABASE cmpe273;

USE cmpe273;

--
-- Table structure for table `files`
--


DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `files` (
  `filename` varchar(255) NOT NULL,
  `filepath` varchar(500) NOT NULL,
  `fileparent` varchar(500) DEFAULT NULL,
  `isfile` varchar(1) DEFAULT NULL,
  PRIMARY KEY (`filepath`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES ('newFolder','./public/uploads/got@gmail/newFolder','','F'),('README.md','./public/uploads/got@gmail/newFolder/README.md','./public/uploads/got@gmail/newFolder','T'),('Report.odt','./public/uploads/got@gmail/Report.odt','','T'),('shareddd','./public/uploads/got@gmail/shareddd','','F'),('2017-10-14 23-24-02.mp4','./public/uploads/kimtani90@gmail/2017-10-14 23-24-02.mp4','','T'),('examples.desktop','./public/uploads/kimtani90@gmail/examples.desktop','','T');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userfiles`
--

DROP TABLE IF EXISTS `userfiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userfiles` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `filepath` varchar(500) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `admin` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `filepath` (`filepath`),
  KEY `email` (`email`),
  CONSTRAINT `userfiles_ibfk_1` FOREIGN KEY (`filepath`) REFERENCES `files` (`filepath`),
  CONSTRAINT `userfiles_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4824 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userfiles`
--

LOCK TABLES `userfiles` WRITE;
/*!40000 ALTER TABLE `userfiles` DISABLE KEYS */;
INSERT INTO `userfiles` VALUES (4812,'./public/uploads/kimtani90@gmail/2017-10-14 23-24-02.mp4','kimtani90@gmail.com','T'),(4813,'./public/uploads/kimtani90@gmail/examples.desktop','kimtani90@gmail.com','T'),(4814,'./public/uploads/got@gmail/Report.odt','got@gmail.com','T'),(4815,'./public/uploads/got@gmail/newFolder','got@gmail.com','T'),(4816,'./public/uploads/got@gmail/newFolder/README.md','got@gmail.com','T'),(4817,'./public/uploads/got@gmail/shareddd','got@gmail.com','T'),(4818,'./public/uploads/got@gmail/shareddd','kimtani90@gmail.com',NULL),(4820,'./public/uploads/kimtani90@gmail/2017-10-14 23-24-02.mp4','got@gmail.com',NULL),(4821,'./public/uploads/got@gmail/shareddd','got@gmail.com',NULL),(4822,'./public/uploads/kimtani90@gmail/2017-10-14 23-24-02.mp4','got@gmail.com',NULL),(4823,'./public/uploads/got@gmail/shareddd','kimtani90@gmail.com',NULL);
/*!40000 ALTER TABLE `userfiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userlog`
--

DROP TABLE IF EXISTS `userlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userlog` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) DEFAULT NULL,
  `filepath` varchar(500) DEFAULT NULL,
  `isfile` varchar(1) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `action` varchar(100) DEFAULT NULL,
  `actiontime` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `email` (`email`),
  CONSTRAINT `userlog_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4817 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userlog`
--

LOCK TABLES `userlog` WRITE;
/*!40000 ALTER TABLE `userlog` DISABLE KEYS */;
INSERT INTO `userlog` VALUES (4794,'Bursar.png','./public/uploads/kimtani90@gmail/Bursar.png','T','kimtani90@gmail.com','File Upload','2017-10-15 21:32:04'),(4795,'sjsuID.jpeg','./public/uploads/kimtani90@gmail/sjsuID.jpeg','T','kimtani90@gmail.com','File Upload','2017-10-15 21:32:16'),(4796,'NewFolder','./public/uploads/kimtani90@gmail/NewFolder','F','kimtani90@gmail.com','Make Folder ','2017-10-15 21:32:33'),(4797,'CourseEnrollment.png','./public/uploads/kimtani90@gmail/CourseEnrollment.png','T','kimtani90@gmail.com','File Upload','2017-10-15 21:33:22'),(4798,'CourseEnrollment.png','./public/uploads/kimtani90@gmail/CourseEnrollment.png','T','kimtani90@gmail.com','File Delete','2017-10-15 21:34:04'),(4799,'sjsuID.jpeg','./public/uploads/kimtani90@gmail/sjsuID.jpeg','T','kimtani90@gmail.com','File Delete','2017-10-15 23:31:26'),(4800,'NewFolder','./public/uploads/kimtani90@gmail/NewFolder','F','kimtani90@gmail.com','File Delete','2017-10-15 23:31:28'),(4801,'Bursar.png','./public/uploads/kimtani90@gmail/Bursar.png','T','kimtani90@gmail.com','File Delete','2017-10-15 23:31:29'),(4802,'favicon.ico','./public/uploads/kimtani90@gmail/favicon.ico','T','kimtani90@gmail.com','File Upload','2017-10-15 23:31:35'),(4803,'2017-10-14 23-24-02.mp4','./public/uploads/kimtani90@gmail/2017-10-14 23-24-02.mp4','T','kimtani90@gmail.com','File Upload','2017-10-15 23:31:44'),(4804,'examples.desktop','./public/uploads/kimtani90@gmail/examples.desktop','T','kimtani90@gmail.com','File Upload','2017-10-15 23:31:59'),(4805,'Report.odt','./public/uploads/got@gmail/Report.odt','T','got@gmail.com','File Upload','2017-10-16 14:12:46'),(4806,'newFolder','./public/uploads/got@gmail/newFolder','F','got@gmail.com','Make Folder ','2017-10-16 14:13:09'),(4807,'README.md','./public/uploads/got@gmail/newFolder/README.md','T','got@gmail.com','File Upload','2017-10-16 14:13:16'),(4808,'shareddd','./public/uploads/got@gmail/shareddd','F','got@gmail.com','Make Folder ','2017-10-16 14:13:44'),(4809,'shareddd','./public/uploads/got@gmail/shareddd','F','got@gmail.com','File Shared with kimtani90@gmail.com','2017-10-16 14:13:45'),(4810,'Report.odt','./public/uploads/kimtani90@gmail/Report.odt','T','kimtani90@gmail.com','File Upload','2017-10-16 16:07:40'),(4811,'Report.odt','./public/uploads/kimtani90@gmail/Report.odt','T','kimtani90@gmail.com','File Delete','2017-10-16 16:07:44'),(4812,'favicon.ico','./public/uploads/kimtani90@gmail/favicon.ico','T','kimtani90@gmail.com','File Delete','2017-10-16 16:07:46'),(4813,'2017-10-14 23-24-02.mp4','./public/uploads/kimtani90@gmail/2017-10-14 23-24-02.mp4','T','kimtani90@gmail.com','File Shared with got@gmail.com','2017-10-17 03:05:52'),(4814,'shareddd','./public/uploads/got@gmail/shareddd','F','kimtani90@gmail.com','File Shared with got@gmail.com','2017-10-17 03:08:02'),(4815,'2017-10-14 23-24-02.mp4','./public/uploads/kimtani90@gmail/2017-10-14 23-24-02.mp4','T','kimtani90@gmail.com','File Shared with got@gmail.com','2017-10-17 03:09:31'),(4816,'shareddd','./public/uploads/got@gmail/shareddd','F','kimtani90@gmail.com','File Shared with kimtani90@gmail.com','2017-10-17 03:32:08');
/*!40000 ALTER TABLE `userlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `email` varchar(500) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `interests` varchar(255) DEFAULT NULL,
  `lastlogin` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('Sam','Tarly','got@gmail.com','[object Object]',NULL,NULL,'2017-10-16 15:40:56'),('Dishant','Kimtani','kimtani90@gmail.com','[object Object]',NULL,NULL,'2017-10-17 02:59:12');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-17 12:32:20