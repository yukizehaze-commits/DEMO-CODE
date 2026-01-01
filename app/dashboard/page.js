'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaSearch, FaArrowLeft, FaWhatsapp, FaUtensils, 
  FaCloudMeatball, FaPlay, FaPlus, FaMinus, FaShoppingBag, 
  FaCalendarAlt, FaCreditCard, FaCopy, FaCheck, FaExchangeAlt, FaMobileAlt, FaSpinner, 
  FaFileInvoiceDollar, FaHamburger, FaBirthdayCake, FaSnowflake, FaTimes, FaChevronRight, FaBoxOpen 
} from 'react-icons/fa';

// --- DATA MENU TERBARU (UPDATED) ---
const rawMenu = [
  // 1. ONIGIRI
  { id: 1, nama: "Onigiri Chicken Mayonaise SMD", harga: 10500, kategori: "Onigiri" },
  { id: 2, nama: "Onigiri Spicy Tuna SMD", harga: 10500, kategori: "Onigiri" },
  { id: 3, nama: "Onigiri Spicy Chicken Mayo SMD", harga: 10500, kategori: "Onigiri" },
  { id: 4, nama: "Onigiri Tuna Mayonaise SMD", harga: 10500, kategori: "Onigiri" },
  { id: 5, nama: "Onigiri Chicken Teriyaki SMD", harga: 10500, kategori: "Onigiri" },
  { id: 6, nama: "Onigiri Ayam Suwir Gurih SMD", harga: 10500, kategori: "Onigiri" },

  // 2. BENTO CHILLED
  { id: 7, nama: "Nasi Ayam Kemangi SMD", harga: 13000, kategori: "Bento Chilled" },
  { id: 8, nama: "Nasi Liwet Ayam Cabe Ijo SMD", harga: 13000, kategori: "Bento Chilled" },
  { id: 9, nama: "Nasi Uduk Spesial SMD", harga: 13000, kategori: "Bento Chilled" },
  { id: 10, nama: "Nasi Ayam Geprek SMD", harga: 15500, kategori: "Bento Chilled" },
  { id: 11, nama: "Nasi Ayam Geprek Jumbo SMD", harga: 20000, kategori: "Bento Chilled" },
  { id: 12, nama: "Nasi Ayam Goreng Saus Mentega SMD", harga: 15500, kategori: "Bento Chilled" },
  { id: 13, nama: "Nasi Goreng Nusantara SMD", harga: 15500, kategori: "Bento Chilled" },
  { id: 14, nama: "Nasi Goreng Tomyum SMD", harga: 21500, kategori: "Bento Chilled" },
  { id: 15, nama: "Nasi Goreng Merah Ayam Panggang SMD", harga: 15500, kategori: "Bento Chilled" },
  { id: 16, nama: "Nasi Ayam Cabe Garam SMD", harga: 21500, kategori: "Bento Chilled" },
  { id: 17, nama: "Nasi Daun Jeruk Sapi Maranggi SMD", harga: 24000, kategori: "Bento Chilled" },
  { id: 18, nama: "Nasi Goreng Ayam Hongkong SMD", harga: 21500, kategori: "Bento Chilled" },
  { id: 19, nama: "Chicken With Truffle Sauce SMD", harga: 21500, kategori: "Bento Chilled" },
  { id: 20, nama: "Spicy Korean Fried Chicken Rice SMD", harga: 25500, kategori: "Bento Chilled" },
  { id: 21, nama: "Nasi Lemak Ayam Rempah SMD", harga: 21500, kategori: "Bento Chilled" },

  // 3. PASTA NOODLES
  { id: 22, nama: "Spaghetti Bolognese Spesial SMD", harga: 19000, kategori: "Pasta Noodles" },

  // 4. SANDWICH
  { id: 23, nama: "Sandwich Chicken Nanban SMD", harga: 20000, kategori: "Sandwich" },
  { id: 24, nama: "Sandwich Menchikatsu SMD", harga: 20000, kategori: "Sandwich" },
  { id: 25, nama: "Sandwich Smoked Beef Garlic Cheese SMD", harga: 20000, kategori: "Sandwich" },

  // 5. FRESH CAKE
  { id: 26, nama: "Choco Dessert Cup SMD", harga: 13000, kategori: "Fresh Cake" },
  { id: 27, nama: "Banana Coffee Dessert Cup SMD", harga: 13000, kategori: "Fresh Cake" },
  { id: 28, nama: "Cake Tiramisu SMD", harga: 21500, kategori: "Fresh Cake" },
  { id: 29, nama: "Cake Choco Layer SMD", harga: 21500, kategori: "Fresh Cake" },
  { id: 30, nama: "Brownies Cokelat Almond SMD", harga: 10500, kategori: "Fresh Cake" },
  { id: 31, nama: "Muffin Strawberry Peanut Butter SMD", harga: 13000, kategori: "Fresh Cake" },
  { id: 32, nama: "Muffin Triple Choco SMD", harga: 13000, kategori: "Fresh Cake" },
  { id: 33, nama: "Muffin Banana Choco SMD", harga: 13000, kategori: "Fresh Cake" },
  { id: 34, nama: "Muffin Blueberry Cheese SMD", harga: 13000, kategori: "Fresh Cake" },

  // 6. FROZEN FOOD (ITEM SATUAN)
  { id: 35, nama: "Fz Nasi Ayam Woku SMD", harga: 26000, kategori: "Frozen Food" },
  { id: 36, nama: "Fz Beef Yakiniku SMD", harga: 27500, kategori: "Frozen Food" },
  { id: 37, nama: "Fz Nasi Ayam Betutu Sambal Matah SMD", harga: 26000, kategori: "Frozen Food" },
  { id: 38, nama: "Fz Chicken Teriyaki SMD", harga: 26000, kategori: "Frozen Food" },
  { id: 39, nama: "Fz Daging Sapi Cincang SMD", harga: 27500, kategori: "Frozen Food" },
  { id: 40, nama: "Fz Nasi Bakar Ayam SMD", harga: 26000, kategori: "Frozen Food" },
  { id: 41, nama: "Fz Nasi Bakar Ikan Cakalang SMD", harga: 26000, kategori: "Frozen Food" },
  { id: 42, nama: "Fz Nasi Rendang Sambal Cabe Ijo SMD", harga: 30000, kategori: "Frozen Food" },
  { id: 43, nama: "Fz Nasi Daun Ayam Geprek Sambal Madura SMD", harga: 12000, kategori: "Frozen Food" },
  { id: 44, nama: "Fz Nasi Goreng Hongkong SMD", harga: 16000, kategori: "Frozen Food" },
  { id: 45, nama: "Fz Bihun Goreng SMD", harga: 12000, kategori: "Frozen Food" },
  { id: 46, nama: "Fz Nasi Putih SMD", harga: 3000, kategori: "Frozen Food" },
  { id: 47, nama: "Bakso Goreng Ayam SMD", harga: 5500, kategori: "Frozen Food" },
  { id: 48, nama: "Pentol Ayam 8's SMD", harga: 9000, kategori: "Frozen Food" },
  { id: 49, nama: "Thai Chicken Popcorn SMD", harga: 11000, kategori: "Frozen Food" },
  { id: 50, nama: "Siomay Ayam SMD", harga: 6000, kategori: "Frozen Food" },
  { id: 51, nama: "Dimsum Ayam Pedas SMD", harga: 4500, kategori: "Frozen Food" },
  { id: 52, nama: "Dimsum Ayam SMD", harga: 4000, kategori: "Frozen Food" },
  { id: 53, nama: "Dimsum Ayam Bayam SMD", harga: 4000, kategori: "Frozen Food" },
  { id: 54, nama: "Dimsum Ayam Udang SMD", harga: 4500, kategori: "Frozen Food" },
  { id: 55, nama: "Steam Pao Besar Ayam Kecap SMD", harga: 9000, kategori: "Frozen Food" },
  { id: 56, nama: "Steam Pao Besar Ayam Panggang SMD", harga: 9000, kategori: "Frozen Food" },
  { id: 57, nama: "Crispy Boneless Chicken SMD", harga: 11500, kategori: "Frozen Food" },

  // 7. SOSIS
  { id: 58, nama: "Sosis Bakar Sapi SMD", harga: 8500, kategori: "Sosis" },
  { id: 59, nama: "Sosis Bakar Sapi Keju SMD", harga: 9000, kategori: "Sosis" },

  // 8. TRIMMINGAN CAKE
  { id: 60, nama: "Trimmingan Brownies", harga: 8000, kategori: "Trimmingan Cake" },
  { id: 61, nama: "Trimmingan Choco", harga: 8000, kategori: "Trimmingan Cake" },
  { id: 62, nama: "Trimmingan Tiramisu", harga: 8000, kategori: "Trimmingan Cake" },

  // 9. FROZEN PACK (BESAR)
  { id: 63, nama: "Siomay Ayam SMD (PCK)", harga: 48000, kategori: "Frozen Pack" },
  { id: 64, nama: "Dimsum Ayam Pedas SMD (PCK)", harga: 208000, kategori: "Frozen Pack" },
  { id: 65, nama: "Dimsum Ayam SMD (PCK)", harga: 192000, kategori: "Frozen Pack" },
  { id: 66, nama: "Dimsum Ayam Bayam SMD (PCK)", harga: 192000, kategori: "Frozen Pack" },
  { id: 67, nama: "Dimsum Ayam Udang SMD (PCK)", harga: 208000, kategori: "Frozen Pack" },
  { id: 68, nama: "Steam Pao Besar Ayam Kecap SMD (PCK)", harga: 103000, kategori: "Frozen Pack" },
  { id: 69, nama: "Steam Pao Besar Ayam Panggang SMD (PCK)", harga: 103000, kategori: "Frozen Pack" },
  { id: 70, nama: "Crispy Boneless Chicken SMD (PCK)", harga: 55500, kategori: "Frozen Pack" },
  { id: 71, nama: "Spicy Wings (PCK)", harga: 40000, kategori: "Frozen Pack" },
  { id: 72, nama: "Sosis Bakar Sapi SMD (PCK)", harga: 97500, kategori: "Frozen Pack" },
  { id: 73, nama: "Sosis Bakar Sapi Keju SMD (PCK)", harga: 107000, kategori: "Frozen Pack" },
];

