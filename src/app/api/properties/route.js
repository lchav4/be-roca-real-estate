import { NextRequest, NextResponse } from "next/server";
import { saveProperty } from "../dao/dao"; 

export const POST = async (req) => {
    try {
        const body = await req.json(); 
        const propertyData = body; 

        await saveProperty(propertyData);

        return NextResponse.json({ message: 'Propiedad guardada con éxito' }, { status: 200 }); 
    } catch (err) {
        return NextResponse.json({ error: `${err}` }, { status: 500 });
    }
};
