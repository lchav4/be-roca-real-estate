import { NextResponse } from 'next/server';
import { findUser } from '../dao/dao'; 
import jwt from 'jsonwebtoken'; 
import sendEmail from '../utils/email';

export const POST = async (req) => {
    try {
        const body = await req.json();
        const email = body.email; 
        
        const existingUser = await findUser(email);
        
        if (!existingUser) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;

        await sendEmail(email, resetLink);

        return NextResponse.json({ message: 'Se ha enviado un correo para restablecer la contraseña' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
