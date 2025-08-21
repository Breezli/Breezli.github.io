// ====================
// 模块1：倒计时组件 (CountdownTimer)
// ====================
const CountdownTimer = (() => {
	const config = {
		targetDate: '2026-07-25',
		targetName: '21岁生日',
		units: {
			day: { text: '今日', unit: '小时' },
			week: { text: '本周', unit: '天' },
			month: { text: '本月', unit: '天' },
			year: { text: '本年', unit: '天' },
		},
	}

	const calculators = {
		day: () => {
			const hours = new Date().getHours()
			return {
				remaining: 24 - hours,
				percentage: (hours / 24) * 100,
			}
		},
		week: () => {
			const day = new Date().getDay()
			const passed = day === 0 ? 6 : day - 1
			return {
				remaining: 6 - passed,
				percentage: ((passed + 1) / 7) * 100,
			}
		},
		month: () => {
			const now = new Date()
			const total = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
			const passed = now.getDate() - 1
			return {
				remaining: total - passed,
				percentage: (passed / total) * 100,
			}
		},
		year: () => {
			const now = new Date()
			const start = new Date(now.getFullYear(), 0, 1)
			const total = 365 + (now.getFullYear() % 4 === 0 ? 1 : 0)
			const passed = Math.floor((now - start) / 86400000)
			return {
				remaining: total - passed,
				percentage: (passed / total) * 100,
			}
		},
	}

	function updateCountdown() {
		const elements = ['eventName', 'eventDate', 'daysUntil', 'countRight'].map(
			(id) => document.getElementById(id)
		)

		if (elements.some((el) => !el)) return

		const [eventName, eventDate, daysUntil, countRight] = elements
		const now = new Date()
		const target = new Date(config.targetDate)

		eventName.textContent = config.targetName
		eventDate.textContent = config.targetDate
		daysUntil.textContent = Math.round(
			(target - now.setHours(0, 0, 0, 0)) / 86400000
		)

		countRight.innerHTML = Object.entries(config.units)
			.map(([key, { text, unit }]) => {
				const { remaining, percentage } = calculators[key]()
				return `
                    <div class="cd-count-item">
                        <div class="cd-item-name">${text}</div>
                        <div class="cd-item-progress">
                            <div class="cd-progress-bar" style="width: ${percentage}%; opacity: ${
					percentage / 100
				}"></div>
                            <span class="cd-percentage ${
															percentage >= 46 ? 'cd-many' : ''
														}">${percentage.toFixed(2)}%</span>
                            <span class="cd-remaining ${
															percentage >= 60 ? 'cd-many' : ''
														}">
                                <span class="cd-tip">还剩</span>${remaining}<span class="cd-tip">${unit}</span>
                            </span>
                        </div>
                    </div>
                `
			})
			.join('')
	}

	function injectStyles() {
		const styles = `
            .card-countdown .item-content {
                display: flex;
            }
            .cd-count-left {
                position: relative;
                display: flex;
                flex-direction: column;
                margin-right: 0.8rem;
                line-height: 1.5;
                align-items: center;
                justify-content: center;
            }
            .cd-count-left .cd-text {
                font-size: 14px;
            }
            .cd-count-left .cd-name {
                font-weight: bold;
                font-size: 18px;
            }
            .cd-count-left .cd-time {
                font-size: 30px;
                font-weight: bold;
                color: var(--anzhiyu-main);
            }
            .cd-count-left .cd-date {
                font-size: 12px;
                opacity: 0.6;
            }
            .cd-count-left::after {
                content: "";
                position: absolute;
                right: -0.8rem;
                width: 2px;
                height: 80%;
                background-color: var(--anzhiyu-main);
                opacity: 0.5;
            }
            .cd-count-right {
                flex: 1;
                margin-left: .8rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .cd-count-item {
                display: flex;
                flex-direction: row;
                align-items: center;
                height: 24px;
            }
            .cd-item-name {
                font-size: 14px;
                margin-right: 0.8rem;
                white-space: nowrap;
            }
            .cd-item-progress {
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                height: 100%;
                width: 100%;
                border-radius: 8px;
                background-color: var(--anzhiyu-background);
                overflow: hidden;
            }
            .cd-progress-bar {
                height: 100%;
                border-radius: 8px;
                background-color: var(--anzhiyu-main);
            }
            .cd-percentage,
            .cd-remaining {
                position: absolute;
                font-size: 12px;
                margin: 0 6px;
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }
            .cd-many {
                color: #fff;
            }
            .cd-remaining {
                opacity: 0;
                transform: translateX(10px);
            }
            .card-countdown .item-content:hover .cd-remaining {
                transform: translateX(0);
                opacity: 1;
            }
            .card-countdown .item-content:hover .cd-percentage {
                transform: translateX(-10px);
                opacity: 0;
            }
        `

		const styleSheet = document.createElement('style')
		styleSheet.textContent = styles
		document.head.appendChild(styleSheet)
	}

	let timer
	const start = () => {
		injectStyles()
		updateCountdown()
		timer = setInterval(updateCountdown, 600000)
	}

	;['pjax:complete', 'DOMContentLoaded'].forEach((event) =>
		document.addEventListener(event, start)
	)
	document.addEventListener('pjax:send', () => timer && clearInterval(timer))

	return { start, stop: () => timer && clearInterval(timer) }
})()

// ====================
// 模块1：视频缓存管理
// ====================

const videoCache = new Map();
const MAX_CACHE = 3; // 最多缓存 3 个视频，防止内存占用过高

