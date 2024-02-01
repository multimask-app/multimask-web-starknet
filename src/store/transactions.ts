import { atom, useAtom } from 'jotai'
import { useCallback, useMemo } from 'react'

type TxStatus = 'pending' | 'success' | 'error'
const txsState = atom<{ [tx: string]: TxStatus }>({})

export function useTransactions() {
  const [txs, setTxs] = useAtom(txsState)
  return {
    pendingCount: useMemo(() => Object.values(txs).filter((i) => i === 'pending').length, [txs]),
    updateTransaction: useCallback(
      (hash: string, status: TxStatus = 'pending') => {
        if (txs[hash]) {
          const oldStatus = txs[hash]
          if (oldStatus !== status) {
            if (status === 'success') {
              // notification.success({ message: 'Transaction Succeeded' })
            }
            if (status === 'error') {
              // notification.error({ message: 'Transaction Failed' })
            }
          }
        }
        txs[hash] = status
        setTxs({ ...txs })
      },
      [setTxs, txs]
    ),
  }
}
