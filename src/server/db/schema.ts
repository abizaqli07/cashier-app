import { relations, sql } from "drizzle-orm";
import { index, pgEnum, pgTableCreator, primaryKey } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ca_${name}`);

// ========= Enums ========= //
export const userRole = pgEnum("userRole", ["STOREONE", "STORETWO", "ADMIN"]);
export const employmentStatus = pgEnum("employmentStatus", [
  "EMPLOYED",
  "PENDING",
  "RESIGN",
]);
export const orderStatus = pgEnum("orderStatus", [
  "SUCCESS",
  "PROCESS",
  "PENDING",
  "FAILED",
]);
export const paymentStatus = pgEnum("paymentStatus", [
  "PAID",
  "PENDING",
  "FAILED",
]);

/**
 * =========================== User Data ===========================
 * This is for store every user data including :
 *  - data employee
 *  - sessions
 *  - account
 *  - clocking
 */
export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  username: d.varchar({ length: 255 }).unique().notNull(),
  role: userRole("role").default("STOREONE").notNull(),
  image: d.varchar({ length: 255 }),
  password: d.varchar({ length: 255 }),
  phone: d.varchar({ length: 255 }),
  status: employmentStatus("status").default("EMPLOYED").notNull(),
  email: d.varchar({ length: 255 }),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  clockings: many(clocking),
  orders: many(order),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const clocking = createTable("clocking", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  start: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  end: d.timestamp({ mode: "date", withTimezone: true }),
  date: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  totalHour: d.integer(),
  userId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
}));

export const clockingRelations = relations(clocking, ({ one }) => ({
  user: one(users, {
    fields: [clocking.userId],
    references: [users.id],
  }),
}));

/**
 * ======================== Store data ==========================
 *
 * Storing data product and services :
 *  - category
 *  - Product store 1
 *  - Service store 2
 */
export const category = createTable("category", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  products: many(product),
}));

export const product = createTable("product", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  description: d.text(),
  image: d.varchar({ length: 255 }),
  isPublished: d.boolean().default(true),
  price: d.numeric({ precision: 15, scale: 0 }).notNull(),
  quantity: d.integer().default(0),
  categoryId: d
    .varchar({ length: 255 })
    .references(() => category.id, { onDelete: "set null" }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  inventories: many(inventory),
  orders: many(productToOrder),
}));

export const inventory = createTable("inventory", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  isPlus: d.boolean().default(true),
  amount: d.integer().notNull(),
  productId: d
    .varchar({ length: 255 })
    .notNull()
    .references(() => product.id, { onDelete: "cascade" }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(product, {
    fields: [inventory.productId],
    references: [product.id],
  }),
}));

export const service = createTable("service", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  description: d.text(),
  isPublished: d.boolean().default(true),
  price: d.numeric({ precision: 15, scale: 0 }).notNull(),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const serviceRelations = relations(service, ({ many }) => ({
  orders: many(order),
}));

/**
 * ======================== Transaction data ===========================
 *
 * Storing data product and services :
 *  - transaction
 *  - order
 *  - invoice
 */
export const order = createTable("order", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }).notNull(),
  status: orderStatus("status").default("PROCESS").notNull(),
  payment: paymentStatus("payment").default("PAID"),
  totalPrice: d.numeric({ precision: 15, scale: 0 }).notNull(),
  method: d.varchar({ length: 255 }),
  userId: d
    .varchar({ length: 255 })
    .references(() => users.id, { onDelete: "set null" }),
  serviceId: d
    .varchar({ length: 255 })
    .references(() => service.id, { onDelete: "set null" }),
  createdAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(users, {
    fields: [order.userId],
    references: [users.id],
  }),
  service: one(service, {
    fields: [order.serviceId],
    references: [service.id],
  }),
  products: many(productToOrder),
}));

export const productToOrder = createTable(
  "productToOrder",
  (d) => ({
    productId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    orderId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.productId, t.orderId] })],
);

export const productToOrderRelations = relations(productToOrder, ({ one }) => ({
  product: one(product, {
    fields: [productToOrder.productId],
    references: [product.id],
  }),
  order: one(order, {
    fields: [productToOrder.orderId],
    references: [order.id],
  }),
}));
