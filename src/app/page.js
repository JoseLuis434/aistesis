"use client";
import React, { useState, useMemo } from 'react';
import { X, Box, Palette, ShoppingCart, Trash2, Ruler, Search, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


// Configuraciones de precios
const PRECIOS_ESTANDAR = { S: 35, M: 40, L: 50 };
const PRECIOS_PROSERPINA = { S: 70, M: 90, L: 120};
const PRECIOS_THEMIS = { S: 40, M: 50, L: 60 };
const PRECIOS_ATLAS = { S: 50, M: 60, L: 70 };

const MOCK_MODELS = [
  { id: "Aristóteles", name: "Aristóteles", category: "Bustos", image: "/images/Aristoteles.png", description: "Filósofo griego representado con túnica y barba detallada.", prices: PRECIOS_ESTANDAR },
  { id: "Atenea", name: "Atenea", category: "Bustos", image: "/images/atenea_B.png", description: "Busto de la diosa con casco decorado y expresión serena.", prices: PRECIOS_ESTANDAR },
  { id: "Atenea de Giustiniani", name: "Atenea de Giustiniani", category: "Esculturas", image: "/images/Atenea_S.png", description: "Diosa de la sabiduría con casco corintio y túnica larga.", prices: PRECIOS_ESTANDAR },
  { id: "Discóbolo de Mirón", name: "Discóbolo de Mirón", category: "Esculturas", image: "/images/Discobolo.png", description: "Atleta griego capturado en el punto máximo de tensión.", prices: PRECIOS_ESTANDAR },
  { id: "Edgar Allan Poe", name: "Edgar Allan Poe", category: "Bustos", image: "/images/poe.png", description: "Busto del maestro del terror con su icónica expresión sombría.", prices: PRECIOS_ESTANDAR },
  { id: "El Rapto de Proserpina", name: "El Rapto de Proserpina", category: "Esculturas", image: "/images/proserpina.png", description: "Compleja escena de Plutón sujetando a Proserpina.", prices: PRECIOS_PROSERPINA },
  { id: "Eros y Psique", name: "Eros y Psique", category: "Esculturas", image: "/images/eros.png", description: "Abrazo mitológico que simboliza la unión del amor y el alma.", prices: PRECIOS_PROSERPINA },
  { id: "Friedrich Nietzsche", name: "Friedrich Nietzsche", category: "Bustos", image: "/images/nietzsche.png", description: "Retrato del filósofo alemán con su característico bigote.", prices: PRECIOS_ESTANDAR },
  { id: "Homero", name: "Homero", category: "Bustos", image: "/images/homero.png", description: "Retrato clásico del legendario poeta ciego de la antigua Grecia.", prices: PRECIOS_ESTANDAR },
  { id: "HP Lovecraft", name: "HP Lovecraft", category: "Bustos", image: "/images/lovecraft.png", description: "Retrato del escritor de terror y ciencia ficción.", prices: PRECIOS_ESTANDAR },
  { id: "Marco Aurelio", name: "Marco Aurelio", category: "Bustos", image: "/images/aurelio.png", description: "Emperador romano con rasgos de filósofo estoico.", prices: PRECIOS_ESTANDAR },
  { id: "Perseo y Medusa", name: "Perseo y Medusa", category: "Esculturas", image: "/images/perseo.png", description: "Héroe mitológico sosteniendo la cabeza de la gorgona.", prices: PRECIOS_ESTANDAR },
  { id: "Platón", name: "Platón", category: "Bustos", image: "/images/platon.png", description: "Retrato del filósofo griego con su característica expresión serena.", prices: PRECIOS_ESTANDAR },
  { id: "Santo Tomas de Aquino", name: "Santo Tomas de Aquino", category: "Esculturas", image: "/images/aquino.png", description: "Teólogo medieval con hábitos y libro de la Summa.", prices: PRECIOS_ESTANDAR },
  { id: "Sócrates", name: "Sócrates", category: "Bustos", image: "/images/socrates.png", description: "Padre de la filosofía occidental con rasgos característicos.", prices: PRECIOS_ESTANDAR },
  { id: "Sólidos Platónicos", name: "Sólidos Platónicos", category: "Esculturas", image: "/images/solidos.png", description: "Conjunto de cinco sólidos geométricos regulares.", prices: PRECIOS_ESTANDAR },
  { id: "Themis", name: "Themis", category: "Esculturas", image: "/images/Themis.png", description: "Representación de la justicia divina con los ojos vendados.", prices: PRECIOS_THEMIS },
  { id: "Tolstói", name: "Tolstói", category: "Bustos", image: "/images/tolstoi.png", description: "Retrato del escritor ruso con su característico bigote.", prices: PRECIOS_ESTANDAR },
  { id: "Venus de Milo", name: "Venus de Milo", category: "Esculturas", image: "/images/venus.png", description: "Representación clásica de la diosa griega con su característica pose.", prices: PRECIOS_ESTANDAR },
  { id: "Zeus de Artemisión", name: "Zeus de Artemisión", category: "Esculturas", image: "/images/zeus.png", description: "Representación del dios Zeus en el templo de Artemisión.", prices: PRECIOS_ESTANDAR },
  { id: "El Pensador de Rodin", name: "El Pensador de Rodin", category: "Esculturas", image: "/images/pensador.png", description: "Representación del pensador filosófico de Rodin.", prices: PRECIOS_ESTANDAR },
  { id: "Apolo de Belvdedere", name: "Apolo de Belvdedere", category: "Esculturas", image: "/images/apolo.png", description: "Representación del dios Apolo en el templo de Belvedere.", prices: PRECIOS_ESTANDAR },
  { id: "Galileo Galilei", name: "Galileo Galilei", category: "Bustos", image: "/images/galileo.png", description: "Retrato del astrónomo y físico italiano con su característico bigote.", prices: PRECIOS_ESTANDAR },
  { id: "Virginia Woolf", name: "Virginia Woolf", category: "Bustos", image: "/images/woolf.png", description: "Réplica de su tumba en el cementerio de Hampstead.", prices: PRECIOS_ESTANDAR },
  { id: "Apolo y Dafne", name: "Apolo y Dafne", category: "Esculturas", image: "/images/dafne.png", description: "Representación del dios Apolo y la ninfa Dafne.", prices: PRECIOS_PROSERPINA },
  { id: "Atlas", name: "Atlas", category: "Esculturas", image: "/images/atlas.png", description: "Representación del dios Atlas soportando el cielo.", prices: PRECIOS_ATLAS },
  { id: "Piedra Rosetta", name: "Piedra Rosetta", category: "Esculturas", image: "/images/roseta.png", description: "Representación de la piedra que permitió descifrar el jeroglífico egipcio.", prices: PRECIOS_ESTANDAR },
  { id: "Asclepio", name: "Asclepio", category: "Esculturas", image: "/images/asclepio.png", description: "Representación del dios de la medicina Asclepio.", prices: PRECIOS_THEMIS },
  { id: "Séneca", name: "Séneca", category: "Bustos", image: "/images/seneca.png", description: "Retrato del filósofo romano con su característico bigote.", prices: PRECIOS_ESTANDAR },
  { id: "Tumba de Marx", name: "Tumba de Marx", category: "Bustos", image: "/images/marx_t.png", description: "Representación de la tumba del filósofo Karl Marx.", prices: PRECIOS_ESTANDAR },
  { id: "Los Luchadores de Florencia", name: "Los Luchadores de Florencia", category: "Esculturas", image: "/images/luchadores.png", description: "Representación de los luchadores de Florencia.", prices: PRECIOS_PROSERPINA },
  { id: "Hipócrates", name: "Hipócrates", category: "Bustos", image: "/images/hipocrates.png", description: "Retrato del médico griego considerado el padre de la medicina.", prices: PRECIOS_ESTANDAR },
  { id: "Cicerón", name: "Cicerón", category: "Bustos", image: "/images/ciceron.png", description: "Retrato del orador romano con su característico bigote.", prices: PRECIOS_ESTANDAR },
  { id: "Lacoonte y sus hijos", name: "Lacoonte y sus hijos", category: "Esculturas", image: "/images/lacoonte.png", description: "Representación del dios Lacoonte y sus hijos.", prices: PRECIOS_PROSERPINA },
  { id: "Fiódor Dostoyevski", name: "Fiódor Dostoyevski", category: "Bustos", image: "/images/dostoievsky.png", description: "Retrato del escritor ruso con su característico bigote.", prices: PRECIOS_ESTANDAR },
  { id: "Edipo en Colono", name: "Edipo en Colono", category: "Esculturas", image: "/images/edipo_colono.png", description: "Representación del rey Edipo y Antígona en Colono.", prices: PRECIOS_PROSERPINA },
  { id: "Sófocles", name: "Sófocles", category: "Esculturas", image: "/images/sofocles.png", description: "Representación del dramaturgo griego Sófocles.", prices: PRECIOS_ESTANDAR },
  { id: "Moisés", name: "Moisés", category: "Esculturas", image: "/images/moises.png", description: "Representación del profeta Moisés en El Vaticano.", prices: PRECIOS_ATLAS },
  { id: "Orestes y Electra", name: "Orestes y Electra", category: "Esculturas", image: "/images/orestes.png", description: "Representación de los personajes Orestes y Electra.", prices: PRECIOS_ATLAS },
  { id: "Charles Darwin", name: "Charles Darwin", category: "Bustos", image: "/images/darwin.png", description: "Retrato del naturalista Charles Darwin.", prices: PRECIOS_ESTANDAR },
  { id: "Niké", name: "Niké", category: "Esculturas", image: "/images/nike.png", description: "Representación de la diosa griega Niké.", prices: PRECIOS_ESTANDAR },
  { id: "Icaro", name: "Icaro", category: "Esculturas", image: "/images/icaro.png", description: "Representación del mito de Icaro.", prices: PRECIOS_ATLAS },
  { id: "Augusto de Prima Porta", name: "Augusto de Prima Porta", category: "Esculturas", image: "/images/augusto.png", description: "Representación del emperador Augusto de Prima Porta.", prices: PRECIOS_ESTANDAR },
  { id: "David de Bernini", name: "David de Bernini", category: "Esculturas", image: "/images/david_bernini.png", description: "Representación del escultor Bernini y su obra David.", prices: PRECIOS_ESTANDAR },
  { id: "David de Miguel Angel", name: "David de Miguel Angel", category: "Esculturas", image: "/images/david_ma.png", description: "Representación del escultor Miguel Ángel y su obra David.", prices: PRECIOS_ESTANDAR },
  { id: "Eneas y Anquises", name: "Eneas y Anquises", category: "Esculturas", image: "/images/eneas.png", description: "Representación de los personajes Eneas y Anquises.", prices: PRECIOS_ATLAS },
  { id: "Dante Alighieri", name: "Dante Alighieri", category: "Bustos", image: "/images/dante.png", description: "Representación del escritor Dante Alighieri.", prices: PRECIOS_ESTANDAR },
  { id: "Blaise Pascal", name: "Blaise Pascal", category: "Escultura", image: "/images/pascal.png", description: "Retrato del filósofo y matemático Blaise Pascal.", prices: PRECIOS_ATLAS },
  { id: "Caronte", name: "Caronte", category: "Escultura", image: "/images/caronte.png", description: "Representación del dios Caronte.", prices: PRECIOS_ATLAS },
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

  // Estados de validación
  const [userId, setUserId] = useState('');
  const [orderStatus, setOrderStatus] = useState('idle'); // idle, loading, success, error

  const normalize = (text) => 
    text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');

  const filteredModels = useMemo(() => {
    const searchNormalized = normalize(searchQuery);
    if (!searchNormalized) return MOCK_MODELS.filter(m => activeCategory === 'Todo' || m.category === activeCategory);

    return MOCK_MODELS
      .filter(model => (activeCategory === 'Todo' || model.category === activeCategory) && normalize(model.name).includes(searchNormalized))
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId.trim(),
          items: cart,
          total: cartTotal,
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderStatus('success');
        
        // Limpiar carrito después de 3 segundos
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
      console.error("Error en la conexión local:", error);
      setOrderStatus('error');
    }
  };

  const removeItem = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));
  const cartTotal = cart.reduce((acc, item) => acc + item.finalPrice, 0);

  return (
    <div className="min-h-screen bg-white text-black font-sans p-6 md:p-8">
      {/* HEADER */}
      {/* HEADER */}
<header className="max-w-6xl mx-auto mb-8 border-b-2 border-black pb-6 flex justify-between items-end">
  <div className="flex items-center gap-4">
    {/* TU LOGO */}
    <img 
      src="/logo.png" 
      alt="Aistesis Logo" 
      className="h-12 w-auto object-contain rounded-2xl" 
    />
    
    <div>
      <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic leading-none">
        Aistesis
      </h1>
      <p className="mt-1 text-[8px] text-gray-500 font-bold uppercase tracking-widest">
        Catálogo
      </p>
    </div>
  </div>
  
  <button onClick={() => {setIsCartOpen(true); setIsCheckout(false);}} className="relative p-2 border-2 border-black hover:bg-black hover:text-white transition-colors cursor-pointer">
    <ShoppingCart size={20} />
    {cart.length > 0 && <span className="absolute -top-3 -right-3 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>}
  </button>
</header>

      {/* NAVEGACIÓN */}
      <div className="max-w-6xl mx-auto mb-10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex bg-gray-100 p-1 border-2 border-black">
            {['Todo', 'Bustos', 'Esculturas'].map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex-1 md:flex-none px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-black text-white' : 'hover:bg-gray-200 cursor-pointer'}`}>{cat}</button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
            <input type="text" placeholder="BUSCAR MODELO..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border-2 border-black py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest focus:bg-gray-50 outline-none" />
          </div>
        </div>
      </div>

      {/* GRID */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        <AnimatePresence mode='popLayout'>
          {filteredModels.map((model) => (
            <motion.div layout key={model.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} whileHover="hover" onClick={() => setSelectedModel(model)} className="group cursor-pointer border-2 border-black overflow-hidden bg-white h-fit">
              <div className="aspect-square overflow-hidden bg-gray-50 p-6 relative">
                <motion.img src={model.image} alt={model.name} variants={{ hover: { scale: 1.08, filter: "grayscale(0%)" } }} initial={{ filter: "grayscale(100%)", scale: 1 }} transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }} className="object-contain w-full h-full pointer-events-none" />
              </div>
              <div className="p-3 border-t-2 border-black flex justify-between items-center font-black uppercase text-[10px] tracking-widest bg-white group-hover:bg-black group-hover:text-white transition-colors duration-300">
                <div><span className="block text-[8px] opacity-50 mb-0.5">{model.category}</span>{model.name}</div>
                <Box size={14} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* MODAL DETALLE */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="bg-white w-full max-w-4xl border-4 border-black relative flex flex-col md:flex-row overflow-hidden max-h-full">
              <button onClick={() => setSelectedModel(null)} className="absolute top-4 right-4 z-30 cursor-pointer p-2 hover:rotate-90 transition-transform"><X size={28} /></button>
              <div className="flex-1 bg-[#f0f0f0] flex items-center justify-center p-8 min-h-[300px]">
                <div className="relative w-full h-full max-w-[300px] flex items-center justify-center">
                  <motion.img src={selectedModel.image} animate={{ scale: sizeConfigs[config.size].scale }} className="w-full h-full object-contain z-10" />
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 h-[70%] flex items-center">
                    <motion.div animate={{ height: `${sizeConfigs[config.size].scale * 100}%` }} className="w-[2px] bg-black/30 relative flex items-center">
                      <div className="absolute top-0 right-0 w-3 h-[2px] bg-black" />
                      <div className="absolute bottom-0 right-0 w-3 h-[2px] bg-black" />
                      <div className="absolute left-4 bg-white border border-black px-1.5 py-0.5 text-[10px] font-black italic shadow-sm">{sizeConfigs[config.size].label}</div>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 p-6 md:p-10 bg-white border-t-2 md:border-t-0 md:border-l-2 border-black overflow-y-auto">
                <h2 className="text-2xl md:text-3xl font-black uppercase mb-1 tracking-tighter leading-tight">{selectedModel.name}</h2>
                <p className="text-gray-500 text-[11px] mb-6 uppercase font-bold tracking-widest">{selectedModel.description}</p>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase flex items-center gap-2"><Ruler size={12} /> Escala</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['S', 'M', 'L'].map(s => (
                        <button key={s} onClick={() => setConfig({ ...config, size: s })} className={`py-3 border-2 border-black text-xs font-black transition-all ${config.size === s ? 'bg-black text-white shadow-md scale-105' : 'opacity-40 hover:opacity-100 cursor-pointer'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase flex items-center gap-2"><Palette size={12} /> Filamento (sin vista previa)</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['Blanco', 'Mármol', 'Negro'].map(c => (
                        <button key={c} onClick={() => setConfig({ ...config, color: c })} className={`py-2 border-2 border-black text-[9px] font-black uppercase transition-all ${config.color === c ? 'bg-black text-white shadow-md scale-105' : 'opacity-40 hover:opacity-100 cursor-pointer'}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t-2 border-black flex justify-between items-center">
                    <span className="text-3xl font-black italic">${selectedModel.prices[config.size]}</span>
                    <button onClick={() => addToCart(selectedModel)} className="bg-black text-white px-8 py-4 font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all cursor-pointer border-2 border-black shadow-lg">Añadir</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CARRITO / CHECKOUT --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {setIsCartOpen(false); setIsCheckout(false);}} className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] border-l-4 border-black p-6 flex flex-col shadow-2xl overflow-hidden">
              
              <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                <div className="flex items-center gap-3">
                  {isCheckout && orderStatus === 'idle' && (
                    <button onClick={() => setIsCheckout(false)} className="cursor-pointer hover:scale-110 transition-transform"><ArrowLeft size={20}/></button>
                  )}
                  <h3 className="font-black uppercase italic text-xl tracking-tighter">
                    {isCheckout ? 'Resumen de Compra' : 'Tu Carrito'}
                  </h3>
                </div>
                <button onClick={() => {setIsCartOpen(false); setIsCheckout(false);}} className="cursor-pointer hover:rotate-90 transition-transform"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {!isCheckout ? (
                  // --- VISTA: CARRITO ---
                  <>
                    {cart.map((item) => (
                      <div key={item.cartId} className="flex gap-4 border-2 border-black p-3 items-center bg-gray-50">
                        <img src={item.image} className="w-16 h-16 object-contain bg-white border border-black/10" />
                        <div className="flex-1 text-[10px] font-black uppercase tracking-widest">
                          <p className="text-xs">{item.name}</p>
                          <p className="text-gray-400">{item.selectedSize} — {item.selectedColor}</p>
                          <p className="mt-1 font-black text-sm italic">${item.finalPrice}</p>
                        </div>
                        <button onClick={() => removeItem(item.cartId)} className="p-2 text-black hover:bg-red-500 hover:text-white transition-colors cursor-pointer border-l border-black/10"><Trash2 size={18}/></button>
                      </div>
                    ))}
                    {cart.length === 0 && <p className="text-center font-black uppercase text-[10px] py-20 opacity-30 italic">Vacío</p>}
                  </>
                ) : (
                  // --- VISTA: CHECKOUT ---
                  <div className="space-y-6">
                    {orderStatus === 'success' ? (
                      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <CheckCircle2 size={64} className="text-black" />
                        <h4 className="font-black uppercase text-lg italic">¡Pedido Enviado!</h4>
                        <p className="text-[10px] font-bold uppercase text-gray-400">Tu orden ha sido procesada con éxito.</p>
                      </motion.div>
                    ) : (
                      <>
                        <div className="border-2 border-black p-4 bg-gray-50 space-y-3">
                          <span className="text-[10px] font-black uppercase opacity-50 block mb-2">Artículos</span>
                          {cart.map(item => (
                            <div key={item.cartId} className="flex justify-between text-[10px] font-bold uppercase">
                              <span>{item.name} ({item.selectedSize})</span>
                              <span>${item.finalPrice}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest block">ID de Usuario</label>
                          <input 
                            type="text" 
                            value={userId}
                            onChange={(e) => {setUserId(e.target.value); setOrderStatus('idle');}}
                            placeholder="EJ: FI-2026-001"
                            className={`w-full bg-white border-2 p-3 font-black uppercase text-xs focus:bg-gray-50 outline-none transition-colors ${orderStatus === 'error' ? 'border-red-500' : 'border-black'}`}
                          />
                          {orderStatus === 'error' && (
                            <p className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1">
                              <AlertCircle size={10}/> ID no encontrado en la base de datos
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {orderStatus !== 'success' && cart.length > 0 && (
                <div className="border-t-4 border-black pt-6 mt-4">
                  <div className="flex justify-between font-black uppercase mb-6 text-2xl italic tracking-tighter">
                    <span>Total:</span>
                    <span>${cartTotal}</span>
                  </div>
                  
                  {!isCheckout ? (
                    <button 
                      onClick={() => setIsCheckout(true)}
                      className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:bg-gray-900 transition-colors cursor-pointer"
                    >
                      Confirmar Pedido
                    </button>
                  ) : (
                    <button 
                      onClick={handleFinalize}
                      disabled={!userId || orderStatus === 'loading'}
                      className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.3em] text-[10px] shadow-xl hover:bg-gray-900 transition-colors cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {orderStatus === 'loading' ? (
                        <>Procesando <Loader2 size={16} className="animate-spin" /></>
                      ) : 'Finalizar Compra'}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto mt-16 text-center text-[9px] uppercase tracking-[0.4em] border-t-2 border-black pt-8 mb-8 opacity-40">
        © 2026 - Aistesis - Ingeniería FI UNAM
      </footer>
    </div>
  );
}