'use client';

import React from 'react';
import { useAuth } from '@/features/auth/context/auth-context';
import { useRouter } from 'next/navigation';
import { 
  Store, 
  Plus, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  Star, 
  LogOut, 
  User, 
  Settings, 
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function SellerDashboard() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/auth/login');
    }
  };

  // Mock statistics
  const stats = [
    { name: 'Total Revenue', value: '145,000 FCFA', change: '+12.5%', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Active Products', value: '8 Items', change: '0', icon: Package, color: 'text-blue-600 bg-blue-50' },
    { name: 'Total Orders', value: '14 Orders', change: '+3 new', icon: ShoppingBag, color: 'text-amber-600 bg-amber-50' },
    { name: 'Store Rating', value: '4.8 / 5.0', change: '5 reviews', icon: Star, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col font-sans">
      {/* Dashboard Nav */}
      <header className="bg-white border-b border-neutral-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold text-lg">
              T
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-text">
              Tradam <span className="text-primary font-medium text-xs px-2 py-0.5 rounded-full bg-primary/10 ml-2">Vendor Portal</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-bg border border-neutral-border">
              <User className="w-4 h-4 text-neutral-muted" />
              <span className="text-xs font-semibold text-neutral-text">{profile?.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-text tracking-tight flex items-center gap-2">
              <Store className="w-7 h-7 text-primary" />
              Store Dashboard
            </h1>
            <p className="mt-1 text-sm text-neutral-muted">
              Manage your inventory, process customer orders, and track your business growth.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white border border-neutral-border rounded-xl p-6 shadow-xs flex items-center gap-5">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-muted uppercase tracking-wider">{stat.name}</p>
                  <p className="text-xl font-bold text-neutral-text mt-1">{stat.value}</p>
                  <p className="text-xs text-neutral-muted mt-0.5">{stat.change}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Panel / Quick Links */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Workspace Drafts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-neutral-border rounded-xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-neutral-border flex items-center justify-between">
                <h3 className="font-bold text-neutral-text text-sm sm:text-base">Recent Activity</h3>
                <span className="text-xs text-primary font-semibold hover:underline cursor-pointer">View All</span>
              </div>
              <div className="divide-y divide-neutral-border">
                <div className="p-5 flex items-center justify-between hover:bg-neutral-bg/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-bg flex items-center justify-center text-xl">📦</div>
                    <div>
                      <p className="text-sm font-bold text-neutral-text">New Order #1002 placed</p>
                      <p className="text-xs text-neutral-muted mt-0.5">By Buyer (2 items - Penja Pepper, Ndop Fabric)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">Pending</span>
                    <ChevronRight className="w-4 h-4 text-neutral-muted" />
                  </div>
                </div>

                <div className="p-5 flex items-center justify-between hover:bg-neutral-bg/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-bg flex items-center justify-center text-xl">✅</div>
                    <div>
                      <p className="text-sm font-bold text-neutral-text">Welcome to Tradam Vendor Portal</p>
                      <p className="text-xs text-neutral-muted mt-0.5">Your store registry profile was verified successfully.</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-muted" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Config Card */}
          <div className="space-y-6">
            <div className="bg-white border border-neutral-border rounded-xl p-6 shadow-xs">
              <h3 className="font-bold text-neutral-text mb-4 text-sm sm:text-base">Store Settings</h3>
              
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-neutral-border hover:bg-neutral-bg/50 hover:border-primary/20 transition-all group">
                  <Settings className="w-5 h-5 text-neutral-muted group-hover:text-primary transition-colors" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-neutral-text">Store Profile</p>
                    <p className="text-[10px] text-neutral-muted">Configure store description & details</p>
                  </div>
                </a>

                <a href="#" className="flex items-center gap-3 p-3 rounded-lg border border-neutral-border hover:bg-neutral-bg/50 hover:border-primary/20 transition-all group">
                  <Package className="w-5 h-5 text-neutral-muted group-hover:text-primary transition-colors" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-neutral-text">Shipping & Fees</p>
                    <p className="text-[10px] text-neutral-muted">Set local delivery fees for regions</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
