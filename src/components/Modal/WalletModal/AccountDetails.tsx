import { shorten } from '@did-network/dapp-sdk'
import { useCallback } from 'react'
import { useAccount, useChainId, useDisconnect } from 'wagmi'

import { useCopyToClipboard } from '@/hooks/useCopy'
import { useModal } from '@/store/modal'

export default function Index() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { disconnect } = useDisconnect()
  const [isCopied, setCopied] = useCopyToClipboard()
  const { closeModals } = useModal()

  const onDisconnect = useCallback(() => {
    closeModals()
    disconnect()
  }, [disconnect, closeModals])

  if (!address || !chainId) {
    return null
  }

  return (
    <div className="text-sm">
      <div className="p-4 border border-divide rounded">
        <div className="flex flex-row justify-between items-center">
          <div className="opacity-60">Connected</div>
          <div onClick={onDisconnect} className="relative rounded pl-8 text-red cursor-pointer">
            <div className="z-10 relative">Disconnect</div>
          </div>
        </div>
        <div className="pt-2 pb-4 text-xl flex flex-row justify-start items-center">
          <div className="font-bold">{shorten(address, 8, 8)}</div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div onClick={() => setCopied(address)} className="cursor-pointer">
            <div className="flex flex-row justify-between items-center hover:underline">
              {/* {isCopied ? <CheckOutlined size={16} /> : <CopyOutlined size={16} />} */}
              <div className="pl-1">{isCopied ? 'Copied' : 'Copy Address'} </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
