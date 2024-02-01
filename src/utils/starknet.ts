import { CallData, ec, hash } from 'starknet'

import { ACCOUNT_CLASS_HASH } from '@/constants'

export function getAccountAddress(privateKey: string) {
  const starkKeyPub = ec.starkCurve.getStarkKey(privateKey)
  return hash.calculateContractAddressFromHash(
    starkKeyPub,
    ACCOUNT_CLASS_HASH,
    CallData.compile({ signer: starkKeyPub, guardian: '0' }),
    0
  )
}
