CREATE DATABASE `miauto` /*!40100 DEFAULT CHARACTER SET utf8 */;

-- miauto.blogs definition

CREATE TABLE `blogs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `content` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.brands definition

CREATE TABLE `brands` (
  `brand_id` INT NOT NULL AUTO_INCREMENT,
  `label` text NOT NULL,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.car_types definition

CREATE TABLE `car_types` (
  `type_id` INT NOT NULL AUTO_INCREMENT,
  `label` text NOT NULL,
  `seats` int(11) NOT NULL,
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.fuels definition

CREATE TABLE `fuels` (
  `fuel_id` INT NOT NULL AUTO_INCREMENT,
  `label` text NOT NULL,
  PRIMARY KEY (`fuel_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.gearboxes definition

CREATE TABLE `gearboxes` (
  `gearbox_id` INT NOT NULL AUTO_INCREMENT,
  `label` text NOT NULL,
  PRIMARY KEY (`gearbox_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.provinces definition

CREATE TABLE `provinces` (
  `prov_id` varchar(10) NOT NULL,
  `prov_name` text NOT NULL,
  PRIMARY KEY (`prov_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.reviews definition

CREATE TABLE `reviews` (
  `review_id` INT NOT NULL AUTO_INCREMENT,
  `createDate` date NOT NULL,
  PRIMARY KEY (`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.roles definition

CREATE TABLE `roles` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.vouchers definition

CREATE TABLE `vouchers` (
  `voucher_id` INT NOT NULL AUTO_INCREMENT,
  `value` int(11) NOT NULL,
  `voucher_code` varchar(100) NOT NULL,
  `startedAt` date NOT NULL,
  `expriedAt` date NOT NULL,
  `policy` text NOT NULL,
  `title` text NOT NULL,
  PRIMARY KEY (`voucher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.districts definition

CREATE TABLE `districts` (
  `district_id` INT NOT NULL AUTO_INCREMENT,
  `district_name` text NOT NULL,
  `prov_id` varchar(10) NOT NULL,
  PRIMARY KEY (`district_id`),
  CONSTRAINT `FK_PROVID` FOREIGN KEY (`prov_id`) REFERENCES `provinces` (`prov_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.users definition

CREATE TABLE `users` (
  `uid` INT NOT NULL AUTO_INCREMENT,
  `firstname` text NOT NULL,
  `lastname` text NOT NULL,
  `phonenumber` INT NOT NULL,
  `email` text NOT NULL,
  `password` varchar(100) NOT NULL,
  `role` varchar(10) NOT NULL,
  `createdAt` date NOT NULL,
  PRIMARY KEY (`uid`),
  CONSTRAINT `users_FK` FOREIGN KEY (`role`) REFERENCES `roles` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.wish_list definition

CREATE TABLE `wish_list` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uid` INT NOT NULL,
  `car_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_UID` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.cars definition

CREATE TABLE `cars` (
  `car_id` INT NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `brand_id` INT NOT NULL,
  `type` INT NOT NULL,
  `gearbox_id` INT NOT NULL,
  `fuel_id` INT NOT NULL,
  `features` text NOT NULL,
  `uid` INT NOT NULL,
  `district_id` INT NOT NULL,
  `year_manufacture` INT NOT NULL,
  `hire_price` int(11) NOT NULL,
  `state` text NOT NULL,
  `desc` text NOT NULL,
  `policy` text NOT NULL,
  `physical_damage_coverage_state` tinyint(1) NOT NULL,
  `physical_damage_coverage` int(11) NOT NULL,
  `deposit_state` tinyint(1) NOT NULL,
  PRIMARY KEY (`car_id`),
  CONSTRAINT `FK_CAR_BRAND` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  CONSTRAINT `FK_CAR_DISTRICT` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`),
  CONSTRAINT `FK_CAR_FUEL` FOREIGN KEY (`fuel_id`) REFERENCES `fuels` (`fuel_id`),
  CONSTRAINT `FK_CAR_GEARBOX` FOREIGN KEY (`gearbox_id`) REFERENCES `gearboxes` (`gearbox_id`),
  CONSTRAINT `FK_CAR_TYPE` FOREIGN KEY (`type`) REFERENCES `car_types` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.contracts definition

CREATE TABLE `contracts` (
  `contract_id` INT NOT NULL AUTO_INCREMENT,
  `owner_id` INT NOT NULL,
  `customer_id` INT NOT NULL,
  `car_id` INT NOT NULL,
  `policy` text NOT NULL,
  `startedAt` date NOT NULL,
  `expired` date NOT NULL,
  `deposit_state` varchar(100) NOT NULL,
  `deposit_total` int(11) NOT NULL,
  PRIMARY KEY (`contract_id`),
  CONSTRAINT `contracts_FK` FOREIGN KEY (`owner_id`) REFERENCES `users` (`uid`),
  CONSTRAINT `contracts_FK_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`uid`),
  CONSTRAINT `contracts_FK_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.review_detail definition

CREATE TABLE `review_detail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `review_id` INT NOT NULL,
  `uid` INT NOT NULL,
  `car_id` INT NOT NULL,
  `content` text,
  `star` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_REVIEW_DETAIL_CAR` FOREIGN KEY (`car_id`) REFERENCES `cars` (`car_id`),
  CONSTRAINT `FK_REVIEW_DETAIL_REVIEW` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`review_id`),
  CONSTRAINT `FK_REVIEW_DETAIL_USER` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.user_report definition

CREATE TABLE `user_report` (
  `report_id` INT NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `content` text NOT NULL,
  `uid` INT NOT NULL,
  `car_id` INT NOT NULL,
  `state_report` varchar(100) DEFAULT NULL,
  `contract_id` INT NOT NULL,
  PRIMARY KEY (`report_id`),
  CONSTRAINT `user_report_FK` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`contract_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- miauto.user_voucher_detail definition

CREATE TABLE `user_voucher_detail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uid` INT NOT NULL,
  `voucher_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_voucher_detail_FK` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`),
  CONSTRAINT `user_voucher_detail_FK_1` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`voucher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;