// --- STYLING KATEGORI ---
const getCategoryStyle = (cat) => {
  switch(cat) {
    case "Onigiri": return { icon: <FaPlay className="-rotate-90 ml-1" />, bg: "bg-emerald-500", shadow: "shadow-emerald-200" };
    case "Bento Chilled": return { icon: <FaUtensils />, bg: "bg-orange-500", shadow: "shadow-orange-200" };
    case "Pasta Noodles": return { icon: <FaCloudMeatball />, bg: "bg-red-500", shadow: "shadow-red-200" };
    case "Sandwich": return { icon: <FaHamburger />, bg: "bg-amber-400", shadow: "shadow-amber-200" };
    case "Fresh Cake": return { icon: <FaBirthdayCake />, bg: "bg-pink-500", shadow: "shadow-pink-200" };
    case "Frozen Food": return { icon: <FaSnowflake />, bg: "bg-blue-500", shadow: "shadow-blue-200" };
    case "Sosis": return { icon: <FaCloudMeatball />, bg: "bg-rose-600", shadow: "shadow-rose-200" };
    case "Trimmingan Cake": return { icon: <FaBirthdayCake />, bg: "bg-purple-500", shadow: "shadow-purple-200" };
    case "Frozen Pack": return { icon: <FaBoxOpen />, bg: "bg-cyan-600", shadow: "shadow-cyan-200" };
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

  // -------------------------------------------------------------
  // 🔥🔥🔥 PASTE LINK GOOGLE SCRIPT DI BAWAH INI !!! 🔥🔥🔥
  // Hapus "PASTE_LINK_..." ganti jadi link asli lu (https://script.google.com/..../exec)
  // -------------------------------------------------------------
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbyfOpG7MATgkboZJJvv3yDQu3lutCRYHsuKf3BDlkVat4soW1FP4cRsIX-HVvafYTQM0A/exec"; 

  // DAFTAR KATEGORI LENGKAP
  const categories = [
    "Semua", "Onigiri", "Bento Chilled", "Pasta Noodles", 
    "Sandwich", "Fresh Cake", "Frozen Food", 
    "Sosis", "Trimmingan Cake", "Frozen Pack"
  ];

  const isakuPhone = "083140440179"; // GANTI NO HP I.SAKU DISINI
  const bcaKode = "27777";
  const atasNama = "SEPTIAN BAYU GANTENG";

  const getDisplayNumber = () => {
    if (paymentMethod === "bca") return `${bcaKode}${isakuPhone}`;
    return isakuPhone;
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

  // --- CHECKOUT LOGIC ---
  const handleCheckout = () => {
    if (!tanggal) {
        alert("⚠️ PERHATIAN: EITTSSS ISI TANGGAL DULU!");
        return;
    }
    
    setIsProcessing(true);

    let methodName = "BCA Virtual";
    if (paymentMethod === "isaku") methodName = "i.saku";
    if (paymentMethod === "ngutang") methodName = "NGUTANG";

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

    const formData = new FormData();
    formData.append("data", JSON.stringify(payload)); 

    // BUKA WA
    const nomorWA = "6283140440179"; // GANTI NOMOR WA ADMIN
    
    let pesan = `*PJ CK SMD - ${user.nama.toUpperCase()}* \n`;
    pesan += `NIK: ${user.nik || "-"}\n`;
    pesan += `Divisi: ${user.divisi || "-"}\n`;
    pesan += `📅 *Tgl Ambil: ${tanggal}*\n`; 
    pesan += `--------------------------------\n`;
    
    Object.keys(cart).forEach(id => {
      const item = menuData.find(m => m.id === parseInt(id));
      pesan += `▪️ ${item.nama} (${cart[id]}x) = Rp ${(item.harga * cart[id]).toLocaleString()}\n`;
    });
    
    pesan += `--------------------------------\n`;
    pesan += `*TOTAL QTY: ${getTotalItems()} Item*\n`;
    pesan += `*TOTAL BAYAR: Rp ${getTotalPrice().toLocaleString()}*\n`;
    pesan += `Via: ${methodName}\n`;

    if (paymentMethod !== "ngutang") {
        pesan += `\n*[LAMPIRKAN BUKTI TRANSFER DISINI]*\n`;
    } else {
        pesan += `\n_BAYAR GAJIAN YA_\n`;
    }
    
    pesan += `_Mohon disiapkan sesuai tanggal, Terima kasih!_`;
    
    window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`, "_blank");

    // KIRIM EXCEL BACKGROUND
    fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        body: formData,
        mode: "no-cors"
    }).then(() => {
        console.log("Data Excel terkirim di background.");
    }).catch(err => {
        console.error("Gagal kirim Excel:", err);
    });

    // Reset Loading & Close Modal
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
    <div className="min-h-screen bg-gray-50/50 pb-32 font-sans relative">
      
      {/* 1. POPUP RINCIAN PESANAN (KERANJANG) */}
      {showCartDetail && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl animate-slide-up relative flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <FaShoppingBag className="text-orange-500" /> Rincian Pesanan
                    </h3>
                    <button onClick={() => setShowCartDetail(false)} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>
                <div className="overflow-y-auto pr-1 space-y-3 flex-1">
                    {Object.keys(cart).length === 0 ? (
                        <p className="text-center text-gray-400 py-10">Keranjang masih kosong nih.</p>
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
                        Tutup
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* 2. POPUP CHECKOUT (PEMBAYARAN & TANGGAL) */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl animate-slide-up relative flex flex-col max-h-[90vh] overflow-y-auto">
                
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Konfirmasi Pesanan</h3>
                    <button onClick={() => setShowCheckoutModal(false)} className="bg-gray-100 p-2 rounded-full">
                        <FaTimes />
                    </button>
                </div>

                {/* DATE PICKER */}
                <div className="mb-5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Pilih Tanggal Pengambilan</label>
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

                {/* PAYMENT METHOD */}
                <div className="mb-5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Metode Pembayaran</label>
                    <div className={`p-4 rounded-xl border flex flex-col gap-3 transition-colors duration-300 ${paymentMethod === 'ngutang' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}>
                        
                        {/* TABS */}
                        <div className="flex bg-white/50 p-1 rounded-xl gap-1">
                            <button onClick={() => setPaymentMethod("bca")} className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === "bca" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}><FaExchangeAlt /> BCA</button>
                            <button onClick={() => setPaymentMethod("isaku")} className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === "isaku" ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}><FaMobileAlt /> i.saku</button>
                            <button onClick={() => setPaymentMethod("ngutang")} className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === "ngutang" ? "bg-white text-red-600 shadow-sm" : "text-gray-400"}`}><FaFileInvoiceDollar /> TANGGAL 28 NGAB</button>
                        </div>

                        {/* INFO REKENING */}
                        {paymentMethod !== "ngutang" ? (
                            <div className="bg-white p-3 rounded-xl border border-dashed border-gray-300 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-medium mb-0.5">{paymentMethod === "bca" ? "Kode (27777) + No. HP (TF lewat VA)" : "Nomor Handphone"}</p>
                                    <p className="text-lg font-mono font-bold text-gray-800 tracking-wider">{getDisplayNumber()}</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1">a.n {atasNama}</p>
                                </div>
                                <button onClick={handleCopyRekening} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isCopied ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                    {isCopied ? <FaCheck /> : <FaCopy />} {isCopied ? "Salin" : "Salin"}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-2"><p className="text-red-600 font-bold text-sm">⚠️ BAYAR PAS GAJIAN LAH ANJAY!</p></div>
                        )}
                    </div>
                </div>

                {/* TOMBOL FINAL CHECKOUT */}
                <button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-70"
                >
                    {isProcessing ? <><FaSpinner className="animate-spin" /> Mengirim Pesanan...</> : <><FaWhatsapp className="text-xl" /> Kirim Pesanan Sekarang</>}
                </button>
            </div>
        </div>
      )}

      {/* HEADER UTAMA */}
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
                          {user.divisi || "Order Makanan Kantor"}
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
                        placeholder="Cari menu favoritmu..." 
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

      {/* MENU GRID */}
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

      {/* --- FLOATING BAR (MINIMALIS) --- */}
      {getTotalItems() > 0 && (
          <div className="fixed bottom-6 left-0 right-0 px-5 z-50 animate-bounce-up">
             <div className="max-w-2xl mx-auto bg-gray-900/95 backdrop-blur-xl text-white p-4 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between gap-6">
                 
                 <div className="flex items-center gap-4 pl-2" onClick={() => setShowCartDetail(true)}>
                     <div className="bg-white/10 p-3 rounded-full cursor-pointer animate-pulse-slow">
                        <FaShoppingBag className="text-xl" />
                     </div>
                     <div>
                         <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total Pembayaran</p>
                         <p className="text-xl font-bold">Rp {getTotalPrice().toLocaleString()}</p>
                     </div>
                 </div>

                 <button 
                    onClick={() => setShowCheckoutModal(true)}
                    className="bg-white text-gray-900 font-bold py-3 px-6 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-all flex items-center gap-2 shadow-lg"
                 >
                     <span>Lanjut Bayar</span>
                     <FaChevronRight className="text-sm" />
                 </button>
             </div>
          </div>
      )}
    </div>
  );
}