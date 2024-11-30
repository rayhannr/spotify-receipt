import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

const availableEnvVars = ['CLIENT_ID', 'REDIRECT_URI', 'BACKEND_BASE_URL']

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const processEnv: Record<string, any> = {}
  availableEnvVars.forEach((key) => (processEnv[key] = env[key]))

  return {
    define: {
      'process.env': processEnv,
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
    },
  }
})
