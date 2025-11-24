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
// 模块2：视频加载管理
// ====================

// 多吉云 vcode
const pageVideoMap = {
	'/cinema/': 'a8bbfa2d57a67fdc',
	'/music/': '531e21b733d2ca38',
	'/essay/': 'a6b4518ca35abebf',
	'/gallerygroup/': 'ac5cadadb3f6b64b',
	'/about/': '7286bbf83869ec83',
	'/link/': '6bcfafa907026db6',
}
// MP4 直链
const directVideoMap = {
	'/games/':
		'https://yys.v.netease.com/2024/0322/3178ec9ec1d5e3df9ecb0f3656ecf62f.mp4',
}

// 等待 DogePlayer 加载完成
function waitForDogePlayer(maxWait = 10000) {
	return new Promise((resolve, reject) => {
		if (window.DogePlayer) {
			resolve()
			return
		}

		const startTime = Date.now()

		const check = () => {
			if (window.DogePlayer) {
				resolve()
			} else if (Date.now() - startTime < maxWait) {
				setTimeout(check, 50)
			} else {
				reject(new Error('DogePlayer 加载超时'))
			}
		}

		check()
	})
}

// ====================
// 模块3：背景视频管理
// ====================
function setupPageBackground() {
	const pathname = window.location.pathname
	removeExistingVideoBackground()

	// 主页特殊处理
	if (pathname === '/' || pathname === '/index.html') {
		setupHomepageBackground()
		return
	}

	// 先检查是否是 MP4 直链路径
	for (const [path, mp4Url] of Object.entries(directVideoMap)) {
		if (pathname.startsWith(path)) {
			addDirectMP4Background(mp4Url)
			return
		}
	}

	// 否则走原来的 vcode 路径
	for (const [path, vcode] of Object.entries(pageVideoMap)) {
		if (pathname.startsWith(path)) {
			addBackgroundVideo(vcode)
			return
		}
	}
}

async function setupHomepageBackground() {
	try {
		await waitForDogePlayer()

		const homeBanner = document.querySelector('.home-banner')
		if (!homeBanner) return

		// 获取所有可能的 vcode
		const vcodeMap = {
			midnight: homeBanner.dataset.midnightVcode,    // 0-5
			morning: homeBanner.dataset.morningVcode,      // 6-8
			noon: homeBanner.dataset.noonVcode,            // 9-12
			afternoon: homeBanner.dataset.afternoonVcode,  // 13-17
			evening: homeBanner.dataset.eveningVcode,      // 18-23
		}

		const hour = new Date().getHours()

		let selectedKey, vcode

		if (hour >= 0 && hour <= 5) {
			selectedKey = 'midnight'
		} else if (hour >= 6 && hour <= 12) {
			selectedKey = 'morning'
		} else if (hour >= 13 && hour <= 16) {
			selectedKey = 'noon'
		} else if (hour >= 17 && hour <= 21) {
			selectedKey = 'afternoon'
		} else {
			selectedKey = 'evening'
		}

		vcode = vcodeMap[selectedKey]

		// 如果该时段没有配置 vcode，则回退到 evening 或任意默认值
		if (!vcode) {
			console.warn(`【主页】未配置 ${selectedKey} 时段的视频 vcode，尝试使用 evening...`)
			vcode = vcodeMap.evening || vcodeMap.afternoon || vcodeMap.noon || vcodeMap.morning || vcodeMap.midnight
		}

		if (!vcode) {
			console.warn('【主页】所有时段均无有效 vcode，跳过视频加载')
			return
		}

		// 清空所有容器（确保只有一个播放器）
		const dayContainer = document.getElementById('dayPlayerContainer')
		const nightContainer = document.getElementById('nightPlayerContainer')
		if (dayContainer) dayContainer.innerHTML = ''
		if (nightContainer) nightContainer.innerHTML = ''

		// 统一使用一个容器播放（比如 dayPlayerContainer）
		const targetContainer = dayContainer || nightContainer
		if (!targetContainer) {
			console.error('【主页】缺少播放器容器（#dayPlayerContainer 或 #nightPlayerContainer）')
			return
		}

		// 创建播放器
		new DogePlayer({
			container: targetContainer,
			userId: 13641,
			vcode: vcode,
			autoPlay: true,
			muted: true,
			loop: true,
			playsInline: true,
		})

		// 淡入效果
		setTimeout(() => {
			document.querySelectorAll('.video-wrapper').forEach(el => {
				el.style.opacity = '1'
				el.style.transition = 'opacity 1s'
			})
		}, 500)
	} catch (err) {
		console.error('【主页】背景视频加载失败:', err)
	}
}

