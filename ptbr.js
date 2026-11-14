(function () {
  'use strict';

  if (window.plugin_ptbr_ready) return;
  window.plugin_ptbr_ready = true;

  var KEYWORDS = [
    'dublado', 'dual', 'dual audio', 'pt-br', 'ptbr',
    'português', 'portugues', 'brazilian', 'nacional'
  ];

  function isPT(text) {
    text = (text || '').toLowerCase();
    for (var i = 0; i < KEYWORDS.length; i++) {
      if (text.indexOf(KEYWORDS[i]) !== -1) return true;
    }
    return false;
  }

  function applyLanguage() {
    try {
      Lampa.Storage.set('language', 'pt');
      Lampa.Storage.set('tmdb_lang', 'pt-BR');
    } catch (e) {
      console.log('[ptbr] erro ao definir idioma', e);
    }
  }

  function markItem(item) {
    if (item.getAttribute('data-ptbr')) return;
    item.setAttribute('data-ptbr', '1');

    var titleEl = item.querySelector('.torrent-item__title') || item;
    if (!isPT(titleEl.textContent)) return;

    var badge = document.createElement('span');
    badge.textContent = ' 🇧🇷 PT-BR';
    badge.style.cssText = 'color:#4cd964;font-weight:bold;margin-left:.5em;';
    titleEl.appendChild(badge);
    item.style.borderLeft = '4px solid #4cd964';
  }

  function scan() {
    var items = document.querySelectorAll('.torrent-item');
    for (var i = 0; i < items.length; i++) markItem(items[i]);
  }

  function watchTorrents() {
    var timer;
    var observer = new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(scan, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function start() {
    applyLanguage();
    watchTorrents();
    console.log('[ptbr] plugin carregado');
  }

  if (window.appready) start();
  else {
    Lampa.Listener.follow('app', function (e) {
      if (e.type === 'ready') start();
    });
  }
})();
