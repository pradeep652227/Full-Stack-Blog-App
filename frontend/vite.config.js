import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig ({
  server:{
    // proxy:{
    //   '/post-signup':'http://localhost:3000',
    //   '/post-login':'http://localhost:3000',
    //   '/create-post-server':'http://localhost:3000',
    //   '/api/public-posts':'http://localhost:3000'
    // }
    proxy:{
      '/post-signup':'https://blog-app-backend-pradeep-gaurs-projects.vercel.app/',
      '/post-login':'https://blog-app-backend-pradeep-gaurs-projects.vercel.app/',
      '/create-post-server':'https://blog-app-backend-pradeep-gaurs-projects.vercel.app/',
      '/api/public-posts':'https://blog-app-backend-pradeep-gaurs-projects.vercel.app/'
    }
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
