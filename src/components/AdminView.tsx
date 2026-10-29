import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, CheckCircle, Trash2, Flag, AlertTriangle } from 'lucide-react';

export const AdminView: React.FC = () => {
  const { currentUser, reports, resolveReport, deleteProduct } = useApp();
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200 my-12">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">權限不足</h2>
        <p className="text-xs text-slate-500">此頁面僅限平台管理員（admin@campus.tw）存取。</p>
      </div>
    );
  }

  const handleResolve = (repId: string, targetId: string, action: string) => {
    resolveReport(repId, action);
    if (action.includes('刪除')) {
      deleteProduct(targetId);
    }
    setResolvingId(null);
    setResolutionNote('');
  };

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-xl font-bold text-slate-900">管理員後台：檢舉與爭議案件審核</h1>
        <p className="text-xs text-slate-500 mt-1">處理同學回報的違規商品與異常交易檢舉，維護校園市集安全</p>
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-700 rounded-lg flex items-center gap-1">
                  <Flag className="w-3.5 h-3.5" />
                  {rep.targetType === 'product' ? '商品檢舉' : '會員檢舉'}
                </span>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  rep.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {rep.status === 'pending' ? '待處理' : '已處理'}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">{new Date(rep.createdAt).toLocaleString()}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <div className="text-xs font-bold text-slate-800">檢舉目標：{rep.targetTitle}</div>
              <div className="text-xs text-slate-600"><span className="font-semibold text-slate-700">檢舉原因：</span>{rep.reason}</div>
              {rep.note && <div className="text-xs text-slate-500"><span className="font-semibold text-slate-700">詳細說明：</span>{rep.note}</div>}
              {rep.result && <div className="text-xs font-bold text-emerald-700 pt-1">處理結果：{rep.result}</div>}
            </div>

            {rep.status === 'pending' && (
              <div className="pt-2 flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => handleResolve(rep.id, rep.targetId, '已審核：維持上架（無違規）')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  駁回檢舉 (無違規)
                </button>
                <button
                  onClick={() => handleResolve(rep.id, rep.targetId, '已處理：判定違規並刪除商品')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
                  確認違規並下架商品
                </button>
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">目前沒有任何待處理檢舉</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              平台秩序良好，無人回報違規案件。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
