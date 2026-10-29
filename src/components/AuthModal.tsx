import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, User, School, MapPin, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, login, register, resetPasswordRequest } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgot, setIsForgot] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [school, setSchool] = useState('台灣大學');
  const [county, setCounty] = useState('台北市');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isForgot) {
      resetPasswordRequest(email);
      setIsForgot(false);
      return;
    }
    if (isRegister) {
      register(name, email, password, school, county);
    } else {
      login(email, password);
    }
  };

  const fillTestAccount = (isAdmin: boolean) => {
    if (isAdmin) {
      setEmail('admin@campus.tw');
      setPassword('admin123');
    } else {
      setEmail('test@ntu.edu.tw');
      setPassword('123456');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative border border-slate-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mx-auto flex items-center justify-center mb-3 text-white shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">
            {isForgot ? '重設密碼' : isRegister ? '註冊 CampusTrade 會員' : '登入 CampusTrade'}
          </h2>
          <p className="text-xs text-emerald-100 mt-1">全國大學生專屬的二手物品交換與買賣平台</p>
        </div>

        {/* Quick test accounts helper */}
        {!isForgot && (
          <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
            <span className="font-medium">💡 快速測試帳號：</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillTestAccount(false)}
                className="bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                一般會員
              </button>
              <button
                type="button"
                onClick={() => fillTestAccount(true)}
                className="bg-white px-2.5 py-1 rounded-md border border-emerald-200 font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                管理員
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isForgot ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">註冊電子郵件</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@ntu.edu.tw"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          ) : (
            <>
              {isRegister && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">真實姓名 / 暱稱</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="例如：林小豪"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">學校電子郵件 (.edu.tw)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@ntu.edu.tw"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">密碼</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {isRegister && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">所屬學校</label>
                    <div className="relative">
                      <School className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <select
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        <option value="台灣大學">台灣大學</option>
                        <option value="清華大學">清華大學</option>
                        <option value="陽明交通大學">陽明交通大學</option>
                        <option value="成功大學">成功大學</option>
                        <option value="政治大學">政治大學</option>
                        <option value="臺灣科技大學">臺灣科技大學</option>
                        <option value="台北科技大學">台北科技大學</option>
                        <option value="中央大學">中央大學</option>
                        <option value="中興大學">中興大學</option>
                        <option value="中山大學">中山大學</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">所在縣市</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <select
                        value={county}
                        onChange={(e) => setCounty(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            {isForgot ? '發送重設密碼信' : isRegister ? '立即註冊' : '登入'}
          </button>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            {isForgot ? (
              <button
                type="button"
                onClick={() => setIsForgot(false)}
                className="text-emerald-600 font-semibold hover:underline"
              >
                返回登入
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsForgot(true)}
                  className="hover:text-emerald-600 transition-colors"
                >
                  忘記密碼？
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  {isRegister ? '已有帳號？直接登入' : '沒有帳號？免費註冊'}
                </button>
              </>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};
