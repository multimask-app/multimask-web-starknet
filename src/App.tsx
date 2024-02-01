import {
  IconArrowBarRight,
  IconArrowBarToRight,
  IconArrowsJoin,
  IconArrowsSplit,
  IconAutomaticGearbox,
} from '@tabler/icons-react'
import { useEffect } from 'react'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'

import routes from '~react-pages'

import Header from './components/Header'
import WalletModal from './components/Modal/WalletModal'

function Redirect({ to }: { to: string }) {
  let navigate = useNavigate()
  useEffect(() => {
    navigate(to)
  }, [navigate, to])
  return null
}

function App() {
  const { pathname } = useLocation()
  const title = useMemo(() => {
    switch (pathname) {
      case '/transfer/consolidate':
        return (
          <div className="flex items-center gap-x-1 text-2xl font-bold mb-4">
            <IconArrowsJoin size={32} /> Consolidate
          </div>
        )
      case '/transfer/distribute':
        return (
          <div className="flex items-center gap-x-1 text-2xl font-bold mb-4">
            <IconArrowsSplit size={32} /> Distribute
          </div>
        )
      case '/contract/read':
        return (
          <div className="flex items-center gap-x-1 text-2xl font-bold mb-4">
            <IconArrowBarRight size={32} /> Contract Read
          </div>
        )
      case '/contract/write':
        return (
          <div className="flex items-center gap-x-1 text-2xl font-bold mb-4">
            <IconArrowBarToRight size={32} /> Contract Write
          </div>
        )
      case '/flow':
        return (
          <div className="flex items-center gap-x-1 text-2xl font-bold mb-4">
            <IconAutomaticGearbox size={32} /> Auto Flow
          </div>
        )
      default:
        return null
    }
  }, [pathname])
  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl my-10">
        {title}
        {useRoutes([...routes, { path: '*', element: <Redirect to="/" /> }])}
      </div>
      <WalletModal />
    </>
  )
}

export default App
