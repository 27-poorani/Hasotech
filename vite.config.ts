import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.FIREBASE_API_KEY': JSON.stringify('AIzaSyAPk3bdlN2hUntjNzFBbFb0_uFSgNVD934'),
    'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify('airecruiterx.firebaseapp.com'),
    'process.env.FIREBASE_PROJECT_ID': JSON.stringify('airecruiterx'),
    'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify('airecruiterx.firebasestorage.app'),
    'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify('281888351289'),
    'process.env.FIREBASE_APP_ID': JSON.stringify('1:281888351289:web:3432a2e6e0f679599699e8'),
    'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify('G-5CEWZYF7DQ'),
  }
})
