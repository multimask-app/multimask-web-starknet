import { formatAmount } from '@did-network/dapp-sdk'
import { Button, Paper, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconArrowBigRightLines } from '@tabler/icons-react'
import BigNumber from 'bignumber.js'
import { Account, cairo, CallData, Contract } from 'starknet'

import Wallets from '@/components/Wallets'
import { ETH_ADDRESS, provider } from '@/constants'
import { useAppContext } from '@/contexts/common'
import { getAccountAddress } from '@/utils/starknet'

export default function () {
  const { wallets } = useAppContext()
  const [pk, setPk] = useState('')
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState<bigint>()

  const onLoad = useCallback(async () => {
    try {
      setLoading(true)
      const { abi } = await provider.getClassAt(ETH_ADDRESS)
      const contract = new Contract(abi, ETH_ADDRESS, provider)
      const address = getAccountAddress(pk)
      setAddress(address)
      const balance = await contract.balanceOf(address)
      setBalance(balance)
    } catch (e: any) {
      notifications.show({
        color: 'red',
        title: 'Load balance failed',
        message: e.message,
      })
    } finally {
      setLoading(false)
    }
  }, [pk])

  const onSubmit = useCallback(async () => {
    setLoading(true)
    const { abi } = await provider.getClassAt(ETH_ADDRESS)
    const account = new Account(provider, address, pk)
    const contract = new Contract(abi, ETH_ADDRESS, provider)
    contract.connect(account)
    for (let wallet of wallets) {
      try {
        const result = await account.execute({
          contractAddress: ETH_ADDRESS,
          entrypoint: 'transfer',
          calldata: CallData.compile({
            recipient: wallet.address,
            amount: cairo.uint256(new BigNumber(amount).times(1e18).toFixed(0)),
          }),
        })
        await provider.waitForTransaction(result.transaction_hash)
      } catch (e: any) {
        console.error(e)
        notifications.show({
          color: 'red',
          title: 'Distribute failed',
          message: e.message,
        })
      }
    }
    setLoading(false)
  }, [address, amount, pk, wallets])

  return (
    <div className="flex-center gap-x-6">
      <Paper className="flex-1 shadow-sm p-6">
        <TextInput
          value={pk}
          onChange={(e) => setPk(e.target.value)}
          className="mb-2"
          withAsterisk
          label="Sender Wallet Private Key"
          placeholder="Private Key"
        />
        <TextInput disabled value={address} className="mb-2" withAsterisk label="Account Address" />
        {address && (
          <TextInput
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-2"
            withAsterisk
            label="ETH Amount per wallet"
            placeholder="Amount"
          />
        )}

        <div className="flex-center">
          {balance !== undefined ? (
            <div className="mt-6 w-full">
              Balance: {formatAmount(balance, 18)} ETH
              <Button className="w-full" loading={loading} onClick={onSubmit}>
                Submit
              </Button>
            </div>
          ) : (
            <Button loading={loading} className="mt-10 w-full" onClick={onLoad} disabled={pk.length < 10}>
              Load Account
            </Button>
          )}
        </div>
      </Paper>
      <div>
        <IconArrowBigRightLines />
      </div>
      <Paper className="flex-1 shadow-sm p-6">
        <div className="text-lg mb-4 font-bold">Wallets</div>
        <Wallets readonly={true} />
      </Paper>
    </div>
  )
}
