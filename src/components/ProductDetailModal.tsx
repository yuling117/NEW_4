import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, ShieldCheck, MapPin, Eye, Calendar, Tag, Bookmark, BookmarkCheck, 
  MessageCircle, Send, Flag, RefreshCw, DollarSign, Gift, CheckCircle2 
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProductForDetail, setSelectedProductForDetail, currentUser, 
    users, toggleBookmark, questions, addQuestion, replyQuestion, 
    createTradeRequest, createReport, setAuthModalOpen 
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Request Form
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState<'purchase' | 'exchange' | 'gift'>('purchase');
  const [requestMessage, setRequestMessage] = useState('');

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('商品資訊不實');
  const [reportNote, setReportNote] = useState('');

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const seller = users.find((u) => u.id === product.sellerId) || {
    id: product.sellerId,
    name: '校園同學',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    school: product.school,
    county: product.county,
    isVerified: true,
  };

  const isBookmarked = currentUser?.bookmarks.includes(product.id) || false;
  const productQuestions = questions.filter((q) => q.productId === product.id);

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    if (!newQuestionText.trim()) return;
    addQuestion(product.id, newQuestionText);
    setNewQuestionText('');
  };

  const handleReplySubmit = (qId: string) => {
    if (!replyText.trim()) return;
    replyQuestion(qId, replyText);
    setReplyingId(null);
    setReplyText('');
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    createTradeRequest(product.id, product.sellerId, requestType, requestMessage);
    setShowRequestModal(false);
    setRequestMessage('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    createReport('product', product.id, product.title, reportReason, reportNote);
    setShowReportModal(false);
    setReportNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden relative border border-slate-100 my-8 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-800 rounded-lg">
              {product.category}
            </span>
            <span className="text-xs font-medium text-slate-500">· 新舊程度：{product.condition}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleBookmark(product.id)}
              className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isBookmarked 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-rose-600" /> : <Bookmark className="w-4 h-4" />}
              <span>{isBookmarked ? '已收藏' : '收藏'}</span>
            </button>
            <button
              onClick={() => setSelectedProductForDetail(null)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx ? 'border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Actions */}
            <div className="space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {product.transactionTypes.map((t) => (
                    <span 
                      key={t}
                      className={`px-3 py-1 text-xs font-bold rounded-lg ${
                        t === '買賣' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        t === '交換' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                        'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                    product.status === 'listed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    product.status === 'reserved' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {product.status === 'listed' ? '上架中' : product.status === 'reserved' ? '預約中' : '交易完成'}
                  </span>
                </div>

                <h1 className="text-xl font-bold text-slate-900">{product.title}</h1>

                <div className="text-2xl font-black text-emerald-600 flex items-baseline gap-1">
                  {product.price === 0 ? (
                    <span className="text-purple-600">免費贈送</span>
                  ) : (
                    <>
                      <span className="text-xs font-medium text-slate-500">NT$</span>
                      <span>{product.price.toLocaleString()}</span>
                    </>
                  )}
                </div>

                {/* Exchange Wishes info */}
                {product.exchangeWishes && (
                  <div className="p-3 bg-teal-50 rounded-xl border border-teal-100 text-xs text-teal-900 space-y-1">
                    <div className="font-bold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                      交換意願：
                    </div>
                    <div>想換：{product.exchangeWishes.itemWanted}</div>
                    <div>{product.exchangeWishes.acceptsCashDifference ? '✓ 接受補差價 (多退少補)' : '✕ 不接受補差價'}</div>
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="font-semibold text-slate-800">商品描述</div>
                  <p className="whitespace-pre-line leading-relaxed">{product.description}</p>
                </div>

                {/* Seller Card */}
                <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <img src={seller.avatar} alt={seller.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                        {seller.name}
                        {seller.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-slate-400" /> {seller.school}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <div>瀏覽人次 {product.views}</div>
                    <div>{new Date(product.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                {currentUser?.id !== product.sellerId ? (
                  <button
                    onClick={() => {
                      if (!currentUser) setAuthModalOpen(true);
                      else setShowRequestModal(true);
                    }}
                    disabled={product.status === 'done'}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                      product.status === 'done' 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{product.status === 'done' ? '商品已售出/交易完成' : '提出購買/交換申請'}</span>
                  </button>
                ) : (
                  <div className="flex-1 py-3 text-center text-xs font-semibold text-slate-500 bg-slate-100 rounded-xl">
                    這是您刊登的商品
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!currentUser) setAuthModalOpen(true);
                    else setShowReportModal(true);
                  }}
                  className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
                  title="檢舉商品"
                >
                  <Flag className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Public Q&A Section */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              公開問答 ({productQuestions.length})
            </h3>

            <div className="space-y-3">
              {productQuestions.map((q) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={q.userAvatar} alt={q.userName} className="w-6 h-6 rounded-full object-cover" />
                      <span className="text-xs font-bold text-slate-800">{q.userName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(q.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 pl-8">{q.content}</p>

                  {/* Reply if exists */}
                  {q.reply && (
                    <div className="ml-8 mt-2 p-3 bg-emerald-50/70 rounded-lg border border-emerald-100 text-xs text-emerald-900 space-y-1">
                      <div className="font-bold flex items-center gap-1 text-emerald-700">
                        賣家回覆：
                      </div>
                      <div>{q.reply}</div>
                    </div>
                  )}

                  {/* Reply button for seller */}
                  {currentUser?.id === product.sellerId && !q.reply && (
                    <div className="ml-8 pt-2">
                      {replyingId === q.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="回覆同學的提問..."
                            className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReplySubmit(q.id)}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
                            >
                              送出回覆
                            </button>
                            <button
                              onClick={() => setReplyingId(null)}
                              className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyingId(q.id)}
                          className="text-xs font-semibold text-emerald-600 hover:underline"
                        >
                          回覆此提問
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {productQuestions.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">目前尚無提問，有任何問題歡迎留言詢問賣家！</p>
              )}
            </div>

            {/* Ask Question Form */}
            <form onSubmit={handleQuestionSubmit} className="flex gap-2 pt-2">
              <input
                type="text"
                required
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="公開留言提問（請勿公開電話或住址等個資）..."
                className="flex-1 px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>發布提問</span>
              </button>
            </form>
          </div>

        </div>

      </div>

      {/* Trade Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">提出購買 / 交換申請</h3>
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">交易類型</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {product.transactionTypes.map((t) => (
                    <option key={t} value={t === '買賣' ? 'purchase' : t === '交換' ? 'exchange' : 'gift'}>
                      {t}申請
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">給賣家的留言與面交時間地點提案 *</label>
                <textarea
                  rows={3}
                  required
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="例如：這週四下午 5 點在總圖正門口面交可以嗎？現金交易！"
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                >
                  確認送出申請
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">檢舉違規商品</h3>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">檢舉原因</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="商品資訊不實">商品資訊不實 / 圖片不符</option>
                  <option value="疑似詐騙或價格異常">疑似詐騙或價格異常</option>
                  <option value="違禁品或不當內容">違禁品或不當內容</option>
                  <option value="其他違規事項">其他違規事項</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">詳細說明</label>
                <textarea
                  rows={3}
                  required
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  placeholder="請描述具體檢舉事由..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
                >
                  送出檢舉
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
