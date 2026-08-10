import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const stickersDir = path.join(rootDir, 'public', 'stickers')

/**
 * Membaca senarai fail dalam public/stickers/ secara automatik.
 *
 * Dengan ini anda hanya perlu letak (atau buang) fail gambar dalam folder itu —
 * tiada kod perlu disunting. Senarai disediakan melalui modul 'virtual:stickers'.
 */
function stickerListPlugin() {
  const virtualId = 'virtual:stickers'
  const resolvedId = '\0' + virtualId

  const readStickers = () => {
    if (!fs.existsSync(stickersDir)) return []
    return fs
      .readdirSync(stickersDir)
      .filter((file) => /\.(png|jpe?g|webp|gif)$/i.test(file))
      // Susunan mengikut nombor, bukan abjad — supaya 2 datang sebelum 10
      .sort((a, b) => a.localeCompare(b, 'en', { numeric: true, sensitivity: 'base' }))
      // Nama fail mungkin mengandungi ruang — perlu dikodkan untuk URL
      .map((file) => `/stickers/${encodeURIComponent(file)}`)
  }

  return {
    name: 'senarai-sticker',

    resolveId(id) {
      return id === virtualId ? resolvedId : null
    },

    load(id) {
      if (id !== resolvedId) return null
      return `export default ${JSON.stringify(readStickers())}`
    },

    configureServer(server) {
      // Muat semula pelayar apabila sticker ditambah atau dibuang
      server.watcher.add(stickersDir)

      const refresh = (file) => {
        if (!file.startsWith(stickersDir)) return
        const mod = server.moduleGraph.getModuleById(resolvedId)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }

      server.watcher.on('add', refresh)
      server.watcher.on('unlink', refresh)
    },
  }
}

export default defineConfig({
  plugins: [react(), stickerListPlugin()],
})
