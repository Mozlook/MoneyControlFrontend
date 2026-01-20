export type Id = string | number

const enc = (v: Id) => encodeURIComponent(String(v))

const wallet = (walletId: Id) => `/wallets/${enc(walletId)}`

export const apiPaths = {
  auth: {
    google: () => `/auth/google`,
  },

  users: {
    me: () => `/users/me`,
    settings: () => `/users/me/settings`,
  },

  wallets: {
    getAll: () => `/wallets/`,
    create: () => `/wallets/`,
    getById: (walletId: Id) => wallet(walletId),

    members: {
      getAll: (walletId: Id) => `${wallet(walletId)}/members`,
      create: (walletId: Id) => `${wallet(walletId)}/members`,
    },

    categories: {
      getAll: (walletId: Id) => `${wallet(walletId)}/categories/`,
      getAllSum: (walletId: Id) => `${wallet(walletId)}/categories/with-sum/`,
      create: (walletId: Id) => `${wallet(walletId)}/categories/`,
      delete: (walletId: Id, categoryId: Id) => `${wallet(walletId)}/categories/${enc(categoryId)}`,
      hardDelete: (walletId: Id, categoryId: Id) =>
        `${wallet(walletId)}/categories/${enc(categoryId)}/hard`,
    },

    products: {
      getAll: (walletId: Id) => `${wallet(walletId)}/products/`,
      getAllSum: (walletId: Id) => `${wallet(walletId)}/products/with-sum/`,
      create: (walletId: Id) => `${wallet(walletId)}/products/`,
      delete: (walletId: Id, productId: Id) => `${wallet(walletId)}/products/${enc(productId)}`,
      hardDelete: (walletId: Id, productId: Id) =>
        `${wallet(walletId)}/products/${enc(productId)}/hard`,
    },

    transactions: {
      getAll: (walletId: Id) => `${wallet(walletId)}/transactions/`,
      create: (walletId: Id) => `${wallet(walletId)}/transactions/`,
      refund: (walletId: Id, transactionId: Id) =>
        `${wallet(walletId)}/transactions/${enc(transactionId)}/refund`,
      delete: (walletId: Id, transactionId: Id) =>
        `${wallet(walletId)}/transactions/${enc(transactionId)}`,
      export: (walletId: Id) => `${wallet(walletId)}/transactions/export`,
    },

    recurring: {
      getAll: (walletId: Id) => `${wallet(walletId)}/recurring/`,
      create: (walletId: Id) => `${wallet(walletId)}/recurring/`,
      update: (walletId: Id, recurringId: Id) =>
        `${wallet(walletId)}/recurring/${enc(recurringId)}`,
      delete: (walletId: Id, recurringId: Id) =>
        `${wallet(walletId)}/recurring/${enc(recurringId)}`,
      activate: (walletId: Id, recurringId: Id) =>
        `${wallet(walletId)}/recurring/${enc(recurringId)}/activate`,
      apply: (walletId: Id) => `${wallet(walletId)}/recurring/apply`,
    },

    summary: {
      categoriesProducts: (walletId: Id) => `${wallet(walletId)}/summary/categories-products`,
      byImportance: (walletId: Id) => `${wallet(walletId)}/summary/by-importance`,
    },

    history: {
      lastPeriods: (walletId: Id) => `${wallet(walletId)}/history/last-periods`,
    },
  },
} as const