function getCachedVideo(videoSrc) {
    if (videoCache.has(videoSrc)) {
        return videoCache.get(videoSrc);
    }

    // 超出缓存数量时，清除最老的一个
    if (videoCache.size >= MAX_CACHE) {
        const firstKey = videoCache.keys().next().value;
        const old = videoCache.get(firstKey);
        if (old.element.parentNode) {
            old.element.remove();
        }
        videoCache.delete(firstKey);
    }

    const video = document.createElement('video');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto'; // 提前加载元数据和部分数据
    video.src = videoSrc;

    // 隐藏视频（不显示但可缓存）
    Object.assign(video.style, {
        position: 'fixed',
        bottom: '0',
        right: '0',
        width: '1px',
        height: '1px',
        opacity: '0',
        pointerEvents: 'none'
    });

    document.body.appendChild(video);

    const cacheItem = {
        element: video,
        loaded: false
    };

    video.addEventListener('canplay', () => {
        cacheItem.loaded = true;
        video.pause(); // 加载后暂停，节省资源
    }, { once: true });

    videoCache.set(videoSrc, cacheItem);

    return cacheItem;
}

// ====================
// 模块2：背景视频管理
// ====================
function setupPageBackground() {
    const pageVideoMap = {
        '/cinema/': 'https://static-breezli.oss-cn-shanghai.aliyuncs.com/%E8%83%8C%E6%99%AF%E8%A7%86%E9%A2%91/movie.mp4',
        '/music/': 'https://static-breezli.oss-cn-shanghai.aliyuncs.com/%E8%83%8C%E6%99%AF%E8%A7%86%E9%A2%91/outer.mp4',
        '/essay/': 'https://static-breezli.oss-cn-shanghai.aliyuncs.com/%E8%83%8C%E6%99%AF%E8%A7%86%E9%A2%91/car.mp4',
        '/gallerygroup/': 'https://static-breezli.oss-cn-shanghai.aliyuncs.com/%E8%83%8C%E6%99%AF%E8%A7%86%E9%A2%91/mountain.mp4',
        '/about/': 'https://static-breezli.oss-cn-shanghai.aliyuncs.com/%E8%83%8C%E6%99%AF%E8%A7%86%E9%A2%91/totoro.mp4',
        '/games/': 'https://static-breezli.oss-cn-shanghai.aliyuncs.com/%E8%83%8C%E6%99%AF%E8%A7%86%E9%A2%91/yys.mp4',
        '/link/': 'https://static-breezli.oss-cn-shanghai.aliyuncs.com/%E8%83%8C%E6%99%AF%E8%A7%86%E9%A2%91/dog.mp4'
    };

    const pathname = window.location.pathname;

    // 先清理旧视频
    removeExistingVideoBackground();

    // 匹配路径
    for (const [path, videoSrc] of Object.entries(pageVideoMap)) {
        if (pathname.startsWith(path)) {
            addBackgroundVideo(videoSrc);
            return;
        }
    }
}

function addBackgroundVideo(videoSrc) {
        // 触发预加载（如果还没加载）
    getCachedVideo(videoSrc);

    const videoBg = document.createElement('div');
    videoBg.className = 'global-video-bg'; // 统一 class
    videoBg.innerHTML = `
        <video autoplay muted loop playsinline>
            <source src="${videoSrc}" type="video/mp4">
        </video>
    `;
    document.body.insertBefore(videoBg, document.body.firstChild);

    const video = videoBg.querySelector('video');

    video.addEventListener('canplay', function onCanPlay() {
        video.removeEventListener('canplay', onCanPlay);
        setTimeout(() => {
            videoBg.classList.add('fade-in');
        }, 300);
    });

    // video.addEventListener('error', () => {
    //     console.warn(`视频加载失败: ${videoSrc}`);
    //     videoBg.style.background = 'rgba(0, 0, 0, 0.5)';
    //     videoBg.style.opacity = 1;
    // });
}

function removeExistingVideoBackground() {
    const existing = document.querySelector('.global-video-bg');
    if (existing) {
        const video = existing.querySelector('video');
        if (video) {
            video.pause();
            // ❌ 不要设置 video.src = ''，否则会破坏缓存
            // video.src = ''; // 删除这行！
        }
        existing.remove();
    }
}

// 绑定事件
document.addEventListener('DOMContentLoaded', setupPageBackground);
document.addEventListener('pjax:complete', setupPageBackground);
document.addEventListener('pjax:send', removeExistingVideoBackground);

// ====================
// 模块3：侧边栏 & 页面背景控制（新增）
// ====================

// 存储原始背景，用于恢复
let originalPageBackground = null;

function handlePageStyleForCinema() {
    const page = document.getElementById('page');
    if (!page) return;

    const pathname = window.location.pathname;

    if (pathname.startsWith('/cinema/')) {
        // 保存原始背景（只保存一次）
        if (originalPageBackground === null) {
            originalPageBackground = page.style.background || page.style.backgroundColor || '';
        }
        // 设置新背景
        page.style.background = '#ffffff46';
        // 移除 aside
        removeAsideContent();
    } else {
        // 恢复原始背景
        page.style.background = originalPageBackground;
        // 可选：恢复 aside
        // restoreAsideContent();
    }
}

function removeAsideContent() {
    const aside = document.getElementById('aside-content');
    if (aside) {
        aside.remove();
        // console.log('已移除侧边栏 #aside-content');
    }
}

// ====================
// 统一事件绑定
// ====================

document.addEventListener('DOMContentLoaded', () => {
    setupPageBackground();
    handlePageStyleForCinema();
});

document.addEventListener('pjax:complete', () => {
    setupPageBackground();
    handlePageStyleForCinema();
});

document.addEventListener('pjax:send', () => {
    removeExistingVideoBackground();
});