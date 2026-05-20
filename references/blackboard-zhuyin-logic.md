# 班級黑板注音顯示邏輯

This reference captures the source behavior from the 班級黑板 project so future zhuyin web pages can reproduce the same display system.

## Source Files

- `zhuyin-map.js`: common-character zhuyin table, pinyin-to-zhuyin conversion, and `getZhuyinForChar`.
- `黑板/app.js`: `parseZhuyin`, `buildCharHTML`, vertical column layout, spacing controls, character overrides.
- `黑板/styles.css`: `.bb-zhuyin-track`, `.bb-zy-char`, `.bb-zy-light`, `.bb-zy-tone`.
- `數位排版中注音符號調號定位方式.pdf`: standard notes for tone mark position and browser upright orientation.

## Core Data Flow

1. The renderer receives one Hanzi character and an optional zhuyin string.
2. If no explicit zhuyin is supplied, it resolves through:
   - App override object, keyed by Hanzi.
   - `COMMON_ZHUYIN`.
   - `pinyin-pro` in numeric tone mode.
   - Empty string on failure.
3. Pinyin conversion normalizes y/w forms, handles j/q/x plus u as ü, removes the apical final for ㄓ ㄔ ㄕ ㄖ ㄗ ㄘ ㄙ, and appends tone marks.
4. `parseZhuyin` strips tone marks from the string and returns `{ chars, tone, type }`.
5. `buildCharHTML` renders the Hanzi slot and a fixed-width zhuyin track.

## Tone Model

The project treats tones as layout instructions, not inline text width.

- First tone: no mark, no occupied tone space.
- Second tone: `ˊ` U+02CA.
- Third tone: `ˇ` U+02C7.
- Fourth tone: `ˋ` U+02CB.
- Light tone: `˙` U+02D9.

Standard tones are rendered as a child of the final zhuyin symbol:

```css
.bb-zy-tone {
  font-size: 0.8em;
  position: absolute;
  left: 100%;
  top: -0.15em;
  white-space: nowrap;
}
```

Light tone is rendered as a separate leading `.bb-zy-light` slot. The source accepts `˙ㄉㄜ` and `ㄉㄜ˙`, then displays the dot before the zhuyin symbols.

## Geometry

Default parameters from `黑板/app.js`:

```js
fsMult = 1.0
cellHMult = 1.55
zyScale = 0.35
zySpacing = 1.1
zySqueeze = 0.1
colGapMult = 0.18
```

Derived geometry:

```js
zySize = Math.round(fs * zyScale)
zyW = Math.round(zySize * 2.4)
cellH = Math.round(fs * cellHMult)
colGap = Math.round(fs * colGapMult)
```

Every character cell uses:

- A Hanzi slot with `width: fs px`, `font-size: fs px`, `line-height: 1`, `font-weight: 900`, and `text-align: center`.
- A zhuyin track with `width: zyW px`, `font-size: zySize px`, and `margin-left: 2px`.
- A blank `zyW` placeholder when the character has no zhuyin.

This fixed reservation is the main alignment rule. Do not let zhuyin width, tone marks, punctuation, or missing zhuyin change the Hanzi grid.

## Zhuyin Vertical Spacing

The project compresses multi-symbol zhuyin by reducing each symbol slot height:

```js
slots = zhuyinChars.length + (type === "light" ? 1 : 0)
gap = Math.max(0.4, slots > 1 ? zySpacing - (slots - 1) * zySqueeze : zySpacing)
```

Each `.bb-zy-char` and `.bb-zy-light` receives `height: gap em`.

## Vertical Blackboard Layout

The board uses custom flex layout instead of native `writing-mode`.

- Each text line becomes one vertical column.
- Each column is `display:flex; flex-direction:column; align-items:flex-start;`.
- Each cell has fixed `height: cellH px`.
- The full board is a flex row aligned to the end. The original app reverses columns so the date column appears rightmost.
- The board font is `"Noto Sans TC", serif`.

Special cases from the source:

- `-`, `~`, `～`, and `至` become vertical `︱`, centered in the Hanzi slot, with an empty zhuyin track.
- Consecutive ASCII letters, digits, `%`, and `.` are grouped into a single horizontal run in the Hanzi slot.
- ASCII run size uses:

```js
maxAlphaFs = Math.round(fs * 1.15)
fitFs = Math.round(fs * 0.95 / Math.max(1, run.length))
alphaFs = Math.min(maxAlphaFs, Math.max(fitFs, Math.round(fs * 0.7)))
```

## Standard Notes From The PDF

The bundled PDF states the same tone-placement assumptions that the app implements:

- Mandarin standard tone marks sit near the upper-right of the final zhuyin symbol in vertical annotation.
- Standard tone marks are slightly smaller than zhuyin symbols and should not occupy the main line space.
- Mandarin light tone is a preceding mark that occupies proportional space.
- For browser vertical text where tone marks rotate, use `text-orientation: upright;` to keep tone marks upright.

The app deliberately implements this behavior in DOM and CSS so it is not dependent on a font's OpenType zhuyin support.
