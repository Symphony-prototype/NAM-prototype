/**
 * GitHub Pages: URLs like https://org.github.io/repo or …/Folder (no trailing slash)
 * make ../ relative links resolve above the project root. Append "/" when the last
 * path segment looks like a directory (no file extension).
 */
(function () {
  if (!/\.github\.io$/i.test(location.hostname)) return;
  var p = location.pathname.replace(/\/+/g, '/');
  if (p === '/' || p.endsWith('/')) return;
  var last = p.split('/').pop() || '';
  if (last.indexOf('.') !== -1) return;
  if (/^(README|LICENSE|CODE_OF_CONDUCT|SECURITY)$/i.test(last)) return;
  location.replace(location.origin + p + '/' + location.search + location.hash);
})();
