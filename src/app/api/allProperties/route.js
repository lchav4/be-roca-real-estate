import { NextResponse } from 'next/server';
import { getProperties } from '../dao/dao';

export const GET = async (req) => {
  try {
    const properties = await getProperties();
    return NextResponse.json(properties, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Error al obtener las propiedades: ${err.message}` },
      { status: 500 }
    );
  }
};