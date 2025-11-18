// 关于页面专用功能
class AboutPageManager {
    constructor() {
        this.navigationManager = navigationManager;
    }

    // 初始化关于页面
    initAboutPage() {
        document.addEventListener('DOMContentLoaded', () => {
            this.navigationManager.loadJSON((data) => {
                // 渲染导航菜单 - 使用相对路径或当前域名
                const baseUrl = this.getBaseUrl();
                this.navigationManager.renderNavigation(data.navigation, baseUrl);
                
                // 初始化交互功能
                this.initAboutInteractions();
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

    // 初始化关于页面交互
    initAboutInteractions() {
        $(document).ready(() => {
            this.navigationManager.initMenuSystem();
        });
    }
}

// 初始化关于页面
const aboutPageManager = new AboutPageManager();
aboutPageManager.initAboutPage();