import { defineConfig } from 'vite'
import path from 'path'
import { createReadStream } from 'fs'
import { promises as fs } from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'



function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function serveGlbFilesPlugin() {
  return {
    name: 'serve-glb-files',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/glb_files/')) {
          return next()
        }

        const filePath = path.join(__dirname, req.url)
        if (!filePath.startsWith(path.join(__dirname, 'glb_files'))) {
          return next()
        }

        try {
          const stat = await fs.stat(filePath)
          if (!stat.isFile()) return next()
          res.setHeader('Content-Type', 'model/gltf-binary')
          res.setHeader('Content-Length', String(stat.size))
          if (req.method === 'HEAD') return res.end()
          createReadStream(filePath).pipe(res)
        } catch {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  base: '/portfolio/',
  define: {
    'import.meta.env.VITE_VERCEL_ANALYTICS_ENABLED': JSON.stringify(process.env.VERCEL === '1'),
  },
  plugins: [
    // figmaAssetResolver(), // 필요시 유지
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
