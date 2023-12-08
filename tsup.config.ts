import { defineConfig } from "tsup";

export default defineConfig({
    clean: true,
    outDir: 'bundle',
    // publicDir: 'static',
    entry: {
        index: 'src/index.ts',
        cellar: 'cellar/cellar.ts',
    },
    dts: true,
    format: [ 'cjs', 'esm' ],
})
