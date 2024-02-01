import { createContext, Dispatch, SetStateAction } from 'react'

import { Wallet } from '@/contexts/models/wallet'

export interface IAppContext {
  wallets: Wallet[]
  generateWallets: (count: number) => void
  selection: string[]
  setSelection: Dispatch<SetStateAction<string[]>>
}

export const AppContext = createContext<IAppContext>(undefined as any)

export function useAppContext() {
  return useContext(AppContext)
}
