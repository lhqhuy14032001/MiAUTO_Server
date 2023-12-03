"use strict";
const VehicleService = require("../services/vehicle.service");
const { OK } = require("../core/success.response");
const { BadRequestError } = require("../core/error.response");
class VehicleController {
  static async getType(req, res) {
    let data = await VehicleService.getType();
    if (!data.error) {
      new OK({ message: "Success", metadata: data.data }).send(res);
    } else {
      throw new BadRequestError("Ooop!!!");
    }
  }
  static async getGearboxes(req, res) {
    let data = await VehicleService.getGearboxes();
    if (!data.error) {
      new OK({ message: "Success", metadata: data.data }).send(res);
    } else {
      throw new BadRequestError("Ooop!!!");
    }
  }
  static async getBrands(req, res) {
    let data = await VehicleService.getBrands();
    if (!data.error) {
      new OK({ message: "Success", metadata: data.data }).send(res);
    } else {
      throw new BadRequestError("Ooop!!!");
    }
  }
  static async getFuels(req, res) {
    let data = await VehicleService.getFuels();
    if (!data.error) {
      new OK({ message: "Success", metadata: data.data }).send(res);
    } else {
      throw new BadRequestError("Ooop!!!");
    }
  }
  static async getProvinces(req, res) {
    let data = await VehicleService.getProvinces();
    if (!data.error) {
      new OK({ message: "Success", metadata: data.data }).send(res);
    } else {
      throw new BadRequestError("Ooop!!!");
    }
  }
  static async getDistricts(req, res) {
    let prov_id = req.body.prov_id;
    if (!prov_id) throw new BadRequestError("Ooop!!!");
    let data = await VehicleService.getDistricts(prov_id);
    if (!data.error) {
      new OK({ message: "Success", metadata: data.data }).send(res);
    } else {
      throw new BadRequestError("Ooop!!!");
    }
  }
  static async regsiterVehicle(req, res) {
    let carInfo = req.body.carInfo;
    let isValid = false;
    let PDC = {};
    PDC.PDC_state = carInfo.physicalDamageCoverageState;
    PDC.PDC_Brand = carInfo.physicalDamageCoverageBrand;
    PDC.PDC_Fee = carInfo.physicalDamageCoverageFee;
    delete carInfo.physicalDamageCoverageState;
    delete carInfo.physicalDamageCoverageBrand;
    delete carInfo.physicalDamageCoverageFee;
    for (const key in carInfo) {
      if (!carInfo[key]) {
        isValid = false;
      } else {
        isValid = true;
      }
    }
    if (!isValid) {
      throw new BadRequestError("error");
    } else {
      await VehicleService.regsiterVehicle(carInfo, PDC);
      new OK({ message: "okok" }).send(res);
    }
  }
  // get vehicle
  static async getVehiCleWithStatus(req, res) {
    let status = req.body.status;
    let result = await VehicleService.getVehiCleWithStatus(status);
    if (result.err) {
      throw new BadRequestError();
    } else {
      new OK({ message: "OK", metadata: result.data }).send(res);
    }
  }
  // get
  static async handleAcceptVehicle(req, res) {
    if (req.body.carInfo) throw new BadRequestError();
    let { car_id, uid, numberPlate, brand, name } = req.body.vehicleInfo;
    let vehicleName = `${brand} ${name}`;
    let result = await VehicleService.handleAcceptVehicle(
      car_id,
      uid,
      numberPlate,
      vehicleName
    );
    if (!result.err) {
      new OK({ message: "Success" }).send(res);
    } else {
      throw new BadRequestError();
    }
  }
  static async handleRejectVehicle(req, res) {
    if (!req.body.carInfo) throw new BadRequestError();
    if (!req.body.reason) throw new BadRequestError();
    let { car_id, uid, numberPlate, brand, name } = req.body.carInfo;
    let vehicleName = `${brand} ${name}`;
    let reasonReject = req.body.reason;
    let result = await VehicleService.handleRejectVehicle(
      car_id,
      uid,
      numberPlate,
      vehicleName,
      reasonReject
    );
    if (!result.err) {
      new OK({ message: "Success" }).send(res);
    } else {
      throw new BadRequestError();
    }
  }
  
}
module.exports = VehicleController;
