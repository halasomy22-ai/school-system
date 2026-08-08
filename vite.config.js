import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild', // 💡 إجبار المجمع على استخدام المحزم الكلاسيكي المستقر وتخطي خطأ rolldown تماماً
    sourcemap: false,
    reportCompressedSize: false
  }
});
