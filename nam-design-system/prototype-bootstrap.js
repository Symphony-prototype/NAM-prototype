/**
 * HTTP(s): load Babel, fetch each .jsx, inline as text/babel, transformScriptTags().
 * file://: Safari blocks fetch() of local .jsx — if prototype-manifest includes
 * fileFallbackScript (prebuilt IIFE from scripts/build-all-file-fallbacks.mjs), load that .js instead.
 * Otherwise show instructions to use a local HTTP server.
 */
(function () {
  var http = /^https?:$/.test(location.protocol);
  var manifest = {
    title: 'NAM prototype',
    plainScripts: [],
    babelModules: [],
    babelEntry: null,
  };
  var el = document.getElementById('prototype-manifest');
  if (el && el.textContent) {
    try {
      Object.assign(manifest, JSON.parse(el.textContent));
    } catch (e) {
      console.warn('prototype-manifest JSON', e);
    }
  }

  var BABEL_SRC = 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js';

  function fileProtocolHubHref() {
    try {
      return new URL('../index.html', location.href).href;
    } catch (e) {
      return 'http://127.0.0.1:8765/index.html';
    }
  }

  function showFileMessage() {
    var root = document.getElementById('root');
    if (!root) return;
    var t = manifest.title || 'This prototype';
    var hubHref = fileProtocolHubHref();
    root.innerHTML =
      '<div style="box-sizing:border-box;font:16px/1.5 system-ui,-apple-system,BlinkMacSystemFont,sans-serif;padding:28px;max-width:36rem;margin:48px auto;background:#fff8f0;border:1px solid #f5d0a8;border-radius:12px;color:#3d2914">' +
      '<h1 style="margin:0 0 12px;font-size:22px;color:#1a1308">' +
      t +
      '</h1>' +
      '<p style="margin:0 0 16px;color:#5c4330">Safari blocks Babel from loading local <code>.jsx</code> files when the page is opened as <code>file://</code>. Run a tiny HTTP server from the <strong>Prototypes</strong> folder, then open the same page via <code>http://127.0.0.1:…</code>.</p>' +
      '<ol style="margin:0 0 20px;padding-left:22px;color:#4a3828">' +
      '<li style="margin-bottom:10px"><strong>Mac:</strong> double-click <code>serve-prototypes.command</code> in the Prototypes folder (starts Python and opens the hub).</li>' +
      '<li><strong>Any OS:</strong> in Terminal, <code>cd</code> to the Prototypes folder and run:<br>' +
      '<code style="display:inline-block;margin-top:8px;padding:10px 12px;background:#f1f0ec;border-radius:6px;font-size:13px;word-break:break-all">python3 -m http.server 8765 --bind 127.0.0.1</code></li>' +
      '<li style="margin-top:10px">Open the <a href="' +
      hubHref +
      '" style="color:#0a264d;font-weight:600">prototype hub</a> over HTTPS (e.g. GitHub Pages) or HTTP from the repo root. For local Python: <a href="http://127.0.0.1:8765/index.html" style="color:#0a264d;font-weight:600">http://127.0.0.1:8765/index.html</a>, then open this portal again.</li>' +
      '</ol>' +
      '<p style="margin:0;font-size:13px;color:#7a6a58">Do not rely on <code>file://</code> for these prototypes.</p>' +
      '</div>';
  }

  function injectScript(src, parent) {
    parent = parent || document.head;
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () {
        resolve();
      };
      s.onerror = function () {
        reject(new Error('Failed to load ' + src));
      };
      parent.appendChild(s);
    });
  }

  function fetchText(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error(r.status + ' ' + url);
      return r.text();
    });
  }

  function appendInlineBabel(code) {
    var s = document.createElement('script');
    s.type = 'text/babel';
    s.text = code;
    document.body.appendChild(s);
  }

  function runHttp() {
    injectScript(BABEL_SRC)
      .then(function () {
        var chain = Promise.resolve();
        (manifest.plainScripts || []).forEach(function (src) {
          chain = chain.then(function () {
            return injectScript(src);
          });
        });
        return chain;
      })
      .then(function () {
        var chain = Promise.resolve();
        (manifest.babelModules || []).forEach(function (src) {
          chain = chain.then(function () {
            return fetchText(src).then(appendInlineBabel);
          });
        });
        return chain;
      })
      .then(function () {
        if (manifest.babelEntry) {
          return fetchText(manifest.babelEntry).then(appendInlineBabel);
        }
      })
      .then(function () {
        if (window.Babel && typeof window.Babel.transformScriptTags === 'function') {
          window.Babel.transformScriptTags();
        }
      })
      .catch(function (err) {
        console.error(err);
        var root = document.getElementById('root');
        if (root) {
          root.innerHTML =
            '<div style="padding:24px;font-family:system-ui"><p><strong>Prototype failed to load.</strong></p><pre style="font-size:12px;white-space:pre-wrap">' +
            String((err && err.message) || err) +
            '</pre></div>';
        }
      });
  }

  function runFileFallback() {
    var src = manifest.fileFallbackScript;
    if (!src) {
      showFileMessage();
      return;
    }
    /* Body so the bundle runs after #root exists; React/ReactDOM already loaded from <head>. */
    injectScript(src, document.body).catch(function (err) {
      console.error(err);
      showFileMessage();
    });
  }

  if (!http) {
    if (manifest.fileFallbackScript) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runFileFallback);
      } else {
        runFileFallback();
      }
      return;
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showFileMessage);
    } else {
      showFileMessage();
    }
    return;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runHttp);
  } else {
    runHttp();
  }
})();
