import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// -- Enums --
export const userRoleEnum = pgEnum("user_role", ["fan", "creator", "admin"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "past_due",
  "canceled",
  "paused",
]);
export const postTypeEnum = pgEnum("post_type", [
  "text",
  "image",
  "video",
  "audio",
]);
export const postVisibilityEnum = pgEnum("post_visibility", [
  "public",
  "subscribers",
  "tier",
]);
export const transactionTypeEnum = pgEnum("transaction_type", [
  "subscription",
  "ppv",
  "dm",
  "tip",
  "payout",
]);
export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "new_post",
  "new_dm",
  "new_subscriber",
  "payment",
  "system",
]);

// -- Users --
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("fan"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// -- Creator Profiles --
export const creatorProfiles = pgTable(
  "creator_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id),
    slug: varchar("slug", { length: 50 }).notNull().unique(),
    bio: text("bio"),
    coverImageUrl: text("cover_image_url"),
    snsInstagram: varchar("sns_instagram", { length: 255 }),
    snsX: varchar("sns_x", { length: 255 }),
    snsThreads: varchar("sns_threads", { length: 255 }),
    snsTiktok: varchar("sns_tiktok", { length: 255 }),
    stripeAccountId: varchar("stripe_account_id", { length: 255 }),
    stripeOnboarded: boolean("stripe_onboarded").notNull().default(false),
    dmPrice: integer("dm_price").default(500),
    isPublished: boolean("is_published").notNull().default(false),
    category: varchar("category", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("creator_profiles_slug_idx").on(table.slug),
    index("creator_profiles_user_id_idx").on(table.userId),
  ]
);

// -- Tiers --
export const tiers = pgTable(
  "tiers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => creatorProfiles.id),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    price: integer("price").notNull(),
    stripePriceId: varchar("stripe_price_id", { length: 255 }),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    benefits: jsonb("benefits").default([]),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("tiers_creator_id_idx").on(table.creatorId)]
);

// -- Subscriptions --
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fanId: uuid("fan_id")
      .notNull()
      .references(() => users.id),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => creatorProfiles.id),
    tierId: uuid("tier_id")
      .notNull()
      .references(() => tiers.id),
    stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }).unique(),
    status: subscriptionStatusEnum("status").notNull(),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    canceledAt: timestamp("canceled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("subscriptions_fan_creator_idx").on(table.fanId, table.creatorId),
  ]
);

// -- Posts --
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => creatorProfiles.id),
    type: postTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }),
    body: text("body"),
    mediaUrls: jsonb("media_urls").default([]),
    visibility: postVisibilityEnum("visibility").notNull().default("subscribers"),
    minTierId: uuid("min_tier_id").references(() => tiers.id),
    isPpv: boolean("is_ppv").notNull().default(false),
    ppvPrice: integer("ppv_price"),
    likeCount: integer("like_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("posts_creator_published_idx").on(table.creatorId, table.publishedAt),
  ]
);

// -- Post Likes --
export const postLikes = pgTable(
  "post_likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("post_likes_post_user_idx").on(table.postId, table.userId),
  ]
);

// -- Comments --
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("comments_post_idx").on(table.postId, table.createdAt)]
);

// -- Direct Messages（レビュー指摘: スレッド型に改善）--
export const dmConversations = pgTable(
  "dm_conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fanId: uuid("fan_id")
      .notNull()
      .references(() => users.id),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("dm_conversations_fan_creator_idx").on(table.fanId, table.creatorId),
  ]
);

export const directMessages = pgTable(
  "direct_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => dmConversations.id),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id),
    body: text("body").notNull(),
    mediaUrl: text("media_url"),
    price: integer("price").notNull().default(0), // 0 = 無料（クリエイター返信）
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("dm_conversation_idx").on(table.conversationId, table.createdAt),
  ]
);

// -- PPV Purchases --
export const ppvPurchases = pgTable(
  "ppv_purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id),
    fanId: uuid("fan_id")
      .notNull()
      .references(() => users.id),
    price: integer("price").notNull(),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("ppv_purchases_post_fan_idx").on(table.postId, table.fanId),
  ]
);

// -- Transactions --
export const transactions = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => creatorProfiles.id),
    fanId: uuid("fan_id").references(() => users.id),
    type: transactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(),
    platformFee: integer("platform_fee").notNull(),
    creatorRevenue: integer("creator_revenue").notNull(),
    stripeId: varchar("stripe_id", { length: 255 }).unique(), // 冪等性キー
    status: transactionStatusEnum("status").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("transactions_creator_idx").on(table.creatorId, table.createdAt),
    index("transactions_type_idx").on(table.type, table.createdAt),
  ]
);

// -- Notifications --
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    type: notificationTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body"),
    link: text("link"),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_idx").on(table.userId, table.isRead, table.createdAt),
  ]
);

// -- Relations --
export const usersRelations = relations(users, ({ one, many }) => ({
  creatorProfile: one(creatorProfiles, {
    fields: [users.id],
    references: [creatorProfiles.userId],
  }),
  subscriptions: many(subscriptions),
  notifications: many(notifications),
}));

export const creatorProfilesRelations = relations(creatorProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [creatorProfiles.userId],
    references: [users.id],
  }),
  tiers: many(tiers),
  posts: many(posts),
  subscriptions: many(subscriptions),
}));

export const tiersRelations = relations(tiers, ({ one, many }) => ({
  creator: one(creatorProfiles, {
    fields: [tiers.creatorId],
    references: [creatorProfiles.id],
  }),
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  fan: one(users, {
    fields: [subscriptions.fanId],
    references: [users.id],
  }),
  creator: one(creatorProfiles, {
    fields: [subscriptions.creatorId],
    references: [creatorProfiles.id],
  }),
  tier: one(tiers, {
    fields: [subscriptions.tierId],
    references: [tiers.id],
  }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  creator: one(creatorProfiles, {
    fields: [posts.creatorId],
    references: [creatorProfiles.id],
  }),
  likes: many(postLikes),
  comments: many(comments),
}));
