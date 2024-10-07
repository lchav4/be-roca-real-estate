import { NextResponse } from 'next/server';
import { saveProperty } from '../dao/dao';


export const POST = async (req) => {
  try {
    const data = await req.formData();
    let images = [];
    data.forEach((value, key) => {
      if (key.startsWith('image')) {
        images = [...images, value];
      }
    })

    const newProperty = {
      province: data.get('province'),
      region: data.get('region'),
      location: data.get('location'),
      propertyType: data.get('propertyType'),
      landSize: data.get('landSize'),
      title: data.get('title'),
      description: data.get('description'),
      salePrice: data.get('salePrice'),
      rentPrice: data.get('rentPrice'),
      forSale: data.get('forSale'),
      forRent: data.get('forRent'),
      images,
    };
    
    await saveProperty(newProperty);

    return NextResponse.json(
      { message: 'Propiedad guardada con éxito' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Error al guardar la propiedad: ${err.message}` },
      { status: 500 }
    );
  }
};
