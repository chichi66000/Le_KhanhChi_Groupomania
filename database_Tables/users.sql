-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 15 mai 2021 à 10:37
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
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fonction` varchar(255) DEFAULT NULL,
  `pseudo` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `createdAt` date NOT NULL,
  `updatedAt` date NOT NULL,
  `createPasswordResetToken` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `pseudo` (`pseudo`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password`, `fonction`, `pseudo`, `avatar`, `isAdmin`, `createdAt`, `updatedAt`, `createPasswordResetToken`) VALUES
(8, 'le', 'chi', 'le.khanhchi@yahoo.fr', '$2b$10$MJYmzZeHoqQTFqkz649Zoe2RrFOLs3.XPSl2i7na79Py6YHG.1/Vq', 'mecanicien', 'myTF1', 'cap21619815288112.jpg', 1, '2021-03-25', '2021-05-14', 'undefined'),
(12, 'leclerc', 'valentin', 'math@yahoo.fr', '$2b$10$SxnCwhOxvanJ7fZxVzD6GOnEd4YUZ7Z/LSFfjkBF29lW8Et3iHHUm', 'technicien', 'valentin', 'avatar_default.png', 0, '2021-03-25', '2021-04-13', '5b2bfc3fd20c79992c9bdd9c24dd12e2b30c8435a62d2d197decb7ec95b72c5d'),
(17, 'nguyen', 'tommy', 'tommy@yahoo.fr', '$2b$10$Xa6uWyqwOk.NuBQG7oEzI.oN8i2xx750k8YBt6iLwa9pheNFZr7I2', 'admin', 'christine', '16099275250171621006448919.jpg', 1, '2021-03-29', '2021-05-14', 'a4d82336aaaf6cc71038e16e73331535281d508fce466d3ff660848a349fd2b9'),
(18, 'dubois', 'jean', 'jean@yahoo.com', '$2b$10$aPRMygZ8.ayXdIf8Q.vyIumpJL13fofWqjaV0nhiSyl6SNNLLp9B6', '', 'jean', 'avatar_default.png', 1, '2021-03-29', '2021-05-08', '7696f4465cc8dab3a444bff0369e40b7702fb7d186241e2a6f8033e5d47ad0d5'),
(28, 'thieue', 'helene', 'question@yaho.com', '$2b$10$mPebR.wiMEFigd3ojI1XDeYzcN8xBUr0FvfFpo8M0VLEHRCQhB00a', 'cabin', 'jonasth', 'sriracha1618501242230.jpg', 0, '2021-04-03', '2021-04-15', NULL),
(40, 'thieue', 'helene', 'kid@g.com', '$2b$10$vBMD/aHb.Gdq2dBhHhyWxuIVRL4MjwGHmkdAtqjnFQYzJVICaaws2', 'reception', 'helene', '11617451448469.jpg', 0, '2021-04-03', '2021-04-03', NULL),
(49, 'het', 'het', 'het@y.com', '$2b$10$W0EVdQR/8cKX/kzsZKEicu80X8CSjLwjKadcaYRRwY2xsceit0XLG', 'null', 'het', 'avatar_default.png', 0, '2021-04-03', '2021-04-18', 'undefined'),
(53, 'malika', 'mali', 'mali@gmail.com', '$2b$10$lK6ZUj3lEceDY8EW.aKqNe9ErIVbGx1y9Fyt7zhD7cXDaFErFR51y', '', 'malie', 'atelier1617469513841.jpg', 0, '2021-04-03', '2021-04-03', NULL),
(55, 'helenene', 'touc', 'tuo@gmail.com', '$2b$10$gz2dcA16pOXGb5MzEwwOze.6SgV7JPzhDp88/KjI5yI95hSAmVDu6', 'receptionnist', 'toc', 'plat1617606420151.jpg', 0, '2021-04-05', '2021-04-19', NULL),
(59, 'reie', 'reine', 'reine12@yahoo.fr', '$2b$10$MS4XMuDwCDprQqyi6u1pK.RYd0tvgQ7nnh3OcYvP03mM5xUv/9h2i', '', 'bla125', 'avatar_default.png', 0, '2021-04-05', '2021-04-05', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
