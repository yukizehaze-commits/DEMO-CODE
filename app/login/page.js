'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaSpinner } from 'react-icons/fa';

// --- DATABASE KARYAWAN (DARI DATA YANG LU KASIH) ---
const employees = [
  { nik: "2015439740", nama: "GALANG DAVID PRASETYO", divisi: "LOGISTIC (CK SAMARINDA)" },
  { nik: "2015442298", nama: "AYYUB YASIN ROHALI", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015442547", nama: "KRESNA SENO DIWANGSA", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015453814", nama: "ANDI NASAR DWI SAPUTRA", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015453821", nama: "SEPTIAN BAYU PRADANA", divisi: "KITCHEN ADMINISTRATION (CK SAMARINDA)" },
  { nik: "2015454891", nama: "VICKY INDRA SAPUTRA", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015456581", nama: "ANDIKA FEBRIAN", divisi: "KITCHEN ADMINISTRATION (CK SAMARINDA)" },
  { nik: "2015458773", nama: "EVIANA", divisi: "KITCHEN ADMINISTRATION (CK SAMARINDA)" },
  { nik: "2015460092", nama: "MUHAMMAD RIDHO", divisi: "PRODUCTION 2 (CK SAMARINDA)" },
  { nik: "2015460098", nama: "MUHAMMAD HELMY", divisi: "LOGISTIC (CK SAMARINDA)" },
  { nik: "2015460100", nama: "ARDY SAPUTRA", divisi: "QUALITY ASSURANCE & CONTROL (CK SAMARINDA)" },
  { nik: "2015460103", nama: "RAHMAWATI", divisi: "PACKING 2 (CK SAMARINDA)" },
  { nik: "2015460106", nama: "ANGGUN APRILIANI BONTA", divisi: "LOGISTIC (CK SAMARINDA)" },
  { nik: "2015461575", nama: "ANDRIAN SAPUTRA", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015461576", nama: "MUHAMMAD NAFIIS", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015461702", nama: "SALSABILA AULIA RAHMASARI", divisi: "LOGISTIC (CK SAMARINDA)" },
  { nik: "2015462426", nama: "MASNIAH", divisi: "LOGISTIC (CK SAMARINDA)" },
  { nik: "2015468393", nama: "RISZKI FAUZAN", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015472104", nama: "ARIE RAHMADANI", divisi: "LOGISTIC (CK SAMARINDA)" },
  { nik: "2015472269", nama: "DWI AGUNG SAPUTRA", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015474036", nama: "AHMAD RUDI KHAIRUDIN", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015483024", nama: "ALDY CAHYO MAHRIANTO", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015483101", nama: "ARUMI BAGAS TARA", divisi: "PACKING 1 (CK SAMARINDA)" },
  { nik: "2015483194", nama: "JIBRAN MAULANA", divisi: "PACKING 1 (CK SAMARINDA)" },
  { nik: "2015483232", nama: "AULIA RAHMAN", divisi: "PRODUCTION 2 (CK SAMARINDA)" },
  { nik: "2015503028", nama: "DAVI NURJANI DARMAWAN", divisi: "PACKING 1 (CK SAMARINDA)" },
  { nik: "2015503030", nama: "ADELITA ROSE", divisi: "LOGISTIC (CK SAMARINDA)" },
  { nik: "2015503077", nama: "AMANDA RIFANI", divisi: "PACKING 1 (CK SAMARINDA)" },
  { nik: "2015503082", nama: "DAFFA IQBAL PRASETYO", divisi: "PRODUCTION 1 (CK SAMARINDA)" },
  { nik: "2015503089", nama: "IDI SISWANTO", divisi: "LOGISTIC (CK SAMARINDA)" },
  { nik: "2015508191", nama: "IRZA AGANI FAHREZI", divisi: "KITCHEN ADMINISTRATION (CK SAMARINDA)" },
  { nik: "2015508192", nama: "MUH MAULANA FIRGIE PRADIKTA", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015508215", nama: "FADIATHUL IFFAH ALMUSYAROFAH", divisi: "PACKING 1 (CK SAMARINDA)" },
  { nik: "2015512680", nama: "RAHIMA MAULIDIA", divisi: "KITCHEN ADMINISTRATION (CK SAMARINDA)" },
  { nik: "2015512681", nama: "AMMAR RIZQI", divisi: "PACKING 1 (CK SAMARINDA)" },
  { nik: "2015514762", nama: "AHMAD MAULUDINSYAH", divisi: "KITCHEN SUPPORT (CK SAMARINDA)" },
  { nik: "2015516973", nama: "RIKI ARMANDA", divisi: "PACKING 2 (CK SAMARINDA)" },
  { nik: "2015517117", nama: "EKA PUJI RAHAYU", divisi: "PRODUCTION 1 (CK SAMARINDA)" },
  { nik: "2015524204", nama: "AULIA DWI NUR ANGGRAINI", divisi: "QUALITY ASSURANCE & CONTROL (CK SAMARINDA)" },
  { nik: "2015567985", nama: "MUSDALIFAH", divisi: "PACKING 1 (CK SAMARINDA)" },
  { nik: "2015637591", nama: "KHAIRULLAH IHSAN", divisi: "KITCHEN ADMINISTRATION (CK SAMARINDA)" },
  { nik: "2015663151", nama: "MUHAMMAD IBRAM MAULANA", divisi: "QUALITY ASSURANCE & CONTROL (CK SAMARINDA)" },
  { nik: "123456789", nama: "WIDIANA", divisi: "BRANCH MANAGER (CK SAMARINDA)" },
  { nik: "123456", nama: "GW OWNERNYA", divisi: "CREATOR ENIH !!!!!" } // Akun Owner
];

export default function Login() {
  const [nik, setNik] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // --- LOGIKA LOGIN OTOMATIS ---
    // 1. Cari data karyawan berdasarkan NIK yang diketik
    const foundUser = employees.find(emp => emp.nik === nik);

    if (foundUser) {
        // 2. Cek Password (Default: Password == NIK)
        if (password === foundUser.nik) {
            // LOGIN SUKSES
            localStorage.setItem('user', JSON.stringify(foundUser));
            
            // Redirect ke Dashboard
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } else {
            // Password Salah
            setError('Password salah! (Default: Gunakan NIK)');
            setIsLoading(false);
        }
    } else {
        // NIK Tidak Ditemukan
        setError('NIK tidak terdaftar dalam database!');
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50/50 p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-orange-100 animate-slide-up">
        <div className="flex flex-col items-center text-center mb-8">
          
          {/* LOGO PERUSAHAAN */}
          <div className="mb-4 relative w-32 h-16">
             <img 
                src="/logo-yummy.png" 
                alt="Yummy Choice Logo" 
                className="object-contain w-full h-full"
             />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            YC SAMARINDA
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Login Karyawan
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 pl-1">Nomor Induk Karyawan (NIK)</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="Masukkan NIK"
                  className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                  required
                />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 pl-1">Password</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium font-mono"
                  required
                />
            </div>
            <p className="text-xs text-gray-400 mt-1 pl-1 italic"></p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs p-3 rounded-xl text-center font-bold border border-red-100 animate-pulse-fast">
                {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition-all shadow-lg disabled:opacity-70 flex justify-center items-center gap-2"
          >
            {isLoading ? (
                <>
                    <FaSpinner className="animate-spin" /> Memeriksa Data...
                </>
            ) : (
                "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}