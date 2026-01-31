"use client";
import React, { useState, useMemo } from 'react';
import Image from 'next/image'; // Importación vital para velocidad
import { X, Box, Palette, ShoppingCart, Trash2, Ruler, Search, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Configuraciones de precios y modelos (Se mantienen igual para no romper tu lógica)
const PRECIOS_ESTANDAR = { S: 35, M: 40, L: 50 };
const PRECIOS_PROSERPINA = { S: 70, M: 90, L: 120 };
const PRECIOS_THEMIS = { S: 40, M: 50, L: 60 };
const PRECIOS_ATLAS = { S: 50, M: 60, L: 70 };

const MOCK_MODELS = [
  { id: "Aristóteles", name: "Aristóteles", category: "Bustos", image: "/images/Aristoteles.png", description: "Filósofo griego representado con túnica y barba detallada.", prices: PRECIOS_ESTANDAR },
  { id: "Atenea", name: "Atenea", category: "Bustos", image: "/images/atenea_B.png", description: "Busto de la diosa con casco decorado y expresión serena.", prices: PRECIOS_ESTANDAR },
  // ... (Mantén aquí el resto de tus modelos igual que los tienes)
].sort((a, b) => a.name.localeCompare(b.name));

const sizeConfigs = {
  'S': { scale: 0.55, label: '8cm' },
  'M': { scale: 0.75, label: '10cm' },
  'L': { scale: 1, label: '12cm' }
};

export default function CatalogPage() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [cart, setCart] = useState([]);
  const [config, setConfig] = useState({ size: 'M', color: 'Blanco' });
  const [activeCategory, setActiveCategory] = useState('Todo');
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState('');
  const [orderStatus, setOrderStatus] = useState('idle');

  const normalize = (text) =>
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');

  const filteredModels = useMemo(() => {
    const searchNormalized = normalize(searchQuery);
    const filtered = MOCK_MODELS.filter(m => activeCategory === 'Todo' || m.category === activeCategory);
    if (!searchNormalized) return filtered;

    return filtered
      .filter(model => normalize(model.name).includes(searchNormalized))
      .sort((a, b) => {
        const aStart = normalize(a.name).startsWith(searchNormalized);
        const bStart = normalize(b.name).startsWith(searchNormalized);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [activeCategory, searchQuery]);

  const addToCart = (model) => {
    const finalPrice = model.prices[config.size];
    setCart([...cart, { ...model, cartId: Math.random().toString(36).substr(2, 9), selectedSize: config.size, selectedColor: config.color, finalPrice }]);
    setSelectedModel(null);
    setIsCartOpen(true);
  };

  const handleFinalize = async () => {
    setOrderStatus('loading');
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId.trim(),
          items: cart,
          total: cartTotal,
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setOrderStatus('success');
        setTimeout(() => {
          setCart([]);
          setIsCartOpen(false);
          setIsCheckout(false);
          setOrderStatus('idle');
          setUserId('');
        }, 3000);
      } else {
        setOrderStatus('error');
      }
    } catch (error) {
      setOrderStatus('error');
    }
  };

  const removeItem = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));
  const cartTotal = cart.reduce((acc, item) => acc + item.finalPrice, 0);

  return (
    <div className="min-h-screen bg-white text-black font-sans p-6 md:p-8">
      {/* HEADER CON LOGO REDONDO OPTIMIZADO */}
      <header className="max-w-6xl mx-auto mb-8 border-b-2 border-black pb-6 flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border border-black/10">
            <Image
              src="/logo.png"
              alt="Aistesis Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none">Aistesis</h1>
            <p className="mt-1 text-[8px] text-gray-500 font-bold uppercase tracking-widest">Catálogo</p>
          </div>
        </div>
        <button onClick={() => { setIsCartOpen(true); setIsCheckout(false); }} className="relative p-2 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
          <ShoppingCart size={20} />
          {cart.length > 0 && <span className="absolute -top-3 -right-3 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
        </button>
      </header>

      {/* BÚSQUEDA Y FILTROS */}
      <div className="max-w-6xl mx-auto mb-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-gray-100 p-1 border-2 border-black">
            {['Todo', 'Bustos', 'Esculturas'].map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-black text-white' : 'hover:bg-gray-200 cursor-pointer'}`}>{cat}</button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
            <input type="text" placeholder="BUSCAR MODELO..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border-2 border-black py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:bg-gray-50 outline-none" />
          </div>
        </div>
      </div>

      {/* GRID CON IMÁGENES OPTIMIZADAS */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredModels.map((model) => (
            <motion.div layout key={model.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedModel(model)} className="group cursor-pointer border-2 border-black overflow-hidden bg-white">
              <div className="aspect-square relative bg-gray-50 p-6 overflow-hidden">
                <Image
                  src={model.image}
                  alt={model.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3 border-t-2 border-black flex justify-between items-center font-black uppercase text-[10px] tracking-widest group-hover:bg-black group-hover:text-white transition-colors">
                <div><span className="block text-[8px] opacity-50 mb-0.5">{model.category}</span>{model.name}</div>
                <Box size={14} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* MODAL DETALLE */}
      {/* MODAL DETALLE OPTIMIZADO */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-2 md:p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-white w-full max-w-4xl border-4 border-black relative flex flex-col md:flex-row overflow-hidden max-h-[95vh]">

              {/* BOTÓN CERRAR */}
              <button onClick={() => setSelectedModel(null)} className="absolute top-2 right-2 z-30 p-2 bg-white/80 rounded-full md:bg-transparent cursor-pointer"><X size={24} /></button>

              {/* SECCIÓN IMAGEN: Altura reducida en mobile (h-[35vh]) */}
              <div className="h-[35vh] md:h-auto md:flex-1 bg-[#f0f0f0] relative flex items-center justify-center p-4">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={selectedModel.image}
                    alt={selectedModel.name}
                    fill
                    className="object-contain p-2"
                    style={{ transform: `scale(${sizeConfigs[config.size].scale * 0.9})` }}
                  />

                  {/* REGLA: Posicionada dentro del cuadro para que no se corte */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 h-[60%] flex items-center">
                    <motion.div animate={{ height: `${sizeConfigs[config.size].scale * 100}%` }} className="w-[2px] bg-black/20 relative flex items-center">
                      <div className="absolute top-0 right-0 w-2 h-[2px] bg-black" />
                      <div className="absolute bottom-0 right-0 w-2 h-[2px] bg-black" />
                      {/* ETIQUETA: Movida a la izquierda de la línea para asegurar visibilidad */}
                      <div className="absolute right-4 bg-white border border-black px-1 py-0.5 text-[9px] font-black italic whitespace-nowrap">
                        {sizeConfigs[config.size].label}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* SECCIÓN TEXTO: Padding reducido y espaciado compacto */}
              <div className="flex-1 p-5 md:p-10 bg-white border-t-4 md:border-t-0 md:border-l-4 border-black overflow-y-auto">
                <h2 className="text-xl md:text-3xl font-black uppercase mb-1 tracking-tighter">{selectedModel.name}</h2>
                <p className="text-gray-500 text-[9px] md:text-[11px] mb-4 md:mb-8 uppercase font-bold leading-tight">
                  {selectedModel.description}
                </p>

                <div className="space-y-4 md:space-y-8">
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase flex items-center gap-2"><Ruler size={10} /> Escala</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['S', 'M', 'L'].map(s => (
                        <button key={s} onClick={() => setConfig({ ...config, size: s })} className={`py-2 md:py-3 border-2 border-black text-[10px] md:text-xs font-black ${config.size === s ? 'bg-black text-white' : 'opacity-40'}`}>{s}</button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-black flex justify-between items-center">
                    <span className="text-2xl md:text-3xl font-black italic">${selectedModel.prices[config.size]}</span>
                    <button onClick={() => addToCart(selectedModel)} className="bg-black text-white px-6 md:px-10 py-3 md:py-4 font-black uppercase tracking-widest text-[10px] md:text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
                      Añadir
                    </button>
                  </div>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CARRITO Y CHECKOUT SIMPLIFICADO */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsCartOpen(false); setIsCheckout(false); }} className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] border-l-4 border-black p-6 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                <div className="flex items-center gap-3">
                  {isCheckout && orderStatus === 'idle' && <button onClick={() => setIsCheckout(false)} className="cursor-pointer"><ArrowLeft size={20} /></button>}
                  <h3 className="font-black uppercase italic text-xl">Tu Carrito</h3>
                </div>
                <button onClick={() => { setIsCartOpen(false); setIsCheckout(false); }} className="cursor-pointer"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {!isCheckout ? (
                  cart.map((item) => (
                    <div key={item.cartId} className="flex gap-4 border-2 border-black p-3 items-center bg-gray-50">
                      <div className="relative h-16 w-16 bg-white border border-black/10">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 text-[10px] font-black uppercase">
                        <p className="text-xs">{item.name}</p>
                        <p className="text-gray-400">{item.selectedSize} — {item.selectedColor}</p>
                        <p className="mt-1 text-sm italic">${item.finalPrice}</p>
                      </div>
                      <button onClick={() => removeItem(item.cartId)} className="p-2 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"><Trash2 size={18} /></button>
                    </div>
                  ))
                ) : (
                  <div className="space-y-6">
                    {orderStatus === 'success' ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <CheckCircle2 size={64} />
                        <h4 className="font-black uppercase italic text-lg">¡Pedido Enviado!</h4>
                      </div>
                    ) : (
                      <>
                        <div className="border-2 border-black p-4 bg-gray-50 space-y-3 text-[10px] font-bold uppercase">
                          {cart.map(item => (
                            <div key={item.cartId} className="flex justify-between">
                              <span>{item.name} ({item.selectedSize})</span>
                              <span>${item.finalPrice}</span>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase block">ID de Usuario</label>
                          <input
                            type="text"
                            value={userId}
                            onChange={(e) => { setUserId(e.target.value); setOrderStatus('idle'); }}
                            placeholder="EJ: JOSE4021"
                            className={`w-full bg-white border-2 p-3 font-black uppercase text-xs outline-none ${orderStatus === 'error' ? 'border-red-500' : 'border-black'}`}
                          />
                          {orderStatus === 'error' && <p className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1"><AlertCircle size={10} /> ID Inválido</p>}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {orderStatus !== 'success' && cart.length > 0 && (
                <div className="border-t-4 border-black pt-6 mt-4">
                  <div className="flex justify-between font-black uppercase mb-6 text-2xl italic">
                    <span>Total:</span>
                    <span>${cartTotal}</span>
                  </div>
                  <button
                    onClick={!isCheckout ? () => setIsCheckout(true) : handleFinalize}
                    disabled={isCheckout && (!userId || orderStatus === 'loading')}
                    className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:bg-gray-900 disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {orderStatus === 'loading' ? <Loader2 className="animate-spin" /> : (!isCheckout ? 'Confirmar Pedido' : 'Finalizar Compra')}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <footer className="max-w-6xl mx-auto mt-16 text-center text-[9px] uppercase tracking-[0.4em] border-t-2 border-black pt-8 mb-8 opacity-40">© 2026 - Aistesis - Ingeniería FI UNAM</footer>
    </div>
  );
}