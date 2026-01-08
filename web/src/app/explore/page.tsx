"use client";

import Link from "next/link";
import { 
  ArrowLeft, 
  Zap, 
  Globe, 
  ShieldCheck, 
  TrendingUp,
  Users,
  BarChart3,
  Lock,
  Smartphone,
  Clock,
  Award,
  CheckCircle2
} from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      <nav className="relative z-50 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Globe className="text-white" size={20} />
          </div>
          <span className="font-bold text-2xl tracking-tighter">Projekt <span className="text-indigo-400">Innowacja</span></span>
        </Link>
        
        <Link 
          href="/"
          className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-full transition-all border border-white/10 hover:border-white/20"
        >
          <ArrowLeft size={16} className="text-slate-400 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium text-slate-300 group-hover:text-white">Back to Home</span>
        </Link>
      </nav>

      <main className="relative z-10 pt-12 pb-32 px-6 max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8">
            <Zap size={14} className="fill-indigo-400 text-indigo-400" />
            Explore Our Platform
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Discover the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Future of Logistics
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Dive into our comprehensive suite of features designed to transform your warehouse operations, streamline your workflows, and maximize efficiency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          
          <div className="group p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-500/30">
              <BarChart3 size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Real-Time Analytics</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Monitor your operations with live dashboards, track KPIs, and make data-driven decisions with powerful analytics tools.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-indigo-400" />
                Live inventory tracking
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-indigo-400" />
                Custom reports & exports
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-indigo-400" />
                Performance metrics
              </li>
            </ul>
          </div>

          <div className="group p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 cursor-pointer hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
              <Smartphone size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Mobile App</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Manage your warehouse on the go with our powerful mobile application. Scan QR codes and update inventory instantly.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-purple-400" />
                QR code scanning
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-purple-400" />
                Offline mode support
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-purple-400" />
                Push notifications
              </li>
            </ul>
          </div>

          <div className="group p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300 cursor-pointer hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
              <Lock size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Enterprise Security</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Bank-level encryption, role-based access control, and compliance with industry standards to keep your data safe.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-pink-400" />
                End-to-end encryption
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-pink-400" />
                Role-based permissions
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-pink-400" />
                Audit logs & compliance
              </li>
            </ul>
          </div>

          <div className="group p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 cursor-pointer hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
              <Globe size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Multi-Location</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Manage multiple warehouses and locations from a single platform. Perfect for growing businesses.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-blue-400" />
                Unlimited locations
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-blue-400" />
                Stock transfers
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-blue-400" />
                Centralized control
              </li>
            </ul>
          </div>

          <div className="group p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
              <Users size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Team Collaboration</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Empower your team with collaborative tools, task assignments, and real-time communication features.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400" />
                User management
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Activity history
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400" />
                Task assignments
              </li>
            </ul>
          </div>

          <div className="group p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 hover:border-orange-500/40 transition-all duration-300 cursor-pointer hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
              <Clock size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Automated Workflows</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Save time with automated processes, smart notifications, and intelligent stock management algorithms.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-orange-400" />
                Auto restocking alerts
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-orange-400" />
                Smart notifications
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-orange-400" />
                Workflow automation
              </li>
            </ul>
          </div>

        </div>

        {/* Stats Section */}
        <div className="relative mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl" />
          <div className="relative p-12 md:p-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Industry Leaders</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">99.9%</div>
                <div className="text-slate-400 text-sm">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">24/7</div>
                <div className="text-slate-400 text-sm">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400 mb-2">1M+</div>
                <div className="text-slate-400 text-sm">Transactions/Day</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">150+</div>
                <div className="text-slate-400 text-sm">Countries Served</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using our platform to revolutionize their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-bold hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Contact Sales
              <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
            </Link>
            <Link 
              href="/login"
              className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-bold hover:bg-white/20 transition-all duration-300"
            >
              Try For Free
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
