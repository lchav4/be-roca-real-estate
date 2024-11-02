import { NextResponse } from 'next/server';
import { saveProperty, updateProperty, getProperties } from '../dao/dao';

export const POST = async (req) => {
  try {
    const data = await req.formData();
    let images = [];
    data.forEach((value, key) => {
      if (key.startsWith('image')) {
        images = [...images, value];
      }
    });

    const newProperty = {
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

export const PUT = async (req) => {
  try {
    // Parse the incoming JSON data
    const updatedData = await req.json();
    
    // Extract the property ID from the updated data
    const { _id, ...updateFields } = updatedData;

    // Validate that the property ID is provided
    if (!_id) {
      return NextResponse.json(
        { error: 'Falta el ID de la propiedad para actualizar.' },
        { status: 400 }
      );
    }

    // Prepare the updated fields to be passed to the DAO function
    const updateFieldsToSend = {};

    // Only include fields that are provided and not null or undefined
    for (const key in updateFields) {
      if (updateFields[key] !== undefined && updateFields[key] !== null) {
        updateFieldsToSend[key] = updateFields[key];
      }
    }

    // Call the updateProperty function with the property ID and the fields to update
    await updateProperty(_id, updateFieldsToSend);

    return NextResponse.json(
      { message: 'Propiedad actualizada con éxito' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Error al actualizar la propiedad: ${err.message}` },
      { status: 500 }
    );
  }
};

export const GET = async (req) => {
  try {
    const searchParams = new URL(req.url).searchParams;
    const propertyId = searchParams.get('id'); // Example: fetching by property ID
    let properties;

    if (propertyId) {
      // If an ID is provided, fetch a specific property
      properties = await getProperties({ id: propertyId });
      if (properties.length === 0) {
        return NextResponse.json({ message: 'No se encontraron propiedades.' }, { status: 404 });
      }
    } else {
      // Otherwise, fetch all properties
      properties = await getProperties({});
    }

    return NextResponse.json(properties, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: `Error al obtener propiedades: ${err.message}` },
      { status: 500 }
    );
  }
};
