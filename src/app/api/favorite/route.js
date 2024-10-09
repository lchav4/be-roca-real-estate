import { NextRequest, NextResponse } from "next/server";
import { addFavorite } from "../dao/dao";

export const POST = async (req) => {
    try{
        const body = await req.text();
        const {propertyTitle, email, isAdding} = JSON.parse(body);
        const saved = await addFavorite(email, propertyTitle, isAdding);
        if (saved){
            return NextResponse.json({success: true}, {status: 200});
        }
    }catch(error){
        return NextResponse.json({error: error.message}, {status: 500});
    }
}