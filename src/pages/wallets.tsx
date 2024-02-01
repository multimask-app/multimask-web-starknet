import { Button, Divider, NavLink, ScrollArea, Select, TextInput, useCombobox } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconFileCode, IconFilePlus, IconWallet } from '@tabler/icons-react'
import { cloneElement } from 'react'
import { useLocation } from 'react-router-dom'
import { Contract } from 'starknet'

import Wallets from '@/components/Wallets'
import { provider } from '@/constants'
import { useAppContext } from '@/contexts/common'

const actions = [
  { value: '', icon: <IconWallet size="1.2rem" stroke={1.5} />, label: 'Wallets' },
  { value: 'generate', icon: <IconFilePlus size="1.2rem" stroke={1.5} />, label: 'Generate' },
  // { value: 'balance', icon: <IconReportMoney size="1.2rem" stroke={1.5} />, label: 'Balance' },
  { value: 'contract', icon: <IconFileCode size="1.2rem" stroke={1.5} />, label: 'Contract Read' },
  // { value: 'delete', icon: <IconFileMinus size="1.2rem" stroke={1.5} />, label: 'Delete' },
  // { value: 'recycle', icon: <IconRecycle size="1.2rem" stroke={1.5} />, label: 'Recycle' },
]

export default function () {
  const { hash } = useLocation()
  const { generateWallets, wallets, selection } = useAppContext()
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  })

  const [method, setMethod] = useState<string>()

  const form = useForm({
    initialValues: {
      email: '',
    },
  })

  const hashValue = hash.slice(1)
  const { label: actionName, icon: actionIcon } = actions.find((i) => i.value === hashValue) ?? actions[0]

  const [rows, setRows] = useState<any[]>()

  const onClickQuery = useCallback(async () => {
    const testAddress = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
    const { abi } = await provider.getClassAt(testAddress)
    const results = await Promise.all(
      wallets.map(async (wallet) => {
        if (abi !== undefined) {
          const contract = new Contract(abi, testAddress, provider)
          return method === 'balanceOf' ? contract.balanceOf(wallet.address) : contract.decimals()
        }
      })
    )
    console.log(results)
    setRows(results)
  }, [method, wallets])

  const action = useMemo(() => {
    switch (hashValue) {
      case '':
        return (
          <div className="text-sm">
            Selected: {selection.length} of {wallets.length}
          </div>
        )
      case 'balance':
        return <Button>Refresh</Button>
      case 'generate':
        return (
          <form className="flex items-end gap-x-2" onSubmit={form.onSubmit((values: any) => console.log(values))}>
            <TextInput className="!hidden flex-center gap-x-1" label="Count" {...form.getInputProps('email')} />
            <div className="flex-center">
              <Button className="w-40" type="submit" onClick={() => generateWallets(1)}>
                Generate
              </Button>
            </div>
          </form>
        )
      case 'contract':
        return (
          <div>
            <form className="flex items-end gap-x-2" onSubmit={form.onSubmit((values: any) => console.log(values))}>
              <Select className="flex-center gap-x-1" label="Contract" value={'ETH Testnet'} data={['ETH Testnet']} />
              <Select
                className="flex-center gap-x-1"
                label="Method"
                value={method}
                data={['decimals', 'balanceOf']}
                onChange={(e) => {
                  setRows(undefined)
                  setMethod(e ?? '')
                }}
              />
              <div className="flex-center">
                <Button className="w-40" onClick={onClickQuery}>
                  Query
                </Button>
              </div>
            </form>
          </div>
        )
      case 'delete':
        return <Button color="red">Delete</Button>
    }
  }, [form, generateWallets, hashValue, method, onClickQuery, selection.length, wallets.length])

  return (
    <div className="flex items-start gap-x-6">
      <div className="bg-white border-l w-40 shadow rounded">
        {actions.map((i, index) => (
          <div key={i.value}>
            {[2, 4].includes(index) && <Divider />}
            <NavLink
              key={i.value}
              active={hashValue === i.value}
              href={`#${i.value}`}
              label={i.label}
              leftSection={i.icon}
            />
          </div>
        ))}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between h-8 mb-2">
          <div className="font-bold text-lg flex-center gap-x-1">
            {cloneElement(actionIcon, { size: '1.5rem', stroke: 2 })} {actionName}
          </div>
          <div>{action}</div>
        </div>
        <ScrollArea className="shadow bg-white rounded">
          <Wallets customCol={rows ? method : undefined} customRows={rows} />
        </ScrollArea>
      </div>
    </div>
  )
}
