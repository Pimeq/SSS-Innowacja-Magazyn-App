"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Globe, 
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Users,
  Zap,
  MessageSquare
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    alert("Thank you for your interest! Our sales team will contact you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-[50%] left-[30%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            Get in Touch
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
            Let's Transform <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Your Business Together
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Our sales team is ready to help you find the perfect solution for your needs. Schedule a demo, discuss pricing, or just ask us anything.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          
          {/* Contact Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
            <div className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl">
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500"
                    placeholder="Your Company Ltd."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500 resize-none"
                    placeholder="Tell us about your project and how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            
            {/* Contact Cards */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                <Mail size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-slate-400 mb-3">Our team is available to answer your questions</p>
              <a href="mailto:sales@projectinnowacja.com" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
                sales@projectinnowacja.com
              </a>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30">
                <Phone size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-slate-400 mb-3">Monday to Friday, 9am to 6pm CET</p>
              <a href="tel:+48123456789" className="text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                +48 123 456 789
              </a>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 hover:border-pink-500/40 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
                <MapPin size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-slate-400 mb-3">Our headquarters in Warsaw</p>
              <p className="text-pink-400 font-semibold">
                ul. Przykładowa 123<br />
                00-000 Warszawa, Poland
              </p>
            </div>

          </div>
        </div>

        {/* Benefits Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
          <div className="relative p-12 md:p-16 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Our Platform?</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Clock size={28} className="text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Quick Response</h3>
                <p className="text-slate-400">
                  We respond to all inquiries within 24 hours. Your time is valuable to us.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Users size={28} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Expert Team</h3>
                <p className="text-slate-400">
                  Our experienced sales engineers will guide you through every step of the process.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                  <Zap size={28} className="text-pink-400 fill-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">Custom Solutions</h3>
                <p className="text-slate-400">
                  We tailor our platform to match your specific business requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold mb-6">Have Questions?</h3>
          <p className="text-slate-400 mb-8">Check out our documentation or explore our features</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/explore"
              className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MessageSquare size={18} />
              Explore Features
            </Link>
            <Link 
              href="/login"
              className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} />
              Try For Free
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
