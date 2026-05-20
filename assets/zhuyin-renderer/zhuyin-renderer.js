(function(root) {
  "use strict";

  var initials = {
    b: "ㄅ", p: "ㄆ", m: "ㄇ", f: "ㄈ",
    d: "ㄉ", t: "ㄊ", n: "ㄋ", l: "ㄌ",
    g: "ㄍ", k: "ㄎ", h: "ㄏ",
    j: "ㄐ", q: "ㄑ", x: "ㄒ",
    zh: "ㄓ", ch: "ㄔ", sh: "ㄕ", r: "ㄖ",
    z: "ㄗ", c: "ㄘ", s: "ㄙ"
  };

  var finals = {
    a: "ㄚ", o: "ㄛ", e: "ㄜ", i: "ㄧ", u: "ㄨ", v: "ㄩ",
    ai: "ㄞ", ei: "ㄟ", ao: "ㄠ", ou: "ㄡ",
    an: "ㄢ", en: "ㄣ", ang: "ㄤ", eng: "ㄥ", er: "ㄦ",
    ia: "ㄧㄚ", ie: "ㄧㄝ", iao: "ㄧㄠ", iu: "ㄧㄡ", iou: "ㄧㄡ",
    ian: "ㄧㄢ", in: "ㄧㄣ", iang: "ㄧㄤ", ing: "ㄧㄥ",
    ua: "ㄨㄚ", uo: "ㄨㄛ", uai: "ㄨㄞ", ui: "ㄨㄟ", uei: "ㄨㄟ",
    uan: "ㄨㄢ", un: "ㄨㄣ", uen: "ㄨㄣ", uang: "ㄨㄤ", ong: "ㄨㄥ",
    ve: "ㄩㄝ", ue: "ㄩㄝ",
    van: "ㄩㄢ", vn: "ㄩㄣ", iong: "ㄩㄥ"
  };

  var toneMarks = ["", "", "\u02CA", "\u02C7", "\u02CB"];
  var lightTone = "\u02D9";
  var standardTones = ["\u02CA", "\u02C7", "\u02CB"];

  var COMMON_ZHUYIN = {
    "一": "ㄧ", "二": "ㄦˋ", "三": "ㄙㄢ", "四": "ㄙˋ", "五": "ㄨˇ",
    "六": "ㄌㄧㄡˋ", "七": "ㄑㄧ", "八": "ㄅㄚ", "九": "ㄐㄧㄡˇ", "十": "ㄕˊ",
    "百": "ㄅㄞˇ", "千": "ㄑㄧㄢ", "萬": "ㄨㄢˋ", "零": "ㄌㄧㄥˊ",
    "月": "ㄩㄝˋ", "日": "ㄖˋ", "星": "ㄒㄧㄥ", "期": "ㄑㄧˊ",
    "年": "ㄋㄧㄢˊ", "今": "ㄐㄧㄣ", "天": "ㄊㄧㄢ",
    "國": "ㄍㄨㄛˊ", "語": "ㄩˇ", "數": "ㄕㄨˋ", "學": "ㄒㄩㄝˊ",
    "自": "ㄗˋ", "然": "ㄖㄢˊ", "社": "ㄕㄜˋ", "會": "ㄏㄨㄟˋ",
    "音": "ㄧㄣ", "樂": "ㄩㄝˋ", "體": "ㄊㄧˇ", "育": "ㄩˋ",
    "美": "ㄇㄟˇ", "術": "ㄕㄨˋ", "健": "ㄐㄧㄢˋ", "康": "ㄎㄤ",
    "電": "ㄉㄧㄢˋ", "腦": "ㄋㄠˇ", "英": "ㄧㄥ", "文": "ㄨㄣˊ",
    "彈": "ㄊㄢˊ", "性": "ㄒㄧㄥˋ", "綜": "ㄗㄨㄥ", "合": "ㄏㄜˊ",
    "第": "ㄉㄧˋ", "課": "ㄎㄜˋ", "生": "ㄕㄥ", "字": "ㄗˋ",
    "回": "ㄏㄨㄟˊ", "家": "ㄐㄧㄚ", "作": "ㄗㄨㄛˋ", "業": "ㄧㄝˋ",
    "功": "ㄍㄨㄥ", "明": "ㄇㄧㄥˊ", "穿": "ㄔㄨㄢ",
    "運": "ㄩㄣˋ", "動": "ㄉㄨㄥˋ", "服": "ㄈㄨˊ",
    "習": "ㄒㄧˊ", "讀": "ㄉㄨˊ", "寫": "ㄒㄧㄝˇ",
    "的": "ㄉㄜ˙", "了": "ㄌㄜ˙", "是": "ㄕˋ", "我": "ㄨㄛˇ",
    "不": "ㄅㄨˋ", "有": "ㄧㄡˇ", "在": "ㄗㄞˋ", "和": "ㄏㄜˊ",
    "老": "ㄌㄠˇ", "師": "ㄕ", "同": "ㄊㄨㄥˊ",
    "請": "ㄑㄧㄥˇ", "帶": "ㄉㄞˋ", "交": "ㄐㄧㄠ", "來": "ㄌㄞˊ"
  };

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseZhuyin(str) {
    if (!str) return { chars: [], tone: "", type: "" };
    var charsStr = String(str).trim();
    var tone = "";
    var type = "";

    if (charsStr.indexOf(lightTone) >= 0) {
      charsStr = charsStr.split(lightTone).join("");
      tone = lightTone;
      type = "light";
    } else {
      for (var i = 0; i < standardTones.length; i++) {
        if (charsStr.indexOf(standardTones[i]) >= 0) {
          charsStr = charsStr.split(standardTones[i]).join("");
          tone = standardTones[i];
          type = "standard";
          break;
        }
      }
    }

    return {
      chars: Array.from(charsStr.replace(/\s+/g, "")),
      tone: tone,
      type: type
    };
  }

  function convertPinyinToZhuyin(py) {
    if (!py) return "";
    py = String(py).trim().toLowerCase();

    var tone = 0;
    var plain = py;
    var last = py.charAt(py.length - 1);
    if (last >= "1" && last <= "5") {
      tone = parseInt(last, 10);
      plain = py.slice(0, -1);
    }

    if (plain === "yi") plain = "i";
    else if (plain === "wu") plain = "u";
    else if (plain === "yu") plain = "v";
    else if (plain === "yin") plain = "in";
    else if (plain === "ying") plain = "ing";
    else if (plain === "yun") plain = "vn";
    else if (plain === "yue") plain = "ve";
    else if (plain === "yuan") plain = "van";
    else if (plain === "yong") plain = "iong";
    else if (plain.charAt(0) === "y") plain = plain.slice(1);
    else if (plain.charAt(0) === "w") {
      plain = plain.slice(1);
      if (plain.charAt(0) !== "u") plain = "u" + plain;
    }

    var initial = "";
    var fin = plain;
    var two = plain.slice(0, 2);
    if (initials[two]) {
      initial = initials[two];
      fin = plain.slice(2);
    } else if (plain.length && initials[plain.charAt(0)]) {
      initial = initials[plain.charAt(0)];
      fin = plain.slice(1);
      if ("jqx".indexOf(plain.charAt(0)) >= 0 && fin.charAt(0) === "u") {
        fin = "v" + fin.slice(1);
      }
    }

    if (fin === "i" && (
      initial === "ㄓ" || initial === "ㄔ" || initial === "ㄕ" ||
      initial === "ㄖ" || initial === "ㄗ" || initial === "ㄘ" || initial === "ㄙ"
    )) {
      fin = "";
    }

    var zy = "";
    if (fin && finals[fin]) {
      zy = finals[fin];
    } else if (fin) {
      for (var l = Math.min(fin.length, 5); l >= 1; l--) {
        if (finals[fin.slice(0, l)]) {
          zy = finals[fin.slice(0, l)];
          break;
        }
      }
    }

    var result = initial + zy;
    if (!result) return "";
    if (tone === 5) result = lightTone + result;
    else if (tone >= 2 && tone <= 4) result += toneMarks[tone];
    return result;
  }

  function resolvePinyinFn() {
    var source = root.pinyinPro;
    if (source && typeof source.pinyin === "function") return source.pinyin;
    if (source && source.default && typeof source.default.pinyin === "function") {
      return source.default.pinyin;
    }
    return null;
  }

  function getZhuyinForChar(char, options) {
    options = options || {};
    if (!/[\u4e00-\u9fa5]/.test(char)) return "";
    if (options.overrides && Object.prototype.hasOwnProperty.call(options.overrides, char)) {
      return options.overrides[char] || "";
    }
    if (COMMON_ZHUYIN[char]) return COMMON_ZHUYIN[char];

    var pinyinFn = options.pinyinFn || resolvePinyinFn();
    if (!pinyinFn) return "";
    try {
      var py = pinyinFn(char, { toneType: "num", type: "string" });
      if (!py || py === char) return "";
      return convertPinyinToZhuyin(String(py).trim()) || "";
    } catch (err) {
      return "";
    }
  }

  function geometry(options) {
    options = options || {};
    var fs = Math.round(options.fs || 52);
    var zyScale = options.zyScale == null ? 0.35 : options.zyScale;
    var zySpacing = options.zySpacing == null ? 1.1 : options.zySpacing;
    var zySqueeze = options.zySqueeze == null ? 0.1 : options.zySqueeze;
    var cellHMult = options.cellHMult == null ? 1.55 : options.cellHMult;
    var colGapMult = options.colGapMult == null ? 0.18 : options.colGapMult;
    var zySize = Math.round(fs * zyScale);
    var zyW = Math.round(zySize * 2.4);

    return {
      fs: fs,
      zySize: zySize,
      zyW: zyW,
      zySpacing: zySpacing,
      zySqueeze: zySqueeze,
      cellH: Math.round(fs * cellHMult),
      colGap: Math.round(fs * colGapMult)
    };
  }

  function blankTrack(g) {
    return '<div style="width:' + g.zyW + 'px;"></div>';
  }

  function hanziSlot(char, g) {
    return '<div class="bb-hanzi-slot" style="font-size:' + g.fs + 'px;width:' + g.fs + 'px;">'
      + escapeHTML(char)
      + '</div>';
  }

  function buildCharHTML(char, zy, options) {
    if (!char) return "";
    options = options || {};
    var g = geometry(options);
    if (zy === undefined) zy = getZhuyinForChar(char, options);

    if (!zy) {
      return '<div class="bb-zhuyin-pair">'
        + hanziSlot(char, g)
        + blankTrack(g)
        + '</div>';
    }

    var p = parseZhuyin(zy);
    var slots = p.chars.length + (p.type === "light" ? 1 : 0);
    var gap = Math.max(0.4, slots > 1 ? g.zySpacing - (slots - 1) * g.zySqueeze : g.zySpacing);
    var cells = [];

    if (p.type === "light") {
      cells.push('<div class="bb-zy-light" style="height:' + gap.toFixed(2) + 'em;">'
        + escapeHTML(p.tone)
        + '</div>');
    }
    for (var i = 0; i < p.chars.length; i++) {
      var tone = (i === p.chars.length - 1 && p.type === "standard")
        ? '<div class="bb-zy-tone">' + escapeHTML(p.tone) + '</div>'
        : "";
      cells.push('<div class="bb-zy-char" style="height:' + gap.toFixed(2) + 'em;">'
        + escapeHTML(p.chars[i])
        + tone
        + '</div>');
    }

    return '<div class="bb-zhuyin-pair">'
      + hanziSlot(char, g)
      + '<div class="bb-zhuyin-track" style="font-size:' + g.zySize + 'px;width:' + g.zyW + 'px;margin-left:2px;">'
      + cells.join("")
      + '</div>'
      + '</div>';
  }

  function buildAsciiHTML(run, options) {
    var g = geometry(options);
    var maxAlphaFs = Math.round(g.fs * 1.15);
    var fitFs = Math.round(g.fs * 0.95 / Math.max(1, run.length));
    var alphaFs = Math.min(maxAlphaFs, Math.max(fitFs, Math.round(g.fs * 0.7)));
    return '<div class="bb-zhuyin-pair">'
      + '<div class="bb-ascii-slot" style="font-size:' + alphaFs + 'px;width:' + g.fs + 'px;">'
      + escapeHTML(run)
      + '</div>'
      + blankTrack(g)
      + '</div>';
  }

  function buildVerticalDashHTML(options) {
    var g = geometry(options);
    var dashFs = Math.round(g.fs * 0.55);
    return '<div class="bb-zhuyin-pair">'
      + '<div class="bb-hanzi-slot" style="font-size:' + dashFs + 'px;font-weight:700;width:' + g.fs + 'px;">︱</div>'
      + blankTrack(g)
      + '</div>';
  }

  function wrapCell(inner, options) {
    var g = geometry(options);
    return '<div class="bb-zhuyin-cell" style="height:' + g.cellH + 'px;">' + inner + '</div>';
  }

  function buildVerticalTextHTML(text, options) {
    options = options || {};
    var g = geometry(options);
    var cols = [];
    var lines = String(text || "").split("\n");

    for (var li = 0; li < lines.length; li++) {
      var line = lines[li].trim();
      if (!line) continue;
      var chars = Array.from(line);
      var cells = [];

      for (var i = 0; i < chars.length; i++) {
        var ch = chars[i];
        if (ch === "-" || ch === "~" || ch === "～" || ch === "至") {
          cells.push(wrapCell(buildVerticalDashHTML(options), options));
        } else if (/[a-zA-Z0-9.%]/.test(ch)) {
          var run = ch;
          while (i + 1 < chars.length && /[a-zA-Z0-9.%]/.test(chars[i + 1])) {
            i++;
            run += chars[i];
          }
          cells.push(wrapCell(buildAsciiHTML(run, options), options));
        } else {
          cells.push(wrapCell(buildCharHTML(ch, undefined, options), options));
        }
      }

      cols.push('<div class="bb-zhuyin-column" style="margin-right:' + g.colGap + 'px;">'
        + cells.join("")
        + '</div>');
    }

    if (options.reverseColumns) cols.reverse();
    return '<div class="bb-zhuyin-board">' + cols.join("") + '</div>';
  }

  var api = {
    COMMON_ZHUYIN: COMMON_ZHUYIN,
    parseZhuyin: parseZhuyin,
    convertPinyinToZhuyin: convertPinyinToZhuyin,
    getZhuyinForChar: getZhuyinForChar,
    buildCharHTML: buildCharHTML,
    buildVerticalTextHTML: buildVerticalTextHTML
  };

  root.BlackboardZhuyin = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
