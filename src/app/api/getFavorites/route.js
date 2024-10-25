import { NextResponse } from "next/server";
import { getUserFavorites } from "../dao/dao";

export const POST = async (req) => {
    try {
      const body = await req.text();
      const { email } = JSON.parse(body);
      const favorites = await getUserFavorites(email);
  
      return NextResponse.json(favorites, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  };