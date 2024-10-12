import nodemailer from 'nodemailer';

const sendEmail = async (to, resetLink, language) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    let subject;
    let html;

    if (language === 'es') {
        subject = 'Restablecimiento de Contraseña';
        html = `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <img src="cid:logo" alt="Logo" style="width: 150px; margin-bottom: 20px;" />
                <h1>Restablecimiento de Contraseña</h1>
                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                <a href="${resetLink}" style="color: #4CAF50; text-decoration: none;">Restablecer Contraseña</a>
            </div>
        `;
    } else {
        subject = 'Password Reset';
        html = `
            <div style="font-family: Arial, sans-serif; text-align: center;">
                <img src="cid:logo" alt="Logo" style="width: 150px; margin-bottom: 20px;" />
                <h1>Password Reset</h1>
                <p>Click the following link to reset your password:</p>
                <a href="${resetLink}" style="color: #4CAF50; text-decoration: none;">Reset Password</a>
            </div>
        `;
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        attachments: [
            {
                filename: 'roca-real-logo.png',  
                path: '././public/roca-real-logo.png', 
                cid: 'logo',  
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;


