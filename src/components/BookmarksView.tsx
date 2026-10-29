import React from 'react';
import { useApp } from '../context/AppContext';
import { Bookmark, MapPin, BookmarkCheck } from 'lucide-react';

export const BookmarksView: React.FC = () => {
  const { currentUser, products, toggleBookmark, setSelectedProductForDetail, setActiveTab } = useApp();

  if (!currentUser) return null;

  const bookmarkedProducts = products.filter((p) => currentUser.bookmarks.includes(p.id));

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-xl font-bold text-slate-900">我的收藏清單</h1>
        <p className="text-xs text-slate-500 mt-1">您關注的校園二手好物，隨時掌握最新狀態</p>
      </div>

      {bookmarkedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarkedProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProductForDetail(product)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer relative"
            >
              <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(product.id);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white text-rose-600 shadow-sm"
                >
                  <BookmarkCheck className="w-4 h-4 fill-rose-600" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-500">{product.category}</span>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{product.title}</h3>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-base font-black text-emerald-600">
                    {product.price === 0 ? '免費贈送' : `NT$ ${product.price.toLocaleString()}`}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {product.school}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">目前沒有收藏任何商品</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            在瀏覽商品時點擊右上角的書籤圖示，即可將感興趣的好物加入收藏！
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            去瀏覽校園市集
          </button>
        </div>
      )}
    </div>
  );
};
