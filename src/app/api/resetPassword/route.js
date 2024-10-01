import { NextResponse } from 'next/server';
import { updatePassword } from '../dao/dao'; 
import { jwtDecode } from 'jwt-decode';

export const POST = async (req) => {
    try {
        const body = await req.json();
        const token = body.token;
        const pass = body.password;
        const decodedToken = jwtDecode(token);
        const email = decodedToken.email
        
        
        const updated = await updatePassword(email, pass);
        
        if (!updated) {
            return NextResponse.json({ error: 'Ha ocurrido un error al actualizar la contraseña' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Se ha actualizado correctamente la contraseña' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};
