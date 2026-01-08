"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { Globe, ArrowLeft, Lock, User, ArrowRight, Shield, Bell, AlertCircle, Info, TrendingUp, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username || !firstName || !lastName || !password || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        username, 
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(signInResult.error);
        setIsLoading(false);
      } else if (signInResult?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-[50%] left-[50%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
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

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center px-6 py-12 min-h-[calc(100vh-100px)]">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Info */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              Join Our Team
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
              Start Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Journey Today
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              Create your account and join our warehouse management platform.
            </p>

            {/* Company Announcements */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Bell size={18} className="text-indigo-400" />
                <h3 className="font-bold text-white">Company Updates</h3>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-white/5">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 hover:border-indigo-500/40 transition-all group cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Info size={14} className="text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-white text-xs">System Maintenance</h4>
                        <span className="text-[10px] text-slate-500">2 days ago</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Maintenance on Jan 15 from 2:00-4:00 AM.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 hover:border-green-500/40 transition-all group cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <TrendingUp size={14} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-white text-xs">New Features</h4>
                        <span className="text-[10px] text-slate-500">1 week ago</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Mobile app now supports offline mode.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-all group cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <AlertCircle size={14} className="text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-white text-xs">Holiday Hours</h4>
                        <span className="text-[10px] text-slate-500">2 weeks ago</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Reduced hours during holiday season.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-purple-500/5 border border-purple-500/20 hover:border-purple-500/40 transition-all group cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Bell size={14} className="text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-white text-xs">Safety Protocol</h4>
                        <span className="text-[10px] text-slate-500">3 weeks ago</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Updated forklift operation guidelines.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition-all group cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Info size={14} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-white text-xs">Inventory Audit</h4>
                        <span className="text-[10px] text-slate-500">1 month ago</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Annual audit scheduled for March 2026.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-pink-500/5 border border-pink-500/20 hover:border-pink-500/40 transition-all group cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-pink-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <TrendingUp size={14} className="text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-white text-xs">Performance Bonuses</h4>
                        <span className="text-[10px] text-slate-500">1 month ago</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Q4 bonuses distributed next month.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all group cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Info size={14} className="text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-white text-xs">Training Workshop</h4>
                        <span className="text-[10px] text-slate-500">2 months ago</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        WMS features workshop registration open.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 hover:border-orange-500/40 transition-all group cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <AlertCircle size={14} className="text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-semibold text-white text-xs">Parking Update</h4>
                        <span className="text-[10px] text-slate-500">2 months ago</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        New parking assignments in effect.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                  <Shield size={16} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Secure Platform</h3>
                  <p className="text-xs text-slate-400">Encrypted and protected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <Globe size={16} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">24/7 Access</h3>
                  <p className="text-xs text-slate-400">Available on all devices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
            <div className="relative p-8 md:p-10 rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <UserPlus className="text-white" size={28} />
                </div>
                <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                <p className="text-slate-400">Join our warehouse management platform</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe123"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-slate-400 text-sm">
                  Already have an account?{" "}
                  <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}