import nodemailer from 'nodemailer';

const sendEmail = async (to, resetLink) => {
    console.log(process.env.EMAIL_USER);
    console.log(process.env.EMAIL_PASS);

    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', 
        port: 587, 
        secure: false, 
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Restablecimiento de Contraseña',
        text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
