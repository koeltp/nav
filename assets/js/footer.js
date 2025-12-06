// 动态生成footer
function generateFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    
    const footerInner = document.createElement('div');
    footerInner.className = 'footer-inner';
    
    // 创建footer-text部分
    const footerText = document.createElement('div');
    footerText.className = 'footer-text';
    footerText.innerHTML = `&copy; 2025
        <a href="./about.html"><strong>太皮导航</strong></a> design by <a href="https://nav.taipi.top" target="_blank"><strong>taipi.top</strong></a>
        | <i class="fa fa-clock-o"></i> 小破站已运行 <span id="uptime"></span>`;
    
    // 创建回到顶部按钮
    const goUp = document.createElement('div');
    goUp.className = 'go-up';
    goUp.innerHTML = `<a href="#" rel="go-top"><i class="fa-angle-up"></i></a>`;
    
    // 组装footer
    footerInner.appendChild(footerText);
    footerInner.appendChild(goUp);
    footer.appendChild(footerInner);
    
    // 初始化运行时间显示
    initUptimeCounter();
}

// 初始化运行时间计数器
function initUptimeCounter() {
    // 设置网站开始运行的时间（修改为您网站实际上线的时间）
    // 格式：年, 月-1, 日, 时, 分, 秒
    const startDate = new Date(2025, 11, 1, 19, 0, 0); // 2025年12月6日 19:00:00
    
    // 数字颜色配置
    const colors = {
        days: ['#ff6b6b', '#ffa726', '#66bb6a', '#42a5f5'], // 红、橙、绿、蓝
        hours: ['#ab47bc', '#7e57c2', '#5c6bc0', '#26c6da'], // 紫、深紫、蓝紫、青
        minutes: ['#ef5350', '#ec407a', '#ab47bc', '#7e57c2'], // 红、粉、紫、深紫
        seconds: ['#26a69a', '#26c6da', '#29b6f6', '#42a5f5']  // 青绿、青、浅蓝、蓝
    };
    
    function updateUptime() {
        const now = new Date();
        const diff = now.getTime() - startDate.getTime();
        
        // 计算天、时、分、秒
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 格式化数字，确保至少显示两位
        const formatNumber = (num) => {
            return num < 10 ? `0${num}` : `${num}`;
        };
        
        const daysStr = formatNumber(days);
        const hoursStr = formatNumber(hours);
        const minutesStr = formatNumber(minutes);
        const secondsStr = formatNumber(seconds);
        
        // 创建带颜色的数字
        const createColoredDigits = (str, colorPalette) => {
            return str.split('').map((digit, index) => {
                // 如果数字只有一位，第一位用空格占位
                if (str.length === 1 && index === 0) {
                    return `<span style="color: transparent;">0</span>`;
                }
                const color = colorPalette[index % colorPalette.length];
                return `<span style="color: ${color}; font-weight: bold;">${digit}</span>`;
            }).join('');
        };
        
        // 构建完整的运行时间显示
        const uptimeHTML = `
            ${createColoredDigits(daysStr, colors.days)} 天 
            ${createColoredDigits(hoursStr, colors.hours)} 时 
            ${createColoredDigits(minutesStr, colors.minutes)} 分 
            ${createColoredDigits(secondsStr, colors.seconds)} 秒
        `;
        
        // 更新显示
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
            uptimeElement.innerHTML = uptimeHTML;
        }
    }
    
    // 页面加载后立即更新一次
    updateUptime();
    
    // 每秒更新一次
    setInterval(updateUptime, 1000);
}

// 页面加载完成后生成footer
document.addEventListener('DOMContentLoaded', function() {
    generateFooter();
    
    // 添加回到顶部的功能
    document.addEventListener('click', function(e) {
        if (e.target.closest('a[rel="go-top"]')) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});