// mp4 直链
function addDirectMP4Background(mp4Url) {
	const videoBg = document.createElement('div')
	videoBg.className = 'global-video-bg'
	Object.assign(
		(videoBg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0;
        overflow: hidden;
    `)
	)

	const video = document.createElement('video')
	video.style.cssText = 'width: 100%; height: 100%;'
	video.autoplay = true
	video.muted = true
	video.loop = true
	video.playsInline = true
	video.src = mp4Url

	video.addEventListener('canplay', function onCanPlay() {
		video.removeEventListener('canplay', onCanPlay)
		setTimeout(() => {
			videoBg.classList.add('fade-in')
		}, 300)
	})

	videoBg.appendChild(video)
	document.body.insertBefore(videoBg, document.body.firstChild)
}

// vcode 路径
async function addBackgroundVideo(vcode) {
	try {
		await waitForDogePlayer()

		// 创建视频背景容器
		const videoBg = document.createElement('div')
		videoBg.className = 'global-video-bg'
		Object.assign(
			(videoBg.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0;
            overflow: hidden;
        `)
		)

		// 创建播放器容器
		const container = document.createElement('div')
		container.style.cssText = 'width: 100%; height: 100%;'
		videoBg.appendChild(container)

		// 插入到DOM
		document.body.insertBefore(videoBg, document.body.firstChild)

		// 创建新的播放器实例
		const player = new DogePlayer({
			container,
			userId: 13641,
			vcode,
			autoPlay: true,
			muted: true,
			loop: true,
			playsInline: true,
		})

		// 尝试监听多个可能的事件
		const eventsToTry = [
			'ready',
			'play',
			'loadeddata',
			'canplay',
			'canplaythrough',
		]

		const onPlayerReady = () => {
			// 移除所有可能的事件监听
			eventsToTry.forEach((event) => {
				player.off(event, onPlayerReady)
			})

			// 添加淡入效果
			setTimeout(() => {
				videoBg.classList.add('fade-in')
			}, 300)
		}

		// 尝试监听所有可能的事件
		eventsToTry.forEach((event) => {
			player.on(event, onPlayerReady)
		})

		// 设置超时，如果10秒内没有触发任何事件，则强制显示
		setTimeout(() => {
			videoBg.classList.add('fade-in')
			console.log('背景视频超时显示')
		}, 5000)
	} catch (err) {
		console.error('背景视频加载失败:', err)
	}
}

function removeExistingVideoBackground() {
  // 1. 移除通用视频背景
  document.querySelectorAll('.global-video-bg').forEach(el => {
    const iframe = el.querySelector('iframe');
    if (iframe) {
      iframe.src = 'about:blank'; // 👈 强制停止播放
      iframe.remove();
    }
    el.remove();
  });

  // 2. 清理主页容器
  const dayContainer = document.getElementById('dayPlayerContainer');
  const nightContainer = document.getElementById('nightPlayerContainer');

  if (dayContainer) {
    const iframe = dayContainer.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
    dayContainer.innerHTML = '';
  }

  if (nightContainer) {
    const iframe = nightContainer.querySelector('iframe');
    if (iframe) iframe.src = 'about:blank';
    nightContainer.innerHTML = '';
  }
}

// ====================
// 模块3：侧边栏 & 页面背景控制
// ====================

let originalPageBackground = null

function handlePageStyleForCinema() {
	const page = document.getElementById('page')
	if (!page) return

	const pathname = window.location.pathname

	if (pathname.startsWith('/cinema/' || '/games/' || '/gallerygroup/')) {
		if (originalPageBackground === null) {
			originalPageBackground = window.getComputedStyle(page).background || ''
		}
		page.style.background = '#ffffff46'
		removeAsideContent()
	} else {
		page.style.background = originalPageBackground
	}
}

function removeAsideContent() {
	const aside = document.getElementById('aside-content')
	if (aside) {
		aside.remove()
	}
}

// ====================
// 统一初始化
// ====================

function onDOMReady(callback) {
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', callback)
	} else {
		callback()
	}
}

function safeInit() {
	// 不再等待DogePlayer，直接设置背景
	onDOMReady(() => {
		setupPageBackground()
		handlePageStyleForCinema()
	})
}

// 首次加载
safeInit()

// PJAX 支持
document.addEventListener('pjax:complete', safeInit)
document.addEventListener('pjax:send', removeExistingVideoBackground)