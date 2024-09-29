import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../dao/dao";

export const POST = async (req) => {
    try {
        const body = await req.text();
        const email = JSON.parse(body).email;
        const password = JSON.parse(body).password;
        const user = await getUser(email, password);
        if (!user) {
            return NextResponse.error(new Error("User not found"), 404);
        }
        return NextResponse.json({user}, {status: 200});
    }
    catch (err) {
        return NextResponse.json({error: `${err}`}, {status: 500});
    }
}