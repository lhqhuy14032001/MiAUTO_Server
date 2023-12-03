"use strict";
const db = require("../database/init.mysql");
const UserService = require("./users.service");
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

class EmailService {
  static async updateEmailState(email) {
    let res = {};
    let sql = "UPDATE users SET emailValid=? WHERE email=?";
    let result = await db.query(sql, [true, email]);
    if (result.affectedRows === 1) {
      let user = await this.getUserByEmail(email);
      if (!user) {
        res.err = true;
        res.user = null;
      } else {
        res.err = false;
        res.data = user;
      }
    }
    return res;
  }
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
    let user = await UserService.getUserById(uid);
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
module.exports = EmailService;
