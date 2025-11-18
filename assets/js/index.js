// 主页专用功能
class HomePageManager {
    constructor() {
        this.navigationManager = navigationManager;
    }

    // 渲染内容区域
    renderContent(categories, navigation) {
        const container = document.getElementById('content-container');
        if (!categories) return;
        
        let contentHTML = '';

        // 动态获取所有分类名称
        const categoryNames = Object.keys(categories);
        
        // 根据导航结构确定分类渲染顺序
        const orderedCategories = this.getOrderedCategories(categoryNames, navigation);
        
        orderedCategories.forEach(categoryName => {
            if (categories[categoryName]) {
                contentHTML += this.renderCategorySection(categoryName, categories[categoryName]);
            }
        });

        container.innerHTML = contentHTML;
    }

    // 根据导航结构确定分类渲染顺序
    getOrderedCategories(categoryNames, navigation) {
        // 从导航菜单中提取分类顺序
        const navOrder = [];
        
        // 遍历导航菜单，收集分类名称
        navigation.forEach(item => {
            if (item.href && item.href.startsWith('#')) {
                const categoryName = item.href.substring(1); // 去掉 # 号
                if (categoryNames.includes(categoryName)) {
                    navOrder.push(categoryName);
                }
            } else if (item.submenu) {
                item.submenu.forEach(subItem => {
                    if (subItem.href && subItem.href.startsWith('#')) {
                        const categoryName = subItem.href.substring(1);
                        if (categoryNames.includes(categoryName)) {
                            navOrder.push(categoryName);
                        }
                    }
                });
            }
        });
        
        // 返回导航顺序 + 其他未在导航中出现的分类
        return [...navOrder, ...categoryNames.filter(cat => !navOrder.includes(cat))];
    }

    // 渲染分类部分
    renderCategorySection(title, items) {
        if (!items || items.length === 0) return '';
        
        const rows = [];
        for (let i = 0; i < items.length; i += 4) {
            const rowItems = items.slice(i, i + 4);
            const rowHTML = rowItems.map(item => `
                <div class="col-sm-3">
                    <div class="xe-widget xe-conversations box2 ${item.label}" 
                         onclick="window.open('${item.url}', '_blank')" 
                         data-toggle="tooltip" 
                         data-placement="bottom" 
                         title="" 
                         data-original-title="${item.url}">
                        <div class="xe-comment-entry">
                            <a class="xe-user-img">
                                <img data-src="${item.logo}" class="lozad img-circle" width="40">
                            </a>
                            <div class="xe-comment">
                                <a href="#" class="xe-user-name overflowClip_1">
                                    <strong>${item.name}</strong>
                                </a>
                                <p class="overflowClip_2">${item.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            rows.push(`<div class="row">${rowHTML}</div>`);
        }
        
        return `
            <h4 class="text-gray">
                <i class="linecons-tag" style="margin-right: 7px;" id="${title}"></i>${title}
            </h4>
            ${rows.join('')}
            <br />
        `;
    }

    // 初始化主页交互功能
    initHomeInteractions() {
        // 图片懒加载
        if (typeof lozad !== 'undefined') {
            const observer = lozad();
            observer.observe();
        }

        // 重新绑定所有菜单交互事件
        $(document).ready(() => {
            this.navigationManager.initMenuSystem();
            this.navigationManager.initSmoothScroll();
        });
    }

    // 初始化主页
    initHomePage() {
        document.addEventListener('DOMContentLoaded', () => {
            this.navigationManager.loadJSON((data) => {
                // 渲染导航菜单
                this.navigationManager.renderNavigation(data.navigation);
                
                // 渲染内容区域，传入导航数据用于排序
                this.renderContent(data.categories, data.navigation);
                
                // 初始化交互功能
                this.initHomeInteractions();
            });
        });
    }
}

// 初始化主页
const homePageManager = new HomePageManager();
homePageManager.initHomePage();