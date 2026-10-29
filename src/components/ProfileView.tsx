import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, MapPin, School, Mail, Star, User as UserIcon, Save } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, verifyCampusEmail, updateProfile, reviews, users } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [school, setSchool] = useState(currentUser?.school || '台灣大學');
  const [county, setCounty] = useState(currentUser?.county || '台北市');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  if (!currentUser) return null;

  const myReviews = reviews.filter((r) => r.revieweeId === currentUser.id);
  const avgRating = myReviews.length > 0 ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1) : '5.0';

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(name, school, county, avatar);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900">個人帳號與校園身分驗證</h1>
        <p className="text-xs text-slate-500 mt-1">管理您的個人資料與校園信箱認證標章</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/20 shadow-md" />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{currentUser.name}</h2>
              {currentUser.isVerified ? (
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  已通過校園信箱驗證
                </span>
              ) : (
                <button
                  onClick={verifyCampusEmail}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                >
                  點擊進行校園身分驗證
                </button>
              )}
            </div>

            <div className="text-xs text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {currentUser.email}</span>
              <span className="flex items-center gap-1"><School className="w-3.5 h-3.5 text-slate-400" /> {currentUser.school}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {currentUser.county}</span>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1 pt-1 text-xs font-bold text-amber-500">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>{avgRating} 顆星 ({myReviews.length} 則交易評價)</span>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleUpdate} className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">編輯個人資料</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">真實姓名 / 暱稱</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">頭像圖片網址</label>
              <input
                type="url"
                required
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">所屬學校</label>
              <select
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="台灣大學">台灣大學</option>
                <option value="清華大學">清華大學</option>
                <option value="陽明交通大學">陽明交通大學</option>
                <option value="成功大學">成功大學</option>
                <option value="政治大學">政治大學</option>
                <option value="臺灣科技大學">臺灣科技大學</option>
                <option value="台北科技大學">台北科技大學</option>
                <option value="中央大學">中央大學</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">所在縣市</label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="台北市">台北市</option>
                <option value="新北市">新北市</option>
                <option value="基隆市">基隆市</option>
                <option value="桃園市">桃園市</option>
                <option value="新竹市">新竹市</option>
                <option value="台中市">台中市</option>
                <option value="台南市">台南市</option>
                <option value="高雄市">高雄市</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>儲存變更</span>
            </button>
          </div>
        </form>

        {/* Reviews Section */}
        <div className="pt-6 border-t border-slate-100 space-y-4">
          <h3 className="text-sm font-bold text-slate-800">收到的交易評價 ({myReviews.length})</h3>
          <div className="space-y-3">
            {myReviews.map((rev) => {
              const reviewer = users.find((u) => u.id === rev.reviewerId) || { name: '校園同學', avatar: '' };
              return (
                <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{reviewer.name}</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-700">{rev.comment}</p>
                </div>
              );
            })}

            {myReviews.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">目前尚無交易評價紀錄。</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
