'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaSpinner, FaHeart } from 'react-icons/fa';

const employees = [
  { nik: "admin", nama: "SEPTIAN BAYU (ADMIN)", divisi: "IT DEVELOPMENT" },
  { nik: "user", nama: "DEMO USER", divisi: "GENERAL STAFF" },
  { nik: "guest", nama: "GUEST VISITOR", divisi: "PUBLIC RELATION" },
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

    const foundUser = employees.find(emp => emp.nik === nik);

    if (foundUser) {
        if (password === foundUser.nik) {
            localStorage.setItem('user', JSON.stringify(foundUser));
            setTimeout(() => {
                router.push('/dashboard');
            }, 800);
        } else {
            setError('Invalid Password. (Hint: Use NIK as password)');
            setIsLoading(false);
        }
    } else {
        setError('User ID not found. (Try: admin)');
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 animate-slide-up z-10 relative">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="mb-4 relative w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center">
             <span className="text-3xl">🍱</span>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
            INTERNAL ORDER
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            System Demo
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2 pl-1">Employee ID</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="ID (Try: admin)"
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
                  placeholder="Password (Try: admin)"
                  className="w-full bg-gray-50 text-gray-800 border border-gray-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium font-mono"
                  required
                />
            </div>
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
                    <FaSpinner className="animate-spin" /> Authenticating...
                </>
            ) : (
                "Sign In"
            )}
          </button>
        </form>
      </div>
      
      <div className="mt-8 text-center animate-fade-in">
          <p className="text-[10px] text-gray-400 font-medium flex items-center justify-center gap-1">
              Developed by
          </p>
          <p className="text-xs font-bold text-orange-600 mt-0.5">
              Septian Bayu Pradana
          </p>
      </div>
    </div>
  );
}