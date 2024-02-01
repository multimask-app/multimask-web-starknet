import { useAccount, useConnect } from 'wagmi'

import { useModal } from '@/store/modal'

export default function ConnectWallet() {
  const { connect, connectors, pendingConnector } = useConnect()
  const { isConnecting } = useAccount()
  const { modal, closeModals } = useModal()

  return (
    <div>
      {connectors.map((connector) => {
        return (
          <div
            className="mt-4 flex flex-row justify-start items-center py-4 px-4 cursor-pointer border border-divide rounded hover:text-primary hover:border-primary"
            key={connector.name}
            onClick={() => {
              connect({ connector })
              closeModals()
            }}
          >
            <div>
              {connector.name}
              {!connector.ready && ' (Unsupported)'}
              {isConnecting && connector.id === pendingConnector?.id && ' (Connecting)'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
