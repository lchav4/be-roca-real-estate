// app/api/deleteProperty/route.js
import { NextRequest, NextResponse } from "next/server";
import { deleteProperty } from "../dao/dao";

export const POST = async (req) => {
  try {
    const body = await req.text();
    const { propertyId, email } = JSON.parse(body);

    const deleted = await deleteProperty(propertyId, email);

    if (deleted) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      throw new Error("No se pudo eliminar la propiedad");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
