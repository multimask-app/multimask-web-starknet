import { Modal } from '@mantine/core'
import React from 'react'
import { useAccount } from 'wagmi'

import { ApplicationModal, useModal } from '@/store/modal'

import AccountDetails from './AccountDetails'
import ConnectWallet from './ConnectWallet'

export default function () {
  const { modal, closeModals } = useModal()
  const { address } = useAccount()

  return (
    <Modal
      title={address ? 'My Wallet' : 'Connect Wallet'}
      onClose={closeModals}
      opened={modal === ApplicationModal.WALLET}
    >
      {address ? <AccountDetails /> : <ConnectWallet />}
    </Modal>
  )
}
