-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 15 mai 2021 à 10:36
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `groupomania`
--

-- --------------------------------------------------------

--
-- Structure de la table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `content` text,
  `userId` int(11) NOT NULL,
  `img_url` varchar(255) DEFAULT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `posts`
--

INSERT INTO `posts` (`id`, `title`, `content`, `userId`, `img_url`, `createdAt`, `updatedAt`) VALUES
(1, 'this is 1 er article', 'this is my first article', 17, 'sauce-piquante-gingembre-et-combava1620504136934.jpg', '2021-04-19', '2021-05-14'),
(9, '', 'Voici 1 photo de moi', 8, '16122863153401618927308831.jpg', '2021-04-20', '2021-04-20'),
(38, '', 'J\'adore cette blague', 17, '16057782466381619897749332.jpg', '2021-04-21', '2021-05-01'),
(61, '', '', 8, 'sauce-piquante-fraises-whiskey1620550652298.jpg', '2021-05-09', '2021-05-09'),
(62, '', '', 8, 'maxresdefault1620550573011.jpg', '2021-05-09', '2021-05-09'),
(64, '', '', 8, 'sauce-piquante-137030201620550666170.jpg', '2021-05-09', '2021-05-09'),
(66, '', '', 8, 'index1620550861330.jpg', '2021-05-09', '2021-05-09'),
(67, '', '', 8, 'sriracha1620550883350.jpg', '2021-05-09', '2021-05-09'),
(73, '', '', 8, '21620551296389.jpg', '2021-05-09', '2021-05-09'),
(74, '', '', 8, '16099275250171620551408062.jpg', '2021-05-09', '2021-05-09'),
(75, '', '', 8, '11620551423141.jpg', '2021-05-09', '2021-05-09'),
(76, '', '', 8, '16104799687591620551503085.jpg', '2021-05-09', '2021-05-09'),
(85, '', '', 17, '16127835456551621007373953.jpg', '2021-05-14', '2021-05-14'),
(91, '', 'une video de musique', 17, 'Music_Box_-_115431621023156323.mp4', '2021-05-14', '2021-05-14');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
