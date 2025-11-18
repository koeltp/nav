// 公共功能函数
class NavigationManager {
    constructor() {
        this.data = null;
    }

    // 使用XMLHttpRequest加载JSON数据
    loadJSON(callback) {
        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', 'data.json', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    this.data = JSON.parse(xhr.responseText);
                    callback(this.data);
                } else {
                    console.error('Error loading data:', xhr.statusText);
                    this.loadDefaultData(callback);
                }
            }
        };
        xhr.send(null);
    }

    // 默认数据（备用）
    loadDefaultData(callback) {
        const defaultData = {
            navigation: [],
            categories: {}
        };
        this.data = defaultData;
        callback(defaultData);
    }

    // 渲染导航菜单 - 子菜单默认展开
    renderNavigation(navigation, baseUrl = '') {
        const mainMenu = document.getElementById('main-menu');
        if (!navigation || navigation.length === 0) return;
        
        mainMenu.innerHTML = navigation.map(item => {
            if (item.submenu) {
                return `
                    <li class="has-sub expanded">
                        <a href="#">
                            <i class="${item.icon}"></i>
                            <span class="title">${item.name}</span>
                        </a>
                        <ul style="display: block;">
                            ${item.submenu.map(subItem => `
                                <li>
                                    <a href="${baseUrl}${subItem.href}" class="${subItem.class || ''}">
                                        <span class="title">${subItem.name}</span>
                                        ${subItem.badge ? `<span class="label ${subItem.badge.class} pull-right hidden-collapsed">${subItem.badge.text}</span>` : ''}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </li>
                `;
            } else {
                return `
                    <li>
                        <a href="${baseUrl}${item.href}" class="${item.class || ''}">
                            <i class="${item.icon}"></i>
                            <span class="title">${item.name}</span>
                            ${item.badge ? `<span class="label ${item.badge.class} pull-right hidden-collapsed">${item.badge.text}</span>` : ''}
                        </a>
                    </li>
                `;
            }
        }).join('');
    }

    // 初始化菜单系统 - 子菜单默认展开
    initMenuSystem() {
        // 清除所有现有的事件绑定
        $(document).off('click', '.has-sub > a');
        
        // 绑定子菜单点击事件
        $(document).on('click', '.has-sub > a', function (e) {
            e.preventDefault();
            
            const $parent = $(this).parent();
            const $submenu = $parent.find('> ul');
            
            // 如果菜单已经展开，则关闭
            if ($parent.hasClass('expanded')) {
                $parent.removeClass('expanded');
                $submenu.slideUp(200);
            } else {
                // 打开当前菜单
                $parent.addClass('expanded');
                $submenu.slideDown(200);
            }
        });

        // 侧边栏切换
        $('.user-info-menu .hidden-sm a[data-toggle="sidebar"]').off('click').on('click', function (e) {
            e.preventDefault();
            $('.sidebar-menu').toggleClass('collapsed');
            
            // 侧边栏展开时，确保子菜单显示
            if (!$('.sidebar-menu').hasClass('collapsed')) {
                $('.has-sub.expanded > ul').show();
            }
        });

        // 原有的菜单交互逻辑
        $(document).on('click', '.has-sub', function (e) {
            if ($(e.target).is('a')) {
                return;
            }
            
            const _this = $(this);
            if (!_this.hasClass('expanded')) {
                setTimeout(function () {
                    _this.find('ul').attr("style", "");
                }, 300);
            } else {
                $('.has-sub ul').each(function (id, ele) {
                    const _that = $(this);
                    if (_this.find('ul')[0] != ele) {
                        setTimeout(function () {
                            _that.attr("style", "");
                        }, 300);
                    }
                });
            }
        });

        $('.user-info-menu .hidden-sm').click(function () {
            if ($('.sidebar-menu').hasClass('collapsed')) {
                $('.has-sub.expanded > ul').attr("style", "");
            } else {
                $('.has-sub.expanded > ul').show();
            }
        });
        
        // 页面加载后确保所有子菜单都是展开状态
        $(document).ready(() => {
            // 给所有有子菜单的项添加expanded类
            $('.has-sub').addClass('expanded');
            // 显示所有子菜单
            $('.has-sub > ul').show();
        });
    }

    // 初始化平滑滚动
    initSmoothScroll() {
        $(document).off('click', 'a.smooth');
        
        $(document).on('click', 'a.smooth', function (ev) {
            ev.preventDefault();

            const target = $(this).attr("href");
            if (target && $(target).length) {
                $("html, body").animate({
                    scrollTop: $(target).offset().top - 30
                }, {
                    duration: 500,
                    easing: "swing"
                });
            }

            // 更新菜单激活状态
            $("#main-menu li").removeClass("active");
            $(this).closest('li').addClass("active");
            
            // 移动端处理
            if ($(window).width() < 768) {
                if (typeof public_vars !== 'undefined') {
                    public_vars.$mainMenu.add(public_vars.$sidebarProfile).toggleClass('mobile-is-visible');
                    if (typeof ps_destroy === 'function') {
                        ps_destroy();
                    }
                }
            }
        });
    }
}

// 创建全局实例
const navigationManager = new NavigationManager();