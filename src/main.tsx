import { createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { arbitrum, arbitrumGoerli, bsc, bscTestnet, goerli, mainnet, polygon } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'

import { AppContextProvider } from '@/contexts/provider'

import App from './App'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@unocss/reset/normalize.css'
import 'uno.css'
import './assets/styles/index.css'

console.table(import.meta.env)

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [arbitrum, arbitrumGoerli, bsc, bscTestnet, mainnet, polygon, goerli],
  [publicProvider()]
)

const config = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
  webSocketPublicClient,
})

const theme = createTheme({
  // primaryColor: '#234977',
})

const root = createRoot(document.getElementById('root')!)
root.render(
  <WagmiConfig config={config}>
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <AppContextProvider>
          <App />
          <Notifications />
        </AppContextProvider>
      </MantineProvider>
    </BrowserRouter>
  </WagmiConfig>
)
