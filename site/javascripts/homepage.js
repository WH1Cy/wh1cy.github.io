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
   * 各时段对应的随机状态（每个时段进入时随机一次，跨时段才换）
   */
  var greetingStatusByPeriod = {};

  var periodStatuses = {
    0: [
      '三月海已经睡成小猪了 (´ε` )',
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
      '三月海正在努力上班 (๑•̀ㅂ•́)و✧',
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

    const y = now.getFullYear();
    const mo = now.getMonth() + 1;
    const d = now.getDate();
    const w = weekdays[now.getDay()];
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    timeEl.textContent = '现在是' + y + '年' + mo + '月' + d + '日星期' + w + periodName + '的' + h + '点' + m + '分' + s + '秒。';
    statusEl.textContent = status;
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
    observer.observe(mainContent, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /**
   * 记录上次是否在首页，用于判断是否为「刚进入首页」（避免因 MutationObserver 被时间更新触发而误判）
   */
  var wasOnHomepage = false;

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
      // 仅当「从非首页进入首页」时重置状态缓存，避免 MutationObserver 因时间每秒更新而反复触发
      if (!wasOnHomepage) {
        greetingStatusByPeriod = {};
      }
      wasOnHomepage = true;
      updateGreeting();
      initGridCanvas();
      initTypewriter();
    } else {
      wasOnHomepage = false;
      gridCanvasInitialized = false;
      typewriterInitialized = false;
    }
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

  var gridCanvasInitialized = false;

  /**
   * 渐变网格背景 Canvas（参考 Wcowin）
   * 鼠标靠近时网格线产生起伏位移
   */
  function initGridCanvas() {
    var canvas = document.getElementById('gridCanvas');
    if (!canvas || gridCanvasInitialized) return;
    gridCanvasInitialized = true;

    var ctx = canvas.getContext('2d');
    var mouseX = -1000;
    var mouseY = -1000;
    var gridSize = 50;
    var influenceRadius = 150;
    var maxDisplacement = 8;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = 500;
    }

    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    document.addEventListener('mouseleave', function() {
      mouseX = -1000;
      mouseY = -1000;
    });

    var animationFrameId = null;
    var isVisible = true;

    var observer = new IntersectionObserver(function(entries) {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !animationFrameId) {
        draw();
      }
    }, { threshold: 0 });

    observer.observe(canvas);

    function draw() {
      if (!isVisible) {
        animationFrameId = null;
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

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();
  }

  var typewriterInitialized = false;

  /**
   * 打字机效果（参考 Wcowin）
   */
  function initTypewriter() {
    var el = document.getElementById('typewriter-text');
    if (!el || typewriterInitialized) return;
    typewriterInitialized = true;

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
