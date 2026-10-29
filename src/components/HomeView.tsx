import React from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category, TransactionType } from '../types';
import { 
  Search, SlidersHorizontal, MapPin, Bookmark, BookmarkCheck, 
  Sparkles, BookOpen, Laptop, Home as HomeIcon, Shirt, Coffee, Package, ShieldCheck 
} from 'lucide-react';

const CATEGORIES: (Category | '全部')[] = ['全部', '課本教科書', '電子產品', '生活家電', '衣物服飾', '宿舍家具', '其他雜貨'];

const SCHOOLS = ['全部', '台灣大學', '清華大學', '陽明交通大學', '成功大學', '政治大學', '臺灣科技大學', '台北科技大學', '中央大學'];
const COUNTIES = ['全部', '台北市', '新北市', '基隆市', '桃園市', '新竹市', '台中市', '台南市', '高雄市'];

export const HomeView: React.FC = () => {
  const { 
    products, searchKeyword, setSearchKeyword, 
    selectedCategory, setSelectedCategory, 
    selectedSchool, setSelectedSchool, 
    selectedCounty, setSelectedCounty,
    selectedTransactionType, setSelectedTransactionType,
    minPrice, setMinPrice, maxPrice, setMaxPrice,
    sortBy, setSortBy, currentUser, toggleBookmark,
    setSelectedProductForDetail, setCreateProductModalOpen, setAuthModalOpen 
  } = useApp();

  // Filtering & Sorting
  const filteredProducts = products.filter((p) => {
    // Keyword search
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(kw);
      const matchDesc = p.description.toLowerCase().includes(kw);
      if (!matchTitle && !matchDesc) return false;
    }
    // Category filter
    if (selectedCategory !== '全部' && p.category !== selectedCategory) return false;
    // School filter
    if (selectedSchool !== '全部' && p.school !== selectedSchool) return false;
    // County filter
    if (selectedCounty !== '全部' && p.county !== selectedCounty) return false;
    // Transaction type filter
    if (selectedTransactionType !== '全部' && !p.transactionTypes.includes(selectedTransactionType)) return false;
    // Price range
    if (minPrice !== '' && p.price < Number(minPrice)) return false;
    if (maxPrice !== '' && p.price > Number(maxPrice)) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>全台大學生專屬二手交換與買賣平台</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            讓閒置好書與物品在校園中延續價值
          </h1>
          <p className="text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            以同校面交優先、校園信箱驗證與多樣化交換機制，讓學生買賣更安心、更省錢。
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                if (!currentUser) setAuthModalOpen(true);
                else setCreateProductModalOpen(true);
              }}
              className="px-6 py-3 bg-white text-emerald-800 rounded-xl font-bold text-xs sm:text-sm hover:bg-emerald-50 transition-colors shadow-lg shadow-black/5"
            >
              立即免費刊登商品
            </button>
          </div>
        </div>
      </div>

      {/* Search & Main Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="搜尋商品名稱、作者、微積分原文書、鍵盤、筆電..."
            className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === '課本教科書' && <BookOpen className="w-3.5 h-3.5" />}
              {cat === '電子產品' && <Laptop className="w-3.5 h-3.5" />}
              {cat === '生活家電' && <Coffee className="w-3.5 h-3.5" />}
              {cat === '衣物服飾' && <Shirt className="w-3.5 h-3.5" />}
              {cat === '宿舍家具' && <HomeIcon className="w-3.5 h-3.5" />}
              {cat === '其他雜貨' && <Package className="w-3.5 h-3.5" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Advanced Filters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-100">
          
          {/* School filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">學校篩選</label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {SCHOOLS.map((s) => (
                <option key={s} value={s}>{s === '全部' ? '所有學校' : s}</option>
              ))}
            </select>
          </div>

          {/* County filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">縣市地區</label>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {COUNTIES.map((c) => (
                <option key={c} value={c}>{c === '全部' ? '所有縣市' : c}</option>
              ))}
            </select>
          </div>

          {/* Transaction Type filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">交易方式</label>
            <select
              value={selectedTransactionType}
              onChange={(e) => setSelectedTransactionType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="全部">所有方式</option>
              <option value="買賣">買賣</option>
              <option value="交換">交換 (以物易物)</option>
              <option value="贈送">免費贈送</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">最低價格 (NT$)</label>
            <input
              type="number"
              placeholder="最低價"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">最高價格 (NT$)</label>
            <input
              type="number"
              placeholder="最高價"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">排序方式</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="newest">最新上架優先</option>
              <option value="price-asc">價格由低到高</option>
              <option value="price-desc">價格由高到低</option>
            </select>
          </div>

        </div>

      </div>

      {/* Product Grid Header / Count */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-slate-800">
          校園二手商品列表 <span className="text-xs font-normal text-slate-500">({filteredProducts.length} 件)</span>
        </h2>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isBookmarked = currentUser?.bookmarks.includes(product.id) || false;
            return (
              <div
                key={product.id}
                onClick={() => setSelectedProductForDetail(product)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer relative"
              >
                {/* Image Container */}
                <div className="aspect-4/3 w-full bg-slate-100 overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Bookmark Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(product.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
                      isBookmarked ? 'bg-white text-rose-600' : 'bg-white/80 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-rose-600" /> : <Bookmark className="w-4 h-4" />}
                  </button>

                  {/* Status Tag */}
                  {product.status !== 'listed' && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white text-[10px] font-bold rounded-lg shadow-md">
                      {product.status === 'reserved' ? '預約中' : '已售出'}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{product.category}</span>
                      <span>{product.condition}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {product.title}
                    </h3>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-black text-emerald-600">
                        {product.price === 0 ? (
                          <span className="text-purple-600 text-sm font-bold">免費贈送</span>
                        ) : (
                          <>
                            <span className="text-xs font-medium text-slate-400">NT$ </span>
                            <span>{product.price.toLocaleString()}</span>
                          </>
                        )}
                      </div>

                      <div className="flex gap-1">
                        {product.transactionTypes.map((t) => (
                          <span 
                            key={t}
                            className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                              t === '買賣' ? 'bg-blue-50 text-blue-700' :
                              t === '交換' ? 'bg-teal-50 text-teal-700' :
                              'bg-purple-50 text-purple-700'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {product.school}
                      </span>
                      <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">找不到符合條件的商品</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            試著切換其他關鍵字、更改學校篩選條件，或點擊上方「免費刊登」張貼您的二手好物！
          </p>
          <button
            onClick={() => {
              setSearchKeyword('');
              setSelectedCategory('全部');
              setSelectedSchool('全部');
              setSelectedCounty('全部');
              setSelectedTransactionType('全部');
              setMinPrice('');
              setMaxPrice('');
            }}
            className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
          >
            重置所有篩選條件
          </button>
        </div>
      )}

    </div>
  );
};
