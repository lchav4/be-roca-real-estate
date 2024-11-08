import { NextRequest, NextResponse } from "next/server";
import { updateProfile } from "../dao/dao";

export const POST = async (req) => {
  try {
    const { currentEmail, newEmail, username } = await req.json(); 

   
    if (currentEmail === newEmail && !username) {
      throw new Error("Ningún campo ha sido modificado.");
    }

   
    const updatedFields = {};
    if (newEmail !== currentEmail) updatedFields.email = newEmail;
    if (username) updatedFields.name = username;

    
    if (Object.keys(updatedFields).length === 0) {
      throw new Error("No se ha proporcionado ningún campo para actualizar.");
    }

    const updateResult = await updateProfile(currentEmail, updatedFields);

    if (updateResult) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      throw new Error("No se pudo actualizar el perfil.");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
