import { defineConfig } from "tsup";

export default defineConfig({
    clean: true,
    outDir: 'bundle',
    entry: [ 'src/index.ts' ],
    dts: true,
    format: [ 'cjs', 'esm' ]
})
