import { NextResponse } from 'next/server';
import { getProperties } from '../dao/dao';

export const POST = async (req) => {
  try {
    const body = await req.text();
    const filters = JSON.parse(body).filters;
    const properties = await getProperties(filters);

    return NextResponse.json(properties, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Error al obtener las propiedades: ${err.message}` },
      { status: 500 }
    );
  }
};