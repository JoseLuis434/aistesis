// app/api/checkout/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// --- BASE DE DATOS DE IDS ALFANUMÉRICOS (5 CARACTERES) ---
const DATABASE_IDS = ["FI206", "UN123", "AD001", "MX99X", "ST007"];

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items, total } = body;

    // 1. VALIDACIÓN ESTRICTA DE FORMATO Y EXISTENCIA
    // - Debe tener exactamente 5 caracteres
    // - Debe ser alfanumérico (letras y números solamente)
    // - Debe estar en nuestra lista blanca
    const idLimpio = userId?.trim().toUpperCase();
    const esAlfanumerico5 = /^[A-Z0-9]{5}$/.test(idLimpio);

    if (!esAlfanumerico5 || !DATABASE_IDS.includes(idLimpio)) {
      console.warn(`[ACCESO RECHAZADO]: ID inválido o no autorizado: ${idLimpio}`);
      return NextResponse.json(
        { success: false, message: 'ID no válido. Use 5 caracteres alfanuméricos.' },
        { status: 401 }
      );
    }

    // 2. CONFIGURACIÓN DEL ARCHIVO DE PERSISTENCIA
    const filePath = path.join(process.cwd(), 'pedidos.json');

    // 3. LECTURA DE PEDIDOS PREVIOS
    let pedidos = [];
    if (fs.existsSync(filePath)) {
      try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        pedidos = JSON.parse(fileData);
      } catch (err) {
        pedidos = [];
      }
    }

    // 4. CREACIÓN DEL REGISTRO DEL PEDIDO
    const nuevoPedido = {
      id: `ORD${Date.now().toString().slice(-6)}`, // ID de orden corto
      fecha: new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' }),
      userId: idLimpio,
      items: items.map(item => ({
        nombre: item.name,
        talla: item.selectedSize,
        color: item.selectedColor,
        precio: item.finalPrice
      })),
      total: total
    };

    pedidos.push(nuevoPedido);

    // 5. GUARDAR EN EL SERVIDOR
    fs.writeFileSync(filePath, JSON.stringify(pedidos, null, 2));

    return NextResponse.json({ 
      success: true, 
      orderId: nuevoPedido.id 
    });

  } catch (error) {
    console.error("Error en el servidor:", error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}