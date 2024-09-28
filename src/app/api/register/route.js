import { NextRequest, NextResponse } from "next/server";
import { createUser } from "../dao/dao";
import { create } from "domain";

export const POST = async (req) => {
    try {
        const body = await req.text();
        const { email, name, password } = JSON.parse(body);
        const resp = await createUser(email, name, password);
        if (!resp) {
            throw new Error("Error creando usuario");
        }
        return NextResponse.json("Usuario creado correctamente", {status: 200});
    }
    catch (err) {
        return NextResponse.json({error: `${err}`}, {status: 500});
    }
}