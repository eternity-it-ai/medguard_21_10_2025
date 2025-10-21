import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
        strictPort: true,
        host: true,                // מאפשר חיבורים מבחוץ
        // אפשר לאפשר כל ngrok domain זמני:
        allowedHosts: ['.ngrok-free.app'],
    },
});
