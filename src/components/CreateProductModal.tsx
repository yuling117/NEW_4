import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Category, Condition, TransactionType } from '../types';
import { X, Plus, Trash2, Image, Tag, DollarSign, RefreshCw, Gift } from 'lucide-react';

const CATEGORIES: Category[] = ['課本教科書', '電子產品', '生活家電', '衣物服飾', '宿舍家具', '其他雜貨'];
const CONDITIONS: Condition[] = ['全新', '九成新', '八成新', '七成新以下'];

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
];

export const CreateProductModal: React.FC = () => {
  const { createProductModalOpen, setCreateProductModalOpen, addProduct } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('課本教科書');
  const [condition, setCondition] = useState<Condition>('九成新');
  const [price, setPrice] = useState('500');
  const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>(['買賣']);
  const [images, setImages] = useState<string[]>([PRESET_IMAGES[0]]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [itemWanted, setItemWanted] = useState('');
  const [acceptsCashDifference, setAcceptsCashDifference] = useState(true);

  if (!createProductModalOpen) return null;

  const handleTransactionTypeToggle = (type: TransactionType) => {
    if (transactionTypes.includes(type)) {
      if (transactionTypes.length === 1) return; // Keep at least one
      setTransactionTypes(transactionTypes.filter((t) => t !== type));
    } else {
      setTransactionTypes([...transactionTypes, type]);
    }
  };

  const handleAddImage = (url: string) => {
    if (!url.trim()) return;
    setImages([...images, url.trim()]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || images.length === 0) return;

    addProduct({
      title,
      description,
      category,
      condition,
      price: transactionTypes.includes('贈送') ? 0 : Number(price) || 0,
      transactionTypes,
      images,
      exchangeWishes: transactionTypes.includes('交換') ? { itemWanted, acceptsCashDifference } : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative border border-slate-100 my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">上架二手物品</h2>
            <p className="text-xs text-emerald-100 mt-0.5">填寫商品詳細資訊，快速與校園同學媒合面交</p>
          </div>
          <button
            onClick={() => setCreateProductModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">商品標題 *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：原文書 Calculus 9th Edition 托馬斯微積分"
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">商品分類 *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">新舊程度 *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Condition)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Transaction Types */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">交易方式（可複選）*</label>
            <div className="flex gap-3">
              {(['買賣', '交換', '贈送'] as TransactionType[]).map((type) => {
                const active = transactionTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTransactionTypeToggle(type)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                      active
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {type === '買賣' && <DollarSign className="w-3.5 h-3.5" />}
                    {type === '交換' && <RefreshCw className="w-3.5 h-3.5" />}
                    {type === '贈送' && <Gift className="w-3.5 h-3.5" />}
                    <span>{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price */}
          {!transactionTypes.includes('贈送') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">預售價格 (NT$) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">NT$</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Exchange Wishes */}
          {transactionTypes.includes('交換') && (
            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-100 space-y-3">
              <h3 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-teal-600" />
                交換意願設定
              </h3>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">想換取什麼物品？</label>
                <input
                  type="text"
                  value={itemWanted}
                  onChange={(e) => setItemWanted(e.target.value)}
                  placeholder="例如：線性代數原文書 或 24吋螢幕"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={acceptsCashDifference}
                  onChange={(e) => setAcceptsCashDifference(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs font-medium text-slate-700">接受補差價 (多退少補)</span>
              </label>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">商品詳細描述 *</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="請描述商品新舊狀況、使用痕跡、面交地點偏好（例如：總圖正門口面交）..."
              className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">💡 建議註明方便面交的時間與校園地點，請勿留下完整電話或住址以免個資外洩。</p>
          </div>

          {/* Images */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">商品照片 (至少 1 張) *</label>
            
            {/* Image Preview Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
                  <img src={img} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Image URL input */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Image className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="輸入圖片網址 (或點下方快速選取預設圖)"
                  className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddImage(imageUrlInput)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors shrink-0"
              >
                新增照片
              </button>
            </div>

            {/* Quick preset selector */}
            <div className="mt-2.5">
              <span className="text-[11px] font-medium text-slate-500 block mb-1">或點擊快速選擇精美範例圖：</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_IMAGES.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddImage(url)}
                    className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 hover:ring-2 hover:ring-emerald-500 transition-all shrink-0"
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateProductModalOpen(false)}
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-600/20"
            >
              確認送出上架
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
