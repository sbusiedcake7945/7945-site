const http = require("http");
const urlModule = require("url");

class siteclient {
  constructor() {
    this.routes = { GET: [], POST: [], DELETE: [], PULL: [] };
  }

  addRoute(method, path, handler) {
    this.routes[method].push({ path, handler });
  }

  get(path, handler) { this.addRoute("GET", path, handler); }
  post(path, handler) { this.addRoute("POST", path, handler); }
  delete(path, handler) { this.addRoute("DELETE", path, handler); }
  pull(path, handler) { this.addRoute("PULL", path, handler); }

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      const parsedUrl = urlModule.parse(req.url, true);
      const url = parsedUrl.pathname;
      req.query = parsedUrl.query;

      res.red = (location, time = 0) => {
        if (time > 0) setTimeout(() => { res.writeHead(302, { Location: location }); res.end(); }, time*1000);
        else { res.writeHead(302, { Location: location }); res.end(); }
      };
// 7945-site listen içindeki server.createServer kısmında, res objesi oluşturulduktan sonra ekle
res._title = ""; // varsayılan boş başlık
res.title = (str) => { res._title = str; };

// res.end wrap: eğer _title varsa otomatik <title> ekle
const originalEnd = res.end;
let ended = false;
res.end = function (data, ...args) {
  if (ended) return;
  ended = true;
  // Eğer data string ise ve _title doluysa HTML wrap yap
  if (typeof data === "string" && res._title) {
    data = `<style> body { background-color: #151515; color: #ffff }</style><html><head><title>${res._title}</title></head><body>${data}</body></html>`;
  }
  return originalEnd.call(this, data, ...args);
};


      let matched = false;

      for (const route of this.routes[req.method] || []) {
        try {
          if (route.path.startsWith("?")) {
            const key = route.path.slice(1);
            if (req.query[key] !== undefined) {
              matched = true;
              let redCalled = false;
              const originalRed = res.red;
              res.red = (...args) => { redCalled = true; originalRed(...args); };
              try {
                route.handler(req, res);
              } catch (err) {
                // HTML error sayfası
                res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
                res.end(this.renderErrorPage(err, `app.${req.method.toLowerCase()}("${route.path}", handler)`));
              }
              if (!redCalled) {
                const err = new Error(`Route ?${key} için res.red() çağrılmadı!`);
                res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
                res.end(this.renderErrorPage(err, `app.${req.method.toLowerCase()}("${route.path}", handler)`));
              }
              break;
            }
          } else if (route.path === "*" || route.path === url) {
            matched = true;
            try {
              route.handler(req, res);
            } catch (err) {
              res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
              res.end(this.renderErrorPage(err, `app.${req.method.toLowerCase()}("${route.path}", handler)`));
            }
            break;
          }
        } catch (err) {
          res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
          res.end(this.renderErrorPage(err, `app.${req.method.toLowerCase()}("${route.path}", handler)`));
          matched = true;
          break;
        }
      }

      if (!matched) {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<style>
            body {
            background-color: #151515;
            }
            </style>
            <title>404 not found</title>
            <body>
            <h1 style="color:#0f0;font-family:monospace;">404 Not Found</h1>
            <p style="color:#0f0;font-family:monospace;">cannot find ${url}</p>
            <body>`);
      }
    });

    server.listen(port, callback);
  }

  // HTML error sayfası render
  renderErrorPage(err, codeSnippet) {
    const stack = err.stack || "";
    const lineMatch = stack.match(/:(\d+):\d+\)?$/m);
    const line = lineMatch ? lineMatch[1] : "?";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Code Error</title>
<style>
  body { background:#011; color:#0f0; font-family: monospace; padding: 40px; }
  .container { border: 2px solid #0f0; padding:20px; border-radius:10px; box-shadow: 0 0 20px #0f0; }
  h1 { margin:0 0 20px; color:#0f0; }
  pre { background:#022; padding:15px; border-radius:8px; overflow-x:auto; }
  .line { color:#0f0; }
</style>
</head>
<body>
  <div class="container">
    <h1>💻 Code Error</h1>
    <p class="line">At line: ${line}</p>
    <pre>${codeSnippet}</pre>
    <pre>${err.message}</pre>
    <footer>7945site error snippet</footer>
  </div>
</body>
</html>
    `;
  }
}

module.exports = 7945-site;
