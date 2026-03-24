/**
 * 首页交互效果增强
 */

(function() {
  'use strict';

  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    /* 尽早注册下滑箭头捕获点击，避免 Material instant 吞掉首次锚点 */
    setupHomeScrollArrow();

    // 问候语 + 实时时间（每秒更新）
    startGreetingClock();
    // 检测是否是首页并添加类名
    checkIfHomepage();
    
    // 监听页面导航事件（Material for MkDocs 的 instant navigation）
    setupNavigationListener();
    
    // 滚动动画观察器
    setupScrollAnimations();
    
    // 卡片悬停效果增强
    enhanceCardHover();
    
    // 平滑滚动
    setupSmoothScroll();
  }

  /**
   * 视口底部下滑箭头：button + data-scroll-target，避免 Material instant 把 <a href="#…"> 当导航导致首次滚回顶并重绘。
   * 仅 window.scrollTo；不写 hash、不调用 checkIfHomepage，避免 teardown 首屏。
   */
  function onWindowScrollHomeScrollArrow() {
    var el = document.querySelector('.home-scroll-arrow');
    if (!el || !document.body.classList.contains('is-homepage')) return;
    el.classList.toggle('home-scroll-arrow--hidden', window.scrollY > 120);
  }

  function homeScrollHeaderOffset() {
    var header = document.querySelector('.md-header');
    if (!header) return 64;
    return Math.round(header.getBoundingClientRect().height) + 8;
  }

  function scrollToHomeHashWhenReady(hash, attemptsLeft) {
    if (attemptsLeft === undefined) attemptsLeft = 16;
    var target = document.querySelector(hash);
    if (target) {
      var y = target.getBoundingClientRect().top + window.pageYOffset - homeScrollHeaderOffset();
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      return;
    }
    if (attemptsLeft <= 0) return;
    setTimeout(function() {
      scrollToHomeHashWhenReady(hash, attemptsLeft - 1);
    }, 40);
  }

  function setupHomeScrollArrow() {
    window.addEventListener('scroll', onWindowScrollHomeScrollArrow, { passive: true });

    window.addEventListener('click', function(e) {
      var btn = e.target.closest('.home-scroll-arrow');
      if (!btn || !document.body.classList.contains('is-homepage')) return;
      var hash = btn.getAttribute('data-scroll-target');
      if (!hash || hash.charAt(0) !== '#') return;

      e.preventDefault();
      e.stopPropagation();
      scrollToHomeHashWhenReady(hash);
    }, { capture: true, passive: false });

    onWindowScrollHomeScrollArrow();
  }

  /**
   * 各时段对应的随机状态（每个时段进入时随机一次，跨时段才换）
   */
  var greetingStatusByPeriod = {};

  var periodStatuses = {
    0: [
      '三月海已经睡成猪了 (´ε` )',
      '三月海在梦里度假中 (～￣▽￣)～',
      '三月海半夜发呆，正在怀疑人生 (´・ω・`)',
      '三月海又熬夜了，明天一定早睡（才怪）(；′⌒`)',
      '三月海半夜刷手机，根本停不下来 ٩(ˊᗜˋ*)و'
    ],
    5: [
      '三月海正在艰难起床中 ＿|￣|○',
      '三月海晨跑去了，今天又是元气满满 (๑•̀ω•́)ノ',
      '三月海需要咖啡续命 (´；ω；`)',
      '三月海在享用美味的早餐 (´▽`)',
      '三月海刚睡醒，正在伸懒腰 ～(´∀`)～'
    ],
    7: [
      '三月海在吃早餐，顺便刷会儿手机 (=´∇`=)',
      '三月海在通勤路上，人挤人 (・_・;)',
      '三月海正在努力起床 (๑•̀ㅂ•́)و✧',
      '三月海靠咖啡开启新的一天 ٩(◕‿◕｡)۶',
      '三月海在通勤路上偷偷背单词 (´∀`)'
    ],
    9: [
      '三月海正在写代码，bug 离我远一点 (´・ω・`)',
      '三月海正在认真学习 (๑•̀ㅂ•́)و✧',
      '三月海正在努力搬砖 (´▽`)',
      '三月海在开会，已经困了 (´ε` )',
      '三月海敲键盘敲得噼里啪啦 ٩(ˊᗜˋ*)و',
      '三月海真的很讨厌 debug (╯°□°)╯︵ ┻━┻'
    ],
    11: [
      '三月海干饭去了，天大地大吃饭最大 (๑´ㅂ`๑)',
      '三月海在午睡，请勿打扰 (´ε` )',
      '三月海在休息，充电中 (～￣▽￣)～',
      '三月海在吃饭，干饭人干饭魂 (=´∇`=)',
      '三月海在晒太阳，懒洋洋的 (´▽`ʃ♡ƪ)'
    ],
    13: [
      '三月海需要下午茶续命 (´；ω；`)',
      '三月海正在摸鱼，别打扰他 ٩(◕‿◕｡)۶',
      '三月海在发呆，可能正在放空 (´・ω・`)',
      '三月海在划水，嘘—— (=´∇`=)',
      '三月海在做白日梦，勿扰 (～￣▽￣)～'
    ],
    15: [
      '三月海正在写代码，键盘声噼里啪啦 (๑•̀ㅂ•́)و✧',
      '三月海在学习，头秃预警 (´･ω･`)',
      '三月海在看书，岁月静好 (´▽`)',
      '三月海在刷题，痛并快乐着 (；′⌒`)',
      '三月海在搬砖，为了梦想 (๑•̀ω•́)ノ'
    ],
    18: [
      '三月海下班了，解放！٩(ˊᗜˋ*)و',
      '三月海在散步，吹吹晚风 (´∀`)',
      '三月海在吃饭，干饭时间到 (๑´ㅂ`๑)',
      '三月海在运动，燃烧卡路里 (๑•̀ω•́)ノ',
      '三月海在撸猫，幸福感爆棚 (=´∇`=)'
    ],
    20: [
      '三月海在看电影，爆米花准备好了 (´▽`)',
      '三月海在听歌，沉浸在自己的世界里 (～￣▽￣)～',
      '三月海在打游戏，别喊他吃饭 ٩(ˊᗜˋ*)و',
      '三月海在写博客，记录生活 (´∀`)',
      '三月海在放松，今天辛苦了 (´▽`ʃ♡ƪ)'
    ],
    22: [
      '三月海又熬夜了，眼睛：我累了 (；′⌒`)',
      '三月海在休息，准备睡觉啦 (´ε` )',
      '三月海在发呆，脑子已经关机 (´・ω・`)',
      '三月海还在刷手机，再刷五分钟就睡 ٩(◕‿◕｡)۶',
      '三月海准备睡觉了，晚安世界 (´∀`)～'
    ]
  };

  function getStatusForPeriod(periodKey) {
    if (!greetingStatusByPeriod[periodKey]) {
      var list = periodStatuses[periodKey] || periodStatuses[0];
      greetingStatusByPeriod[periodKey] = list[Math.floor(Math.random() * list.length)];
    }
    return greetingStatusByPeriod[periodKey];
  }

  /* ---------- Open-Meteo 实时天气 + 首页粒子动效（无需 API Key） ---------- */
  /** 定时刷新间隔：仅后台静默更新，避免观感上频繁跳动 */
  var WEATHER_REFRESH_MS = 60 * 60 * 1000;

  var weatherState = {
    raf: null,
    thunderTimer: null,
    refreshTimer: null,
    resizeHandler: null,
    mode: 'none',
    particles: [],
    cssW: 0,
    cssH: 0,
    /** 最近一次成功拉取的天气，供问候语联动 */
    snapshot: null
  };

  /** 问候语与天气拼接缓存（时段|天气 变化时才重新抽签） */
  var greetingWeatherStatusCache = { key: null, text: null };

  /**
   * 按天气现象随机抽一句「氛围旁白」，与时段里的三月海状态拼在一起
   * 支持占位符 {label} → 实况中文（如 小雨、阵雨）
   */
  var weatherStatusPrefixes = {
    clear: [
      '天儿透亮，',
      '阳光正好，',
      '大晴天呢，',
      '紫外线有点凶，',
      '碧空如洗，',
      '蓝天没商量，',
      '晒得人懒洋洋的，'
    ],
    cloudy: [
      '云层厚厚的，',
      '天色有点阴，',
      '不算特别晒，',
      '像要变天的样子，',
      '灰蒙蒙的天空下，',
      '阳光被云吃掉了，',
      '气压闷闷的，'
    ],
    fog: [
      '雾有点大，',
      '能见度一般，',
      '空气湿漉漉的，',
      '窗外一片朦胧，'
    ],
    rain: [
      '外面正{label}，',
      '雨声淅沥，',
      '地上反光湿漉漉的，',
      '这种天气适合宅，',
      '伞记得晾干，',
      '屋檐滴水哒哒响，',
      '空气湿度拉满，'
    ],
    snow: [
      '雪飘飘的，',
      '外面白茫茫一片，',
      '踩雪咯吱响的日子，',
      '冷气里带着雪味，',
      '窗台上积了薄雪，',
      '呵气成雾的季节，'
    ],
    thunder: [
      '电闪雷鸣的，',
      '雷雨天，',
      '轰隆隆的，',
      '强对流来了，',
      '天公在发脾气，',
      '一道闪电划过去，',
      '雨幕里夹着雷声，'
    ]
  };

  var weatherStatusSuffixes = {
    clear: [
      ' 出门记得防晒～',
      ' 心情也容易跟着亮起来。',
      ' 晒晒太阳补补钙也不错。'
    ],
    cloudy: [
      ' 适合泡杯茶慢慢干活。',
      ' 光线柔和不伤眼。',
      ' 窝在室内最舒服了。'
    ],
    fog: [
      ' 路上要小心车辆呀。',
      ' 开车记得开雾灯。',
      ' 在家当宅宅最安全。'
    ],
    rain: [
      ' 听雨写代码也挺治愈。',
      ' 别淋感冒了。',
      ' 热饮可以安排上。'
    ],
    snow: [
      ' 手脚冰冷记得捂暖。',
      ' 堆雪人前先把手套戴好。',
      ' 热饮续命。'
    ],
    thunder: [
      ' 电器防雷要小心。',
      ' 尽量别在树下逗留。',
      ' 缩在室内最稳妥。'
    ]
  };

  function pickFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * 把天气旁白与时段随机状态拼成一句（旁白在前，「三月海…」在后）
   */
  function buildGreetingWithWeather(base, snap) {
    var effect = snap.effect || 'cloudy';
    var prefixes = weatherStatusPrefixes[effect] || weatherStatusPrefixes.cloudy;
    var prefix = pickFrom(prefixes).replace(/\{label\}/g, snap.labelZh || '');
    var temp = snap.temp;
    if (temp >= 33 && Math.random() < 0.5) {
      prefix = '闷热得像蒸笼，' + prefix;
    } else if (temp >= 28 && temp < 33 && Math.random() < 0.35) {
      prefix = '有点燥热，' + prefix;
    } else if (temp <= 0 && Math.random() < 0.5) {
      prefix = '冷到哆嗦，' + prefix;
    } else if (temp > 0 && temp <= 6 && Math.random() < 0.4) {
      prefix = '凉飕飕的，' + prefix;
    }
    var out = prefix + base;
    var sufList = weatherStatusSuffixes[effect];
    if (sufList && sufList.length && Math.random() < 0.4) {
      out += pickFrom(sufList);
    }
    return out;
  }

  function weatherCodeToZh(code) {
    var map = {
      0: '晴', 1: '少云', 2: '多云', 3: '阴',
      45: '雾', 48: '雾凇',
      51: '小毛毛雨', 53: '毛毛雨', 55: '大毛毛雨', 56: '冻毛毛雨', 57: '冻毛毛雨',
      61: '小雨', 63: '中雨', 65: '大雨', 66: '冻雨', 67: '冻雨',
      71: '小雪', 73: '中雪', 75: '大雪', 77: '雪粒',
      80: '小阵雨', 81: '阵雨', 82: '强阵雨',
      85: '小阵雪', 86: '阵雪',
      95: '雷暴', 96: '雷暴伴冰雹', 99: '强雷暴伴冰雹'
    };
    return map[code] != null ? map[code] : '多云';
  }

  function wmoCodeToEffect(code) {
    if (code === 0) return 'clear';
    if (code >= 1 && code <= 3) return 'cloudy';
    if (code === 45 || code === 48) return 'fog';
    if (code >= 51 && code <= 67) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rain';
    if (code >= 85 && code <= 86) return 'snow';
    if (code >= 95) return 'thunder';
    return 'cloudy';
  }

  function windMsToZh(ms) {
    if (ms == null || isNaN(ms)) return '风力 —';
    if (ms < 0.3) return '静风';
    if (ms < 3.4) return '微风';
    if (ms < 8) return '和风';
    if (ms < 13.9) return '清风';
    return '阵风较大';
  }

  function formatWeatherLine(d) {
    return d.placeName + ' · ' + d.labelZh + ' ' + Math.round(d.temp) + '°C · 湿度 ' +
      Math.round(d.humidity) + '% · ' + windMsToZh(d.windMs);
  }

  function fetchForecast(lat, lon, placeName) {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
      '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=ms&timezone=auto';
    return fetch(url).then(function(r) {
      if (!r.ok) throw new Error('forecast http');
      return r.json();
    }).then(function(j) {
      if (!j.current) throw new Error('no current');
      var c = j.current;
      var code = c.weather_code;
      return {
        placeName: placeName,
        temp: c.temperature_2m,
        humidity: c.relative_humidity_2m,
        windMs: c.wind_speed_10m,
        code: code,
        labelZh: weatherCodeToZh(code),
        effect: wmoCodeToEffect(code)
      };
    });
  }

  function fetchOpenMeteoWeather(opts) {
    var lat = opts.lat;
    var lon = opts.lon;
    if (lat != null && !isNaN(lat) && lon != null && !isNaN(lon)) {
      var label = opts.city && opts.city.trim() ? opts.city.trim() : '当前位置';
      return fetchForecast(lat, lon, label);
    }
    if (!opts.city || !opts.city.trim()) {
      return Promise.reject(new Error('no city'));
    }
    var gUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(opts.city.trim()) +
      '&count=1&language=zh';
    return fetch(gUrl).then(function(r) {
      if (!r.ok) throw new Error('geo http');
      return r.json();
    }).then(function(geo) {
      if (!geo.results || !geo.results.length) throw new Error('no location');
      var r0 = geo.results[0];
      var name = r0.name || opts.city.trim();
      return fetchForecast(r0.latitude, r0.longitude, name);
    });
  }

  function randomInRange(a, b) {
    return a + Math.random() * (b - a);
  }

  function makeParticles(mode, w, h) {
    var list = [];
    var n;
    if (mode === 'rain' || mode === 'thunder') n = 140;
    else if (mode === 'snow') n = 70;
    else if (mode === 'cloudy') n = 36;
    else if (mode === 'clear') n = 18;
    else n = 0;

    var i;
    for (i = 0; i < n; i++) {
      if (mode === 'rain' || mode === 'thunder') {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vy: randomInRange(14, 22),
          len: randomInRange(10, 18),
          wind: randomInRange(-0.5, 0.5)
        });
      } else if (mode === 'snow') {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vy: randomInRange(0.8, 2.2),
          vx: randomInRange(-0.4, 0.4),
          r: randomInRange(1.2, 3.5),
          phase: Math.random() * Math.PI * 2
        });
      } else if (mode === 'cloudy') {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: randomInRange(20, 55),
          vx: randomInRange(-0.15, 0.15),
          vy: randomInRange(-0.08, 0.08),
          a: randomInRange(0.06, 0.14)
        });
      } else if (mode === 'clear') {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: randomInRange(0.8, 2),
          vx: randomInRange(-0.2, 0.2),
          vy: randomInRange(-0.35, -0.1),
          a: randomInRange(0.15, 0.35)
        });
      }
    }
    return list;
  }

  function resizeWeatherCanvas() {
    var canvas = document.getElementById('weatherCanvas');
    var stack = document.querySelector('.home-hero-canvas-stack');
    if (!canvas || !stack) return;
    var rect = stack.getBoundingClientRect();
    var cssW = rect.width;
    var cssH = rect.height;
    if (cssW < 1 || cssH < 1) return;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    weatherState.cssW = cssW;
    weatherState.cssH = cssH;
    weatherState.ctx = ctx;
    weatherState.particles = makeParticles(weatherState.mode, cssW, cssH);
  }

  function drawWeatherFrame() {
    var ctx = weatherState.ctx;
    var w = weatherState.cssW;
    var h = weatherState.cssH;
    var mode = weatherState.mode;
    if (!ctx || !w || !h || mode === 'none' || mode === 'fog') {
      weatherState.raf = null;
      return;
    }

    var isDark = document.documentElement.getAttribute('data-md-color-scheme') === 'slate';
    ctx.clearRect(0, 0, w, h);

    var particles = weatherState.particles;
    var i;
    var p;

    if (mode === 'rain' || mode === 'thunder') {
      ctx.strokeStyle = isDark ? 'rgba(200, 220, 255, 0.35)' : 'rgba(80, 100, 160, 0.25)';
      ctx.lineWidth = 1;
      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.wind * 6, p.y + p.len);
        ctx.stroke();
        p.y += p.vy;
        p.x += p.wind;
        if (p.y > h + p.len) {
          p.y = -p.len;
          p.x = Math.random() * w;
        }
      }
    } else if (mode === 'snow') {
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.85)';
      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        p.phase += 0.02;
        p.x += p.vx + Math.sin(p.phase) * 0.6;
        p.y += p.vy;
        if (p.y > h + 5) {
          p.y = -5;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (mode === 'cloudy') {
      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -p.r) p.x = w + p.r;
        if (p.x > w + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = h + p.r;
        if (p.y > h + p.r) p.y = -p.r;
        ctx.fillStyle = isDark ? 'rgba(160, 170, 200, ' + p.a + ')' : 'rgba(120, 130, 170, ' + p.a + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (mode === 'clear') {
      for (i = 0; i < particles.length; i++) {
        p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -5) {
          p.y = h + 5;
          p.x = Math.random() * w;
        }
        ctx.fillStyle = isDark ? 'rgba(255, 230, 200, ' + p.a + ')' : 'rgba(255, 220, 150, ' + p.a + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    weatherState.raf = requestAnimationFrame(drawWeatherFrame);
  }

  function ensureThunderFlashEl() {
    var el = document.getElementById('weatherThunderFlash');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'weatherThunderFlash';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    return el;
  }

  function stopHomepageWeather() {
    if (weatherState.raf) {
      cancelAnimationFrame(weatherState.raf);
      weatherState.raf = null;
    }
    if (weatherState.thunderTimer) {
      clearInterval(weatherState.thunderTimer);
      weatherState.thunderTimer = null;
    }
    if (weatherState.refreshTimer) {
      clearInterval(weatherState.refreshTimer);
      weatherState.refreshTimer = null;
    }
    if (weatherState.resizeHandler) {
      window.removeEventListener('resize', weatherState.resizeHandler);
      weatherState.resizeHandler = null;
    }
    weatherState.mode = 'none';
    weatherState.particles = [];
    document.body.removeAttribute('data-weather-effect');
    var fog = document.getElementById('weatherFogLayer');
    if (fog) fog.remove();
    var flash = document.getElementById('weatherThunderFlash');
    if (flash) flash.remove();
    var canvas = document.getElementById('weatherCanvas');
    if (canvas) {
      var cctx = canvas.getContext('2d');
      if (cctx) cctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    weatherState.snapshot = null;
    greetingWeatherStatusCache.key = null;
    greetingWeatherStatusCache.text = null;
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function applyWeatherVisual(effect) {
    document.body.setAttribute('data-weather-effect', effect);
    weatherState.mode = effect;

    var fogEl = document.getElementById('weatherFogLayer');
    if (fogEl) fogEl.remove();

    if (weatherState.thunderTimer) {
      clearInterval(weatherState.thunderTimer);
      weatherState.thunderTimer = null;
    }
    var oldFlash = document.getElementById('weatherThunderFlash');
    if (oldFlash) oldFlash.remove();

    if (prefersReducedMotion()) {
      return;
    }

    if (window.matchMedia('(max-width: 768px)').matches) {
      return;
    }

    if (effect === 'fog') {
      var stack = document.querySelector('.home-hero-canvas-stack');
      if (!stack) return;
      var div = document.createElement('div');
      div.id = 'weatherFogLayer';
      div.className = 'weather-fog-layer';
      div.setAttribute('aria-hidden', 'true');
      stack.appendChild(div);
      return;
    }

    if (effect === 'clear' || effect === 'cloudy' || effect === 'rain' || effect === 'snow' || effect === 'thunder') {
      resizeWeatherCanvas();
      if (!weatherState.resizeHandler) {
        weatherState.resizeHandler = function() {
          if (weatherState.mode !== 'none' && weatherState.mode !== 'fog') {
            resizeWeatherCanvas();
          }
        };
        window.addEventListener('resize', weatherState.resizeHandler);
      }
      if (weatherState.raf) cancelAnimationFrame(weatherState.raf);
      weatherState.raf = requestAnimationFrame(drawWeatherFrame);
    }

    if (effect === 'thunder') {
      var flashEl = ensureThunderFlashEl();
      weatherState.thunderTimer = setInterval(function() {
        if (document.body.getAttribute('data-weather-effect') !== 'thunder') return;
        flashEl.style.opacity = '0.22';
        setTimeout(function() {
          flashEl.style.opacity = '0';
        }, 40);
        setTimeout(function() {
          if (Math.random() < 0.35) {
            flashEl.style.opacity = '0.12';
            setTimeout(function() {
              flashEl.style.opacity = '0';
            }, 30);
          }
        }, 120);
      }, randomInRange(2800, 7000));
    }
  }

  function initHomepageWeather() {
    var greeting = document.getElementById('greeting');
    var weatherEl = document.getElementById('greeting-weather');
    if (!weatherEl) return;

    stopHomepageWeather();

    var city = greeting ? greeting.getAttribute('data-weather-city') : null;
    var latAttr = greeting ? greeting.getAttribute('data-weather-lat') : null;
    var lonAttr = greeting ? greeting.getAttribute('data-weather-lon') : null;
    var lat = latAttr != null && String(latAttr).trim() !== '' ? parseFloat(latAttr) : null;
    var lon = lonAttr != null && String(lonAttr).trim() !== '' ? parseFloat(lonAttr) : null;

    var hasCoords = lat != null && !isNaN(lat) && lon != null && !isNaN(lon);
    var hasCity = city && city.trim();

    if (!hasCoords && !hasCity) {
      weatherEl.textContent = '';
      return;
    }

    weatherEl.textContent = '天气加载中…';

    var opts = { city: hasCity ? city.trim() : '', lat: lat, lon: lon };

    fetchOpenMeteoWeather(opts)
      .then(function(data) {
        weatherState.snapshot = {
          effect: data.effect,
          labelZh: data.labelZh,
          temp: data.temp,
          code: data.code
        };
        greetingWeatherStatusCache.key = null;
        weatherEl.textContent = formatWeatherLine(data);
        applyWeatherVisual(data.effect);
        weatherState.refreshTimer = setInterval(function() {
          fetchOpenMeteoWeather(opts)
            .then(function(d) {
              weatherState.snapshot = {
                effect: d.effect,
                labelZh: d.labelZh,
                temp: d.temp,
                code: d.code
              };
              greetingWeatherStatusCache.key = null;
              weatherEl.textContent = formatWeatherLine(d);
              if (d.effect !== weatherState.mode) {
                applyWeatherVisual(d.effect);
              }
            })
            .catch(function() {});
        }, WEATHER_REFRESH_MS);
      })
      .catch(function() {
        weatherEl.textContent = '天气暂时无法获取（可检查城市名或网络）';
      });
  }

  /**
   * 问候语：你好，现在是X年X月X日星期X{时段}的X点X分X秒。三月海应该在...
   */
  function updateGreeting() {
    const timeEl = document.getElementById('greeting-time');
    const statusEl = document.getElementById('greeting-status');
    if (!timeEl || !statusEl) return;

    const now = new Date();
    const hour = now.getHours();
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const periodDefs = [
      [0, 5, '凌晨', 0], [5, 7, '清晨', 5], [7, 9, '早上', 7], [9, 11, '上午', 9],
      [11, 13, '中午', 11], [13, 15, '午后', 13], [15, 18, '下午', 15], [18, 20, '傍晚', 18],
      [20, 22, '晚上', 20], [22, 24, '夜深', 22]
    ];

    const period = periodDefs.find(function(p) {
      return hour >= p[0] && hour < p[1];
    }) || periodDefs[0];
    const periodName = period[2];
    const periodKey = period[3];
    const status = getStatusForPeriod(periodKey);
    const snap = weatherState.snapshot;

    const y = now.getFullYear();
    const mo = now.getMonth() + 1;
    const d = now.getDate();
    const w = weekdays[now.getDay()];
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    timeEl.textContent = '现在是' + y + '年' + mo + '月' + d + '日星期' + w + periodName + '的' + h + '点' + m + '分' + s + '秒。';

    if (!snap) {
      greetingWeatherStatusCache.key = null;
      greetingWeatherStatusCache.text = null;
      statusEl.textContent = status;
    } else {
      var combinedKey = String(periodKey) + '|' + snap.effect + '|' + snap.code + '|' + Math.round(snap.temp);
      if (greetingWeatherStatusCache.key !== combinedKey) {
        greetingWeatherStatusCache.key = combinedKey;
        greetingWeatherStatusCache.text = buildGreetingWithWeather(status, snap);
      }
      statusEl.textContent = greetingWeatherStatusCache.text;
    }
  }

  /**
   * 启动问候语 + 时间实时更新（每秒刷新）
   */
  function startGreetingClock() {
    updateGreeting();
    setInterval(updateGreeting, 1000);
  }

  /**
   * 设置导航监听器，在页面切换时重新检测首页状态
   */
  function setupNavigationListener() {
    // 防抖函数，避免频繁调用
    let checkTimeout = null;
    function debouncedCheck() {
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
      checkTimeout = setTimeout(checkIfHomepage, 150);
    }

    // 监听 Material for MkDocs 的导航事件
    // Material for MkDocs 在页面切换时会触发这些事件
    document.addEventListener('navigation', debouncedCheck);

    // 监听 locationchange 事件（某些版本的 Material 使用这个）
    window.addEventListener('locationchange', debouncedCheck);

    // 监听 popstate 事件（浏览器前进/后退）
    window.addEventListener('popstate', debouncedCheck);

    // 同页锚点（如下滑箭头 #about-me）后部分主题会替换正文 DOM，需复检首屏组件
    window.addEventListener('hashchange', debouncedCheck);

    // 监听所有链接点击事件（作为备用方案）
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href]');
      if (link && link.hostname === window.location.hostname && !link.hash) {
        // 只处理非锚点链接，延迟执行，等待页面切换完成
        setTimeout(debouncedCheck, 200);
      }
    }, true);

    // 使用 MutationObserver 监听 DOM 变化（作为最后的备用方案）
    // 只监听主要内容区域的变化，避免过度触发
    const observer = new MutationObserver(function(mutations) {
      // 检查是否有主要内容区域的变化
      const hasContentChange = mutations.some(function(mutation) {
        const target = mutation.target;
        // 检查是否是主要内容区域或其子元素的变化
        return target.classList && (
          target.classList.contains('md-content') ||
          target.classList.contains('md-content__inner') ||
          target.classList.contains('md-main') ||
          target.closest('.md-content') !== null
        );
      });
      
      if (hasContentChange) {
        debouncedCheck();
      }
    });

    // 观察主要内容区域的变化
    const mainContent = document.querySelector('.md-main') || document.body;
    /* 勿监听 attributes：滚动淡入会给子节点加 class，频繁触发 checkIfHomepage */
    observer.observe(mainContent, {
      childList: true,
      subtree: true
    });
  }

  /**
   * 记录上次是否在首页，用于判断是否为「刚进入首页」（避免因 MutationObserver 被时间更新触发而误判）
   */
  var wasOnHomepage = false;

  var gridCanvasInitialized = false;
  var gridCanvasLifecycle = {
    rafId: null,
    onResize: null,
    onMove: null,
    onLeave: null,
    observer: null,
    canvas: null
  };

  function teardownGridCanvas() {
    if (gridCanvasLifecycle.rafId != null) {
      cancelAnimationFrame(gridCanvasLifecycle.rafId);
      gridCanvasLifecycle.rafId = null;
    }
    if (gridCanvasLifecycle.onResize) {
      window.removeEventListener('resize', gridCanvasLifecycle.onResize);
      gridCanvasLifecycle.onResize = null;
    }
    if (gridCanvasLifecycle.onMove) {
      document.removeEventListener('mousemove', gridCanvasLifecycle.onMove);
      gridCanvasLifecycle.onMove = null;
    }
    if (gridCanvasLifecycle.onLeave) {
      document.removeEventListener('mouseleave', gridCanvasLifecycle.onLeave);
      gridCanvasLifecycle.onLeave = null;
    }
    if (gridCanvasLifecycle.observer) {
      gridCanvasLifecycle.observer.disconnect();
      gridCanvasLifecycle.observer = null;
    }
    gridCanvasLifecycle.canvas = null;
    gridCanvasInitialized = false;
  }

  /**
   * 检测是否是首页，如果是则添加类名以便 CSS 控制
   * 每次页面切换时都会调用此函数，确保类名状态正确
   */
  function checkIfHomepage() {
    // 检查 URL 路径判断是否为首页
    const path = window.location.pathname;
    const pathname = path.replace(/\/$/, ''); // 移除末尾的斜杠
    
    const isHomepagePath = pathname === '' || 
                           pathname === '/' || 
                           pathname === '/index' ||
                           pathname === '/index.html' ||
                           pathname.endsWith('/index') ||
                           pathname.endsWith('/index.html');
    
    const activeTabLink = document.querySelector('.md-tabs__item--active .md-tabs__link');
    const isHomepageTab = activeTabLink && (
      activeTabLink.getAttribute('href') === '.' ||
      activeTabLink.getAttribute('href') === './' ||
      activeTabLink.getAttribute('href') === '/' ||
      activeTabLink.textContent.trim() === '首页'
    );
    
    const isHomepage = isHomepagePath || isHomepageTab;

    /* 已在首页且 body 已带 is-homepage：若首屏 DOM 仍完整则跳过（避免仅因 class 变化去 strip/add）。
       若 #gridCanvas 等已被 instant 导航换节点但 body 类名未清，须 teardown 后重绑，否则方格/打字/天气不会再 init。 */
    if (isHomepage && document.body.classList.contains('is-homepage')) {
      if (isHomepageHeroHealthy()) {
        return;
      }
      teardownGridCanvas();
      stopHomepageWeather();
      typewriterInitialized = false;
      greetingStatusByPeriod = {};
      initHomepageWeather();
      initGridCanvas();
      initTypewriter();
      updateGreeting();
      onWindowScrollHomeScrollArrow();
      return;
    }

    // 始终先移除类名，然后再根据判断结果添加
    // 这样可以确保状态正确，避免残留的类名
    document.body.classList.remove('is-homepage');
    const mainElement = document.querySelector('.md-main');
    if (mainElement) {
      mainElement.classList.remove('is-homepage');
    }
    const containerElement = document.querySelector('.md-container');
    if (containerElement) {
      containerElement.classList.remove('is-homepage');
    }
    
    // 如果是首页，才添加类名并更新问候语
    if (isHomepage) {
      document.body.classList.add('is-homepage');
      if (mainElement) {
        mainElement.classList.add('is-homepage');
      }
      if (containerElement) {
        containerElement.classList.add('is-homepage');
      }
      // 仅当「从非首页进入首页」时重置问候缓存并拉取天气，避免 MutationObserver 频繁触发时重复请求、反复「加载中」
      if (!wasOnHomepage) {
        greetingStatusByPeriod = {};
        initHomepageWeather();
      }
      wasOnHomepage = true;
      updateGreeting();
      initGridCanvas();
      initTypewriter();
      onWindowScrollHomeScrollArrow();
    } else {
      wasOnHomepage = false;
      teardownGridCanvas();
      typewriterGen++;
      typewriterInitialized = false;
      stopHomepageWeather();
    }
  }

  /** 判断首页首屏关键节点是否仍在文档中且画布实例未与当前 DOM 脱节 */
  function isHomepageHeroHealthy() {
    var canvas = document.getElementById('gridCanvas');
    var tw = document.getElementById('typewriter-text');
    var greet = document.getElementById('greeting');
    if (!canvas || !canvas.isConnected || !tw || !tw.isConnected || !greet || !greet.isConnected) {
      return false;
    }
    if (!gridCanvasInitialized || gridCanvasLifecycle.canvas !== canvas) {
      return false;
    }
    return true;
  }

  /**
   * 设置滚动动画
   */
  function setupScrollAnimations() {
    // 检查是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // 观察所有需要动画的元素
    document.querySelectorAll('.fade-in, .animated-cards > *, .grid.cards ul li').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * 增强卡片悬停效果
   */
  function enhanceCardHover() {
    const cards = document.querySelectorAll('.grid.cards ul li');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    });
  }

  /**
   * 设置平滑滚动
   */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      if (anchor.classList.contains('home-scroll-arrow')) return;
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#top') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  /**
   * 渐变网格背景 Canvas（参考 Wcowin）
   * 鼠标靠近时网格线产生起伏位移；支持 DOM 替换后 teardown 再绑定
   */
  function initGridCanvas() {
    var canvas = document.getElementById('gridCanvas');
    if (!canvas) return;
    if (gridCanvasInitialized && gridCanvasLifecycle.canvas === canvas && canvas.isConnected) {
      return;
    }

    teardownGridCanvas();

    gridCanvasInitialized = true;
    gridCanvasLifecycle.canvas = canvas;

    var ctx = canvas.getContext('2d');
    var mouseX = -1000;
    var mouseY = -1000;
    var gridSize = 50;
    var influenceRadius = 150;
    var maxDisplacement = 8;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = 750;
    }

    gridCanvasLifecycle.onResize = resize;
    resize();
    window.addEventListener('resize', resize);

    gridCanvasLifecycle.onMove = function(e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    document.addEventListener('mousemove', gridCanvasLifecycle.onMove);

    gridCanvasLifecycle.onLeave = function() {
      mouseX = -1000;
      mouseY = -1000;
    };
    document.addEventListener('mouseleave', gridCanvasLifecycle.onLeave);

    var isVisible = true;

    gridCanvasLifecycle.observer = new IntersectionObserver(function(entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible && gridCanvasLifecycle.rafId == null) {
        draw();
      }
    }, { threshold: 0 });

    gridCanvasLifecycle.observer.observe(canvas);

    function draw() {
      if (!isVisible) {
        gridCanvasLifecycle.rafId = null;
        return;
      }

      if (!canvas.isConnected) {
        gridCanvasLifecycle.rafId = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var isDark = document.documentElement.getAttribute('data-md-color-scheme') === 'slate';
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;

      for (var x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        for (var y = 0; y <= canvas.height; y += 5) {
          var dx = x - mouseX;
          var dy = y - mouseY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var offsetX = 0;
          if (dist < influenceRadius) {
            var force = (1 - dist / influenceRadius) * maxDisplacement;
            offsetX = (dx / dist) * force || 0;
          }
          if (y === 0) {
            ctx.moveTo(x + offsetX, y);
          } else {
            ctx.lineTo(x + offsetX, y);
          }
        }
        ctx.stroke();
      }

      for (var y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        for (var x = 0; x <= canvas.width; x += 5) {
          var dx = x - mouseX;
          var dy = y - mouseY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var offsetY = 0;
          if (dist < influenceRadius) {
            var force = (1 - dist / influenceRadius) * maxDisplacement;
            offsetY = (dy / dist) * force || 0;
          }
          if (x === 0) {
            ctx.moveTo(x, y + offsetY);
          } else {
            ctx.lineTo(x, y + offsetY);
          }
        }
        ctx.stroke();
      }

      gridCanvasLifecycle.rafId = requestAnimationFrame(draw);
    }

    draw();
  }

  var typewriterInitialized = false;
  var typewriterGen = 0;

  /**
   * 打字机效果（参考 Wcowin）
   */
  function initTypewriter() {
    var el = document.getElementById('typewriter-text');
    if (!el) return;
    typewriterGen++;
    var gen = typewriterGen;
    typewriterInitialized = true;
    el.textContent = '';

    var phrases = [
      'Where logic meets lyric',
      'When code meets verse',
      'Between syntax and soul',
    ];

    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typeSpeed = 100;
    var deleteSpeed = 50;
    var pauseTime = 2000;
    var startDelay = 600;

    function typeWriter() {
      if (gen !== typewriterGen) return;
      var currentPhrase = phrases[phraseIndex % phrases.length];

      if (isDeleting) {
        charIndex--;
        el.textContent = currentPhrase.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeWriter, startDelay);
        } else {
          setTimeout(typeWriter, deleteSpeed);
        }
      } else {
        charIndex++;
        el.textContent = currentPhrase.substring(0, charIndex);
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(typeWriter, pauseTime);
        } else {
          setTimeout(typeWriter, typeSpeed);
        }
      }
    }

    setTimeout(typeWriter, startDelay);
  }

  /**
   * 鼠标跟随效果（可选，用于 hero 区域）
   */
  function setupMouseFollow() {
    const introSection = document.querySelector('.home-intro');
    if (!introSection) return;

    introSection.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      this.style.setProperty('--mouse-x', x + '%');
      this.style.setProperty('--mouse-y', y + '%');
    });
  }

  // 如果用户偏好减少动画，则不启用某些效果
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // 禁用动画相关功能
    return;
  } else {
    setupMouseFollow();
  }
})();
