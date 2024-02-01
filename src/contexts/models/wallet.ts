import { BigNumberish } from 'ethers'

export interface Wallet {
  id: number
  address: string
  pk: string
  balance?: BigNumberish | null
}
