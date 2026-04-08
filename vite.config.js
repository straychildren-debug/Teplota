import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
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
