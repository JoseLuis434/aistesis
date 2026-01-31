import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, items } = body;

    const idsPath = path.join(process.cwd(), 'ids.json');
    const pedidosPath = path.join(process.cwd(), 'pedidos.json');

    // 1. VALIDACIÓN DE ID
    const idsData = fs.readFileSync(idsPath, 'utf8');
    const allowedIds = JSON.parse(idsData);
    const idLimpio = id?.trim().toUpperCase();

    if (!idLimpio || !allowedIds.includes(idLimpio)) {
      return NextResponse.json({ success: false, message: 'ID no válido' }, { status: 401 });
    }

    // 2. FILTRADO DE DATOS (Mapeo a solo lo necesario)
    const articulosSimplificados = items.map(item => ({
      nombre: item.name,
      tamano: item.selectedSize,
      color: item.selectedColor
    }));

    // 3. ESTRUCTURA MINIMALISTA
    const nuevoPedido = {
      idUsuario: idLimpio,
      articulos: articulosSimplificados
    };

    // 4. GUARDADO EN EL ARCHIVO
    let pedidos = [];
    if (fs.existsSync(pedidosPath)) {
      try {
        const contenido = fs.readFileSync(pedidosPath, 'utf8');
        pedidos = contenido ? JSON.parse(contenido) : [];
      } catch (e) { pedidos = []; }
    }

    pedidos.push(nuevoPedido);
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Pedido simplificado guardado' 
    }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}