---
title: "Bunka v 3D: živočíšna a rastlinná"
pubDate: 2026-09-26T21:00:00.000+02:00
author: Miroslav Sopko
categories:
  - Biológia
types:
  - APPKA
image: /uploaded-images/bunka-3d-hero.png
embedHtml: |-
  <iframe src="https://sopkomir.github.io/model-bunky/"
          style="width:100%; height:85vh; border:0"
          allow="fullscreen" allowfullscreen></iframe>
---
Bunka je najmenšia stavebná a funkčná jednotka živého organizmu, no na obrázku v učebnici je to plochý krúžok s farebnými fľakmi. Tento model ukazuje bunku ako priestorový útvar. Dá sa otáčať myšou alebo prstom, približovať kolieskom či dvoma prstami a cez „rez bunkou“ sa dá nazrieť dovnútra.

Model obsahuje dve bunky, medzi ktorými sa dá jedným klikom prepínať. **Živočíšna bunka** má 12 označených častí: cytoplazmatickú membránu, cytoplazmu, jadro s jadierkom, drsné a hladké endoplazmatické retikulum, Golgiho aparát, mitochondrie, ribozómy, lyzozómy, transportné mechúriky a centrioly. **Rastlinná bunka** má navyše bunkovú stenu s plazmodezmami, chloroplasty s granami a veľkú centrálnu vakuolu, ktorá odtláča jadro k okraju. Časti, ktoré má len jeden typ bunky, sú v zozname označené, takže rozdiely vidno na prvý pohľad.

Po kliknutí na ktorúkoľvek časť sa zvýrazní a ostatné organely sa stlmia. V bočnom paneli sa zobrazí krátke vysvetlenie jej stavby a funkcie a jedna veta „v skratke“, ktorá sa ľahko zapamätá (mitochondrie ako elektrárne bunky, Golgiho aparát ako pošta). Popisy sa dajú skryť, čo sa hodí na opakovanie a skúšanie: „Ukáž mi, kde je jadierko.“ Na interaktívnej tabuli sa model dá zobraziť na celú obrazovku.

Texty pri organelách boli overené podľa vysokoškolských študijných materiálov z cytológie a fyziológie rastlín (TU vo Zvolene, UKF v Nitre, Mendelova univerzita v Brne) a odborných článkov (Přírodovědci.cz, časopis Živa). Model je zámerne schematický: veľkosti a počty organel nezodpovedajú skutočnosti, veď skutočná bunka má stovky mitochondrií a milióny ribozómov.

**Ako model vznikol**

Model vznikol v spolupráci s umelou inteligenciou **Claude** od spoločnosti Anthropic (model Claude Opus 5.5). Zadanie, požiadavky na obsah a didaktické zameranie boli moje. Claude navrhol a naprogramoval 3D model, napísal popisy organel, overil ich podľa odborných zdrojov a pomohol so zverejnením. Celé to vzniklo počas niekoľkých rozhovorov, bez programovania na mojej strane.

Model je jedna samostatná webová stránka napísaná v **HTML, CSS a JavaScripte**. Priestorové zobrazenie zabezpečuje knižnica **Three.js**, ktorá využíva technológiu **WebGL**, teda grafický výkon priamo v prehliadači. Nie je potrebné nič inštalovať, model funguje na počítači, tablete, mobile aj interaktívnej tabuli. Písmo Lexend bolo navrhnuté pre lepšiu čitateľnosť, popisy sú v písme Source Serif 4. Stránka je zverejnená bezplatne cez **GitHub Pages**.

Model je dostupný na <https://sopkomir.github.io/model-bunky/>
