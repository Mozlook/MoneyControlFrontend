import type { WalletMemberRead } from '@/models/walletMember'
type WalletMemberListItemProps = {
  member: WalletMemberRead
}

export default function WalletMemberListItem({ member }: WalletMemberListItemProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-3 hover:bg-slate-50">
      <div className="min-w-0">
        <div className="truncate font-medium text-slate-900">{member.email}</div>
      </div>

      <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
        {member.role}
      </span>
    </div>
  )
}
