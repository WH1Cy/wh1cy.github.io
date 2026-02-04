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
    // 滚动动画观察器
    setupScrollAnimations();
    
    // 卡片悬停效果增强
    enhanceCardHover();
    
    // 平滑滚动
    setupSmoothScroll();
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
