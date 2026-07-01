import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// El "base" debe coincidir con el nombre del repositorio en GitHub Pages
// para que las rutas de los assets se resuelvan correctamente.
export default defineConfig({
  base: '/bdg/',
  plugins: [react(), tailwindcss()],
})
