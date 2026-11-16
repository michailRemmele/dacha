import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT_TYPES = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

/**
 * Serves the local `media/` copy at `/media` while `astro dev` is running.
 *
 * @returns {import('vite').Plugin}
 */
export const serveLocalMedia = () => {
  const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../media',
  );

  return {
    name: 'serve-local-media',
    apply: 'serve',

    configureServer(server) {
      if (process.env.MEDIA_BASE_URL) {
        server.config.logger.info(
          '[media] MEDIA_BASE_URL is set, not serving the local copy',
        );
        return;
      }

      if (!fs.existsSync(root)) {
        server.config.logger.warn(
          `[media] ${root} not found, video will 404. Run "npm run docs:media:pull".`,
        );
        return;
      }

      server.middlewares.use('/media', (req, res, next) => {
        const requested = decodeURIComponent((req.url ?? '/').split('?')[0]);
        const file = path.join(root, requested);

        // Keep a crafted path from reaching outside the media directory.
        if (!file.startsWith(root + path.sep)) {
          res.statusCode = 403;
          res.end('Forbidden');
          return;
        }

        let stat;
        try {
          stat = fs.statSync(file);
        } catch {
          next();
          return;
        }

        if (!stat.isFile()) {
          next();
          return;
        }

        const type =
          CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream';
        const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');

        // Video needs byte ranges, or the browser cannot seek.
        if (range) {
          const start = range[1] ? Number(range[1]) : 0;
          const end = range[2] ? Number(range[2]) : stat.size - 1;

          if (start <= end && end < stat.size) {
            res.writeHead(206, {
              'Content-Type': type,
              'Content-Length': end - start + 1,
              'Content-Range': `bytes ${start}-${end}/${stat.size}`,
              'Accept-Ranges': 'bytes',
            });
            fs.createReadStream(file, { start, end }).pipe(res);
            return;
          }
        }

        res.writeHead(200, {
          'Content-Type': type,
          'Content-Length': stat.size,
          'Accept-Ranges': 'bytes',
        });
        fs.createReadStream(file).pipe(res);
      });

      server.config.logger.info(`[media] serving ${root} at /media`);
    },
  };
};
