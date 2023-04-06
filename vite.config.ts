import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
			},
		},
	},
  resolve: {
    alias: [
        {
          find: /^~/,
          replacement: "",
        },
        { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
	build: {
		assetsDir: "static/img/",
		rollupOptions: {
			output: {
				chunkFileNames: "static/js/[name].[hash].chunk.js",
				entryFileNames: "static/js/[name].[hash].js",
				assetFileNames: "static/[ext]/[name].[hash].[ext]",
			},
		},
		minify: "terser",
		terserOptions: {
			compress: {
				// drop_console: true, // 删除所有的console.*
				drop_debugger: true, // 删除所有的debugger
				pure_funcs: ["console.log"], // 删除所有的console.log
			},
		},
	},
	// 代理
	server: {
		host: true,
		// 默认是 3000 端口
		port: 9120,
		// 不默认打开浏览器
		open: false,
		proxy: {
		  '/v1/': {
			target: 'https://api.openai.com',
			changeOrigin: true,
			rewrite: (path) => path.replace(/^\v1/, '')
		  },
		}
	},
})
