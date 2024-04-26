import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig ({
  envDir:"../",
  server:{
    proxy:{
      '/post-signup':'http://localhost:3000',
      '/post-login':'http://localhost:3000',
      '/server-create-post':'http://localhost:3000',
      '/update-post':'http://localhost:3000',
      '/api/posts/':'http://localhost:3000',
      '/api/delete-post/':'http://localhost:3000',
      '/api/delete-image/':'http://localhost:3000'
    }
    // proxy:{
    //   '/post-signup':'https://blog-app-backend-tau.vercel.app',
    //   '/post-login':'https://blog-app-backend-tau.vercel.app',
    //   '/create-post-server':'https://blog-app-backend-tau.vercel.app',
    //   '/api/public-posts':'https://blog-app-backend-tau.vercel.app'
    // }
  }
})
// vite.config.js
/*export default {
  proxy: {
    '/post-signup': {
      target: 'http://localhost:3000', // Assuming your backend server is running on port 3000
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/post-signup/, '')
    },
    // Add more proxy configurations if needed
  }
}*/
