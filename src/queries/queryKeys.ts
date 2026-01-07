export const queryKeys = {
  me: ['me'] as const,

  wallets: {
    all: ['wallets'] as const,
    byId: (walletId: string) => ['wallets', walletId] as const,
  },
} as const
