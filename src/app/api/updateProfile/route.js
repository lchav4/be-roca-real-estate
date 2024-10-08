import { NextRequest, NextResponse } from "next/server";
import { updateProfile } from "../dao/dao";

export const POST = async (req) => {
  try {
    const { currentEmail, newEmail, username } = await req.json(); 

    console.log("Datos recibidos en el backend:", { currentEmail, newEmail, username });

   
    if (currentEmail === newEmail && !username) {
      throw new Error("Ningún campo ha sido modificado.");
    }

   
    const updatedFields = {};
    if (newEmail) updatedFields.email = newEmail;
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
    console.error("Error en la actualización:", error); 
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
