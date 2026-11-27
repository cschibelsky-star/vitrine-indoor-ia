import { build } from 'vite';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Build a classic script so Android can load the packaged page without an HTTP server.
const outDir = resolve(process.argv[2]);
await build({
  configFile: false,
  publicDir: false,
  build: {
    outDir, emptyOutDir: true, target: 'chrome80',
    lib: { entry: resolve('src/main.ts'), name: 'IndoorPlayer', formats: ['iife'],
      fileName: () => 'player.js', cssFileName: 'player' }
  }
});
const page = await readFile('index.html', 'utf8');
const script = '<script type="module" src="/src/main.ts"></script>';
const video = '<video id="localVideo"';
if (!page.includes(script) || !page.includes(video)) throw Error('Entradas do player não encontradas');
await writeFile(resolve(outDir, 'index.html'), page
  .replace('</head>', '<link rel="stylesheet" href="player.css"></head>')
  .replace(video, video + ' src="intro_vitrine.mp4"')
  .replace(script, '<script src="player.js"></script>'));
await copyFile('public/intro_vitrine.mp4', resolve(outDir, 'intro_vitrine.mp4'));
