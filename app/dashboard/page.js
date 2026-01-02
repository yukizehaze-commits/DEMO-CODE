'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaSearch, FaArrowLeft, FaWhatsapp, FaUtensils, 
  FaCloudMeatball, FaPlay, FaPlus, FaMinus, FaShoppingBag, 
  FaCalendarAlt, FaCreditCard, FaCopy, FaCheck, FaExchangeAlt, FaMobileAlt, FaSpinner, 
  FaFileInvoiceDollar, FaHamburger, FaBirthdayCake, FaSnowflake, FaTimes, FaChevronRight, FaBoxOpen 
} from 'react-icons/fa';

const GOOGLE_SHEET_URL = ""; 
const ADMIN_WA_NUMBER = "628000000000"; 
const PAYMENT_CONFIG = {
  isaku: { phone: "0812-XXXX-XXXX" },
  bca: { code: "123456", accountName: "Company Finance" }
};

const rawMenu = [
  { id: 1, nama: "Signature Beef Bento", harga: 45000, kategori: "Bento Chilled" },
  { id: 2, nama: "Chicken Katsu Curry", harga: 38000, kategori: "Bento Chilled" },
  { id: 3, nama: "Spicy Tuna Onigiri", harga: 12000, kategori: "Onigiri" },
  { id: 4, nama: "Salmon Mayo Onigiri", harga: 15000, kategori: "Onigiri" },
  { id: 5, nama: "Creamy Mushroom Pasta", harga: 32000, kategori: "Pasta Noodles" },
  { id: 6, nama: "Spaghetti Aglio Olio", harga: 28000, kategori: "Pasta Noodles" },
  { id: 7, nama: "Club Sandwich Deluxe", harga: 25000, kategori: "Sandwich" },
  { id: 8, nama: "Egg & Cheese Toast", harga: 18000, kategori: "Sandwich" },
  { id: 9, nama: "Chocolate Lava Cake", harga: 22000, kategori: "Fresh Cake" },
  { id: 10, nama: "Matcha Cheese Tart", harga: 24000, kategori: "Fresh Cake" },
  { id: 11, nama: "Frozen Chicken Wings", harga: 55000, kategori: "Frozen Food" },
  { id: 12, nama: "Frozen Beef Patty", harga: 65000, kategori: "Frozen Food" },
];

const getCategoryStyle = (cat) => {
  switch(cat) {
    case "Onigiri": return { icon: <FaPlay className="-rotate-90 ml-1" />, bg: "bg-emerald-500", shadow: "shadow-emerald-200" };
    case "Bento Chilled": return { icon: <FaUtensils />, bg: "bg-orange-500", shadow: "shadow-orange-200" };
    case "Pasta Noodles": return { icon: <FaCloudMeatball />, bg: "bg-red-500", shadow: "shadow-red-200" };
    case "Sandwich": return { icon: <FaHamburger />, bg: "bg-amber-400", shadow: "shadow-amber-200" };
    case "Fresh Cake": return { icon: <FaBirthdayCake />, bg: "bg-pink-500", shadow: "shadow-pink-200" };
    case "Frozen Food": return { icon: <FaSnowflake />, bg: "bg-blue-500", shadow: "shadow-blue-200" };
    default: return { icon: <FaUtensils />, bg: "bg-gray-500", shadow: "shadow-gray-200" };
  }
};

