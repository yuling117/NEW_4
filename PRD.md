# PRD — 全國大學生二手物品交換與買賣平台 (CampusTrade)

> Vibe Coding 第一次期中作品 · 產品需求文件（Product Requirements Document）
> 文件狀態：實作版 v1.2（依審查建議優化版）｜最後更新：2026-10-29

---

## 0. 文件使用說明

- 本文件為「規格＋繳交」雙用途：既是產品開發規格，也是作業交付文件之一。
- **資料儲存說明**：展示版採用瀏覽器 `localStorage` 進行前端持久化儲存，不支援跨裝置同步；正式上線版將改用後端關聯式資料庫（PostgreSQL / Cloud SQL）。
- **測試帳號**：`test@ntu.edu.tw` / `123456`（一般會員）、`admin@campus.tw` / `admin123`（管理員）。

---

## 1. 產品定位與成功指標 (KPIs)

**一句話定位**：一個以「同校面交優先、跨校延伸」為原則的全國大學生二手物品交換與買賣平台，讓學生能安全、低門檻地出售、交換或贈送閒置的課本、電子產品與生活用品。

**我們要解決的問題**
- 學期更替時大量課本、電子產品、宿舍家具閒置，學生缺乏針對「校園情境」的交易管道。
- 一般二手平台（蝦皮、FB 社團）缺乏校園身分信任機制、也無法依「同校／鄰近學校」篩選，面交安全與便利性不足。
- 交換（以物易物）與贈送需求在通用電商平台上難以表達。

**產品價值主張**
- **校園信任**：以學校信箱驗證身分，依學校／地區篩選，優先促成同校面交。
- **多元交易**：同時支援「買賣、交換、贈送」三種交易方式。
- **低門檻瀏覽**：未登入即可瀏覽、搜尋、篩選商品；需要互動（聯絡賣家、上架）時才登入。
- **行動優先**：介面以手機操作為主要情境設計。

### 成功指標 (Success Metrics / KPIs)
1. **商品成功上架率** $\ge 90\%$（填寫完整欄位並順利發布之比例）
2. **搜尋後點擊瀏覽率** $\ge 30\%$（使用者透過搜尋或篩選找到商品的點擊率）
3. **完成交易數量**（每週媒合成功並標記為 `done` 之交易數）
4. **收藏商品活躍度**（平均每位活躍會員加入收藏之商品數）
5. **校園驗證會員比例**（完成 `.edu.tw` 驗證之會員佔總會員數之比例）

---

## 2. 目標使用者與情境

### 2.1 主要使用者輪廓（Persona）

| Persona | 描述 | 主要需求 | 痛點 |
|---|---|---|---|
| **出清者 小婷（大四）** | 畢業在即，想出清課本、桌燈、二手筆電 | 快速上架、設定面交地點、管理多件商品狀態 | 不想被陌生人騷擾、怕約了不來 |
| **撿便宜 阿豪（大一）** | 剛入學，想低價取得教科書與生活用品 | 依課名/學校搜尋、價格篩選、收藏比較 | 不確定賣家可不可信、怕買到爛東西 |
| **以物易物 Ken（研究生）** | 想用舊鍵盤換螢幕、送出用不到的書 | 標註可交換、填寫想換的物品、是否補差價 | 一般平台沒有交換功能 |
| **管理員 助教 / 平台方** | 維護平台秩序 | 審核檢舉、處理爭議、管理會員與商品 | 需要後台與紀錄 |

---

## 3. 核心流程與狀態機

### 3.1 狀態機：商品生命週期
```
草稿 →（發佈）→ 上架中 (listed) →（被申請並接受）→ 預約中 (reserved) →（面交完成）→ 交易完成 (done)
  上架中 / 預約中 →（賣家操作）→ 下架 (delisted)
```

### 3.2 狀態機：交易申請
```
已送出申請 (requested) → 賣家審視 →（接受）預約中 (reserved) /（婉拒）已婉拒 (rejected)
預約中 (reserved) →（雙方確認完成）交易完成 (done) /（任一方取消）已取消 (canceled)
```

---

## 4. 資料模型設計 (Data Schema)

> 正式版將以關聯式資料庫（PostgreSQL）規範，展示版以 localStorage 保存。

- **User（會員實體）**：id, email, password, name, avatar, school, county, isVerified, role, bookmarks[], createdAt
- **Product（商品實體）**：id, sellerId, title, description, category, condition, price, transactionTypes[], images[], status, exchangeWishes{itemWanted, acceptsCashDifference}, school, county, views, createdAt
- **Trade（交易申請實體）**：id, productId, buyerId, sellerId, type, status, message, createdAt
- **Question（問答實體）**：id, productId, userId, userName, userAvatar, content, reply, createdAt
- **Notification（通知實體）**：id, userId, type, title, content, linkId, isRead, createdAt
- **Report（檢舉實體）**：id, reporterId, targetType, targetId, targetTitle, reason, note, status, result, createdAt
- **Review（評價實體）**：id, tradeId, rating, comment, reviewerId, revieweeId, createdAt

---

## 5. 產品藍圖與版本規劃 (Roadmap)

- **v1.0（本次期中實作版・已完成）**
  - 商品卡片瀏覽、分類、關鍵字搜尋、價格與學校篩選
  - 會員註冊、登入與快速測試帳號
  - 商品上架（含多張照片與預設圖）與狀態管理（上架中、預約中、交易完成）
  - 收藏清單與帳號綁定
  - 公開問答與交易申請流程
  - 賣家信用評價與管理員檢舉審核後台
- **v1.1（近期優化）**
  - 校園信箱真實驗證機制
  - 淺色／深色模式切換支援
- **v2.0（未來擴充願景）**
  - 買方願望清單 / 徵求貼文
  - 校園安全面交地點地圖推薦（圖書館、警衛室旁）
  - 跨校距離排序與即時聊天室功能

---

## 6. 非功能需求 (NFR)

- **行動優先 / RWD**：以 375px 手機寬度為主要設計基準，搭配頂部導航與手機底部導覽列，平板與桌機完美適配。
- **效能與體驗**：圖片採延遲載入（`loading="lazy"`），微互動反饋 $< 200\text{ms}$。
- **安全與個資**：權限嚴格控管（僅商品擁有者可編輯/下架、僅管理員可進後台），問答與頁面提醒避免公開完整電話與住址。
