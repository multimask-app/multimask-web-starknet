import { Button, Paper, Slider, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconArrowBigRightLines } from '@tabler/icons-react'
import BigNumber from 'bignumber.js'
import { Account, cairo, CallData, Contract } from 'starknet'

import Wallets from '@/components/Wallets'
import { ETH_ADDRESS, provider } from '@/constants'
import { useAppContext } from '@/contexts/common'

export default function () {
  const { wallets } = useAppContext()
  const [pct, setPct] = useState(1)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    setLoading(true)
    const { abi } = await provider.getClassAt(ETH_ADDRESS)
    try {
      for (let wallet of wallets) {
        if (!wallet.balance) {
          continue
        }
        const account = new Account(provider, wallet.address, wallet.pk)
        const contract = new Contract(abi, ETH_ADDRESS, provider)
        contract.connect(account)
        const result = await account.execute({
          contractAddress: ETH_ADDRESS,
          entrypoint: 'transfer',
          calldata: CallData.compile({
            recipient: address,
            amount: cairo.uint256(new BigNumber(wallet.balance.toString()).times(pct).times(1e18).toFixed(0)),
          }),
        })
        await provider.waitForTransaction(result.transaction_hash)
      }
    } catch (e: any) {
      console.error(e)
      notifications.show({
        color: 'red',
        title: 'Distribute failed',
        message: e.message,
      })
    }
    setLoading(false)
  }, [address, pct, wallets])

  return (
    <div className="flex-center gap-x-6">
      <Paper className="flex-1 shadow-sm p-6">
        <div className="text-lg mb-4 font-bold">Wallets</div>
        <Wallets readonly={true} />
      </Paper>
      <div>
        <IconArrowBigRightLines />
      </div>
      <Paper className="flex-1 shadow-sm p-6">
        <TextInput
          className="mb-2"
          withAsterisk
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          label="Receiver Wallet Address"
        />
        <div className="text-sm font-medium mb-1">Percentage</div>
        <Slider
          value={pct}
          onChange={setPct}
          color="blue"
          max={1}
          step={0.01}
          marks={[
            { value: 0.2, label: '20%' },
            { value: 0.5, label: '50%' },
            { value: 0.8, label: '80%' },
          ]}
        />

        <div className="flex-center">
          <Button
            loading={loading}
            className="mt-10 w-40"
            onClick={onSubmit}
            disabled={pct === 0 || address.length < 5}
          >
            Submit
          </Button>
        </div>
      </Paper>
    </div>
  )
}
