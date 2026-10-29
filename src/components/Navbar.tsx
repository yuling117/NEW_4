import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Bell, Bookmark, User as UserIcon, Plus, ShieldCheck, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, activeTab, setActiveTab, setAuthModalOpen, 
    setCreateProductModalOpen, notifications, logout 
  } = useApp();

  const unreadCount = notifications.filter((n) => n.userId === currentUser?.id && !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand title */}
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 text-left shrink-0 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">CampusTrade</span>
            <span className="text-[10px] font-medium text-emerald-600 tracking-wider uppercase block">大學生二手交換平台</span>
          </div>
        </button>

        {/* Zone 2: 4-5 concise single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 ${activeTab === 'home' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            首頁市集
          </button>
          <button 
            onClick={() => {
              if (!currentUser) setAuthModalOpen(true);
              else setActiveTab('bookmarks');
            }} 
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 ${activeTab === 'bookmarks' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            我的收藏
          </button>
          <button 
            onClick={() => {
              if (!currentUser) setAuthModalOpen(true);
              else setActiveTab('requests');
            }} 
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 ${activeTab === 'requests' ? 'text-emerald-600 font-semibold' : ''}`}
          >
            交易進度
          </button>
          {currentUser?.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 ${activeTab === 'admin' ? 'text-emerald-600 font-semibold' : ''}`}
            >
              管理後台
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions & User Menu */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <>
              <button
                onClick={() => setCreateProductModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                免費刊登
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="通知中心"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center gap-2 group text-left focus:outline-none"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-500 transition-all"
                  />
                  <div className="hidden lg:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                      {currentUser.name}
                      {currentUser.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />}
                    </div>
                    <div className="text-[10px] text-slate-500">{currentUser.school}</div>
                  </div>
                </button>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                  title="登出"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0"
              >
                登入 / 註冊
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                免費刊登
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
