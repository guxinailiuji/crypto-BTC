// 当文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化功能
    animateRatingBars();
    addCardHoverEffects();
    initializeTooltips();
    setResponsiveHeight();
    initializeRatingEffects();
    animateTagElements();
    
    // 移除价格相关功能初始化
    // initializeBinancePrice();
    // initializeShutdownPriceUpdates();
    
    // 移除刮奖效果相关代码
    
    // 窗口大小改变时调整高度
    window.addEventListener('resize', function() {
        setResponsiveHeight();
    });
});

// 为标签元素添加动画效果
function animateTagElements() {
    const tagElements = document.querySelectorAll('.tag-animate');
    
    // 设置初始状态
    tagElements.forEach((tag, index) => {
        // 给每个标签一个随机的初始透明度，使其看起来更自然
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(15px)';
        
        // 延迟显示，形成波浪进入的效果
        setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
            
            // 添加点击效果
            tag.addEventListener('click', function() {
                // 创建波纹效果
                const ripple = document.createElement('span');
                ripple.className = 'tag-ripple';
                ripple.style.position = 'absolute';
                ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                ripple.style.borderRadius = '50%';
                ripple.style.pointerEvents = 'none';
                ripple.style.width = '100px';
                ripple.style.height = '100px';
                ripple.style.transform = 'translate(-50%, -50%) scale(0)';
                ripple.style.animation = 'tagRipple 0.6s linear';
                
                // 获取点击位置
                const rect = this.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                // 确保标签是相对定位以便放置波纹
                if (this.style.position !== 'relative') {
                    this.style.position = 'relative';
                }
                this.style.overflow = 'hidden';
                
                this.appendChild(ripple);
                
                // 动画结束后移除波纹元素
                setTimeout(() => {
                    ripple.remove();
                }, 600);
                
                // 添加缩放效果
                this.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            });
        }, 100 * (index + 1));
    });
    
    // 添加波纹动画样式
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes tagRipple {
            to {
                transform: translate(-50%, -50%) scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 动画评级条
function animateRatingBars() {
    // 获取所有评级条
    const ratingBars = document.querySelectorAll('.rating-bar');
    
    // 为每个评级条添加发光元素
    ratingBars.forEach(bar => {
        const glow = document.createElement('div');
        glow.className = 'rating-glow';
        bar.appendChild(glow);
        
        // 设置初始位置在左侧
        glow.style.left = '0px';
        
        // 添加动画，使发光效果从左到右移动
        animateGlow(glow, bar);
    });
}

// 发光效果动画
function animateGlow(glow, bar) {
    // 计算评级条宽度
    const barWidth = bar.offsetWidth;
    
    // 设置动画持续时间与评级条宽度成正比
    const duration = barWidth * 20; // 假设每像素20ms
    
    // 使用requestAnimationFrame添加动画
    let start = null;
    
    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        
        // 计算当前位置
        const position = (progress / duration) * barWidth;
        
        // 如果动画未完成，继续移动
        if (position <= barWidth) {
            glow.style.left = position + 'px';
            requestAnimationFrame(step);
        } else {
            // 动画完成后，重置位置并再次开始
            glow.style.left = '0px';
            start = null;
            setTimeout(() => requestAnimationFrame(step), 1000); // 延迟1秒再次开始
        }
    }
    
    // 开始动画
    requestAnimationFrame(step);
}

// 添加卡片悬停效果
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.crypto-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        });
    });
}

// 初始化工具提示
function initializeTooltips() {
    const tooltipTargets = document.querySelectorAll('[data-tooltip]');
    
    tooltipTargets.forEach(element => {
        // 悬停时显示提示
        element.addEventListener('mouseenter', function() {
            // 获取提示文本
            const tooltipText = this.getAttribute('data-tooltip');
            
            // 创建提示元素
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            // 设置样式
            tooltip.style.position = 'absolute';
            tooltip.style.background = '#1e293b';
            tooltip.style.color = 'white';
            tooltip.style.padding = '4px 8px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '0.7rem';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '1000';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.3s';
            
            // 添加到页面
            document.body.appendChild(tooltip);
            
            // 计算位置
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            // 显示提示
            setTimeout(() => tooltip.style.opacity = '1', 10);
            
            // 存储提示元素引用
            this._tooltip = tooltip;
        });
        
        // 鼠标离开时移除提示
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                const tooltip = this._tooltip;
                tooltip.style.opacity = '0';
                setTimeout(() => tooltip.remove(), 300);
                this._tooltip = null;
            }
        });
    });
}

// 设置响应式高度
function setResponsiveHeight() {
    // 获取视窗高度
    const vh = window.innerHeight;
    
    // 对某些需要填充高度的元素设置高度
    // 例如：让主内容区域至少占据视窗高度的80%
    const main = document.querySelector('main');
    if (main) {
        main.style.minHeight = `${vh * 0.8}px`;
    }
}

// 平滑滚动到锚点
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});

// 为标签添加交互效果
const categoryTags = document.querySelectorAll('.rounded-full');
categoryTags.forEach(tag => {
    tag.addEventListener('click', () => {
        // 可以在这里添加标签点击的功能，例如筛选等
        tag.classList.add('ring-2', 'ring-offset-1');
        setTimeout(() => {
            tag.classList.remove('ring-2', 'ring-offset-1');
        }, 300);
    });
});

// 设置评级效果
function initializeRatingEffects() {
    // 获取评级项
    const ratingItems = document.querySelectorAll('.rating-item');
    
    // 为每个评级项添加动画效果
    ratingItems.forEach((item, index) => {
        // 设置延迟显示动画
        item.style.opacity = '0';
        item.style.transform = 'translateX(-10px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // 设置延迟时间，依次显示
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 * (index + 1));
    });
}
