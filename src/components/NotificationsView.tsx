import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, MessageSquare, ClipboardList, ShieldAlert } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsRead } = useApp();

  if (!currentUser) return null;

  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const unreadCount = myNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">站內通知中心</h1>
          <p className="text-xs text-slate-500 mt-1">查看商品提問回覆、交易申請與系統通知</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            全部標記為已讀
          </button>
        )}
      </div>

      <div className="space-y-3">
        {myNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markNotificationAsRead(notif.id)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              notif.isRead ? 'bg-white border-slate-200 opacity-80' : 'bg-emerald-50/60 border-emerald-200 shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              notif.type === 'request' ? 'bg-blue-100 text-blue-600' :
              notif.type === 'message' ? 'bg-teal-100 text-teal-600' :
              'bg-amber-100 text-amber-600'
            }`}>
              {notif.type === 'request' ? <ClipboardList className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  {notif.title}
                  {!notif.isRead && <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />}
                </h3>
                <span className="text-[11px] text-slate-400">{new Date(notif.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{notif.content}</p>
            </div>
          </div>
        ))}

        {myNotifications.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">目前沒有任何通知</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              當有同學對您的商品提問或提出交易申請時，系統會立即發送通知給您。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
