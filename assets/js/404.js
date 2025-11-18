// 404页面专用功能
class ErrorPageManager {
    constructor() {
        this.navigationManager = navigationManager;
    }

    // 初始化404页面
    initErrorPage() {
        document.addEventListener('DOMContentLoaded', () => {
            this.navigationManager.loadJSON((data) => {
                // 渲染导航菜单 - 使用相对路径或当前域名
                const baseUrl = this.getBaseUrl();
                this.navigationManager.renderNavigation(data.navigation, baseUrl);
                
                // 初始化交互功能
                this.initErrorPageInteractions();
            });
        });
    }

    // 获取基础URL
    getBaseUrl() {
        // 如果是本地开发环境，使用相对路径
        // 如果是生产环境，会自动使用当前域名
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return '../'; // 返回上一级目录
        } else {
            // 生产环境使用当前域名的根路径
            return window.location.origin + '/';
        }
    }

    // 初始化404页面交互
    initErrorPageInteractions() {
        $(document).ready(() => {
            this.navigationManager.initMenuSystem();
            
            // 更新返回首页按钮的链接
            this.updateHomeLinks();
        });
    }

    // 更新首页链接
    updateHomeLinks() {
        const homeUrl = this.getBaseUrl() + 'index.html';
        const homeButtons = document.querySelectorAll('a[href*="localhost"], a.btn-primary');
        
        homeButtons.forEach(button => {
            if (button.href.includes('localhost')) {
                button.href = homeUrl;
            }
        });
    }
}

// 初始化404页面
const errorPageManager = new ErrorPageManager();
errorPageManager.initErrorPage();