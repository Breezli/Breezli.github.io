document.addEventListener('DOMContentLoaded', async function () {
	const worldRef = document.getElementById('world-map')
	const backButton = document.getElementById('back-button')
	const countryTitle = document.getElementById('country-title')
	const tooltipContainer = document.getElementById('tooltip-container')
	const tooltipProvince = document.getElementById('tooltip-province')
	const tooltipAttraction = document.getElementById('tooltip-attraction')
	const tooltipImage = document.getElementById('tooltip-image')

	let chartInstance = null
	let currentMap = 'world'
	let currentCountry = ''

	// 地图数据变量（初始为空）
	let worldMap = null
	let chinaMap = null
	let norwayMap = null

	// 加载地图数据
	// async function loadMapData() {
	// 	return Promise.all([
	// 		fetch('/map_json/world2.json').then((res) => res.json()),
	// 		fetch('/map_json/china.json').then((res) => res.json()),
	// 		fetch('/map_json/norway.json').then((res) => res.json()),
	// 	]).then(([world, china, norway]) => {
	// 		worldMap = world
	// 		chinaMap = china
	// 		norwayMap = norway
	// 	})
	// }
	// 显示地图加载失败提示
	function showMapError() {
		// 移除原容器
		if (worldRef) worldRef.remove()

		// 创建提示容器
		const errorContainer = document.createElement('div')
		errorContainer.id = 'map-error'
		errorContainer.className = 'map-error'
		errorContainer.innerHTML = '地图加载失败，请刷新重试。'

		// 插入到 map-container 内
		const parent = document.querySelector('.map-container')
		if (parent) {
			parent.appendChild(errorContainer)
		}
	}

	// 加载地图数据（链式调用）
	function loadMapData() {
		return Promise.all([
			fetch('/map_json/world2.json').then((res) => {
				if (!res.ok) throw new Error('World map data failed')
				return res.json()
			}),
			fetch('/map_json/china.json').then((res) => {
				if (!res.ok) throw new Error('China map data failed')
				return res.json()
			}),
			fetch('/map_json/norway.json').then((res) => {
				if (!res.ok) throw new Error('Norway map data failed')
				return res.json()
			}),
		]).then(([world, china, norway]) => {
			worldMap = world
			chinaMap = china
			norwayMap = norway
			console.log('✅ 地图数据加载完成')
		})
	}

	// 定义国家名称映射 (翻译)
	const nameMap = {
		Afghanistan: '阿富汗',
		Singapore: '新加坡',
		Angola: '安哥拉',
		Albania: '阿尔巴尼亚',
		'United Arab Emirates': '阿联酋',
		Argentina: '阿根廷',
		Armenia: '亚美尼亚',
		'French Southern and Antarctic Lands': '法属南半球和南极领地',
		Australia: '澳大利亚',
		Austria: '奥地利',
		Azerbaijan: '阿塞拜疆',
		Burundi: '布隆迪',
		Belgium: '比利时',
		Benin: '贝宁',
		'Burkina Faso': '布基纳法索',
		Bangladesh: '孟加拉国',
		Bulgaria: '保加利亚',
		'The Bahamas': '巴哈马',
		'Bosnia and Herzegovina': '波斯尼亚和黑塞哥维那',
		Belarus: '白俄罗斯',
		Belize: '伯利兹',
		Bermuda: '百慕大',
		Bolivia: '玻利维亚',
		Brazil: '巴西',
		Brunei: '文莱',
		Bhutan: '不丹',
		Botswana: '博茨瓦纳',
		'Central African Republic': '中非共和国',
		Canada: '加拿大',
		Switzerland: '瑞士',
		Chile: '智利',
		China: '中国',
		'Ivory Coast': '象牙海岸',
		Cameroon: '喀麦隆',
		'Democratic Republic of the Congo': '刚果民主共和国',
		'Republic of the Congo': '刚果共和国',
		Colombia: '哥伦比亚',
		'Costa Rica': '哥斯达黎加',
		Cuba: '古巴',
		'Northern Cyprus': '北塞浦路斯',
		Cyprus: '塞浦路斯',
		'Czech Republic': '捷克共和国',
		Germany: '德国',
		Djibouti: '吉布提',
		Denmark: '丹麦',
		'Dominican Republic': '多明尼加共和国',
		Algeria: '阿尔及利亚',
		Ecuador: '厄瓜多尔',
		Egypt: '埃及',
		Eritrea: '厄立特里亚',
		Spain: '西班牙',
		Estonia: '爱沙尼亚',
		Ethiopia: '埃塞俄比亚',
		Finland: '芬兰',
		Fiji: '斐济',
		'Falkland Islands': '福克兰群岛',
		France: '法国',
		Gabon: '加蓬',
		'United Kingdom': '英国',
		Georgia: '格鲁吉亚',
		Ghana: '加纳',
		Guinea: '几内亚',
		Gambia: '冈比亚',
		'Guinea Bissau': '几内亚比绍',
		Greece: '希腊',
		Greenland: '格陵兰',
		Guatemala: '危地马拉',
		'French Guiana': '法属圭亚那',
		Guyana: '圭亚那',
		Honduras: '洪都拉斯',
		Croatia: '克罗地亚',
		Haiti: '海地',
		Hungary: '匈牙利',
		Indonesia: '印度尼西亚',
		India: '印度',
		Ireland: '爱尔兰',
		Iran: '伊朗',
		Iraq: '伊拉克',
		Iceland: '冰岛',
		Israel: '以色列',
		Italy: '意大利',
		Jamaica: '牙买加',
		Jordan: '约旦',
		Japan: '日本',
		Kazakhstan: '哈萨克斯坦',
		Kenya: '肯尼亚',
		Kyrgyzstan: '吉尔吉斯斯坦',
		Cambodia: '柬埔寨',
		Kosovo: '科索沃',
		Kuwait: '科威特',
		Laos: '老挝',
		Lebanon: '黎巴嫩',
		Liberia: '利比里亚',
		Libya: '利比亚',
		'Sri Lanka': '斯里兰卡',
		Lesotho: '莱索托',
		Lithuania: '立陶宛',
		Luxembourg: '卢森堡',
		Latvia: '拉脱维亚',
		Morocco: '摩洛哥',
		Moldova: '摩尔多瓦',
		Madagascar: '马达加斯加',
		Mexico: '墨西哥',
		Macedonia: '马其顿',
		Mali: '马里',
		Myanmar: '缅甸',
		Montenegro: '黑山',
		Mongolia: '蒙古',
		Mozambique: '莫桑比克',
		Mauritania: '毛里塔尼亚',
		Malawi: '马拉维',
		Malaysia: '马来西亚',
		Namibia: '纳米比亚',
		'New Caledonia': '新喀里多尼亚',
		Niger: '尼日尔',
		Nigeria: '尼日利亚',
		Nicaragua: '尼加拉瓜',
		Netherlands: '荷兰',
		Norway: '挪威',
		Nepal: '尼泊尔',
		'New Zealand': '新西兰',
		Oman: '阿曼',
		Pakistan: '巴基斯坦',
		Panama: '巴拿马',
		Peru: '秘鲁',
		Philippines: '菲律宾',
		'Papua New Guinea': '巴布亚新几内亚',
		Poland: '波兰',
		'Puerto Rico': '波多黎各',
		'North Korea': '北朝鲜',
		Portugal: '葡萄牙',
		Paraguay: '巴拉圭',
		Qatar: '卡塔尔',
		Romania: '罗马尼亚',
		Russia: '俄罗斯',
		Rwanda: '卢旺达',
		'Western Sahara': '西撒哈拉',
		'Saudi Arabia': '沙特阿拉伯',
		Sudan: '苏丹',
		'South Sudan': '南苏丹',
		Senegal: '塞内加尔',
		'Solomon Islands': '所罗门群岛',
		'Sierra Leone': '塞拉利昂',
		'El Salvador': '萨尔瓦多',
		Somaliland: '索马里兰',
		Somalia: '索马里',
		'Republic of Serbia': '塞尔维亚',
		Suriname: '苏里南',
		Slovakia: '斯洛伐克',
		Slovenia: '斯洛文尼亚',
		Sweden: '瑞典',
		Swaziland: '斯威士兰',
		Syria: '叙利亚',
		Chad: '乍得',
		Togo: '多哥',
		Thailand: '泰国',
		Tajikistan: '塔吉克斯坦',
		Turkmenistan: '土库曼斯坦',
		'East Timor': '东帝汶',
		'Trinidad and Tobago': '特里尼达和多巴哥',
		Tunisia: '突尼斯',
		Turkey: '土耳其',
		'United Republic of Tanzania': '坦桑尼亚',
		Uganda: '乌干达',
		Ukraine: '乌克兰',
		Uruguay: '乌拉圭',
		'United States': '美国',
		Uzbekistan: '乌兹别克斯坦',
		Venezuela: '委内瑞拉',
		Vietnam: '越南',
		Vanuatu: '瓦努阿图',
		'West Bank': '西岸',
		Yemen: '也门',
		'South Africa': '南非',
		Zambia: '赞比亚',
		Korea: '韩国',
		Tanzania: '坦桑尼亚',
		Zimbabwe: '津巴布韦',
		Congo: '刚果',
		'Central African Rep.': '中非',
		Serbia: '塞尔维亚',
		'Bosnia and Herz.': '波黑',
		'Czech Rep.': '捷克',
		'W. Sahara': '西撒哈拉',
		'Lao PDR': '老挝',
		'Dem.Rep.Korea': '朝鲜',
		'Falkland Is.': '福克兰群岛',
		'Timor-Leste': '东帝汶',
		'Solomon Is.': '所罗门群岛',
		Palestine: '巴勒斯坦',
		'N. Cyprus': '北塞浦路斯',
		Aland: '奥兰群岛',
		'Fr. S. Antarctic Lands': '法属南半球和南极领地',
		Mauritius: '毛里求斯',
		Comoros: '科摩罗',
		'Eq. Guinea': '赤道几内亚',
		'Guinea-Bissau': '几内亚比绍',
		'Dominican Rep.': '多米尼加',
		'Saint Lucia': '圣卢西亚',
		Dominica: '多米尼克',
		'Antigua and Barb.': '安提瓜和巴布达',
		'U.S. Virgin Is.': '美国原始岛屿',
		Montserrat: '蒙塞拉特',
		Grenada: '格林纳达',
		Barbados: '巴巴多斯',
		Samoa: '萨摩亚',
		Bahamas: '巴哈马',
		'Cayman Is.': '开曼群岛',
		'Faeroe Is.': '法罗群岛',
		'Isle of Man': '马恩岛',
		Malta: '马耳他共和国',
		Jersey: '泽西',
		'Cape Verde': '佛得角共和国',
		'Turks and Caicos Is.': '特克斯和凯科斯群岛',
		'St. Vin. and Gren.': '圣文森特和格林纳丁斯',
	}

	const norwayNameMap = {
		Oslo: '奥斯陆',
		Bergen: '卑尔根',
		Trondheim: '特隆赫姆',
		Stavanger: '斯塔万格',
		Troms: '特罗姆瑟',
	}

	Object.assign(nameMap, norwayNameMap)

	// 数据格式: 正数表示到访次数，负数表示想去程度
	const countryData = [
		{ name: '中国', value: 8 },
		{ name: '日本', value: -9 },
		{ name: '挪威', value: -8 },
		{ name: '瑞士', value: -10 },
		{ name: '墨西哥', value: -2 },
		{ name: '法国', value: -5 },
		{ name: '爱尔兰', value: -8 },
		{ name: '英国', value: -4 },
		{ name: '意大利', value: -10 },
		{ name: '马来西亚', value: -1 },
	]

	const chinaData = [
		{ name: '北京', value: 5 },
		{ name: '上海', value: 4 },
		{ name: '广东', value: 3 },
		{ name: '江苏', value: 2 },
		{ name: '浙江', value: 3 },
		{ name: '四川', value: 2 },
		{ name: '云南', value: 1 },
		{ name: '西藏', value: -10 },
		{ name: '新疆', value: 8 },
		{ name: '台湾', value: -9 },
	]

	const norwayData = [
		{ name: 'Oslo', value: 3 },
		{ name: 'Bergen', value: 2 },
		{ name: 'Stavanger', value: 1 },
		{ name: 'Trondheim', value: -5 },
		{ name: 'Tromsø', value: -8 },
	]

	// 省份图片映射（单张图片）
	const provinceImages = {
		四川: 'https://via.placeholder.com/150?text=四川',
		山东: 'https://via.placeholder.com/150?text=山东',
		北京: 'https://via.placeholder.com/150?text=北京',
	}

	// 地图点位数据
	const attractionPoints = [
		{
			name: '峨眉山',
			province: '四川',
			coord: [29.516715669172484, 103.33490860677465],
			image: 'https://via.placeholder.com/150?text=峨眉山',
		},
		{
			name: '泰山',
			province: '山东',
			coord: [117.076507, 36.195403],
			image: 'https://via.placeholder.com/150?text=泰山',
		},
		{
			name: '黄山',
			province: '安徽',
			coord: [118.171525, 30.111667],
			image: 'https://via.placeholder.com/150?text=黄山',
		},
	]

	// 悬浮层状态
	let hoveredProvince = ''
	let hoveredAttraction = ''
	let hoverCoord = { x: 0, y: 0 }

	// 初始化图表
	async function initChart() {
		await loadMapData() // 等待地图数据加载完成

		if (!worldRef) return

		// 注册地图
		echarts.registerMap('world', worldMap)
		echarts.registerMap('china', chinaMap)
		echarts.registerMap('norway', norwayMap)

		chartInstance = echarts.init(worldRef)
		setMapOption(currentMap)

		// 点击事件
		chartInstance.on('click', handleMapClick)

		// 鼠标移动事件
		chartInstance.on('mousemove', function (params) {
			if (params.name && params.value !== undefined) {
				// 检查是否有图片数据
				if (hasImageData(params.name)) {
					hoveredProvince = params.name
					hoverCoord = {
						x: params.event?.offsetX ?? 0,
						y: params.event?.offsetY ?? 0,
					}
					updateTooltip()
				} else {
					hoveredProvince = ''
					hideTooltip()
				}
			} else {
				const pointInfo = getAttractionByCoord(
					params.event?.offsetX,
					params.event?.offsetY
				)
				if (pointInfo) {
					hoveredAttraction = pointInfo.name
					hoveredProvince = pointInfo.province
					hoverCoord = {
						x: params.event?.offsetX ?? 0,
						y: params.event?.offsetY ?? 0,
					}
					updateTooltip()
				} else {
					hoveredProvince = ''
					hoveredAttraction = ''
					hideTooltip()
				}
			}
		})

		// 窗口大小变化
		function resizeHandler() {
			chartInstance?.resize()
		}
		window.addEventListener('resize', resizeHandler)

		return function () {
			window.removeEventListener('resize', resizeHandler)
			chartInstance?.dispose()
			chartInstance = null
		}
	}

	// 根据坐标查找景点
	function getAttractionByCoord(x, y) {
		if (!chartInstance || !x || !y) return null

		const point = chartInstance.convertFromPixel('geo', [x, y])
		if (!point) return null

		const threshold = 1
		for (const attraction of attractionPoints) {
			if (
				Math.abs(point[0] - attraction.coord[0]) < threshold &&
				Math.abs(point[1] - attraction.coord[1]) < threshold
			) {
				return attraction
			}
		}
		return null
	}

	// 检查是否有图片数据
	function hasImageData(province) {
		return province in provinceImages
	}

	// 地图点击处理
	const countryToMap = {
		中国: 'china',
		挪威: 'norway',
	}

	function handleMapClick(params) {
		if (!params.name) return

		const countryName = params.name

		const targetMap = countryToMap[countryName]
		if (targetMap) {
			currentMap = targetMap
			setMapOption(targetMap)
			showBackButton()
			updateCountryTitle(countryName)
		} else {
			console.log('点击了其他国家:', countryName)
		}
	}

	// 返回世界地图
	function goBackToWorldMap() {
		currentMap = 'world'
		currentCountry = ''
		setMapOption('world')
		hideBackButton()
		hideCountryTitle()
	}

	// 设置地图选项
	function setMapOption(mapType) {
		if (!chartInstance) return

		const dataMap = {
			world: countryData,
			china: chinaData,
			norway: norwayData,
		}

		const nameMapMap = {
			world: nameMap,
			china: {},
			norway: norwayNameMap,
		}

		const getPointList = function () {
			if (mapType === 'china') {
				return attractionPoints.map(function (point) {
					return {
						coord: point.coord,
						value: point.name,
						symbol: 'pin',
						symbolSize: [20, 30],
						itemStyle: {
							color: '#ff3300',
						},
					}
				})
			}
			return []
		}

		const option = {
			tooltip: {
				trigger: 'item',
				formatter: function (params) {
					if (params.name) {
						const value = params.value
						if (value > 0) {
							return `${params.name}<br/>到访次数: ${value}次`
						} else if (value < 0) {
							return `${params.name}<br/>想去程度: ${Math.abs(value)}/10`
						}
					}
					return ''
				},
			},
			visualMap: {
				type: 'piecewise',
				show: false,
				pieces: [
					{ min: 1, max: 1, label: '1次', color: '#FFF9C4' },
					{ min: 2, max: 2, label: '2次', color: '#FFE082' },
					{ min: 3, max: 3, label: '3次', color: '#FFD54F' },
					{ min: 4, max: 4, label: '4次', color: '#FFCA28' },
					{ min: 5, max: 5, label: '5次', color: '#FFB300' },
					{ min: 6, max: 6, label: '6次', color: '#FF8F00' },
					{ min: 7, max: 7, label: '7次', color: '#FF6F00' },
					{ min: 8, max: 8, label: '8次', color: '#E65100' },
					{ min: -1, max: -1, label: '想去1级', color: '#E1F5FE22' },
					{ min: -2, max: -2, label: '想去2级', color: '#B3E5FC22' },
					{ min: -3, max: -3, label: '想去3级', color: '#81D4FA22' },
					{ min: -4, max: -4, label: '想去4级', color: '#4FC3F722' },
					{ min: -5, max: -5, label: '想去5级', color: '#29B6F622' },
					{ min: -6, max: -6, label: '想去6级', color: '#039BE533' },
					{ min: -7, max: -7, label: '想去7级', color: '#0288D155' },
					{ min: -8, max: -8, label: '想去8级', color: '#0277BD77' },
					{ min: -9, max: -9, label: '想去9级', color: '#01579B99' },
					{ min: -10, max: -10, label: '想去10级', color: '#003A75bb' },
				],
			},
			series: [
				{
					name: '旅行地图',
					type: 'map',
					map: mapType === 'world' ? 'world' : mapType,
					roam: true,
					zoom: mapType !== 'world' ? 1.0 : 1.2,
					scaleLimit: {
						min: 1.2, // 最小缩放级别，1.2 表示原图大小
						max: 5, // 最大缩放级别
					},
					center:
						mapType === 'norway'
							? [105, 36]
							: mapType === 'china'
							? [105, 36]
							: [0, 0],
					itemStyle: {
						areaColor: '#f8f9fa',
						borderWidth: 0.5,
						borderColor: '#ddd',
					},
					emphasis: {
						label: {
							show: true,
							color: '#fff',
						},
						itemStyle: {
							areaColor: '#ff7043',
						},
					},
					label: {
						show: mapType !== 'world',
						fontSize: 10,
					},
					data: dataMap[mapType],
					nameMap: nameMapMap[mapType],
				},
				{
					type: 'effectScatter',
					coordinateSystem: 'geo',
					data: getPointList(),
					symbol: 'pin',
					symbolSize: [20, 30],
					rippleEffect: {
						brushType: 'stroke',
					},
					showEffectOn: 'render',
					zlevel: 2,
					label: {
						show: true,
						formatter: function (params) {
							return params.value
						},
						position: 'right',
						offset: [10, 0],
					},
				},
			],
		}

		chartInstance.setOption(option)
	}

	// 更新悬浮层
	function updateTooltip() {
		tooltipProvince.textContent = nameMap[hoveredProvince] || hoveredProvince
		if (hoveredAttraction) {
			tooltipAttraction.textContent = ' - ' + hoveredAttraction
		} else {
			tooltipAttraction.textContent = ''
		}
		tooltipImage.src = getHoveredImage()
		tooltipContainer.style.left = hoverCoord.x + 'px'
		tooltipContainer.style.top = hoverCoord.y + 'px'
		tooltipContainer.style.display = 'block'
	}

	// 隐藏悬浮层
	function hideTooltip() {
		tooltipContainer.style.display = 'none'
	}

	// 获取当前显示的图片
	function getHoveredImage() {
		if (!hoveredProvince) return ''

		if (hoveredAttraction) {
			const point = attractionPoints.find(
				(p) => p.name === hoveredAttraction && p.province === hoveredProvince
			)
			return point?.image || ''
		}

		return provinceImages[hoveredProvince] || ''
	}

	// 显示返回按钮
	function showBackButton() {
		backButton.style.display = 'block'
	}

	// 隐藏返回按钮
	function hideBackButton() {
		backButton.style.display = 'none'
	}

	// 更新国家标题
	function updateCountryTitle(countryName) {
		countryTitle.textContent = nameMap[countryName] || countryName
		countryTitle.style.display = 'block'
	}

	// 隐藏国家标题
	function hideCountryTitle() {
		countryTitle.style.display = 'none'
	}

	backButton.addEventListener('click', goBackToWorldMap)

	const dispose = initChart()
	window.onBeforeUnmount = function () {
		dispose?.()
	}
})
