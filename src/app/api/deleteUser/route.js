import { NextRequest, NextResponse } from "next/server";
import { deleteUser } from "../dao/dao"; 

export const DELETE = async (req) => {
    try {
        const body = await req.text();
        const { email } = JSON.parse(body);

        const resp = await deleteUser(email);
        
        if (!resp) {
            throw new Error("Error al eliminar el usuario");
        }
        return NextResponse.json("Usuario eliminado correctamente", { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: `${err}` }, { status: 500 });
    }
};
