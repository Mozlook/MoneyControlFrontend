import { useWalletId } from '@/features/wallets/hooks/useWalletId'
import useWalletMembersQuery from '@/queries/useWalletMembersQuery'
import useWalletQuery from '@/queries/useWalletQuery'
import { Spinner, EmptyState, Button, PageHeader } from '@/ui'
import AddMemberModal from '@/features/walletMembers/components/AddMemberModal'
import { useState } from 'react'
import WalletMemberListItem from '@/features/walletMembers/components/WalletMemberListItem'

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
            <Button
              variant="primary"
              className="w-full sm:w-auto"
              onClick={() => setIsAddOpen(true)}
            >
              Add member
            </Button>
          )
        }
      />

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
        <div className="mt-2 space-y-2">
          {members.data.map((m) => (
            <WalletMemberListItem key={m.user_id} member={m} />
          ))}
        </div>
      )}
    </div>
  )
}
