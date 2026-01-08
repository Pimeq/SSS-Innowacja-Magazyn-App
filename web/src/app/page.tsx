"use client";

import Link from "next/link";
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
          <span className="text-sm font-medium text-slate-300 group-hover:text-white">Employee Login</span>
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
              <Link 
                href="/explore"
                className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-xl shadow-white/5 flex items-center justify-center gap-2 group"
              >
                Explore More
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contact"
                className="px-8 py-4 bg-transparent border border-white/10 text-white rounded-full font-bold hover:bg-white/5 transition-colors flex items-center justify-center"
              >
                Contact Sales
              </Link>
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

        {/* Explore More Section */}
        <div className="mt-32 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
          <div className="relative p-12 md:p-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
                  <Zap size={14} className="fill-indigo-400 text-indigo-400" />
                  Discover More
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Innovation</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Dive deeper into our cutting-edge solutions and discover how we're revolutionizing the industry. From advanced analytics to seamless integrations, explore the features that set us apart.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                      <ArrowRight size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Advanced Features</h4>
                      <p className="text-sm text-slate-400">Real-time tracking and analytics dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <ArrowRight size={16} className="text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Seamless Integration</h4>
                      <p className="text-sm text-slate-400">Connect with your existing systems effortlessly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                      <ArrowRight size={16} className="text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Enterprise Security</h4>
                      <p className="text-sm text-slate-400">Bank-level encryption and compliance</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-20 blur-2xl" />
                <div className="relative h-full rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl p-8 flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                      <div className="text-3xl font-bold text-indigo-400 mb-2">99.9%</div>
                      <div className="text-sm text-slate-400">Uptime SLA</div>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                      <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                      <div className="text-sm text-slate-400">Support</div>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 hover:border-pink-500/40 transition-colors">
                      <div className="text-3xl font-bold text-pink-400 mb-2">1M+</div>
                      <div className="text-sm text-slate-400">Transactions</div>
                    </div>
                    <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                      <div className="text-3xl font-bold text-blue-400 mb-2">150+</div>
                      <div className="text-sm text-slate-400">Countries</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Sales Section */}
        <div className="mt-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-purple-600/20 rounded-3xl blur-3xl animate-pulse" />
          <div className="relative p-12 md:p-20 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                Get in Touch
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Ready to Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Business?</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
                Our sales team is ready to help you find the perfect solution for your needs. Get a personalized demo, discuss pricing, and learn how we can help you achieve your goals.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                    <Globe size={20} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Global Support</h4>
                  <p className="text-sm text-slate-400">Available in 150+ countries</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Zap size={20} className="text-white fill-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Fast Response</h4>
                  <p className="text-sm text-slate-400">24-hour response time</p>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <h4 className="font-semibold text-white mb-2">Trusted Partner</h4>
                  <p className="text-sm text-slate-400">Enterprise-grade security</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact"
                  className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Schedule a Demo
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/contact"
                  className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                >
                  Contact Sales Team
                </Link>
              </div>

              <p className="mt-8 text-sm text-slate-500">
                Or email us at <span className="text-indigo-400 font-semibold">sales@projectinnowacja.com</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}