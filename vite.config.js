import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// ── Build-time pre-render ─────────────────────────────────────────────────────
// Bakes the current CMS snapshot (cms-data.json) into the static index.html so
// the first paint already shows real content. cms.js still hydrates from live
// Sanity afterwards, but the values match, so there is no flash of stale text.
function accentTitle(text) {
  return String(text).replace(/\*([^*]+)\*/g, '<span class="text-[#f36e21]">$1</span>');
}
function escapeText(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function prerenderCms() {
  return {
    name: 'teplota-prerender-cms',
    transformIndexHtml(html) {
      let data;
      try {
        data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'cms-data.json'), 'utf8'));
      } catch {
        return html; // no snapshot → leave placeholders untouched
      }
      const h = data.hero || {}, a = data.about || {}, hd = data.header || {};
      // [id, tagName, value] — value is inserted as innerHTML (matches cms.js)
      const targets = [
        h.title            && ['hero-title', 'h1', accentTitle(h.title).replace(/\n/g, '<br/>')],
        h.subtitle         && ['hero-subtitle', 'p', escapeText(h.subtitle).replace(/\n/g, '<br/>')],
        h.btnText          && ['hero-btn', 'a', escapeText(h.btnText)],
        h.secondaryBtnText && ['hero-btn-secondary', 'a', escapeText(h.secondaryBtnText)],
        a.label            && ['about-label', 'p', escapeText(a.label)],
        a.title            && ['about-title', 'h2', escapeText(a.title)],
        a.text1            && ['about-text1', 'div', escapeText(a.text1)],
        a.text2            && ['about-text2', 'div', a.text2],
        hd.phone           && ['header-phone-val', 'a', escapeText(hd.phone)],
        hd.btnText         && ['header-cta-btn', 'a', escapeText(hd.btnText)],
      ].filter(Boolean);
      for (const [id, tag, value] of targets) {
        const re = new RegExp(`(<${tag}\\b[^>]*\\bid="${id}"[^>]*>)[\\s\\S]*?(</${tag}>)`);
        html = html.replace(re, `$1${value}$2`);
      }
      return html;
    },
  };
}

export default defineConfig({
  plugins: [prerenderCms()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 5173,
    // Add a simple API middleware to handle CMS saving
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/save') {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              // Save to cms-data.json
              fs.writeFileSync(
                path.resolve(__dirname, 'cms-data.json'),
                JSON.stringify(data, null, 2)
              );
              console.log('CMS: Saved data to cms-data.json');
              res.statusCode = 200;
              res.end('OK');
            } catch (err) {
              console.error('CMS Save Error:', err);
              res.statusCode = 500;
              res.end('Error');
            }
          });
        } else {
          next();
        }
      });
    }
  }
});
