export const queryKeys = {
  me: ['me'] as const,

  wallets: {
    all: ['wallets'] as const,
    byId: (walletId: string) => ['wallets', walletId] as const,
    members: {
      all: (walletId: string) => ['wallets', walletId, 'members'] as const,
    },
  },
} as const
