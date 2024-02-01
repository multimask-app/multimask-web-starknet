import { useLocalStorage } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { Contract, stark } from 'starknet'

import { ETH_ADDRESS, provider, STORAGE_PREFIX } from '@/constants'
import { Wallet } from '@/contexts/models/wallet'
import { inSequence } from '@/utils/promise'
import { getAccountAddress } from '@/utils/starknet'

import { AppContext } from './common'

export function AppContextProvider({ children }: any) {
  const [pks, setPks] = useLocalStorage<string[]>({ key: `${STORAGE_PREFIX}.pks`, defaultValue: [] })
  const [selection, setSelection] = useLocalStorage<string[]>({ key: `${STORAGE_PREFIX}.selection`, defaultValue: [] })

  const generateWallets = useCallback(
    (count: number) => {
      const newPks = [...pks]
      for (let i = 1; i <= count; i++) {
        const privateKey = stark.randomAddress()
        newPks.push(privateKey)
      }
      setPks(newPks)
    },
    [pks, setPks]
  )

  useEffect(() => {
    if (!localStorage.getItem(`${STORAGE_PREFIX}.pks`)) {
      generateWallets(3)
    }
  })

  const [balances, setBalances] = useState<{ [account: string]: bigint }>({})
  const wallets: Wallet[] = useMemo(() => {
    return pks.map((privateKey, index) => ({
      id: index + 1,
      address: getAccountAddress(privateKey),
      pk: privateKey,
    }))
  }, [pks])

  useEffect(() => {
    updateBalances(wallets, setBalances).catch(console.error)
  }, [wallets])

  return (
    <AppContext.Provider
      value={{
        wallets: useMemo(
          () =>
            wallets.map((wallet) => {
              return { ...wallet, balance: balances[wallet.address] }
            }),
          [balances, wallets]
        ),
        selection,
        setSelection,
        generateWallets,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

async function updateBalances(wallets: Wallet[], setBalances: (balances: { [account: string]: bigint }) => void) {
  const { abi } = await provider.getClassAt(ETH_ADDRESS)
  const result = await inSequence(
    wallets.map(async (wallet) => {
      if (abi !== undefined) {
        const contract = new Contract(abi, ETH_ADDRESS, provider)
        let balance: bigint | undefined = undefined
        try {
          balance = await contract.balanceOf(wallet.address)
        } catch (e: any) {
          notifications.show({
            color: 'red',
            title: 'Load balance failed',
            message: e.message,
          })
        }
        return { address: wallet.address, balance: balance }
      }
    })
  )
  const balances: { [account: string]: bigint } = {}
  result.forEach((i) => {
    if (i !== undefined && i.balance) {
      balances[i.address] = i.balance
    }
  })
  setBalances(balances)
}
