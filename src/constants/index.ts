import { RpcProvider } from 'starknet'

export const ENV = import.meta.env.NODE_ENV || 'development'
export const CHAIN = import.meta.env.CHAIN || 'SN_GOERLI'
export const STORAGE_PREFIX = `multimask.${ENV}.${CHAIN}`

export const provider = new RpcProvider({
  nodeUrl: 'https://starknet-goerli.infura.io/v3/b9533891a07248a18989492623ac92d8',
})

export const ACCOUNT_CLASS_HASH = '0x01a736d6ed154502257f02b1ccdf4d9d1089f80811cd6acad48e6b6a9d1f2003'
export const ETH_ADDRESS = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'
