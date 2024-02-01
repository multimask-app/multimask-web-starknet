import { Button } from '@mantine/core'
import {
  IconArrowBarToRight,
  IconArrowsJoin,
  IconArrowsSplit,
  IconAutomaticGearbox,
  IconWallet,
} from '@tabler/icons-react'
import { useCallback } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { useAppContext } from '@/contexts/common'

import LogoImg from '../../assets/icons/logo.svg'
import ChainImg from '../../assets/icons/starknet.svg'

const links = [
  { link: '/transfer/distribute', label: 'Distribute', icon: <IconArrowsSplit size={20} /> },
  { link: '/transfer/consolidate', label: 'Consolidate', icon: <IconArrowsJoin size={20} /> },
  { link: '/contract/write', label: 'Smart Contract', icon: <IconArrowBarToRight size={20} /> },
  { link: '/flow', label: 'Auto Flow', icon: <IconAutomaticGearbox size={20} /> },
]

export default function HeaderMenu() {
  const nav = useNavigate()
  const { pathname } = useLocation()
  const onClickWallets = useCallback(() => {
    nav('/wallets')
  }, [nav])
  const { wallets, selection } = useAppContext()

  return (
    <div className="bg-[--mantine-color-body] shadow-sm">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-row justify-between items-center">
          <NavLink to="/" className="mr-8 flex-center">
            <img src={LogoImg} alt="" className="h-8" />
          </NavLink>
          <div className="flex-1 flex items-center gap-x-8">
            {links.map((link) => (
              <NavLink
                key={link.label}
                to={link.link}
                className={`flex-center gap-x-1 leading-none py-2 px-3 my-2 rounded no-underline text-sm font-medium hover:bg-[--mantine-color-gray-0] ${
                  pathname === link.link ? '!text-[#228be6]' : 'text-gray-700'
                }`}
              >
                {link.icon}
                {link.label}
              </NavLink>
            ))}
          </div>
          <img src={ChainImg} alt="" className="h-6 mr-2" />
          <Button onClick={onClickWallets} className="flex-center gap-x-1" variant="light">
            <IconWallet size={20} />
            <span>
              Wallets ({selection.length}/{wallets.length})
            </span>
          </Button>
        </header>
      </div>
    </div>
  )
}
