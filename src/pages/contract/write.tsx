import { Button, Paper, Select, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { Account, Contract } from 'starknet'

import Wallets from '@/components/Wallets'
import { provider } from '@/constants'
import { useAppContext } from '@/contexts/common'

export default function () {
  const { wallets } = useAppContext()
  const [param1, setParam1] = useState('10')
  const [param2, setParam2] = useState('30')
  const [loading, setLoading] = useState(false)

  const onSubmit = useCallback(async () => {
    setLoading(true)
    const testAddress = '0x5f7cd1fd465baff2ba9d2d1501ad0a2eb5337d9a885be319366b5205a414fdd'
    const { abi: testAbi } = await provider.getClassAt(testAddress)
    try {
      for (let wallet of wallets) {
        if (!wallet.balance) {
          continue
        }
        const account = new Account(provider, wallet.address, wallet.pk)
        const myTestContract = new Contract(testAbi, testAddress, provider)
        myTestContract.connect(account)
        const myCall = myTestContract.populate('increase_balance', [10, 30])
        const res = await myTestContract.increase_balance(myCall.calldata)
        await provider.waitForTransaction(res.transaction_hash)
        notifications.show({
          color: 'green',
          title: 'Contract write success',
          message: 'Contract write success: ' + wallet.address,
        })
      }
    } catch (e: any) {
      console.error(e)
      notifications.show({
        color: 'red',
        title: 'Contract write failed',
        message: e.message,
      })
    } finally {
      setLoading(false)
    }
  }, [wallets])

  return (
    <div className="flex-center gap-x-6">
      <Paper className="flex-1 shadow-sm p-6">
        <div className="text-lg mb-4 font-bold">Wallets</div>
        <Wallets readonly={true} />
      </Paper>
      <Paper className="flex-1 shadow-sm p-6">
        <Select
          className="flex-center gap-x-1 mb-2 justify-between"
          label="Contract"
          value={'Counter Test Contract'}
          data={['Counter Test Contract']}
        />
        <Select
          className="flex-center gap-x-1 mb-2 justify-between"
          label="Method"
          value="increase_balance"
          data={['increase_balance']}
        />
        <TextInput
          className="flex-center gap-x-1 mb-2 justify-between mb-2"
          value={param1}
          onChange={(e) => setParam1(e.target.value)}
          withAsterisk
          label="Amount1"
          placeholder="Amount"
        />
        <TextInput
          className="flex-center gap-x-1 mb-2 justify-between mb-2"
          value={param2}
          onChange={(e) => setParam2(e.target.value)}
          withAsterisk
          label="Amount2"
          placeholder="Amount"
        />
        <div className="flex-center">
          <Button className="mt-10 w-40" onClick={onSubmit} loading={loading}>
            Submit
          </Button>
        </div>
      </Paper>
    </div>
  )
}
