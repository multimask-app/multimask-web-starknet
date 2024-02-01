import { atom, useAtom } from 'jotai'
import { useCallback } from 'react'

export enum ApplicationModal {
  WALLET,
}

const modalState = atom<ApplicationModal | undefined>(undefined)

export function useModal() {
  const [modal, setModal] = useAtom(modalState)

  const openModal = useCallback(
    (modal: ApplicationModal) => {
      setModal(modal)
    },
    [setModal]
  )
  const closeModals = useCallback(() => {
    setModal(undefined)
  }, [setModal])
  return {
    modal,
    openModal,
    closeModals,
  }
}
