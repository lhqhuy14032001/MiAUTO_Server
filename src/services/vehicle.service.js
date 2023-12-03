"use strict";
const dbFunc = require("../ultils/dbFunc");
const db = require("../database/init.mysql");
const { VEHICLE_STATUS } = require("../ultils/constants");
//
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GG_PASS,
  },
});
// service
const EmailService = require("./email.service");
class VehicleService {
  static async getType() {
    let sql = "SELECT type_id, label, seats FROM miauto.car_types;";
    let result = await dbFunc.handleSelectWithoutConditon(db, sql);
    return result;
  }
  static async getGearboxes() {
    let sql = "SELECT gearbox_id, label FROM miauto.gearboxes;";
    let result = await dbFunc.handleSelectWithoutConditon(db, sql);
    return result;
  }
  static async getBrands() {
    let sql = "SELECT brand_id, label FROM miauto.brands;";
    let result = await dbFunc.handleSelectWithoutConditon(db, sql);
    return result;
  }
  static async getFuels() {
    let sql = "SELECT fuel_id, label FROM miauto.fuels;";
    let result = await dbFunc.handleSelectWithoutConditon(db, sql);
    return result;
  }
  static async getProvinces() {
    let sql = "SELECT prov_id, prov_name FROM miauto.provinces;";
    let result = await dbFunc.handleSelectWithoutConditon(db, sql);
    return result;
  }
  static async getDistricts(prov_id) {
    let res = {};
    let sql =
      "SELECT district_id, district_name, prov_id FROM miauto.districts WHERE prov_id=?;";
    let result = await db.query(sql, [prov_id]);
    if (result.length > 0) {
      res.error = false;
      res.data = result;
    } else {
      res.error = true;
      res.data = result;
    }
    return res;
  }
  static async regsiterVehicle(carInfo, PDC) {
    let {
      uid,
      carName,
      hirePrice,
      numberPlate,
      brand,
      carType,
      gearbox,
      fuel,
      year,
      features,
      state,
      desc,
      deposit,
      averageFuel,
      prov,
      prov_id,
      district,
      addressDetail,
    } = carInfo;
    let { PDC_state, PDC_Brand, PDC_Fee } = PDC;
    let sql =
      "INSERT INTO miauto.cars (name, features, uid, year_manufacture, hire_price, state, carDesc, physical_damage_coverage_state, physical_damage_coverage, physical_damage_coverage_brand, deposit_state, brand, carType, gearbox, fuel, district, prov, prov_id, avgFuel, addressDetail, numberPlate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
    let args = [
      carName,
      JSON.stringify({ features: features }),
      uid,
      year,
      hirePrice,
      state,
      desc,
      PDC_state,
      PDC_Fee,
      PDC_Brand,
      deposit,
      brand,
      carType,
      gearbox,
      fuel,
      district,
      prov,
      prov_id,
      averageFuel,
      addressDetail,
      numberPlate,
    ];
    let res = await db.query(sql, args);
    console.log(res);
  }
  static async getVehiCleWithStatus(status) {
    let res = {
      err: true,
      data: null,
    };
    let sql = "SELECT * FROM miauto.cars WHERE state=?;";
    let result = await db.query(sql, [status]);
    if (result.length > 0) {
      res.err = false;
      res.data = result;
    }
    return res;
  }
  static async handleAcceptVehicle(car_id, uid, numberPlate, vehicleName) {
    let res = {};
    let sql =
      "UPDATE miauto.cars SET state=? WHERE car_id=? AND uid=? AND numberPlate=?;";
    let result = await db.query(sql, [
      VEHICLE_STATUS.DD,
      car_id,
      uid,
      numberPlate,
    ]);
    if (result.affectedRows === 1) {
      await this.sendEmailInformVehicleActive(uid, vehicleName, numberPlate);
      res.err = false;
    } else {
      res.err = true;
    }
    return res;
  }
  static async handleRejectVehicle(
    car_id,
    uid,
    numberPlate,
    vehicleName,
    reasonReject
  ) {
    let res = {};
    let sql =
      "DELETE FROM miauto.cars WHERE car_id=? AND uid=? AND numberPlate=?;";
    let result = await db.query(sql, [car_id, uid, numberPlate]);
    if (result.affectedRows === 1) {
      let emailResult = await this.sendEmailInformRejectVehicle(
        uid,
        vehicleName,
        numberPlate,
        reasonReject
      );
      console.log(emailResult);
      res.err = false;
    } else {
      res.err = true;
    }
    return res;
  }
  
