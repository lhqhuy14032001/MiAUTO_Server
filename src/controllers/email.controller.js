"user strict";
require("dotenv").config();
const { BadRequestError } = require("../core/error.response");
// handle response result
const { OK, CREATED } = require("../core/success.response");
// service
const EmailService = require("../services/email.service");
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
class EmailController {
  static async sendEmailVerify(req, res) {
    const fullname = req.body.user.fullname;
    const bodyEmail = `
    <p>Kính gửi ${fullname},</p>
    <p>MiAUTO chân thành cảm ơn bạn đã tin tưởng sử dụng dịch vụ của MiAUTO. Để có thể đăng thông tin và nhận thông tin thuê xe từ khách hàng bạn vui lòng nhấn vào đường dẫn bên dưới để xác nhận rằng e-mail của bạn tồn tại và hợp lê.</p>
    <a href="${process.env.FRONTEND_HOST}/verify-gmail/${req.body.user.email}" target="_blank">Nhấn vào đây để xác thực</a>
    <br/>
    <p>Trân trọng.</p>
    <p>MiAUTO<p/>
    `;
    await transporter.sendMail({
      from: "MiAUTO - Ứng dụng thuê ô tô tự lái. <foo@example.com>", // sender address
      to: req.body.user.email, // list of receivers
      subject: "Xác nhận E-mail chủ xe MiAUTO", // Subject line
      html: bodyEmail, // html body
    });
  }
  static async updateEmailState(req, res) {
    let email = req.body.email;
    let result = await EmailService.updateEmailState(email);
    if (result.err) throw new BadRequestError("Update email is not success.");
    else new OK({ message: "OK", metadata: result.data }).send(res);
  }
}
module.exports = EmailController;
