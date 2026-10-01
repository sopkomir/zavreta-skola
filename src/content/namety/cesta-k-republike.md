---
title: Cesta k republike
pubDate: 2026-10-01T18:51:00.000+02:00
author: Miroslav Sopko
categories:
  - Dejepis
types:
  - WEBKA
  - APPKA
  - CVIKA
image: /uploaded-images/cesta-k-republike-hero-1200x630.png
embedHtml: >-
  <div id="ckr-wrap"
  style="position:relative;width:100%;height:85vh;border-radius:12px;overflow:hidden;background:#ECEEE8">
    <iframe id="ckr-frame"
      src="https://SOPKOMIR.github.io/cesta-k-republike/"
      title="Cesta k republike – vznik Československa 1914 – 1920"
      style="width:100%;height:100%;border:0"
      allow="fullscreen" allowfullscreen loading="lazy"></iframe>
    <button id="ckr-fs" type="button" aria-label="Zobraziť na celú obrazovku"
      style="position:absolute;right:12px;bottom:84px;z-index:10;display:flex;align-items:center;gap:6px;padding:10px 14px;border:0;border-radius:24px;background:#1C2333;color:#fff;font:600 15px/1 sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.3);cursor:pointer">
      ⛶ <span>Celá obrazovka</span>
    </button>
  </div>

  <script>

  (function(){
    var wrap=document.getElementById('ckr-wrap'), btn=document.getElementById('ckr-fs'),
        frame=document.getElementById('ckr-frame'), label=btn.querySelector('span');
    var canFs = wrap.requestFullscreen || wrap.webkitRequestFullscreen;
    function isFs(){ return document.fullscreenElement || document.webkitFullscreenElement; }
    btn.addEventListener('click', function(){
      if(!canFs){ window.open(frame.src,'_blank'); return; }   // iPhone: otvorí v novom okne
      if(isFs()){ (document.exitFullscreen||document.webkitExitFullscreen).call(document); }
      else { (wrap.requestFullscreen||wrap.webkitRequestFullscreen).call(wrap); }
    });
    function upd(){ label.textContent = isFs() ? 'Zavrieť' : 'Celá obrazovka';
      wrap.style.borderRadius = isFs() ? '0' : '12px'; }
    document.addEventListener('fullscreenchange', upd);
    document.addEventListener('webkitfullscreenchange', upd);
  })();

  </script>
metaDescription: Ako sa z rozpadajúceho Rakúsko-Uhorska zrodilo Československo?
  Interaktívna aplikácia prevedie žiakov šiestimi rokmi od výstrelov v Sarajeve
  po prvú ústavu z roku 1920 – s dobovými fotografiami, mapami a pôvodnými
  dokumentmi.
---
**Ako sa z rozpadajúceho Rakúsko-Uhorska zrodilo Československo? Interaktívna aplikácia prevedie žiakov šiestimi rokmi od výstrelov v Sarajeve po prvú ústavu z roku 1920 – s dobovými fotografiami, mapami a pôvodnými dokumentmi.**

Aplikácia **Cesta k republike** vznikla pre vyučovanie dejepisu v 3. cykle podľa ŠVP 2023 (Človek a spoločnosť) a funguje na mobile, tablete aj interaktívnej tabuli. Žiaci prechádzajú príbehom v šiestich kapitolách, od začiatku prvej svetovej vojny cez domáci a zahraničný odboj až po hranice a ústavu. Každá udalosť obsahuje vysvetlenie, prečo je dôležitá, a bádateľskú otázku.

Historické mapy porovnávajú Európu v rokoch 1914 a 1920 a ukazujú aj cestu légií cez Sibír. Model štátu vedľa seba stavia Rakúsko-Uhorsko a Československú republiku, takže žiaci vidia, kto volil, kto vládol a čo sa zmenilo pre Slovákov. V aplikácii sú aj portréty osobností, pôvodné texty Clevelandskej a Pittsburskej dohody, Martinskej deklarácie a ústavy, Masarykov hlas a dobové filmy. Nechýbajú štatistiky, úlohy pre geografiu, matematiku, SJL, etickú, hudobnú a výtvarnú výchovu, kvíz a návrh tematického dňa.
