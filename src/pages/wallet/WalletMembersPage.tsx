import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletMembersQuery from '@/queries/useWalletMembersQuery'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader } from '@/ui'

export default function WalletMembersPage() {
  const walletId = useWalletId()
  const members = useWalletMembersQuery(walletId)
  const walletQuery = useWalletQuery(walletId)
  const isOwner = walletQuery.data?.role === 'owner'
  return (
    <div>
      <PageHeader
        title="Wallet Members"
        actions={isOwner && <Button>Add member</Button>}
      ></PageHeader>
      {members.isPending ? (
        <div className="flex justify-center py-16">
          <Spinner size="md" />
        </div>
      ) : members.isError ? (
        <div className="py-16">
          <EmptyState
            title="Couldn't load members"
            description={members.error instanceof Error ? members.error.message : 'Unknown error'}
            action={
              <Button variant="secondary" onClick={() => members.refetch()}>
                Try again
              </Button>
            }
          />
        </div>
      ) : !members.data || members.data.length === 0 ? (
        <div className="py-16">
          <EmptyState
            title="No members yet"
            action={
              isOwner && (
                <Button variant="secondary" onClick={() => members.refetch()}>
                  Add member
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-2 p-6">
          {members.data.map((m) => (
            <div key={m.user_id}>
              {m.email}{' '}
              <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                {m.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
