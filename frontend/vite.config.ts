import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-icons', 'react-icons/fi', 'react-icons/fa', 'react-icons/ai', 'react-icons/md', 'react-icons/io5', 'react-icons/bs', 'lucide-react', '@headlessui/react', '@react-google-maps/api']
  }
})
