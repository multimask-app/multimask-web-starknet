import { formatAmount } from '@did-network/dapp-sdk'
import { Checkbox, rem, Table } from '@mantine/core'

import { useAppContext } from '@/contexts/common'

interface IParams {
  readonly?: boolean
  customCol?: string
  customRows?: string[]
}

export default function Wallets({ readonly = false, customCol, customRows }: IParams) {
  const { wallets, selection, setSelection } = useAppContext()
  const toggleRow = (id: string) =>
    setSelection((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  const toggleAll = () =>
    setSelection((current) => (current.length === wallets.length ? [] : wallets.map((i) => i.address)))

  const filteredWallets = useMemo(() => {
    if (readonly) {
      return wallets.filter((i) => selection.includes(i.address))
    }
    return wallets
  }, [readonly, selection, wallets])

  return (
    <Table verticalSpacing="sm">
      <Table.Thead className="bg-[--mantine-color-gray]">
        <Table.Tr>
          {!readonly && (
            <Table.Th style={{ width: rem(40) }}>
              <Checkbox
                onChange={toggleAll}
                checked={selection.length === wallets.length}
                indeterminate={selection.length > 0 && selection.length !== wallets.length}
              />
            </Table.Th>
          )}
          <Table.Th>ID</Table.Th>
          <Table.Th>Address</Table.Th>
          <Table.Th>{customCol ?? 'ETH Balance'}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {filteredWallets.map((i, index) => {
          const selected = selection.includes(i.address)
          const showSelected = selected && !readonly
          return (
            <Table.Tr key={i.address} className={showSelected ? 'bg-[--mantine-color-blue-light]' : ''}>
              {!readonly && (
                <Table.Td>
                  <Checkbox checked={selection.includes(i.address)} onChange={() => toggleRow(i.address)} />
                </Table.Td>
              )}
              <Table.Td>{i.id}</Table.Td>
              <Table.Td>{i.address}</Table.Td>
              <Table.Td>{customRows ? formatAmount(customRows[index], 0, 0) : formatAmount(i.balance, 18, 6)}</Table.Td>
            </Table.Tr>
          )
        })}
      </Table.Tbody>
    </Table>
  )
}
