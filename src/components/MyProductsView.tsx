import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductStatus } from '../types';
import { Package, Plus, Trash2, Edit3, CheckCircle2, Clock, Eye } from 'lucide-react';

export const MyProductsView: React.FC = () => {
  const { currentUser, products, updateProductStatus, deleteProduct, setCreateProductModalOpen, setSelectedProductForDetail } = useApp();

  if (!currentUser) return null;

  const myProducts = products.filter((p) => p.sellerId === currentUser.id);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">我的個人賣場與上架商品</h1>
          <p className="text-xs text-slate-500 mt-1">管理您刊登的商品狀態（上架中、預約中、交易完成）</p>
        </div>
        <button
          onClick={() => setCreateProductModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          刊登新商品
        </button>
      </div>

      {myProducts.length > 0 ? (
        <div className="space-y-4">
          {myProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs hover:shadow-md transition-shadow"
            >
              <div 
                onClick={() => setSelectedProductForDetail(product)}
                className="flex items-center gap-4 cursor-pointer group flex-1"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-800 rounded">{product.category}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      product.status === 'listed' ? 'bg-emerald-100 text-emerald-800' :
                      product.status === 'reserved' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {product.status === 'listed' ? '上架中' : product.status === 'reserved' ? '預約中' : '交易完成'}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{product.title}</h3>
                  <div className="text-sm font-black text-emerald-600">
                    {product.price === 0 ? '免費贈送' : `NT$ ${product.price.toLocaleString()}`}
                  </div>
                </div>
              </div>

              {/* Status Switcher & Actions */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <select
                  value={product.status}
                  onChange={(e) => updateProductStatus(product.id, e.target.value as ProductStatus)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="listed">上架中</option>
                  <option value="reserved">預約中</option>
                  <option value="done">交易完成</option>
                </select>

                <button
                  onClick={() => deleteProduct(product.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
                  title="刪除商品"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">您尚未刊登任何商品</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            畢業出清、不需要的教科書、電子產品或宿舍家具，現在就免費刊登給校園學弟妹吧！
          </p>
          <button
            onClick={() => setCreateProductModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            立即刊登商品
          </button>
        </div>
      )}
    </div>
  );
};
