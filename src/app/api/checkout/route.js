import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();
    const { id, items, total } = body;

    const idsPath = path.join(process.cwd(), 'ids.json');
    const pedidosPath = path.join(process.cwd(), 'pedidos.json');

    // 1. VALIDACIÓN DE ID
    const idsData = fs.readFileSync(idsPath, 'utf8');
    const allowedIds = JSON.parse(idsData);
    const idLimpio = id.trim().toUpperCase();

    if (!allowedIds.includes(idLimpio)) {
      return NextResponse.json({ success: false, message: 'ID no válido' }, { status: 401 });
    }

    // 2. INICIALIZACIÓN DE LA VARIABLE CON PROTECCIÓN
    let pedidos = [];

    if (fs.existsSync(pedidosPath)) {
      try {
        const pedidosData = fs.readFileSync(pedidosPath, 'utf8');
        // Solo intentamos parsear si el archivo no está vacío
        if (pedidosData.trim()) {
          pedidos = JSON.parse(pedidosData);
        }
      } catch (parseError) {
        console.error("Aviso: pedidos.json estaba vacío o corrupto, reiniciando arreglo.");
        pedidos = []; // Si hay error, empezamos de cero para no romper el flujo
      }
    }

    // 3. REGISTRO DEL NUEVO PEDIDO
    const nuevoPedido = {
      idUsuario: idLimpio,
      fecha: new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
      articulos: items,
      total: total
    };

    pedidos.push(nuevoPedido);
    fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2));

    // 4. RESPUESTA EXITOSA (Con success: true para el frontend)
    return NextResponse.json({ 
      success: true, // <--- Crucial para que page.js muestre el éxito
      message: '¡Pedido realizado con éxito!',
      pedidoId: pedidos.length 
    }, { status: 200 });

  } catch (error) {
    console.error("Error crítico:", error);
    return NextResponse.json({ success: false, message: 'Error interno' }, { status: 500 });
  }
}