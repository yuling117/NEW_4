import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RequestStatus } from '../types';
import { ClipboardList, CheckCircle, XCircle, Clock, ArrowUpRight, ArrowDownLeft, Star, MessageSquare } from 'lucide-react';

export const RequestsView: React.FC = () => {
  const { currentUser, requests, products, users, updateRequestStatus, addReview } = useApp();
  const [activeTabSub, setActiveTabSub] = useState<'incoming' | 'outgoing'>('incoming');

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTradeId, setReviewTradeId] = useState('');
  const [revieweeId, setRevieweeId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!currentUser) return null;

  const incomingRequests = requests.filter((r) => r.sellerId === currentUser.id);
  const outgoingRequests = requests.filter((r) => r.buyerId === currentUser.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(reviewTradeId, rating, comment, revieweeId);
    setReviewModalOpen(false);
    setComment('');
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">交易申請與進度追蹤</h1>
          <p className="text-xs text-slate-500 mt-1">管理您收到的購買/交換申請，以及您向其他同學提出的申請進度</p>
        </div>

        {/* Sub tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTabSub('incoming')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTabSub === 'incoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            收到的申請 ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTabSub('outgoing')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTabSub === 'outgoing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            送出的申請 ({outgoingRequests.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {(activeTabSub === 'incoming' ? incomingRequests : outgoingRequests).map((req) => {
          const product = products.find((p) => p.id === req.productId);
          const otherUserId = activeTabSub === 'incoming' ? req.buyerId : req.sellerId;
          const otherUser = users.find((u) => u.id === otherUserId) || {
            name: '校園同學',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            school: '台灣大學',
          };

          return (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      {activeTabSub === 'incoming' ? <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />}
                      <span>{otherUser.name} ({otherUser.school})</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{new Date(req.createdAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    req.status === 'requested' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    req.status === 'reserved' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    req.status === 'done' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {req.status === 'requested' ? '等待賣家審核' :
                     req.status === 'reserved' ? '預約中 (安排面交)' :
                     req.status === 'done' ? '交易完成' : '已婉拒/取消'}
                  </span>
                </div>
              </div>

              {/* Product Info Preview */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                {product && (
                  <img src={product.images[0]} alt={product.title} className="w-14 h-14 rounded-lg object-cover" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{product?.title || '商品已下架'}</div>
                  <div className="text-xs font-black text-emerald-600">
                    {product?.price === 0 ? '免費贈送' : `NT$ ${product?.price?.toLocaleString()}`}
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="p-3 bg-emerald-50/50 rounded-xl text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-emerald-900">面交提案與留言：</div>
                <p>{req.message}</p>
              </div>

              {/* Actions for Seller */}
              {activeTabSub === 'incoming' && req.status === 'requested' && (
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => updateRequestStatus(req.id, 'rejected')}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    婉拒申請
                  </button>
                  <button
                    onClick={() => updateRequestStatus(req.id, 'reserved')}
                    className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                    接受申請 (進入預約中)
                  </button>
                </div>
              )}

              {/* Actions for marking done */}
              {req.status === 'reserved' && (
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-500">💡 請雙方依照約定時間地點進行安全面交。</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateRequestStatus(req.id, 'done')}
                      className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>確認面交完成</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Review trigger if done */}
              {req.status === 'done' && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setReviewTradeId(req.id);
                      setRevieweeId(otherUserId);
                      setReviewModalOpen(true);
                    }}
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    <span>給予對方評價</span>
                  </button>
                </div>
              )}

            </div>
          );
        })}

        {(activeTabSub === 'incoming' ? incomingRequests : outgoingRequests).length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <ClipboardList className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">目前沒有相關的交易申請</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              當您對商品提出購買申請，或是其他同學向您申請購買商品時，都會顯示在這裡。
            </p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">給予交易評價</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">評分星等</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-xl transition-colors ${
                        rating >= star ? 'text-amber-500 bg-amber-50' : 'text-slate-300 bg-slate-50'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">評價留言</label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="例如：面交非常準時，商品狀況極佳，大推！"
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  送出評價
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
