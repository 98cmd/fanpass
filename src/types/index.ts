// ユーザーロール
export type UserRole = "fan" | "creator" | "admin";

// サブスクリプションステータス
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "paused";

// 投稿タイプ
export type PostType = "text" | "image" | "video" | "audio";

// 投稿公開範囲
export type PostVisibility = "public" | "subscribers" | "tier";

// トランザクションタイプ
export type TransactionType = "subscription" | "ppv" | "dm" | "tip" | "payout";

// トランザクションステータス
export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";

// 通知タイプ
export type NotificationType =
  | "new_post"
  | "new_dm"
  | "new_subscriber"
  | "payment"
  | "system";

// APIレスポンス型
export type ApiResponse<T> = {
  data: T;
};

export type ApiError = {
  error: {
    message: string;
    code?: string;
  };
};

// ページネーション
export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
