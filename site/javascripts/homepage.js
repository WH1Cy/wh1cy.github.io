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
   * 检测是否是首页，如果是则添加类名以便 CSS 控制
   * 每次页面切换时都会调用此函数，确保类名状态正确
   */
  function checkIfHomepage() {
    // 首先检查页面内容：如果页面包含 hero-section，很可能是首页
    const hasHeroSection = document.querySelector('.hero-section') !== null;
    
    // 检查 URL 路径
    const path = window.location.pathname;
    const pathname = path.replace(/\/$/, ''); // 移除末尾的斜杠
    
    // 检查是否是首页路径
    // 首页通常是：根路径、index.html、或者路径为空
    const isHomepagePath = pathname === '' || 
                           pathname === '/' || 
                           pathname === '/index' ||
                           pathname === '/index.html' ||
                           pathname.endsWith('/index') ||
                           pathname.endsWith('/index.html');
    
    // 检查当前激活的标签页链接
    const activeTabLink = document.querySelector('.md-tabs__item--active .md-tabs__link');
    const isHomepageTab = activeTabLink && (
      activeTabLink.getAttribute('href') === '.' ||
      activeTabLink.getAttribute('href') === './' ||
      activeTabLink.getAttribute('href') === '/' ||
      activeTabLink.textContent.trim() === '首页'
    );
    
    // 只有当页面有 hero-section 且路径或标签页都指向首页时，才认为是首页
    const isHomepage = hasHeroSection && (isHomepagePath || isHomepageTab);
    
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
    
    // 如果是首页，才添加类名
    if (isHomepage) {
      document.body.classList.add('is-homepage');
      if (mainElement) {
        mainElement.classList.add('is-homepage');
      }
      if (containerElement) {
        containerElement.classList.add('is-homepage');
      }
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
    document.querySelectorAll('.fade-in, .animated-cards > *').forEach(el => {
      observer.observe(el);
    });
  }

  /**
   * 增强卡片悬停效果
   */
  function enhanceCardHover() {
    const cards = document.querySelectorAll('.grid.cards > *');
    
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

  /**
   * 鼠标跟随效果（可选，用于 hero 区域）
   */
  function setupMouseFollow() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    heroSection.addEventListener('mousemove', function(e) {
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
