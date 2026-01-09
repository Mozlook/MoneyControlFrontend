import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletMembersQuery from '@/queries/useWalletMembersQuery'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader } from '@/ui'
import AddMemberModal from '@/features/walletMembers/components/AddMemberModal'
import { useState } from 'react'

export default function WalletMembersPage() {
  const walletId = useWalletId()
  const members = useWalletMembersQuery(walletId)
  const walletQuery = useWalletQuery(walletId)
  const isOwner = walletQuery.data?.role === 'owner'
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  return (
    <div>
      <PageHeader
        title="Wallet Members"
        actions={
          isOwner && (
            <Button variant="primary" onClick={() => setIsAddOpen(true)}>
              Add member
            </Button>
          )
        }
      ></PageHeader>
      <AddMemberModal walletId={walletId} open={isAddOpen} onOpenChange={setIsAddOpen} />
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
                <Button variant="primary" onClick={() => setIsAddOpen(true)}>
                  Add member
                </Button>
              )
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
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
