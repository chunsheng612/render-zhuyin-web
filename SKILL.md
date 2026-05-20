---
name: render-zhuyin-web
description: Render Mandarin Zhuyin or Bopomofo in web pages using the 班級黑板 display logic. Use when building, styling, reviewing, or fixing any HTML, CSS, JavaScript, React, Vue, or Svelte page that shows Chinese characters with 注音, zhuyin, bopomofo, ruby-like phonetic guides, pinyin-to-zhuyin conversion, tone mark placement, light tone display, or vertical Chinese blackboard and worksheet text. Always apply this skill for zhuyin web UI so tone marks, light tone, reserved tracks, character alignment, and fallback conversion match the Blackboard project.
---

# Render Zhuyin Web

Use the 班級黑板 zhuyin renderer as the default display logic for any web UI that puts 注音 beside Chinese characters. The goal is visual stability: every Hanzi cell reserves the same zhuyin track, tone marks never change cell width, and light tone is handled as a leading occupied slot.

## Use The Bundled Renderer

For new HTML or JavaScript work, start from:

- `assets/zhuyin-renderer/zhuyin-renderer.js`
- `assets/zhuyin-renderer/zhuyin-renderer.css`

Copy or port the renderer into the target project, preserving the geometry constants and DOM structure unless the user explicitly asks for a different visual system. For framework code, keep the same data model and CSS behavior even if the markup is generated through components.

Read `references/blackboard-zhuyin-logic.md` when you need the source-derived rationale, exact formulas, or the PDF standard notes behind the implementation.

## Required Rendering Rules

Resolve zhuyin per character in this order:

1. Per-character overrides supplied by the app.
2. A hardcoded common-character map.
3. `pinyin-pro` with `{ toneType: "num", type: "string" }`, then convert numeric pinyin to zhuyin.
4. Empty string for non-Chinese characters or failed conversion.

Parse zhuyin strings by separating tone marks from zhuyin symbols:

- Standard tones are `ˊ` U+02CA, `ˇ` U+02C7, and `ˋ` U+02CB.
- Light tone is `˙` U+02D9. Accept it before or after the zhuyin symbols, but render it as a leading occupied slot.
- First tone has no mark and occupies no tone space.

Render each Hanzi and its zhuyin as one fixed-width flex cell:

- Hanzi slot width: `fs` px.
- Zhuyin font size: `zySize = round(fs * zyScale)`, default `zyScale = 0.35`.
- Zhuyin track width: `zyW = round(zySize * 2.4)`.
- Track margin-left: `2px`.
- If a character has no zhuyin, still render a blank `zyW` track so every Hanzi column aligns.

Lay out zhuyin symbols vertically inside the track:

- `slots = zhuyinSymbolCount + 1` for light tone, otherwise `zhuyinSymbolCount`.
- `gap = max(0.4, slots > 1 ? zySpacing - (slots - 1) * zySqueeze : zySpacing)`.
- Defaults: `zySpacing = 1.1em`, `zySqueeze = 0.1`.
- Standard tones render only on the last zhuyin symbol as an absolutely positioned child: `font-size: 0.8em; left: 100%; top: -0.15em;`.
- Light tone renders as its own first slot before the symbols.

For vertical blackboard or worksheet text:

- Treat each input line as one vertical column.
- Each row/cell height should be `cellH = round(fs * cellHMult)`, default `cellHMult = 1.55`.
- Keep each column as `flex-direction: column` and each cell as a fixed-height flex row.
- Group contiguous ASCII letters, digits, `%`, and `.` into one horizontal run placed in the Hanzi slot with an empty zhuyin track.
- Render range dashes such as `-`, `~`, `～`, and `至` as `︱` in the Hanzi slot with an empty zhuyin track.

## Validation Checklist

Before finishing zhuyin UI work, verify these cases:

- `星 ㄒㄧㄥ`, `期 ㄑㄧˊ`, `語 ㄩˇ`, and `日 ㄖˋ` align to the same Hanzi column.
- A no-zhuyin symbol or punctuation still reserves the blank zhuyin track when it appears in the same vertical flow.
- A standard tone sits at the upper-right of the final zhuyin symbol and does not widen or shift the cell.
- Light tone `˙` appears as a leading occupied slot, even when the source string stores it at the end, such as `ㄉㄜ˙`.
- Multi-symbol zhuyin such as `ㄒㄩㄝˊ` remains compact through the spacing and squeeze formula.
- ASCII runs such as `A1`, `5%`, or `3.5` stay horizontally grouped in the Hanzi slot.

If the target page uses native CSS vertical writing mode instead of the bundled flex-column layout, force zhuyin and tone marks upright with `text-orientation: upright;` where applicable, then re-check tone placement visually.
