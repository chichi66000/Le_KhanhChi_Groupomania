-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 22 mai 2021 à 15:28
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password`, `fonction`, `pseudo`, `avatar`, `isAdmin`, `createdAt`, `updatedAt`, `createPasswordResetToken`) VALUES
(4, 'testpho', 'hel', 'e9c0c4168d8282aa57ed577d1d', '$2b$10$w7EjYo2msKqe/uwzh4I8c.mr2k9R6Ir5/gCJazZkTHcMOotU5JbeC', 'admin', 'lele', '16057782466381621694154914.jpeg', 1, '2021-05-22', '2021-05-22', NULL),
(5, 'testpho', 'hel', 'e6cdc133b49a8bad57ac1f69', '$2b$10$tkGWqT8UtXOduwErektD8ucuelLECzc05zWH/CDJd.PePARi.Rgg.', 'fontionnaire', 'chi', 'avatar_default.png', 1, '2021-05-22', '2021-05-22', NULL),
(7, 'tommy', 'tommy', 'f1cac51eb4bb9aa350ed1635092b', '$2b$10$r9HMUIW1iEf6LX1bWQpcPOeASqVs1JMt0pb.UEf7nd60IA8h1Z7bO', 'admin', 'toto', 'cap21621697046989.jpeg', 0, '2021-05-22', '2021-05-22', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
