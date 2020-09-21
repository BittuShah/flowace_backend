const router = require("express").Router();
const { User, validate } = require("../Models/User");
const Order = require("../Models/Order");

const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

let OTP = {};

router.post("/", async (req, res) => {
  const validationResult = await validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error.details[0].message);
  }

  const userName = req.body.userName;
  const userEmail = req.body.userEmail;
  const userPassword = req.body.userPassword;
  const userAddress = req.body.userAddress;

  bcrypt
    .hash(userPassword, 12)
    .then((encryptPassword) => {
      const user = User.create({
        user_name: userName,
        user_email: userEmail,
        user_password: encryptPassword,
        user_address: userAddress,
      }).then((result) => {
        res.status(200).send(result);
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/login", async (req, res) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;

  const user = await User.findOne({ where: { user_email: email } });

  if (!user) {
    return res
      .status(404)
      .send({ resBoolean: false, des: "Email or Password is incorrect" });
  }

  const isEqual = await bcrypt.compare(password, user.user_password);

  if (!isEqual) {
    return res
      .status(401)
      .send({ resBoolean: false, des: "Email or Password is incorrect" });
  }

  const pendingOrders = await Order.count({
    where: { order_status: "Pending", userId: user.id },
  });

  const token = jwt.sign(
    {
      userName: user.user_name,
      userId: user.id.toString(),
      auth: true,
    },
    "myproject"
  );

  const resObj = {
    resBoolean: true,
    userId: user.id.toString(),
    token: token,
    cartCount: pendingOrders,
  };

  res.status(200).send(resObj);
});

router.post("/forgot", async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ where: { user_email: email } });

  if (!user) {
    return res
      .status(404)
      .send({ user: false, des: "Email is not registered" });
  }

  const randomNumbers = "01234567890";
  let tempOTP = "";

  while (tempOTP.length < 6) {
    tempOTP += randomNumbers[Math.floor(Math.random() * randomNumbers.length)];
  }

  OTP[user.user_email] = tempOTP;

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.get("myGmail"), // generated ethereal user
      // pass: "", // generated ethereal password
      pass: config.get("pass"),
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // <h3><b>Hello ${updatedUserName},</b><br></h3>
  let mailOptions = {
    from: `"Flowance" <support@flowance.com>`, // sender address
    to: user.user_email, // list of receivers
    subject: `Password Reset`, // Subject line
    // text: "", // plain text body
    html: `
    <div style="text-align:left;">
    
      <h4>Hi ${user.user_name}, Enter this OTP to change your Password: ${tempOTP}
      </h4>

      <p style="font-size:1.2em;">Do not share this OTP with others.</p>
    </div>
    
    
    `, // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    }
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  });
  return res.status(200).send({ email: user.user_email, desc: "Email Sent!" });
});

router.put("/forgot", async (req, res) => {
  const userOTP = req.body.OTP;
  const userEmail = req.body.email;

  console.log(OTP);
  console.log(userOTP);

  if (OTP[userEmail] !== userOTP)
    return res
      .status(400)
      .send({ OTP: false, updated: false, desc: "OTP not match" });

  const password = req.body.newPassword;

  bcrypt
    .hash(password, 12)
    .then((encryptPassword) => {
      const user = User.update(
        {
          user_password: encryptPassword,
        },
        { where: { user_email: userEmail } }
      ).then((result) => {
        return res
          .status(200)
          .send({ updated: true, desc: "password updated" });
      });
    })
    .catch((err) => {
      return res.status(400).send({ updated: false, desc: "error" });
    });
});

module.exports = router;
