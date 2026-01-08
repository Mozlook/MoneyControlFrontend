import { Navigate } from 'react-router-dom'
import { routePaths } from '@/routes/routePaths'
import { useParams } from 'react-router-dom'
import WalletLayoutInner from './components/WalletLayoutInner'
export default function WalletLayout() {
  const { walletId } = useParams<{ walletId: string }>()

  if (!walletId) {
    return <Navigate to={routePaths.wallets.list()} replace />
  }

  return <WalletLayoutInner walletId={walletId} />
}
