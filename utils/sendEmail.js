// utils/sendEmail.js


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

// 📩 USER EMAIL
exports.sendUserOrderConfirmedMail = async (to, orderId) => {
  await transporter.sendMail({
    from: `"ShopKart" <${process.env.EMAIL}>`,
    to,
    subject: "✅ Your Order is Confirmed",
    html: `
      <h2>Order Confirmed 🎉</h2>
      <p>Your order <b>${orderId}</b> has been successfully confirmed.</p>
      <p>We will notify you once it is out for delivery.</p>
      <br/>
      <p>Thanks,<br/>ShopKart Team</p>
    `
  });
};

// 📩 ADMIN EMAIL (OPTIONAL BUT GOOD)
exports.sendAdminOrderConfirmedMail = async (orderId) => {
  await transporter.sendMail({
    from: `"ShopKart" <${process.env.EMAIL}>`,
    to: process.env.EMAIL,
    subject: "📦 Order Confirmed (Admin)",
    html: `
      <h3>Order Confirmed</h3>
      <p>Order <b>${orderId}</b> has been confirmed by admin.</p>
    `
  });
};
