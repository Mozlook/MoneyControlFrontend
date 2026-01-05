export type Id = string | number

const enc = (v: Id) => encodeURIComponent(String(v))

const wallet = (walletId: Id) => `/wallets/${enc(walletId)}`

export const routePaths = {
  auth: {
    login: () => `/login`,
  },

  settings: {
    root: () => `/settings`,
  },

  wallets: {
    list: () => `/wallets`,
    base: (walletId: Id) => wallet(walletId),
    transactions: (walletId: Id) => `${wallet(walletId)}/transactions`,
    categories: (walletId: Id) => `${wallet(walletId)}/categories`,
    products: (walletId: Id) => `${wallet(walletId)}/products`,
    recurring: (walletId: Id) => `${wallet(walletId)}/recurring`,
    members: (walletId: Id) => `${wallet(walletId)}/members`,
    dashboard: (walletId: Id) => `${wallet(walletId)}/dashboard`,
    history: (walletId: Id) => `${wallet(walletId)}/history`,
  },
} as const

export const routePatterns = {
  auth: {
    login: '/login',
  },
  settings: {
    root: '/settings',
  },
  wallets: {
    list: '/wallets',
    base: '/wallets/:walletId',
    transactions: '/wallets/:walletId/transactions',
    categories: '/wallets/:walletId/categories',
    products: '/wallets/:walletId/products',
    recurring: '/wallets/:walletId/recurring',
    members: '/wallets/:walletId/members',
    dashboard: '/wallets/:walletId/dashboard',
    history: '/wallets/:walletId/history',
  },
} as const
