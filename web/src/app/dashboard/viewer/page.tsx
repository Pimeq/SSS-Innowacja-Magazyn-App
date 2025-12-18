"use client";

import { signOut } from "next-auth/react";
import { 
  Globe, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Leaf, 
  LogOut 
} from "lucide-react";

export default function ViewerPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <nav className="relative z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Globe className="text-white" size={20} />
          </div>
          <span className="font-bold text-2xl tracking-tighter">Projekt <span className="text-indigo-400">Innowacja</span></span>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full transition-all border border-white/10 hover:border-white/20"
        >
          <span className="text-sm font-medium text-slate-300 group-hover:text-white">Sign Out</span>
          <LogOut size={16} className="text-slate-400 group-hover:text-white transition-colors" />
        </button>
      </nav>

      <main className="relative z-10 pt-20 pb-32 px-6 max-w-7xl mx-auto text-center md:text-left">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              The Future is Now
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              Redefining <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                Logistics Excellence
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-xl shadow-white/5 flex items-center justify-center gap-2 group">
                Explore More
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-transparent border border-white/10 text-white rounded-full font-bold hover:bg-white/5 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>

          <div className="relative h-[400px] md:h-[500px] w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl opacity-20 blur-2xl transform rotate-6 scale-95 animate-pulse"></div>
            <div className="absolute inset-0 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 backdrop-blur-xl bg-opacity-60">
                <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
                   <Zap size={40} className="text-white fill-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Premium Innovation</h3>
                <p className="text-center text-slate-400 text-sm">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.
                </p>
                
                <div className="w-full max-w-[200px] mt-8 space-y-3 opacity-50">
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[70%] bg-indigo-500 rounded-full"></div>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-purple-500 rounded-full"></div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div className="mt-32 grid md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group cursor-pointer">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-100">Global Reach</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group cursor-pointer">
            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400 group-hover:scale-110 transition-transform">
              <Leaf size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-100">Eco Friendly</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300 group cursor-pointer">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-100">Secure Storage</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>

        </div>

        <div className="mt-24 pt-12 border-t border-white/5">
          <p className="text-center text-slate-500 text-sm font-medium uppercase tracking-widest mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <h3 className="text-2xl font-bold">Company1</h3>
            <h3 className="text-2xl font-bold">Company2</h3>
            <h3 className="text-2xl font-bold">Company3</h3>
            <h3 className="text-2xl font-bold">Company4</h3>
            <h3 className="text-2xl font-bold">Company5</h3>
          </div>
        </div>
      </main>
    </div>
  );
}