/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { HomeView } from './components/HomeView';
import { BookmarksView } from './components/BookmarksView';
import { MyProductsView } from './components/MyProductsView';
import { RequestsView } from './components/RequestsView';
import { NotificationsView } from './components/NotificationsView';
import { AdminView } from './components/AdminView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { CreateProductModal } from './components/CreateProductModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ShoppingBag, ShieldCheck } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, currentUser, setActiveTab, setAuthModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {/* Quick Tab Switcher for Member sections on desktop */}
        {currentUser && ['bookmarks', 'my-products', 'requests', 'notifications', 'profile'].includes(activeTab) && (
          <div className="hidden md:flex gap-2 mb-6 pb-3 border-b border-slate-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('my-products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'my-products' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              我的個人賣場
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bookmarks' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              我的收藏
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'requests' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              交易進度與申請
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'notifications' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              站內通知中心
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              個人資料與認證
            </button>
          </div>
        )}

        {activeTab === 'home' && <HomeView />}
        {activeTab === 'bookmarks' && <BookmarksView />}
        {activeTab === 'my-products' && <MyProductsView />}
        {activeTab === 'requests' && <RequestsView />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'admin' && <AdminView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 space-y-2 hidden md:block">
        <div className="flex items-center justify-center gap-2 font-bold text-slate-800">
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>CampusTrade 全國大學生二手物品交換與買賣平台</span>
        </div>
        <p>以同校面交優先、校園信箱驗證為原則，讓閒置資源在校園中循環永續。</p>
        <p className="text-[11px] text-slate-400">© 2026 CampusTrade Academic Demonstration. All rights reserved.</p>
      </footer>

      <MobileNav />
      <AuthModal />
      <CreateProductModal />
      <ProductDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
