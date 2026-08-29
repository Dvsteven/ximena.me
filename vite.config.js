import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      workbox: {
        // El service worker no debe meterse con las funciones serverless
        // (notas y vales) ni servirles el index.html cacheado.
        navigateFallbackDenylist: [/^\/\.netlify\//],
      },
      manifest: {
        name: 'Ximena & Steven',
        short_name: 'Nosotros',
        description: 'Un rincón solo para nosotros.',
        theme_color: '#A2314A',
        background_color: '#FBF1EC',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
