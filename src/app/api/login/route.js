import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../dao/dao";
import jwt from 'jsonwebtoken';

export const POST = async (req) => {
    try {
        const body = await req.text();
        const email = JSON.parse(body).email;
        const password = JSON.parse(body).password;
        const user = await getUser(email, password);

        const token = jwt.sign(
            {email: user.email, username: user.name, role: user.role, favorites: user.favorites},
            process.env.JWT_SECRET,
            {expiresIn: '2h'}
        );

        return NextResponse.json({ token, role: user.role }, {status: 200});
    }
    catch (err) {
        return NextResponse.json({error: `${err}`}, {status: 500});
    }
}