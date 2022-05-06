const { scryptSync } = require("crypto");
const mail = require("nodemailer")


const transporter = mail.createTransport({
    host: process.env["SMTP_HOST"],
    port: process.env["SMTP_PORT"],
    secure: false,
    auth: {
        user: process.env["SMTP_USER"],
        pass: process.env["SMTP_PASSWORD"],
    },
});

const hashPassword = (password, salt) => {
    return scryptSync(password, salt, 64).toString("hex");
}

const sendMail = (receiver, creatorEmail, shareId) => {
    let message = {
        from: process.env["SMTP_FROM"],
        to: receiver,
        subject: "New share from Pingvin Share",
        text: `Hey, ${creatorEmail} shared files with you. To access the files, visit ${process.env.FRONTEND_URL}/share/${shareId}`

    }
    transporter.sendMail(message)
}

module.exports = {
    hashPassword, sendMail
}