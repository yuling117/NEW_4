export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  avatar: string;
  school: string;
  county: string;
  isVerified: boolean;
  role: UserRole;
  bookmarks: string[]; // product IDs
  createdAt: string;
}

export type Category = '課本教科書' | '電子產品' | '生活家電' | '衣物服飾' | '宿舍家具' | '其他雜貨';

export type Condition = '全新' | '九成新' | '八成新' | '七成新以下';

export type TransactionType = '買賣' | '交換' | '贈送';

export type ProductStatus = 'listed' | 'reserved' | 'done' | 'delisted';

export interface ExchangeWishes {
  itemWanted: string;
  acceptsCashDifference: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: Category;
  condition: Condition;
  price: number;
  transactionTypes: TransactionType[];
  images: string[];
  status: ProductStatus;
  exchangeWishes?: ExchangeWishes;
  school: string;
  county: string;
  views: number;
  createdAt: string;
}

export type RequestType = 'purchase' | 'exchange' | 'gift';

export type RequestStatus = 'requested' | 'reserved' | 'done' | 'rejected' | 'canceled';

export interface TradeRequest {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  type: RequestType;
  status: RequestStatus;
  message: string;
  createdAt: string;
}

export interface Question {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  reply?: string;
  createdAt: string;
}

export type NotificationType = 'message' | 'request' | 'status' | 'review' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  linkId?: string; // productId or requestID
  isRead: boolean;
  createdAt: string;
}

export type ReportTargetType = 'product' | 'user';

export interface Report {
  id: string;
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  targetTitle: string;
  reason: string;
  note: string;
  status: 'pending' | 'resolved' | 'dismissed';
  result?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  tradeId: string;
  rating: number; // 1 to 5
  comment: string;
  reviewerId: string;
  revieweeId: string;
  createdAt: string;
}
