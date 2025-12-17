import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Réussite France Citoyen',
    short_name: 'RFC',
    description: "Préparation à l'entretien de naturalisation française",
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0055A4',
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
