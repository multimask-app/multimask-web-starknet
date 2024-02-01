import { shorten } from '@did-network/dapp-sdk'
import { Button } from '@mantine/core'
import { useAccount } from 'wagmi'

import { ApplicationModal, useModal } from '@/store/modal'
import { useTransactions } from '@/store/transactions'

export default function () {
  const { address } = useAccount()
  const { openModal } = useModal()
  const { pendingCount } = useTransactions()

  if (address) {
    return (
      <Button
        className="border border-primary text-primary hover:bg-[#F4FAFF]"
        onClick={() => openModal(ApplicationModal.WALLET)}
      >
        {pendingCount > 0 ? (
          <div className="flex-center">
            <div className="mr-2">{pendingCount} Pending</div>
            {/*<Loadin size="small" spinning={true} indicator={<Spin />} />*/}
          </div>
        ) : (
          <div>{shorten(address)}</div>
        )}
      </Button>
    )
  }

  return (
    <Button onClick={() => openModal(ApplicationModal.WALLET)} style={{ color: 'white' }}>
      <div>Connect Wallet</div>
    </Button>
  )
}
