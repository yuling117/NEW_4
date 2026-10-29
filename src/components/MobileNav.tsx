import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Bookmark, ClipboardList, Bell, User, Plus } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, setAuthModalOpen, setCreateProductModalOpen, notifications } = useApp();
  const unreadCount = notifications.filter((n) => n.userId === currentUser?.id && !n.isRead).length;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'home' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>市集首頁</span>
      </button>

      <button
        onClick={() => {
          if (!currentUser) setAuthModalOpen(true);
          else setActiveTab('bookmarks');
        }}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'bookmarks' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Bookmark className="w-5 h-5" />
        <span>收藏</span>
      </button>

      <button
        onClick={() => {
          if (!currentUser) setAuthModalOpen(true);
          else setCreateProductModalOpen(true);
        }}
        className="flex flex-col items-center justify-center -mt-5 bg-emerald-600 text-white w-12 h-12 rounded-full shadow-lg hover:bg-emerald-700 transition-transform active:scale-95"
        title="刊登商品"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => {
          if (!currentUser) setAuthModalOpen(true);
          else setActiveTab('requests');
        }}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'requests' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <ClipboardList className="w-5 h-5" />
        <span>交易</span>
      </button>

      <button
        onClick={() => {
          if (!currentUser) setAuthModalOpen(true);
          else setActiveTab('notifications');
        }}
        className={`relative flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'notifications' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
        <span>通知</span>
      </button>

      <button
        onClick={() => {
          if (!currentUser) setAuthModalOpen(true);
          else setActiveTab('profile');
        }}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          activeTab === 'profile' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span>我的</span>
      </button>
    </div>
  );
};
