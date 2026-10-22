(function () {
  "use strict";
  var root = document.getElementById("root");
  if (!root) return;

  function showUnavailable() {
    if (document.documentElement.dataset.ultraopAppReady === "true") return;
    document.documentElement.dataset.ultraopAppFailed = "true";
    root.innerHTML = [
      '<main class="uos-runtime-fallback" role="alert">',
      '<div class="uos-runtime-fallback-card">',
      '<p class="uos-runtime-fallback-code">TEMPORARY / PAGE LOAD ISSUE</p>',
      '<h1>This page isn’t loading.</h1>',
      '<p>The site’s interactive page did not start correctly. The address may still be right. Try reloading, or use one of the official links below.</p>',
      '<nav aria-label="Recovery options">',
      '<a class="uos-runtime-fallback-primary" href="' + window.location.href.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '">Try again</a>',
      '<a href="/">UltraOP home</a>',
      '<a href="/channels/">Official channels</a>',
      '<a href="/journal/">Creator journal</a>',
      '<a href="/503.html">Temporary issue information</a>',
      '</nav>',
      '<p class="uos-runtime-fallback-note">If the website itself cannot be reached, no page on this same host can load. Please try again later.</p>',
      '</div></main>'
    ].join("");

    var style = document.createElement("style");
    style.id = "uos-runtime-fallback-style";
    style.textContent = [
      'html,body{margin:0;min-height:100%;background:#090a0c;color:#f1eee7;font-family:Inter,"Segoe UI",system-ui,sans-serif}',
      '.uos-runtime-fallback{min-height:100vh;display:grid;place-items:center;padding:28px;box-sizing:border-box;background:radial-gradient(ellipse at 15% 20%,rgba(255,104,71,.1),transparent 35rem),#090a0c}',
      '.uos-runtime-fallback-card{width:min(720px,100%);padding:clamp(26px,6vw,68px);box-sizing:border-box;border:1px solid rgba(241,238,231,.18);background:#101215}',
      '.uos-runtime-fallback-code{color:#ff6847;font:700 10px/1.6 ui-monospace,monospace;letter-spacing:.16em}',
      '.uos-runtime-fallback h1{max-width:620px;margin:20px 0;font-size:clamp(42px,8vw,76px);line-height:.94;letter-spacing:-.065em}',
      '.uos-runtime-fallback p:not(.uos-runtime-fallback-code){color:#aaa9a3;line-height:1.8}',
      '.uos-runtime-fallback nav{display:flex;flex-wrap:wrap;gap:10px;margin:26px 0}',
      '.uos-runtime-fallback nav a{display:inline-flex;padding:12px 15px;border:1px solid rgba(241,238,231,.25);color:#f1eee7;text-decoration:none;font-size:12px}',
      '.uos-runtime-fallback nav .uos-runtime-fallback-primary{background:#ff6847;border-color:#ff6847;color:#111;font-weight:750}',
      '.uos-runtime-fallback-note{font-size:12px;border-top:1px solid rgba(241,238,231,.12);padding-top:15px}'
    ].join("");
    document.head.appendChild(style);
  }

  window.setTimeout(function () {
    if (document.documentElement.dataset.ultraopAppReady !== "true") showUnavailable();
  }, 12000);

  window.addEventListener("error", function (event) {
    var target = event.target;
    if (target && target.tagName === "SCRIPT" && target.src && (/\/assets\//.test(target.src) || /\/src\/main\.tsx/.test(target.src))) {
      window.setTimeout(showUnavailable, 0);
    }
  }, true);
}());
