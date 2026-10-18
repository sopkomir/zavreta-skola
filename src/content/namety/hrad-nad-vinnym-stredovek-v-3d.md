---
title: Hrad nad Vinným – stredovek v 3D
pubDate: 2026-10-18T16:33:00.000+02:00
author: Miroslav Sopko
categories:
  - Dejepis
types:
  - APPKA
  - WEBKA
  - HRA
image: /uploaded-images/1000044549.png
embedHtml: >
  <!-- Hrad nad Vinným – vloženie do článku na zavretaskola.sk -->

  <!-- Adresa predpokladá GitHub Pages: https://sopkomir.github.io/hrad-nad-vinnym/ – ak repozitár pomenuješ inak, zmeň ju na troch miestach nižšie. -->

  <div id="hnv-wrap" style="position:relative;width:100%;max-width:1200px;margin:0 auto;aspect-ratio:16/10;min-height:520px;border-radius:14px;overflow:hidden;background:#15171f;box-shadow:0 6px 24px rgba(0,0,0,.25)">
    <iframe id="hnv-frame" src="https://sopkomir.github.io/hrad-nad-vinnym/" title="Hrad nad Vinným – stredovek v 3D" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="fullscreen; autoplay" allowfullscreen loading="lazy"></iframe>
    <button id="hnv-fs" type="button" aria-label="Celá obrazovka" style="position:absolute;left:12px;bottom:84px;z-index:5;display:flex;align-items:center;gap:6px;padding:9px 13px;border:1px solid #e3b14b;border-radius:999px;background:rgba(21,23,31,.88);color:#efe8d8;font:700 14px system-ui,sans-serif;cursor:pointer">⛶ Celá obrazovka</button>
  </div>

  <p style="text-align:center;margin:10px 0 0">
    <a href="https://sopkomir.github.io/hrad-nad-vinnym/" target="_blank" rel="noopener" style="font-weight:700">🏰 Otvoriť Hrad nad Vinným v novom okne</a>
  </p>

  <script>

  (function(){
    var wrap=document.getElementById('hnv-wrap'),btn=document.getElementById('hnv-fs');
    var url='https://sopkomir.github.io/hrad-nad-vinnym/';
    var canFS=wrap.requestFullscreen||wrap.webkitRequestFullscreen;
    btn.onclick=function(){
      var fsEl=document.fullscreenElement||document.webkitFullscreenElement;
      if(fsEl){(document.exitFullscreen||document.webkitExitFullscreen).call(document);return;}
      if(canFS){try{(wrap.requestFullscreen||wrap.webkitRequestFullscreen).call(wrap);return;}catch(e){}}
      window.open(url,'_blank','noopener'); // iPhone: celá obrazovka v iframe nejde, otvorí sa nové okno
    };
    function upd(){var on=!!(document.fullscreenElement||document.webkitFullscreenElement);btn.textContent=on?'✕ Zavrieť celú obrazovku':'⛶ Celá obrazovka';wrap.style.borderRadius=on?'0':'14px';}
    document.addEventListener('fullscreenchange',upd);document.addEventListener('webkitfullscreenchange',upd);
  })();

  </script>

  <!-- Ak editor odstráni <script>, tlačidlo nebude fungovať – vtedy stačí odkaz „Otvoriť v novom okne“ pod aplikáciou. -->
metaDescription: ""
---
**Vystúp na hrad rytiera Alberta z Michaloviec, prejdi sa jeho nádvorím, palácom a sieňou a pozri sa, ako žil stredoveký svet pod ním – vo Vinnom, vo Veľkých a Malých Zalužiciach, v Trnave pri Laborci aj v mestečku Michalovce.**

Interaktívna 3D aplikácia na dejepis spája celý tematický celok stredoveku do jednej živej krajiny. Žiaci neučia len pojmy, ale vidia, kde sa dejiny odohrávali – na hrade nad Vinným, v dedinách pod ním a na trhu v Michalovciach.

## Čo v aplikácii nájdete

### Živá krajina pod hradom
- 3D krajina so zemplínskymi a užskými dedinami, ktoré existovali už v 13. – 15. storočí (Vinné, Veľké a Malé Zalužice, Trnava pri Laborci, Lažňany, Kaluža, Klokočov, Petrovce nad Laborcom, Lesné, Hažín)
- mestečko Michalovce s trhoviskom, kostolom a rotundou
- ľudia pri práci – oráči, žnici, pastieri, kováč, mešťania, rytieri na turnaji
- krajinou sa dá voľne posúvať, približovať a otáčať prstom aj myšou
- prepínač medzi hradom v Albertových časoch (okolo 1420) a hradom po neskorších prestavbách

