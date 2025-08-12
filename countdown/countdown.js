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
// 模块2：背景视频管理
// ====================
function setupPageBackground() {
    const pageVideoMap = {
        '/cinema/': '/media/movie.mp4',
        '/music/': '/media/outer.mp4',
        '/essay/': '/media/car.mp4',
        '/gallerygroup/': '/media/mountain.mp4',
        '/about/': '/media/totoro.mp4',
        '/games/': '/media/yys.mp4',
        '/link/': '/media/dog.mp4'
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
            video.src = '';
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
        console.log('已移除侧边栏 #aside-content');
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