const menuData = rawMenu.map(item => {
  const style = getCategoryStyle(item.kategori);
  return { ...item, icon: style.icon, iconBg: style.bg, iconShadow: style.shadow };
});

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState(""); 
  const [isCopied, setIsCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bca");
  const [isProcessing, setIsProcessing] = useState(false); 
  const [showCartDetail, setShowCartDetail] = useState(false); 
  const [showCheckoutModal, setShowCheckoutModal] = useState(false); 
  const router = useRouter();

  const categories = ["Semua", "Bento Chilled", "Onigiri", "Pasta Noodles", "Sandwich", "Fresh Cake", "Frozen Food"];

  const getDisplayNumber = () => {
    if (paymentMethod === "bca") return `${PAYMENT_CONFIG.bca.code}`;
    return PAYMENT_CONFIG.isaku.phone;
  };

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (!data) router.push("/login");
    else setUser(JSON.parse(data));
  }, [router]);

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) - 1;
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const getTotalItems = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const getTotalPrice = () => Object.keys(cart).reduce((total, id) => {
    const item = menuData.find(m => m.id === parseInt(id));
    return total + (item.harga * cart[id]);
  }, 0);

  const handleCopyRekening = () => {
    const textToCopy = getDisplayNumber();
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); 
  };

  const handleCheckout = () => {
    if (!tanggal) {
        alert("Please select a pickup date.");
        return;
    }
    
    setIsProcessing(true);

    let methodName = "Bank Transfer";
    if (paymentMethod === "isaku") methodName = "E-Wallet";
    if (paymentMethod === "ngutang") methodName = "Pay Later";

    const itemsToUpload = Object.keys(cart).map(id => {
        const item = menuData.find(m => m.id === parseInt(id));
        return {
            namaMenu: item.nama,
            qty: cart[id],
            subtotal: item.harga * cart[id]
        };
    });

    const payload = {
        metadata: {
            tanggalOrder: new Date().toLocaleString(),
            tglAmbil: tanggal,
            nik: user.nik,
            nama: user.nama,
            divisi: user.divisi,
            metodeBayar: methodName
        },
        items: itemsToUpload
    };

    let pesan = `*ORDER DEMO - ${user.nama}*\n`;
    pesan += `ID: ${user.nik}\n`;
    pesan += `📅 *Pickup: ${tanggal}*\n`; 
    pesan += `--------------------------------\n`;
    
    Object.keys(cart).forEach(id => {
      const item = menuData.find(m => m.id === parseInt(id));
      pesan += `▪️ ${item.nama} (${cart[id]}x)\n`;
    });
    
    pesan += `--------------------------------\n`;
    pesan += `*TOTAL: Rp ${getTotalPrice().toLocaleString()}*\n`;
    pesan += `Payment: ${methodName}\n`;
    
    window.open(`https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(pesan)}`, "_blank");

    setTimeout(() => {
        setIsProcessing(false);
        setShowCheckoutModal(false); 
        setCart({}); 
        setTanggal(""); 
    }, 1000);
  };

  const filteredMenu = menuData.filter(item => {
    const matchCategory = activeCategory === "Semua" || item.kategori === activeCategory;
    const matchSearch = item.nama.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 font-sans relative">
      
      {showCartDetail && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl animate-slide-up relative flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <FaShoppingBag className="text-orange-500" /> Cart Summary
                    </h3>
                    <button onClick={() => setShowCartDetail(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>
                <div className="overflow-y-auto pr-1 space-y-3 flex-1">
                    {Object.keys(cart).length === 0 ? (
                        <p className="text-center text-gray-400 py-10">Empty Cart</p>
                    ) : (
                        Object.keys(cart).map(id => {
                            const item = menuData.find(m => m.id === parseInt(id));
                            const qty = cart[id];
                            return (
                                <div key={id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <div className="flex-1 pr-2">
                                        <h4 className="font-bold text-gray-800 text-sm break-words">{item.nama}</h4>
                                        <p className="text-xs text-gray-500">@ Rp {item.harga.toLocaleString()}</p>
                                        <p className="text-sm font-bold text-orange-600 mt-1">Rp {(item.harga * qty).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm shrink-0">
                                        <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-500"><FaMinus className="text-xs"/></button>
                                        <span className="font-bold text-gray-800 w-4 text-center text-sm">{qty}</span>
                                        <button onClick={() => addToCart(item.id)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-green-500"><FaPlus className="text-xs"/></button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <button onClick={() => setShowCartDetail(false)} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}

      {showCheckoutModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl animate-slide-up relative flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Checkout</h3>
                    <button onClick={() => setShowCheckoutModal(false)} className="bg-gray-100 p-2 rounded-full">
                        <FaTimes />
                    </button>
                </div>

                <div className="mb-5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Pickup Date</label>
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <FaCalendarAlt className="text-orange-500 text-lg" />
                        <input 
                            type="date" 
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            className="bg-transparent w-full text-gray-800 font-bold outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Payment</label>
                    <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors duration-300 ${paymentMethod === 'ngutang' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                        <div className="flex bg-white/50 p-1 rounded-xl gap-1">
                            <button onClick={() => setPaymentMethod("bca")} className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === "bca" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}><FaExchangeAlt /> Transfer</button>
                            <button onClick={() => setPaymentMethod("isaku")} className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === "isaku" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}><FaMobileAlt /> E-Wallet</button>
                            <button onClick={() => setPaymentMethod("ngutang")} className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === "ngutang" ? "bg-white text-red-600 shadow-sm" : "text-gray-400"}`}><FaFileInvoiceDollar /> Pay Later</button>
                        </div>

                        {paymentMethod !== "ngutang" ? (
                            <div className="bg-white p-3 rounded-xl border border-dashed border-gray-300 flex items-center justify-between">
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="text-[10px] text-gray-400 font-medium mb-0.5">{paymentMethod === "bca" ? "Virtual Account" : "E-Wallet No."}</p>
                                    <p className="text-sm sm:text-lg font-mono font-bold text-gray-800 tracking-wider break-all leading-tight">
                                        {getDisplayNumber()}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1">{PAYMENT_CONFIG.bca.accountName}</p>
                                </div>
                                <button onClick={handleCopyRekening} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${isCopied ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                    {isCopied ? <FaCheck /> : <FaCopy />} {isCopied ? "Copied" : "Copy"}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-2"><p className="text-red-600 font-bold text-sm">⚠️ Recorded as Credit</p></div>
                        )}
                    </div>
                </div>

                <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                >
                    {isProcessing ? <><FaSpinner className="animate-spin" /> Processing...</> : <><FaWhatsapp className="text-xl" /> Confirm Order</>}
                </button>
            </div>
        </div>
      )}

      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100/50 shadow-sm">
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-xl">
                        <FaUtensils className="text-orange-600" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 text-lg leading-tight">
                          Hi, {user.nama}
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">
                          {user.divisi}
                        </p>
                    </div>
                </div>
                <button onClick={() => { localStorage.removeItem("user"); router.push("/login"); }} className="p-2.5 bg-gray-100 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 transition duration-200">
                    <FaArrowLeft />
                </button>
            </div>

            <div className="px-5 pb-2">
                <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search menu..." 
                        className="w-full bg-gray-100/80 text-gray-800 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-5 pb-4 pt-2 flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade">
                {categories.map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all duration-200 border ${
                            activeCategory === cat 
                            ? "bg-gray-900 text-white border-gray-900 shadow-md" 
                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredMenu.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                    <div key={item.id} className="group bg-white rounded-2xl p-2.5 md:p-3 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex gap-3 md:gap-4 items-start h-auto">
                        <div className={`w-14 h-14 md:w-20 md:h-20 flex-shrink-0 rounded-xl ${item.iconBg} text-white flex items-center justify-center text-xl md:text-2xl shadow-lg ${item.iconShadow}`}>
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5 md:py-1">
                            <div className="flex items-center gap-2 mb-0.5 md:mb-1">
                                <span className="px-1.5 py-0.5 rounded-md bg-gray-50 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-400 border border-gray-100">
                                    {item.kategori}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-800 text-[11px] md:text-sm leading-tight line-clamp-3 mb-1" title={item.nama}>
                                {item.nama}
                            </h3>
                            <p className="text-gray-900 font-extrabold text-sm">
                                Rp {item.harga.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 self-center">
                            {qty === 0 ? (
                                <button 
                                    onClick={() => addToCart(item.id)}
                                    className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-50 border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm active:scale-90"
                                >
                                    <FaPlus className="text-xs" />
                                </button>
                            ) : (
                                <div className="flex flex-col items-center bg-gray-900 rounded-full p-1 shadow-lg text-white">
                                    <button onClick={() => addToCart(item.id)} className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-white/20 rounded-full transition"><FaPlus className="text-[10px]" /></button>
                                    <span className="text-xs font-bold py-0.5 md:py-1">{qty}</span>
                                    <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 md:w-7 md:h-7 flex items-center justify-center hover:bg-white/20 rounded-full transition"><FaMinus className="text-[10px]" /></button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {getTotalItems() > 0 && (
          <div className="fixed bottom-6 left-0 right-0 px-5 z-50 animate-bounce-up">
             <div className="max-w-2xl mx-auto bg-gray-900/95 backdrop-blur-xl text-white p-4 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between gap-6">
                 
                 <div className="flex items-center gap-4 pl-2" onClick={() => setShowCartDetail(true)}>
                     <div className="bg-white/10 p-3 rounded-full cursor-pointer animate-pulse-slow">
                        <FaShoppingBag className="text-xl" />
                     </div>
                     <div>
                         <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total</p>
                         <p className="text-xl font-bold">Rp {getTotalPrice().toLocaleString()}</p>
                     </div>
                 </div>

                 <button 
                    onClick={() => setShowCheckoutModal(true)}
                    className="bg-white text-gray-900 font-bold py-3 px-6 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-all flex items-center gap-2 shadow-lg"
                 >
                     <span>Checkout</span>
                     <FaChevronRight className="text-sm" />
                 </button>
             </div>
          </div>
      )}
    </div>
  );
}