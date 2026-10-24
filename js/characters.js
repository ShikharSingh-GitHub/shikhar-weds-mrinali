/* Cartoon couple illustrations, one parametric SVG per wedding function.
   Shikhar: gold aviators, handlebar moustache, light beard, swept-back hair.
   Mrinali: long wavy hair, bindi, warm smile. */
(function () {
  'use strict';

  const SKIN_G = '#E7B48E', SKIN_B = '#F1C6A4', SHADE = '#C98E68', HAIR = '#2A1B14', INK = '#33211B';
  const GOLD = '#D4A24C', GOLD_D = '#A97A2C';
  let uidSeq = 0;

  /* ---------- small drawing helpers ---------- */
  const n = (v) => +v.toFixed(1);

  const heart = (x, y, s, fill, cls = '') =>
    `<path class="${cls}" transform="translate(${n(x - 12 * s)} ${n(y - 12 * s)}) scale(${s})" fill="${fill}" d="M12 21s-7.5-4.6-9.6-9.3C.7 7.3 3.2 3 7.2 3c2.2 0 3.8 1.2 4.8 2.8C13 4.2 14.6 3 16.8 3c4 0 6.5 4.3 4.8 8.7C19.5 16.4 12 21 12 21z"/>`;

  const sparkle = (x, y, s, fill) =>
    `<path class="twinkle" transform="translate(${x} ${y}) scale(${s})" fill="${fill}" d="M0-10C1 -3 3-1 10 0 3 1 1 3 0 10-1 3-3 1-10 0-3-1-1-3 0-10z"/>`;

  const flower = (x, y, r, petal, center = '#F6C343') => {
    let s = '';
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * Math.PI / 180;
      s += `<circle cx="${n(x + Math.cos(a) * r)}" cy="${n(y + Math.sin(a) * r)}" r="${n(r * 0.78)}" fill="${petal}"/>`;
    }
    return s + `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.55)}" fill="${center}"/>`;
  };

  const marigold = (x, y, r) =>
    `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="#F59E0B"/><circle cx="${n(x)}" cy="${n(y)}" r="${n(r * 0.6)}" fill="#F97316"/>`;

  const rose = (x, y, r, c1, c2) =>
    `<circle cx="${x}" cy="${y}" r="${r}" fill="${c1}"/><path d="M${x - r * .55} ${y}a${r * .55} ${r * .55} 0 1 1 ${r * .55} ${r * .55}" stroke="${c2}" stroke-width="1.6" fill="none"/>`;

  // U-shaped garland of beads/flowers from (cx-w, y) dipping to (cx, y+h)
  const garland = (cx, y, w, h, cols, r = 5, count = 15) => {
    let s = '';
    for (let i = 0; i <= count; i++) {
      const t = Math.PI * i / count;
      s += `<circle cx="${n(cx - Math.cos(t) * w)}" cy="${n(y + Math.sin(t) * h)}" r="${r}" fill="${cols[i % cols.length]}"/>`;
    }
    return s;
  };

  // vertical hanging string of marigolds
  const strand = (x, y0, len, r = 5.5) => {
    let s = `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + len}" stroke="#6B8E23" stroke-width="1"/>`;
    for (let y = y0 + r; y < y0 + len; y += r * 1.9) s += marigold(x, y, r);
    return s;
  };

  const leaf = (x, y, rot, sc, fill, vein = 'rgba(255,255,255,.45)') =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})"><path d="M0 0C14-18 44-20 60 0 44 20 14 18 0 0z" fill="${fill}"/><path d="M4 0H54" stroke="${vein}" stroke-width="1.4"/></g>`;

  const paisley = (x, y, rot, sc, stroke) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${sc})" fill="none" stroke="${stroke}" stroke-width="1.6"><path d="M0 0C-16 0-22-22-6-30 10-38 30-20 22 4 16 22-4 34-20 40-6 28 8 16 0 0z"/><circle cx="2" cy="-12" r="5"/><circle cx="2" cy="-12" r="1.6" fill="${stroke}"/></g>`;

  const diya = (x, y) =>
    `<g transform="translate(${x} ${y})"><path d="M-14 0Q0 14 14 0Z" fill="${GOLD_D}"/><ellipse cx="0" cy="0" rx="14" ry="3" fill="${GOLD}"/><path class="flicker" d="M0-16C5-9 4-3 0-1-4-3-5-9 0-16Z" fill="#FFB547"/><path d="M0-10C2-7 2-4 0-3-2-4-2-7 0-10Z" fill="#FFF3B0"/></g>`;

  /* ---------- the groom ---------- */
  function groomBody(o, u) {
    let s = `<rect x="131" y="194" width="28" height="36" rx="10" fill="${SKIN_G}"/><path d="M131 214q14 9 28 0v-6q-14 8-28 0z" fill="${SHADE}" opacity=".35"/>`;
    s += `<path d="M84 252Q88 228 120 221H170Q202 228 206 252L222 440H68Z" fill="${o.base}"/>`;
    s += `<path d="M95 268Q85 340 89 440M195 268Q205 340 201 440" stroke="${o.shade}" stroke-width="3" fill="none" opacity=".55"/>`;

    if (o.style === 'kurta') {
      s += `<path d="M145 232V318" stroke="${o.trim}" stroke-width="3"/>`;
      for (let y = 244; y <= 304; y += 20) s += `<circle cx="145" cy="${y}" r="2.6" fill="${GOLD}"/>`;
      for (let y = 240; y <= 310; y += 10) s += `<circle cx="136" cy="${y}" r="1.6" fill="${o.trim}"/><circle cx="154" cy="${y}" r="1.6" fill="${o.trim}"/>`;
      if (o.jacket) {
        s += `<path d="M118 222Q140 280 138 440H86Q84 330 90 254Q94 232 118 222ZM172 222Q150 280 152 440H204Q206 330 200 254Q196 232 172 222Z" fill="${o.jacket}"/>`;
        for (let i = 0; i < 18; i++) s += `<circle cx="${i % 2 ? 108 + (i % 5) * 4 : 182 - (i % 5) * 4}" cy="${262 + i * 9}" r="2" fill="${o.trim}" opacity=".8"/>`;
      }
      s += `<path d="M131 219h28l-2 14q-12 6-24 0z" fill="${o.trim}"/>`;
    } else if (o.style === 'sherwani') {
      s += `<pattern id="brocade${u}" width="18" height="18" patternUnits="userSpaceOnUse"><path d="M9 3l3 6-3 6-3-6z" fill="${o.trim}" opacity=".35"/></pattern>`;
      s += `<path d="M84 252Q88 228 120 221H170Q202 228 206 252L222 440H68Z" fill="url(#brocade${u})"/>`;
      s += `<path d="M145 232V440" stroke="${GOLD}" stroke-width="2"/>`;
      for (let y = 244; y <= 430; y += 18) s += `<circle cx="145" cy="${y}" r="3" fill="${GOLD}" stroke="${GOLD_D}" stroke-width=".8"/>`;
      s += `<path d="M130 218h30l-2 16q-13 6-26 0z" fill="${o.base}" stroke="${GOLD}" stroke-width="2"/>`;
      if (o.stole) s += `<path d="M98 234Q128 300 196 440H166Q118 330 86 254Q88 238 98 234Z" fill="${o.stole}" stroke="${GOLD}" stroke-width="2.5"/>`;
    } else if (o.style === 'indo') {
      s += `<path d="M130 221H170Q200 228 206 252L222 440H150L172 312Q170 260 130 221Z" fill="${o.accent}" stroke="${GOLD}" stroke-width="2"/>`;
      s += `<path d="M131 219h28l-2 14q-12 6-24 0z" fill="${o.accent}" stroke="${GOLD}" stroke-width="1.6"/>`;
      s += `<circle cx="166" cy="258" r="6" fill="${GOLD}"/><circle cx="166" cy="258" r="2.6" fill="#E9D5FF"/><path d="M166 264Q176 290 190 296" stroke="${GOLD}" stroke-width="1.4" fill="none" stroke-dasharray="2 2"/>`;
      for (let i = 0; i < 10; i++) s += sparkle(176 + (i % 3) * 9, 330 + i * 10, .25, '#F5E6B8');
    } else if (o.style === 'tux') {
      s += `<path d="M126 221L145 300 164 221Z" fill="#FFFFFF"/>`;
      s += `<path d="M120 222L145 306 130 306 106 248Q108 230 120 222ZM170 222L145 306 160 306 184 248Q182 230 170 222Z" fill="${o.accent}"/>`;
      s += `<path d="M134 230l11 5 11-5v12l-11-5-11 5z" fill="${o.tie}"/><circle cx="145" cy="237" r="3" fill="${o.tie}"/>`;
      s += `<circle cx="145" cy="270" r="2" fill="${INK}"/><circle cx="145" cy="288" r="2" fill="${INK}"/>`;
      s += `<path d="M176 262l12-3 3 9-14 3z" fill="${o.tie}"/>`;
    }
    if (o.garland) s += garland(145, 226, 44, 74, o.garland, 5.5, 17);
    return s;
  }

  function groomHead(o) {
    let s = '<g class="tilt-r">';
    s += `<ellipse cx="90" cy="158" rx="9" ry="13" fill="${SKIN_G}"/><ellipse cx="200" cy="158" rx="9" ry="13" fill="${SKIN_G}"/>`;
    s += `<ellipse cx="145" cy="150" rx="56" ry="60" fill="${SKIN_G}"/>`;
    s += `<path d="M90 160Q92 212 145 216Q198 212 200 160Q194 190 170 196Q145 202 120 196Q96 190 90 160Z" fill="${HAIR}" opacity=".55"/>`;
    if (o.safa) {
      s += `<path d="M84 146Q76 82 145 66Q214 82 206 146Q186 118 145 116Q104 118 84 146Z" fill="${o.safa}"/>`;
      s += `<path d="M90 124Q145 98 200 124M94 106Q145 82 196 106M104 90Q145 72 186 90" stroke="${o.safaTrim}" stroke-width="2.4" fill="none" opacity=".75"/>`;
      for (let i = 0; i < 16; i++) s += `<circle cx="${100 + (i * 37) % 92}" cy="${86 + (i * 13) % 34}" r="1.5" fill="#FFF7E6" opacity=".85"/>`;
      s += `<path d="M150 92Q156 60 180 42Q170 66 160 94Z" fill="#FFF8EC" stroke="${GOLD}" stroke-width="1.4"/>`;
      s += `<circle cx="145" cy="96" r="8" fill="${GOLD}"/><circle cx="145" cy="96" r="3.6" fill="#C81E4A"/>`;
      s += `<path d="M138 104q7 10 14 0" stroke="#FFF" stroke-width="1.6" fill="none" stroke-dasharray="1.5 2.5"/>`;
    } else {
      s += `<path d="M88 158Q80 96 132 82Q188 72 204 124Q208 144 200 158Q194 124 168 114Q138 106 110 118Q96 130 92 160Z" fill="${HAIR}"/>`;
      s += `<path d="M106 96Q150 62 198 104Q162 84 116 102Z" fill="#46302A"/>`;
    }
    s += `<path d="M110 133Q122 126 136 131M154 131Q168 126 180 133" stroke="${HAIR}" stroke-width="4.5" stroke-linecap="round" fill="none"/>`;
    s += `<ellipse cx="124" cy="153" rx="5" ry="6.5" fill="${INK}"/><ellipse cx="166" cy="153" rx="5" ry="6.5" fill="${INK}"/>`;
    s += `<circle cx="126" cy="150.5" r="1.8" fill="#fff"/><circle cx="168" cy="150.5" r="1.8" fill="#fff"/>`;
    s += `<g fill="rgba(255,255,255,.22)" stroke="${GOLD}" stroke-width="2.4"><path d="M103 140Q124 135 142 141Q144 161 132 169Q118 173 108 163Q100 153 103 140Z"/><path d="M187 140Q166 135 148 141Q146 161 158 169Q172 173 182 163Q190 153 187 140Z"/></g>`;
    s += `<path d="M142 142Q145 138 148 142M138 137H152M103 142L90 147M187 142L200 147" stroke="${GOLD}" stroke-width="2.2" fill="none"/>`;
    s += `<path d="M145 160Q140 171 147 173" stroke="${SHADE}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M131 193Q145 208 159 193Q145 198 131 193Z" fill="#fff" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
    s += `<path transform="translate(0 -3)" d="M145 181Q132 172 118 180Q108 186 103 177Q101 170 107 167Q104 176 112 177Q124 170 145 177Q166 170 178 177Q186 176 183 167Q189 170 187 177Q182 186 172 180Q158 172 145 181Z" fill="${HAIR}"/>`;
    s += `<ellipse cx="112" cy="176" rx="8" ry="5" fill="#F28B9B" opacity=".35"/><ellipse cx="178" cy="176" rx="8" ry="5" fill="#F28B9B" opacity=".35"/>`;
    if (o.tilak) s += `<path d="M145 120v12" stroke="#D3243B" stroke-width="4" stroke-linecap="round"/><circle cx="145" cy="128" r="1.6" fill="#F6C343"/>`;
    return s + '</g>';
  }

  /* ---------- the bride ---------- */
  function brideBody(o) {
    let s = `<rect x="250" y="198" width="24" height="44" rx="10" fill="${SKIN_B}"/>`;
    if (o.style === 'gown') {
      s += `<path d="M214 262Q218 242 246 238H278Q306 242 310 262Z" fill="${SKIN_B}"/>`;
      s += `<path d="M213 262Q262 250 311 262L316 350H208Z" fill="${o.blouse}"/>`;
      s += `<path d="M208 346Q184 400 166 440H358Q340 400 316 346Z" fill="${o.skirt}"/>`;
      s += `<path d="M230 352Q222 400 214 440M262 352V440M294 352Q302 400 310 440" stroke="${o.trim}" stroke-width="1.4" opacity=".55" fill="none"/>`;
      for (let i = 0; i < 26; i++) s += `<circle cx="${n(196 + (i * 53) % 136)}" cy="${n(268 + (i * 29) % 170)}" r="${i % 3 ? 1.3 : 2.2}" fill="#fff" opacity=".85"/>`;
      s += `<path d="M210 346Q262 356 314 346" stroke="${o.trim}" stroke-width="5" fill="none"/>`;
    } else {
      s += `<path d="M214 262Q218 242 246 238H278Q306 242 310 262L314 352H210Z" fill="${o.blouse}"/>`;
      s += `<path d="M246 238Q262 262 278 238Z" fill="${SKIN_B}"/>`;
      s += `<path d="M210 350Q186 400 172 440H352Q338 400 314 350Z" fill="${o.skirt}"/>`;
      s += `<path d="M236 354Q224 400 214 440M262 354V440M288 354Q300 400 310 440" stroke="${o.trim}" stroke-width="1.4" opacity=".5" fill="none"/>`;
      for (let i = 0; i < 18; i++) s += `<circle cx="${n(196 + (i * 47) % 132)}" cy="${n(368 + (i * 23) % 52)}" r="2.2" fill="${o.trim}"/>`;
      s += `<path d="M178 426H346L352 440H172Z" fill="${o.trim}"/><path d="M180 431H344" stroke="${o.skirt}" stroke-width="1.6" stroke-dasharray="3 3"/>`;
      s += `<rect x="208" y="344" width="108" height="9" rx="3" fill="${o.trim}"/>`;
    }
    if (o.dupatta && !o.dupatta.head) {
      s += `<path d="M296 240Q330 252 332 304Q336 380 342 440H318Q314 360 306 304Q300 266 282 247Z" fill="${o.dupatta.color}" opacity=".92" stroke="${o.dupatta.border}" stroke-width="3"/>`;
    }
    if (o.jewel === 'floral') s += garland(262, 230, 20, 18, ['#FFFFFF', '#F6C343', '#F9A8C0'], 3.4, 10);
    else if (o.jewel === 'gold') s += `<path d="M242 228Q262 246 282 228" stroke="${GOLD}" stroke-width="4.5" fill="none"/>${garland(262, 230, 18, 15, [GOLD, '#C81E4A', GOLD, '#1F8A5B'], 2.6, 10)}<path d="M262 246l5 7-5 7-5-7z" fill="#C81E4A" stroke="${GOLD}" stroke-width="1.4"/>`;
    else if (o.jewel === 'diamond') s += `<path d="M242 228Q262 246 282 228" stroke="#F4F1FF" stroke-width="3" fill="none"/>${garland(262, 230, 18, 15, ['#FFFFFF', '#DCD3F7'], 2.2, 12)}`;
    if (o.garland) s += garland(262, 240, 38, 66, o.garland, 5.5, 17);
    return s;
  }

  function brideHead(o) {
    let s = '<g class="tilt-l">';
    s += `<ellipse cx="262" cy="160" rx="50" ry="54" fill="${SKIN_B}"/>`;
    s += `<path d="M212 172Q204 102 262 100Q320 102 312 172Q302 126 268 114Q262 116 256 114Q222 126 212 172Z" fill="${HAIR}"/>`;
    s += `<path d="M236 140Q245 134 254 138M270 138Q279 134 288 140" stroke="${HAIR}" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
    s += `<ellipse cx="245" cy="158" rx="6" ry="7.5" fill="${INK}"/><ellipse cx="279" cy="158" rx="6" ry="7.5" fill="${INK}"/>`;
    s += `<circle cx="247.5" cy="155" r="2.2" fill="#fff"/><circle cx="281.5" cy="155" r="2.2" fill="#fff"/>`;
    s += `<path d="M239 152l-5-3M241 150l-3-4M285 152l5-3M283 150l3-4" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`;
    s += `<path d="M262 166q-3 8 2 9" stroke="#D29A78" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    s += `<path d="M249 184Q262 197 275 184Q262 189 249 184Z" fill="#D2546F"/>`;
    s += `<ellipse cx="234" cy="176" rx="8" ry="5" fill="#F28B9B" opacity=".45"/><ellipse cx="290" cy="176" rx="8" ry="5" fill="#F28B9B" opacity=".45"/>`;
    s += `<circle cx="262" cy="140" r="3" fill="#C81E4A"/>`;
    if (o.tikka) s += `<path d="M262 104V124" stroke="${GOLD}" stroke-width="1.6"/><circle cx="262" cy="127" r="4" fill="${GOLD}"/><path d="M262 131l3 4-3 4-3-4z" fill="#C81E4A"/>`;
    if (o.jewel === 'floral') {
      s += flower(213, 186, 4.4, '#fff', '#F6C343') + flower(311, 186, 4.4, '#fff', '#F6C343');
      [[222, 128], [234, 116], [248, 108], [262, 105], [276, 108], [290, 116], [302, 128]].forEach(([x, y], i) => {
        s += flower(x, y, 4.2, ['#FFFFFF', '#F9A8C0', '#FDE68A'][i % 3], i % 3 === 2 ? '#F97316' : '#F6C343');
      });
    } else {
      [213, 311].forEach((x) => {
        s += `<path d="M${x} 176v6" stroke="${GOLD}" stroke-width="1.6"/><path d="M${x - 7} 190Q${x} 178 ${x + 7} 190Z" fill="${o.jewel === 'diamond' ? '#EDE9FE' : GOLD}"/>`;
        s += `<circle cx="${x - 5}" cy="193" r="1.6" fill="${o.jewel === 'diamond' ? '#fff' : '#C81E4A'}"/><circle cx="${x}" cy="194" r="1.6" fill="${o.jewel === 'diamond' ? '#fff' : '#C81E4A'}"/><circle cx="${x + 5}" cy="193" r="1.6" fill="${o.jewel === 'diamond' ? '#fff' : '#C81E4A'}"/>`;
      });
    }
    if (o.nath) s += `<circle cx="271" cy="174" r="8" stroke="${GOLD}" stroke-width="2" fill="none"/><circle cx="276" cy="181" r="1.8" fill="#C81E4A"/><path d="M278 170Q298 158 310 170" stroke="${GOLD}" stroke-width="1" fill="none" stroke-dasharray="1.5 1.5"/>`;
    if (o.dupatta && o.dupatta.head) {
      const d = o.dupatta;
      s += `<path d="M200 200Q190 84 262 80Q334 84 324 200Q334 300 340 440H312Q312 300 313 182Q310 102 262 98Q214 102 211 182Q212 300 212 440H184Q190 300 200 200Z" fill="${d.color}" opacity=".9"/>`;
      s += `<path d="M200 200Q190 84 262 80Q334 84 324 200Q334 300 340 440M212 440Q212 300 211 182Q214 102 262 98Q310 102 313 182Q312 300 312 440" stroke="${d.border}" stroke-width="3.5" fill="none"/>`;
      for (let i = 0; i < 14; i++) s += `<circle cx="${i < 7 ? 194 + (i % 2) * 6 : 324 + (i % 2) * 5}" cy="${200 + (i % 7) * 34}" r="2" fill="${d.border}"/>`;
      if (o.tikka) s += `<path d="M262 99V124" stroke="${GOLD}" stroke-width="1.6"/>`;
    }
    return s + '</g>';
  }

  function brideBackHair() {
    return `<path d="M208 170Q200 96 262 94Q324 96 316 170Q324 228 330 296Q338 326 324 338Q316 326 306 332Q298 314 292 300H232Q226 314 218 332Q208 326 200 338Q186 326 194 296Q200 228 208 170Z" fill="${HAIR}"/>`;
  }

  /* ---------- per-function backdrops ---------- */
  const BACKDROPS = {
    hero(u) {
      let s = `<defs><linearGradient id="arch${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FCE4EC"/><stop offset=".55" stop-color="#EDE3FA"/><stop offset="1" stop-color="#FFE6D5"/></linearGradient></defs>`;
      s += `<path d="M34 440V196Q34 52 200 34Q366 52 366 196V440Z" fill="url(#arch${u})"/>`;
      s += `<path d="M48 440V200Q48 68 200 50Q352 68 352 200V440" stroke="${GOLD}" stroke-width="2" fill="none" stroke-dasharray="1 6" stroke-linecap="round"/>`;
      s += `<path d="M34 440V196Q34 52 200 34Q366 52 366 196V440" stroke="${GOLD}" stroke-width="2.5" fill="none"/>`;
      [[44, 190], [62, 140], [92, 98], [308, 98], [338, 140], [356, 190]].forEach(([x, y], i) => {
        s += leaf(x - 8, y + 4, -40 + i * 18, .32, '#A7C4A0') + rose(x, y, 10, i % 2 ? '#F8BBD0' : '#FBD3C0', i % 2 ? '#E88FAE' : '#F2A98A');
      });
      s += flower(200, 36, 8, '#fff', GOLD);
      return s;
    },
    haldi(u) {
      let s = `<defs><linearGradient id="bg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF7DA"/><stop offset="1" stop-color="#FFD670"/></linearGradient></defs><rect width="400" height="440" fill="url(#bg${u})"/>`;
      s += `<circle cx="205" cy="168" r="132" fill="#FFF0B8" opacity=".75"/><circle cx="205" cy="168" r="100" fill="#FFF7D6" opacity=".7"/>`;
      [[20, 150], [48, 104], [76, 70], [324, 70], [352, 104], [380, 150]].forEach(([x, l]) => (s += strand(x, 0, l)));
      for (let i = 0; i < 5; i++) s += garland(40 + i * 80, 0, 40, 18, ['#F59E0B', '#FB923C', '#FDE68A'], 4.5, 9);
      s += `<path d="M14 404Q46 446 78 404Z" fill="${GOLD_D}"/><ellipse cx="46" cy="404" rx="32" ry="7" fill="${GOLD}"/><ellipse cx="46" cy="402" rx="24" ry="4.5" fill="#F7B500"/>`;
      s += marigold(352, 414, 9) + marigold(372, 404, 8) + marigold(338, 398, 7) + leaf(360, 428, -160, .4, '#6B8E23');
      for (let i = 0; i < 9; i++) s += `<ellipse cx="${30 + i * 43}" cy="${200 + (i * 71) % 180}" rx="4" ry="2.4" fill="#F97316" opacity=".55" transform="rotate(${i * 40} ${30 + i * 43} ${200 + (i * 71) % 180})"/>`;
      return s;
    },
    mehendi(u) {
      let s = `<defs><linearGradient id="bg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1FAEA"/><stop offset="1" stop-color="#BFE0B0"/></linearGradient></defs><rect width="400" height="440" fill="url(#bg${u})"/>`;
      s += paisley(56, 210, -20, 1.1, '#7FB069') + paisley(346, 220, 160, 1.1, '#7FB069') + paisley(40, 330, 10, .8, '#9BC48A') + paisley(364, 330, 190, .8, '#9BC48A');
      s += leaf(-6, 20, 30, 1.1, '#5E9C4E') + leaf(10, 50, 60, .9, '#7FB069') + leaf(406, 20, 150, 1.1, '#5E9C4E') + leaf(390, 52, 120, .9, '#7FB069');
      [60, 100, 300, 340].forEach((x, i) => {
        const l = 60 + (i % 2) * 30;
        s += `<line x1="${x}" y1="0" x2="${x}" y2="${l}" stroke="#E07AA0" stroke-width="1.4"/>${flower(x, l, 5, '#F9A8C0', '#F6C343')}<path d="M${x - 4} ${l + 8}h8l-2 14h-4z" fill="#E07AA0"/>`;
      });
      s += `<g transform="translate(40 392) rotate(-35)"><path d="M0 0L36 -8 36 8Z" fill="#7A3E1D"/><rect x="34" y="-9" width="6" height="18" fill="${GOLD}"/><path d="M40-8H58Q62 0 58 8H40Z" fill="#F9A8C0"/></g>`;
      s += `<g transform="translate(352 400) rotate(-15)"><ellipse cx="0" cy="8" rx="20" ry="22" fill="${SKIN_B}"/>`;
      [[-14, -26], [-5, -32], [5, -32], [14, -26]].forEach(([x, y]) => (s += `<rect x="${x - 4.5}" y="${y}" width="9" height="30" rx="4.5" fill="${SKIN_B}"/>`));
      s += `<rect x="-34" y="0" width="22" height="9" rx="4.5" transform="rotate(-30 -12 4)" fill="${SKIN_B}"/>`;
      s += `<circle cx="0" cy="10" r="8" fill="none" stroke="#9A4A1F" stroke-width="1.6"/><circle cx="0" cy="10" r="2.6" fill="#9A4A1F"/>`;
      [[-14, -20], [-5, -26], [5, -26], [14, -20]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="2" fill="#9A4A1F"/><path d="M${x - 3} ${y + 7}h6M${x - 3} ${y + 11}h6" stroke="#9A4A1F" stroke-width="1.2"/>`));
      return s + `</g>`;
    },
    sangeet(u) {
      let s = `<defs><linearGradient id="bg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241240"/><stop offset="1" stop-color="#6E2F80"/></linearGradient>`;
      ['#FFD6E8', '#E9D5FF', '#FFE8B0'].forEach((c, i) => (s += `<linearGradient id="beam${u}${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".75"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`));
      s += `</defs><rect width="400" height="440" fill="url(#bg${u})"/>`;
      s += `<path class="beam" d="M60 0L-10 440H150Z" fill="url(#beam${u}0)" opacity=".45"/><path class="beam b2" d="M200 0L120 440H290Z" fill="url(#beam${u}1)" opacity=".35"/><path class="beam b3" d="M340 0L250 440H410Z" fill="url(#beam${u}2)" opacity=".45"/>`;
      for (let i = 0; i < 18; i++) s += `<circle class="twinkle" cx="${(i * 67) % 400}" cy="${(i * 41) % 170}" r="${i % 3 ? 1.2 : 2}" fill="#fff" opacity=".8"/>`;
      s += `<path d="M0 40Q100 76 200 40Q300 76 400 40" stroke="#3A2550" fill="none"/>`;
      for (let i = 0; i <= 16; i++) { const x = i * 25, y = 40 + Math.sin(Math.PI * ((x % 200) / 200)) * 18; s += `<circle cx="${x}" cy="${n(y)}" r="3" fill="${['#FFD166', '#FF9EC7', '#C4B5FD'][i % 3]}"/>`; }
      s += `<line x1="344" y1="0" x2="344" y2="70" stroke="#C0C0D0"/><circle cx="344" cy="88" r="18" fill="#D9D6E8"/><path d="M326 88H362M344 70V106M330 77Q344 88 330 99M358 77Q344 88 358 99" stroke="#8D88A6" stroke-width="1" fill="none"/><circle cx="338" cy="82" r="3" fill="#fff"/>`;
      s += `<text x="40" y="250" font-size="30" fill="${GOLD}" class="bob">&#9834;</text><text x="350" y="300" font-size="26" fill="#F9A8D4" class="bob b2">&#9835;</text><text x="22" y="350" font-size="22" fill="#C4B5FD" class="bob b3">&#9834;</text>`;
      s += `<ellipse cx="200" cy="452" rx="230" ry="44" fill="#F9A8D4" opacity=".25"/>`;
      return s;
    },
    wedding(u) {
      let s = `<defs><linearGradient id="bg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3E8"/><stop offset="1" stop-color="#F8C9B4"/></linearGradient><linearGradient id="pil${u}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F3DFB8"/><stop offset=".5" stop-color="#FFF6E2"/><stop offset="1" stop-color="#E8CC94"/></linearGradient></defs><rect width="400" height="440" fill="url(#bg${u})"/>`;
      s += `<circle cx="205" cy="190" r="128" fill="#FFF0E2" opacity=".8"/>`;
      [[12, 40], [348, 40]].forEach(([x, w]) => {
        s += `<rect x="${x}" y="80" width="${w}" height="360" fill="url(#pil${u})" stroke="${GOLD}" stroke-width="1.6"/>`;
        for (let y = 120; y < 440; y += 70) s += `<rect x="${x - 3}" y="${y}" width="${w + 6}" height="8" rx="3" fill="${GOLD}"/>`;
        s += `<path d="M${x + w / 2} 96V430" stroke="#F59E0B" stroke-width="5" stroke-dasharray="6 3" opacity=".75"/>`;
      });
      s += `<path d="M52 70Q90 200 60 300Q56 250 40 210Q50 140 52 70ZM348 70Q310 200 340 300Q344 250 360 210Q350 140 348 70Z" fill="#B3263A" opacity=".85"/>`;
      s += `<path d="M0 0H400V74Q360 112 300 92Q250 122 200 100Q150 122 100 92Q40 112 0 74Z" fill="#A61E36"/>`;
      s += `<path d="M0 74Q40 112 100 92Q150 122 200 100Q250 122 300 92Q360 112 400 74" stroke="${GOLD}" stroke-width="4" fill="none"/>`;
      for (let i = 0; i < 8; i++) s += `<path d="M${10 + i * 54} 20l8 8-8 8-8-8z" fill="${GOLD}" opacity=".85"/>`;
      [[100, 92, 46], [150, 112, 34], [250, 112, 34], [300, 92, 46]].forEach(([x, y, l]) => (s += strand(x, y, l, 4.5)));
      s += diya(80, 428) + diya(320, 428) + diya(56, 436) + diya(344, 436);
      for (let i = 0; i < 10; i++) s += `<ellipse cx="${30 + i * 38}" cy="${170 + (i * 53) % 200}" rx="4" ry="2.4" fill="#E11D48" opacity=".45" transform="rotate(${i * 50} ${30 + i * 38} ${170 + (i * 53) % 200})"/>`;
      return s;
    },
    reception(u) {
      let s = `<defs><linearGradient id="bg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25233F"/><stop offset="1" stop-color="#55416E"/></linearGradient><radialGradient id="glow${u}"><stop offset="0" stop-color="#FFE7A8" stop-opacity=".9"/><stop offset="1" stop-color="#FFE7A8" stop-opacity="0"/></radialGradient></defs><rect width="400" height="440" fill="url(#bg${u})"/>`;
      s += `<ellipse cx="205" cy="200" rx="150" ry="170" fill="#7C5E9A" opacity=".3"/>`;
      for (let i = 0; i <= 40; i++) {
        const t = Math.PI * i / 40, x = 200 - Math.cos(t) * 176, y = 440 - Math.sin(t) * 400;
        s += `<circle cx="${n(x)}" cy="${n(y)}" r="7" fill="url(#glow${u})"/><circle class="${i % 4 ? '' : 'twinkle'}" cx="${n(x)}" cy="${n(y)}" r="2" fill="#FFF3C8"/>`;
      }
      [[70, 0], [330, 0]].forEach(([x]) => {
        s += `<line x1="${x}" y1="0" x2="${x}" y2="34" stroke="${GOLD}"/><path d="M${x - 28} 44Q${x} 66 ${x + 28} 44" stroke="${GOLD}" stroke-width="2" fill="none"/><path d="M${x - 16} 36Q${x} 52 ${x + 16} 36" stroke="${GOLD}" stroke-width="2" fill="none"/>`;
        for (let k = -2; k <= 2; k++) s += `<path d="M${x + k * 12} ${50 + Math.abs(k) * -3}l3 7-3 7-3-7z" fill="#F4F1FF" opacity=".9"/><circle cx="${x + k * 12}" cy="${44 - Math.abs(k) * 3}" r="2" fill="#FFE7A8"/>`;
        s += `<circle cx="${x}" cy="40" r="20" fill="url(#glow${u})" opacity=".6"/>`;
      });
      [[28, 418], [52, 430], [14, 436], [372, 418], [348, 430], [386, 436]].forEach(([x, y], i) => (s += rose(x, y, 12, i % 2 ? '#FFFFFF' : '#F8D3DD', i % 2 ? '#E5E0EE' : '#E8A7B9')));
      s += leaf(70, 432, -150, .45, '#7F9C84') + leaf(330, 432, -30, .45, '#7F9C84');
      for (let i = 0; i < 10; i++) s += sparkle(20 + (i * 83) % 360, 90 + (i * 59) % 250, .45, '#FFE7A8');
      return s;
    }
  };

  /* ---------- outfits per function ---------- */
  const THEMES = {
    hero: {
      label: 'Shikhar and Mrinali, illustrated as a cartoon couple in wedding attire',
      groom: { style: 'sherwani', base: '#FBF1DE', shade: '#D9C29A', trim: '#D4A24C', stole: '#B3263A', safa: '#B3263A', safaTrim: '#F6C343', tilak: true },
      bride: { style: 'lehenga', blouse: '#C8233F', skirt: '#C8233F', trim: GOLD, dupatta: { color: '#E8506A', border: GOLD, head: true }, jewel: 'gold', tikka: true, nath: true },
      hearts: [[205, 54, 1.5, '#E8506A'], [176, 30, .8, '#F8A5C2'], [236, 26, .7, '#C4B5FD']]
    },
    haldi: {
      label: 'Shikhar and Mrinali in yellow Haldi outfits with floral jewellery',
      groom: { style: 'kurta', base: '#FFD43B', shade: '#E0A800', trim: '#F97316', garland: ['#F59E0B', '#F97316', '#FDE68A'] },
      bride: { style: 'lehenga', blouse: '#FFC93C', skirt: '#FFE066', trim: '#EC6A9C', dupatta: { color: '#FF9EC7', border: '#F6C343' }, jewel: 'floral' },
      hearts: [[205, 60, 1.2, '#F97316']]
    },
    mehendi: {
      label: 'Shikhar and Mrinali in green Mehendi outfits surrounded by mehendi decorations',
      groom: { style: 'kurta', base: '#E9F5DB', shade: '#B9D3A0', trim: '#2F7D4F', jacket: '#3E8E5E' },
      bride: { style: 'lehenga', blouse: '#2F8F5B', skirt: '#4CAF76', trim: '#F6C343', dupatta: { color: '#F48FB1', border: '#F6C343' }, jewel: 'gold', tikka: true },
      hearts: [[205, 60, 1.2, '#E07AA0']]
    },
    sangeet: {
      label: 'Shikhar and Mrinali in glamorous Indo-western Sangeet outfits under stage lights',
      groom: { style: 'indo', base: '#1E1B3A', shade: '#3B3566', accent: '#2B2560', trim: GOLD },
      bride: { style: 'gown', blouse: '#8E44AD', skirt: '#A65BC8', trim: '#F5D0FE', dupatta: { color: '#E9D5FF', border: '#F5D0FE' }, jewel: 'diamond' },
      hearts: [[205, 62, 1.2, '#FF9EC7']]
    },
    wedding: {
      label: 'Mrinali in a red lehenga and Shikhar in a cream sherwani under a traditional mandap',
      groom: { style: 'sherwani', base: '#FBF1DE', shade: '#D9C29A', trim: '#D4A24C', stole: '#B3263A', safa: '#B3263A', safaTrim: '#F6C343', tilak: true, garland: ['#C81E3A', '#FFFFFF', '#F59E0B'] },
      bride: { style: 'lehenga', blouse: '#C8233F', skirt: '#C8233F', trim: GOLD, dupatta: { color: '#E8506A', border: GOLD, head: true }, jewel: 'gold', tikka: true, nath: true, garland: ['#C81E3A', '#FFFFFF', '#F59E0B'] },
      hearts: []
    },
    reception: {
      label: 'Shikhar in a tuxedo and Mrinali in an elegant gown at a luxurious reception',
      groom: { style: 'tux', base: '#1C2340', shade: '#3A4470', accent: '#111629', tie: '#1C1C1C' },
      bride: { style: 'gown', blouse: '#F3D9C6', skirt: '#EED3BE', trim: GOLD, jewel: 'diamond' },
      hearts: [[205, 52, 1.1, '#F8A5C2']]
    }
  };

  function render(name) {
    const t = THEMES[name];
    if (!t) return '';
    const u = name + (++uidSeq);
    const isHero = name === 'hero';
    let s = `<svg viewBox="0 0 400 440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${t.label}" class="couple-svg${isHero ? ' is-hero' : ''}">`;
    if (!isHero) s += `<clipPath id="clip${u}"><rect width="400" height="440" rx="26"/></clipPath><g clip-path="url(#clip${u})">`;
    s += BACKDROPS[name](u);
    s += brideBackHair();
    s += groomBody(t.groom, u);
    s += brideBody(t.bride);
    s += groomHead(t.groom);
    s += brideHead(t.bride);
    t.hearts.forEach(([x, y, sc, c], i) => (s += `<g class="float-heart${i ? ' d' + i : ''}">${heart(x, y, sc, c)}</g>`));
    s += sparkle(112, 60, .7, GOLD) + sparkle(300, 70, .55, GOLD);
    if (!isHero) s += '</g>';
    return s + '</svg>';
  }

  window.CoupleArt = { render };

  document.querySelectorAll('[data-couple]').forEach((el) => {
    el.innerHTML = render(el.dataset.couple);
  });
})();