  static async getVehicleByUID(uid) {
    let sql = "SELECT * FROM miauto.cars WHERE uid=?;";
    let params = [uid];
    let res = { err, data };
    let result = await db.query(sql, params);
    if (result.length > 0) {
      res.err = false;
      res.data = result;
    } else {
      res.err = true;
      res.data = [];
    }
    return res;
  }
  static async handleDeleteVehicleByUID(uid) {
    let sql = "DELETE FROM miauto.cars WHERE uid=?;";
    let params = [uid];
    let res = { err: true };
    let result = await db.query(sql, params);
    if (result.affectedRows === 1) {
      res.err = false;
    }
    return res;
  }

  // tmp
  // email inform vehicle can be hired by customer
  static async sendEmailInformVehicleActive(uid, vehiclename, numberPlate) {
    let user = await this.getUserById(uid);
    if (user) {
      const bodyEmail = `
    <p>Kính gửi ${user.fullname},</p>
    <p>MiAUTO chân thành cảm ơn bạn đã tin tưởng sử dụng dịch vụ của MiAUTO. Chúng tôi xin thông báo xe ${vehiclename} - ${numberPlate} đã được duyệt. <b>Vui lòng kiểm tra e-mail thường xuyên để nhận được các yêu cầu thuê xe.</b></p>
    <br/>
    <p>Trân trọng.</p>
    <p>MiAUTO<p/>
    `;
      await transporter.sendMail({
        from: "MiAUTO - Ứng dụng thuê ô tô tự lái. <foo@example.com>", // sender address
        to: user.email, // list of receivers
        subject: `${vehiclename} - ${numberPlate}`, // Subject line
        html: bodyEmail, // html body
      });
    }
  }

  // email inform vehicle was rejected by Admin
  static async sendEmailInformRejectVehicle(
    uid,
    vehiclename,
    numberPlate,
    reasonReject
  ) {
    let user = await this.getUserById(uid);
    if (user) {
      const bodyEmail = `
    <p>Kính gửi ${user.fullname},</p>
    <p>MiAUTO chân thành cảm ơn bạn đã tin tưởng sử dụng dịch vụ của MiAUTO. Chúng tôi xin thông báo xe ${vehiclename} - ${numberPlate} đã <b>BỊ TỪ CHỐI TRÊN HỆ THỐNG</b> với lý do: <pre>${reasonReject}</pre></br><b>Vui lòng liên hệ hotline để được hỗ trợ.</b></p>
    <br/>
    <p>Trân trọng.</p>
    <p>MiAUTO<p/>
    `;
      await transporter.sendMail({
        from: "MiAUTO - Ứng dụng thuê ô tô tự lái. <foo@example.com>", // sender address
        to: user.email, // list of receivers
        subject: `Thông báo từ chối phê duyệt ${vehiclename} - ${numberPlate}`, // Subject line
        html: bodyEmail, // html body
      });
    }
  }
  static getUserById = async (uid) => {
    let sql =
      "SELECT uid, fullname, phonenumber, email, role, phoneValid, google_id, avatar FROM miauto.users WHERE uid=?;";
    let user = await db.query(sql, [uid]);
    return user.length === 1 ? user[0] : null;
  };
  static getUserByEmail = async (email) => {
    let sql =
      "SELECT uid, fullname, phonenumber, email, role, phoneValid, emailValid, google_id, avatar FROM miauto.users WHERE email=?;";
    let user = await db.query(sql, [email]);
    return user.length === 1 ? user[0] : null;
  };
}
module.exports = VehicleService;
