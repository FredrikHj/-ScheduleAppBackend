-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 14 okt 2019 kl 08:49
-- Serverversion: 10.4.6-MariaDB
-- PHP-version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `scheduleapp`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `data`
--

CREATE TABLE `data` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `month` text COLLATE utf8_swedish_ci NOT NULL,
  `activity` text COLLATE utf8_swedish_ci NOT NULL,
  `state` text COLLATE utf8_swedish_ci NOT NULL,
  `concerned` text COLLATE utf8_swedish_ci NOT NULL,
  `type` text COLLATE utf8_swedish_ci NOT NULL,
  `place` text COLLATE utf8_swedish_ci NOT NULL,
  `content` text COLLATE utf8_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Dumpning av Data i tabell `data`
--

INSERT INTO `data` (`id`, `date`, `month`, `activity`, `state`, `concerned`, `type`, `place`, `content`) VALUES
(2, '2019-09-06', 'februari', 'vewD', 'Vre', 'vfrd', 'RVe', 'VARE', 'REvvr'),
(5, '2019-09-27', 'sep', 'vrf', '<vds', 'vd<', 'v<dsv', 'sdc', 'CSCsaDc'),
(6, '2019-09-27', 'sep', 'vrf', '<argaagre', 'rggdfb', 'v<dsv', 'sdc', 'CSCsaDc'),
(7, '2019-09-27', 'sep', 'vrf', '<vds', 'vd<', 'v<dsv', 'sdc', 'CSCsaDc'),
(8, '2019-09-27', 'sep', 'vrf', '<vds', 'vd<', 'v<dsv', 'sdc', 'CSCsaDc'),
(9, '2019-09-27', 'januari', 'vrf', '<vds', 'vd<', 'v<dsv', 'sdc', 'CSCsaDc'),
(10, '2019-09-27', 'sep', 'vrf', '<vds', 'vd<', 'v<dsv', 'sdc', 'CSCsaDc'),
(11, '2019-09-27', 'sep', 'vrf', '<vds', 'vd<', 'v<dsv', 'sdc', 'CSCsaDc'),
(12, '2019-09-27', 'sep', 'vrf', '<vds', 'vd<', 'v<dsv', 'sdc', 'CSCsaDc'),
(13, '2019-09-27', 'sep', 'vrf', '<vds', 'vd<5her', 'v<dsv', 'sdc', 'CSCsaDc'),
(14, '2019-09-27', 'sep', 'vrf', '<vds', 'vd<', 'v<dsv', 'sdc', 'CSCsaDc');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ID` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
q3uqurm7z68qb3h2q3uqurm7z68qb3h2