import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, Product, TradeRequest, Question, Notification, Report, Review, 
  Category, Condition, TransactionType, ProductStatus, RequestType, RequestStatus, ReportTargetType 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_REQUESTS, 
  INITIAL_QUESTIONS, INITIAL_NOTIFICATIONS, INITIAL_REPORTS, INITIAL_REVIEWS 
} from '../data/seed';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  requests: TradeRequest[];
  questions: Question[];
  notifications: Notification[];
  reports: Report[];
  reviews: Review[];
  
  // Filters & Navigation
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  selectedCategory: Category | '全部';
  setSelectedCategory: (val: Category | '全部') => void;
  selectedSchool: string;
  setSelectedSchool: (val: string) => void;
  selectedCounty: string;
  setSelectedCounty: (val: string) => void;
  selectedTransactionType: TransactionType | '全部';
  setSelectedTransactionType: (val: TransactionType | '全部') => void;
  minPrice: string;
  setMinPrice: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
  setSortBy: (val: 'newest' | 'price-asc' | 'price-desc') => void;
  activeTab: 'home' | 'bookmarks' | 'my-products' | 'requests' | 'notifications' | 'admin' | 'profile';
  setActiveTab: (tab: 'home' | 'bookmarks' | 'my-products' | 'requests' | 'notifications' | 'admin' | 'profile') => void;
  
  // Modals
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  createProductModalOpen: boolean;
  setCreateProductModalOpen: (open: boolean) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (prod: Product | null) => void;
  
  // Actions
  login: (email: string, pass: string) => boolean;
  register: (name: string, email: string, pass: string, school: string, county: string) => boolean;
  logout: () => void;
  verifyCampusEmail: () => void;
  updateProfile: (name: string, school: string, county: string, avatar: string) => void;
  resetPasswordRequest: (email: string) => void;
  
  addProduct: (product: Omit<Product, 'id' | 'sellerId' | 'views' | 'createdAt' | 'status' | 'school' | 'county'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductStatus: (id: string, status: ProductStatus) => void;
  deleteProduct: (id: string) => void;
  
  toggleBookmark: (productId: string) => void;
  
  createTradeRequest: (productId: string, sellerId: string, type: RequestType, message: string) => void;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  
  addQuestion: (productId: string, content: string) => void;
  replyQuestion: (questionId: string, reply: string) => void;
  
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  
  createReport: (targetType: ReportTargetType, targetId: string, targetTitle: string, reason: string, note: string) => void;
  resolveReport: (reportId: string, result: string) => void;
  
  addReview: (tradeId: string, rating: number, comment: string, revieweeId: string) => void;
  
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('campustrade_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('campustrade_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('campustrade_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [requests, setRequests] = useState<TradeRequest[]>(() => {
    const saved = localStorage.getItem('campustrade_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('campustrade_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('campustrade_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('campustrade_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('campustrade_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Filter & Navigation State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | '全部'>('全部');
  const [selectedSchool, setSelectedSchool] = useState<string>('全部');
  const [selectedCounty, setSelectedCounty] = useState<string>('全部');
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | '全部'>('全部');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [activeTab, setActiveTab] = useState<'home' | 'bookmarks' | 'my-products' | 'requests' | 'notifications' | 'admin' | 'profile'>('home');

  // Modals & Selection
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [createProductModalOpen, setCreateProductModalOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('campustrade_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { 
    if (currentUser) {
      localStorage.setItem('campustrade_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('campustrade_current_user');
    }
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('campustrade_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('campustrade_requests', JSON.stringify(requests)); }, [requests]);
  useEffect(() => { localStorage.setItem('campustrade_questions', JSON.stringify(questions)); }, [questions]);
  useEffect(() => { localStorage.setItem('campustrade_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('campustrade_reports', JSON.stringify(reports)); }, [reports]);
  useEffect(() => { localStorage.setItem('campustrade_reviews', JSON.stringify(reviews)); }, [reviews]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const login = (email: string, pass: string): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (found) {
      setCurrentUser(found);
      setAuthModalOpen(false);
      showToast(`歡迎回來，${found.name}！`, 'success');
      return true;
    }
    showToast('登入失敗：帳號或密碼錯誤', 'error');
    return false;
  };

  const register = (name: string, email: string, pass: string, school: string, county: string): boolean => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      showToast('註冊失敗：此信箱已被註冊', 'error');
      return false;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password: pass,
      name,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      school,
      county,
      isVerified: email.includes('.edu.tw') || email.includes('student'),
      role: 'user',
      bookmarks: [],
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setAuthModalOpen(false);
    showToast('註冊成功！已自動登入', 'success');
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    showToast('已安全登出', 'info');
  };

  const verifyCampusEmail = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, isVerified: true };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    showToast('校園身分驗證模擬成功！已獲得驗證標章', 'success');
  };

  const updateProfile = (name: string, school: string, county: string, avatar: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name, school, county, avatar };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('個人檔案更新成功', 'success');
  };

  const resetPasswordRequest = (email: string) => {
    showToast(`重設密碼信件已模擬發送至 ${email} (測試密碼可直接使用舊密碼)`, 'info');
  };

  const addProduct = (productData: Omit<Product, 'id' | 'sellerId' | 'views' | 'createdAt' | 'status' | 'school' | 'county'>) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const newProd: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      sellerId: currentUser.id,
      status: 'listed',
      school: currentUser.school,
      county: currentUser.county,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProd, ...prev]);
    setCreateProductModalOpen(false);
    showToast('商品上架成功！', 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('商品資料已更新', 'success');
  };

  const updateProductStatus = (id: string, status: ProductStatus) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    showToast(`商品狀態已更新為：${status === 'listed' ? '上架中' : status === 'reserved' ? '預約中' : status === 'done' ? '交易完成' : '已下架'}`, 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('商品已刪除', 'info');
  };

  const toggleBookmark = (productId: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const isBookmarked = currentUser.bookmarks.includes(productId);
    const newBookmarks = isBookmarked
      ? currentUser.bookmarks.filter((id) => id !== productId)
      : [...currentUser.bookmarks, productId];
    
    const updated = { ...currentUser, bookmarks: newBookmarks };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast(isBookmarked ? '已取消收藏' : '已加入收藏清單', 'success');
  };

  const createTradeRequest = (productId: string, sellerId: string, type: RequestType, message: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const prod = products.find((p) => p.id === productId);
    const newReq: TradeRequest = {
      id: `req-${Date.now()}`,
      productId,
      buyerId: currentUser.id,
      sellerId,
      type,
      status: 'requested',
      message,
      createdAt: new Date().toISOString(),
    };
    setRequests((prev) => [newReq, ...prev]);

    // Create notification for seller
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: sellerId,
      type: 'request',
      title: `收到新的${type === 'purchase' ? '購買' : type === 'exchange' ? '交換' : '索取'}申請`,
      content: `${currentUser.name} 對您的商品「${prod?.title || '商品'}」提出了申請。`,
      linkId: newReq.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('申請已送出！已通知賣家', 'success');
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status } : r)));

    // If accepted -> update product status to reserved
    if (status === 'reserved') {
      updateProductStatus(req.productId, 'reserved');
    } else if (status === 'done') {
      updateProductStatus(req.productId, 'done');
    }

    // Notify buyer
    const prod = products.find((p) => p.id === req.productId);
    const notifText = status === 'reserved' ? '賣家已接受您的申請，商品進入預約中！' :
                      status === 'done' ? '交易已標記完成！' :
                      status === 'rejected' ? '賣家已婉拒此交易申請。' : '交易已取消。';

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: req.buyerId,
      type: 'status',
      title: '交易狀態更新',
      content: `關於「${prod?.title || '商品'}」，${notifText}`,
      linkId: req.productId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`已更新申請狀態為：${status}`, 'success');
  };

  const addQuestion = (productId: string, content: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const prod = products.find((p) => p.id === productId);
    const newQ: Question = {
      id: `q-${Date.now()}`,
      productId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      createdAt: new Date().toISOString(),
    };
    setQuestions((prev) => [...prev, newQ]);

    if (prod && prod.sellerId !== currentUser.id) {
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        userId: prod.sellerId,
        type: 'message',
        title: '新的商品提問',
        content: `${currentUser.name} 在您的商品「${prod.title}」下方留言提問。`,
        linkId: productId,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
    showToast('留言提問已發布', 'success');
  };

  const replyQuestion = (questionId: string, reply: string) => {
    const q = questions.find((item) => item.id === questionId);
    if (!q) return;

    setQuestions((prev) => prev.map((item) => (item.id === questionId ? { ...item, reply } : item)));

    // Notify question asker
    const prod = products.find((p) => p.id === q.productId);
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: q.userId,
      type: 'message',
      title: '商品提問回覆',
      content: `賣家回覆了您在「${prod?.title || '商品'}」的提問。`,
      linkId: q.productId,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast('回覆成功', 'success');
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) => prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n)));
    showToast('所有通知已標記為已讀', 'success');
  };

  const createReport = (targetType: ReportTargetType, targetId: string, targetTitle: string, reason: string, note: string) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }
    const newRep: Report = {
      id: `rep-${Date.now()}`,
      reporterId: currentUser.id,
      targetType,
      targetId,
      targetTitle,
      reason,
      note,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [newRep, ...prev]);
    showToast('檢舉已提交，管理員將盡快審核處理', 'success');
  };

  const resolveReport = (reportId: string, result: string) => {
    setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: 'resolved', result } : r)));
    showToast('檢舉案件已處理', 'success');
  };

  const addReview = (tradeId: string, rating: number, comment: string, revieweeId: string) => {
    if (!currentUser) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      tradeId,
      rating,
      comment,
      reviewerId: currentUser.id,
      revieweeId,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [...prev, newRev]);
    showToast('評價已成功送出！', 'success');
  };

  return (
    <AppContext.Provider value={{
      currentUser, users, products, requests, questions, notifications, reports, reviews,
      searchKeyword, setSearchKeyword,
      selectedCategory, setSelectedCategory,
      selectedSchool, setSelectedSchool,
      selectedCounty, setSelectedCounty,
      selectedTransactionType, setSelectedTransactionType,
      minPrice, setMinPrice,
      maxPrice, setMaxPrice,
      sortBy, setSortBy,
      activeTab, setActiveTab,
      authModalOpen, setAuthModalOpen,
      createProductModalOpen, setCreateProductModalOpen,
      selectedProductForDetail, setSelectedProductForDetail,
      login, register, logout, verifyCampusEmail, updateProfile, resetPasswordRequest,
      addProduct, updateProduct, updateProductStatus, deleteProduct,
      toggleBookmark,
      createTradeRequest, updateRequestStatus,
      addQuestion, replyQuestion,
      markNotificationAsRead, markAllNotificationsRead,
      createReport, resolveReport,
      addReview,
      toasts, showToast
    }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all transform translate-y-0 opacity-100 flex items-center gap-3 ${
              toast.type === 'success' ? 'bg-emerald-600' : toast.type === 'error' ? 'bg-rose-600' : 'bg-slate-800'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