### Prechádzka vnútrom hradu
- rozmiestnenie zodpovedá pôdorysu hradu: brána vo veži, veľké nádvorie, palác pri východnej hradbe s tromi miestnosťami v prízemí a sieňou na poschodí, Veľká veža, kuchyňa s pecou
- do paláca sa z nádvoria vystupuje po schodoch, do siene sa ide po schodisku
- v každom priestore sú ľudia – strážca brány, kastelán, rytier so zbrojnošom, pisár, kuchárka, podkoní
- žiaci objavujú 37 bodov so zaujímavosťami a sledujú, koľko už našli

### Učivo, ktoré sa dá vyskúšať
- **Rok na poli** – trojpoľný systém priamo na poliach pod Vinným: žiak prepína ročné obdobia, vidí sejbu, žatvu, úhor a predpovedá, čo bude na poli o rok
- **Deň na trhu v Michalovciach** – žiak je Katarína zo Zalužíc, platí mýto, predáva vajcia a syr, zjednáva a kupuje soľ a kosák (ceny sa pri každej hre menia)
- **Albertov erb** – postupné skladanie polepšeného erbu z roku 1418
- **Rytier v zbroji, sedliak, sedliačka, kňaz a mešťan** – 3D postavy, ktoré sa dajú vrstvu po vrstve obliekať a vyzliekať, s opisom dobového odevu
- **Turnaj, obliehací prak, triedenie povinností poddaných**, zoraďovanie udalostí a mýty o stredoveku

### Tri úrovne pre rôzny vek
- **Páža** – 1. stupeň ZŠ, jednoduchý jazyk
- **Zbrojnoš** – 2. stupeň ZŠ
- **Rytier** – stredná škola, učivo „do hĺbky“

Každá kapitola má krátku úvodnú animáciu, učivo, úlohu a kvíz. Otázky sa pri každom pokuse premiešajú a menia, takže sa nedajú len naspamäť naučiť. V učive sú klikateľné pojmy s vysvetlením a celá aplikácia má slovník pojmov s vyhľadávaním. Predčítanie textu sa spúšťa len ručne tlačidlom 🔊 a dobová hudba v štýle stredovekej estampie sa dá zapnúť a vypnúť.

## Témy tematického celku
Trojaký ľud, štáty a panovníci, rytier Albert z Michaloviec, hrad a jeho časti, život na hrade, rytieri a turnaje, boj a obliehanie, dedina a poddaní, mestá a mešťania, valaská kolonizácia, cirkev, kultúra a architektúra, dediny okolo hradu a vyvracanie mýtov.

## Na čo sme si dali pozor
Fakty sme overovali v odbornej literatúre a v prameňoch. Aplikácia otvorene ukazuje, čo je doložené a čo je len predpoklad – napríklad presné využitie miestností paláca alebo polohu Veľkej veže. Opravuje aj niektoré tradované omyly: v stredoveku sa hrad nevolal Vinné, ale rovnako ako mesto – hrad Michalovce, a hrad nikto nezbúral, postupne sa zmenil na ruinu, keď ho majitelia prestali udržiavať.

Vzdialenosti v krajine sú skrátené, postavy sú vymyslené a ich odev zodpovedá obdobiu.

## Pre koho
Pre žiakov 1. aj 2. stupňa ZŠ a stredných škôl, na vyučovanie dejepisu, vlastivedy aj regionálnej výchovy. Aplikácia je navrhnutá najmä pre mobil a tablet, funguje však aj na počítači a interaktívnej tabuli.

## Ako vznikla
Aplikáciu vytvoril Claude (umelá inteligencia od spoločnosti Anthropic) podľa zadania, pripomienok a fotografií z hradu. Je to jeden samostatný HTML súbor, 3D zobrazenie beží v prehliadači cez knižnicu Three.js (WebGL), písma sú Grenze Gotisch a Alegreya Sans. Hudba sa vytvára priamo v prehliadači.

Obnovu hradu nad Vinným vedie občianske združenie Zemplínsko-užská hradná cesta – hrad sa oplatí navštíviť aj naživo.

[Otvoriť aplikáciu Hrad nad Vinným v novom okne](https://sopkomir.github.io/hrad-nad-vinnym/)
