import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig(({ command }) => {
    if (command === 'build') {
        return {
            build: {
                lib: {
                    entry: path.resolve(__dirname, 'lib/index.ts'),
                    formats: ['es']
                },
                copyPublicDir: false,
            }
        };
    }

    return {};
});