import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateData } from './lib/model.mjs';
import { renderHtml } from './lib/render.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (file) => JSON.parse(await fs.readFile(path.join(ROOT, file), 'utf8'));

export async function build({ now = new Date() } = {}) {
  const [eventsData, contentData, photosData, site] = await Promise.all([
    'data/events.json',
    'data/content.json',
    'data/photos.json',
    'data/site.json'
  ].map(readJson));

  validateData({ eventsData, contentData, photosData, site });
  const html = renderHtml({ eventsData, contentData, photosData, site, now });
  if (html.includes('href="#"')) throw new Error('空のリンクは生成できません');

  await fs.mkdir(path.join(ROOT, 'dist/assets'), { recursive: true });
  await fs.writeFile(path.join(ROOT, 'index.html'), html);
  await fs.writeFile(
    path.join(ROOT, 'dist/index.html'),
    html
      .replace('href="css/style.css"', 'href="assets/style.css"')
      .replace('src="js/app.js"', 'src="assets/app.js"')
  );
  await fs.copyFile(path.join(ROOT, 'css/style.css'), path.join(ROOT, 'dist/assets/style.css'));
  await fs.copyFile(path.join(ROOT, 'js/app.js'), path.join(ROOT, 'dist/assets/app.js'));
  return { html, publishMode: site.publishMode };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await build();
  console.log(`Built (${result.publishMode})`);
}
