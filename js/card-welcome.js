window.IP_CONFIG = {
    API_KEY: 'Qe2XiZPAHxzTmwIsySO3qgxiwA', // API密钥 申请地址：https://api.76.al/
    BLOG_LOCATION: {
        lng: 117.90, // 经度
        lat: 40.50 // 纬度
    },
    CACHE_DURATION: 1000 * 60 * 60, // 可配置缓存时间(默认1小时)
    HOME_PAGE_ONLY: true, // 是否只在首页显示 开启后其它页面将不会显示这个容器
};

const insertAnnouncementComponent = () => {
    // 获取所有公告卡片
    const announcementCards = document.querySelectorAll('.card-widget.card-announcement');
    if (!announcementCards.length) return;

    if (IP_CONFIG.HOME_PAGE_ONLY && !isHomePage()) {
        announcementCards.forEach(card => card.remove());
        return;
    }
    
    if (!document.querySelector('#welcome-info')) return;
    fetchIpInfo();
};

const getWelcomeInfoElement = () => document.querySelector('#welcome-info');

const fetchIpData = async () => {
    const response = await fetch(`https://api.nsmao.net/api/ip/query?key=${encodeURIComponent(IP_CONFIG.API_KEY)}`);
    if (!response.ok) throw new Error('网络响应不正常');
    return await response.json();
};

const showWelcome = ({
    data,
    ip
}) => {
    if (!data) return showErrorMessage();

    const {
        lng,
        lat,
        country,
        prov,
        city
    } = data;
    const welcomeInfo = getWelcomeInfoElement();
    if (!welcomeInfo) return;

    const dist = calculateDistance(lng, lat);
    const ipDisplay = formatIpDisplay(ip);
    const pos = formatLocation(country, prov, city);

    welcomeInfo.style.display = 'block';
    welcomeInfo.style.height = 'auto';
    welcomeInfo.innerHTML = generateWelcomeMessage(pos, dist, ipDisplay, country, prov, city);
};

const calculateDistance = (lng, lat) => {
    const R = 6371; // 地球半径(km)
    const rad = Math.PI / 180;
    const dLat = (lat - IP_CONFIG.BLOG_LOCATION.lat) * rad;
    const dLon = (lng - IP_CONFIG.BLOG_LOCATION.lng) * rad;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(IP_CONFIG.BLOG_LOCATION.lat * rad) * Math.cos(lat * rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};
const formatIpDisplay = (ip) => ip.includes(":") ? "<br>好复杂，咱看不懂~(ipv6)" : ip;
const formatLocation = (country, prov, city) => {
    return country ? (country === "中国" ? `${prov} ${city}` : country) : '神秘地区';
};

const generateWelcomeMessage = (pos, dist, ipDisplay, country, prov, city) => `
    欢迎来自 <b>${pos}</b> 的朋友<br>
    你当前距博主约 <b>${dist}</b> 公里！<br>
    你的IP地址：<b class="ip-address">${ipDisplay}</b><br>
    ${getTimeGreeting()}<br>
    Tip：<b>${getGreeting(country, prov, city)}</b>
`;

const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        #welcome-info {
            user-select: none;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 212px;
            padding: 10px;
            margin-top: 5px;
            border-radius: 12px;
            background-color: var(--anzhiyu-background);
            outline: 1px solid var(--anzhiyu-card-border);
        }
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 3px solid var(--anzhiyu-main);
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .ip-address {
            filter: blur(5px);
            transition: filter 0.3s ease;
        }
        .ip-address:hover {
            filter: blur(0);
        }
        .error-message {
            color: #ff6565;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .error-message p,
        .permission-dialog p {
            margin: 0;
        }
        .error-icon {
            font-size: 3rem;
        }
        #retry-button {
            margin: 0 5px;
            color: var(--anzhiyu-main);
            transition: transform 0.3s ease;
        }
        #retry-button:hover {
            transform: rotate(180deg);
        }
        .permission-dialog {
            text-align: center;
        }
        .permission-dialog button {
            margin: 10px 5px;
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            background-color: var(--anzhiyu-main);
            color: white;
            transition: opacity 0.3s ease;
        }
        .permission-dialog button:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
};

// 位置权限相关函数
const checkLocationPermission = () => localStorage.getItem('locationPermission') === 'granted';
const saveLocationPermission = (permission) => {
    localStorage.setItem('locationPermission', permission);
};
const showLocationPermissionDialog = () => {
    const welcomeInfoElement = document.getElementById("welcome-info");
    welcomeInfoElement.innerHTML = `
        <div class="permission-dialog">
            <div class="error-icon">❓</div>
            <p>是否允许访问您的位置信息？</p>
            <button data-action="allow">允许</button>
            <button data-action="deny">拒绝</button>
        </div>
    `;

    welcomeInfoElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const action = e.target.dataset.action;
            const permission = action === 'allow' ? 'granted' : 'denied';
            handleLocationPermission(permission);
        }
    });
};
const handleLocationPermission = (permission) => {
    saveLocationPermission(permission);
    if (permission === 'granted') {
        showLoadingSpinner();
        fetchIpInfo();
    } else {
        showErrorMessage('您已拒绝访问位置信息');
    }
};

const showLoadingSpinner = () => {
    const welcomeInfoElement = document.querySelector("#welcome-info");
    if (!welcomeInfoElement) return;
    welcomeInfoElement.innerHTML = '<div class="loading-spinner"></div>';
};

const IP_CACHE_KEY = 'ip_info_cache';
const getIpInfoFromCache = () => {
    const cached = localStorage.getItem(IP_CACHE_KEY);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > IP_CONFIG.CACHE_DURATION) {
        localStorage.removeItem(IP_CACHE_KEY);
        return null;
    }
    return data;
};
const setIpInfoCache = (data) => {
    localStorage.setItem(IP_CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
};

const fetchIpInfo = async () => {
    if (!checkLocationPermission()) {
        showLocationPermissionDialog();
        return;
    }

    showLoadingSpinner();

    const cachedData = getIpInfoFromCache();
    if (cachedData) {
        showWelcome(cachedData);
        return;
    }

    try {
        const data = await fetchIpData();
        setIpInfoCache(data);
        showWelcome(data);
    } catch (error) {
        console.error('获取IP信息失败:', error);
        showErrorMessage();
    }
};

const greetings = {
  "中国": {
    "北京市": "故宫红墙黄瓦，沉淀六百年紫禁风云；居庸关长城蜿蜒，见证多少金戈铁马。愿君漫步中轴线，听钟鼓楼声回响千年帝都的沧桑。",
    "天津市": "海河波光潋滟，倒映九国租界往事；相声茶馆里，一捧一逗道尽市井烟火。盼君尝过狗不理，且在夜幕下看摩天轮点亮津门夜色。",
    "河北省": "山海关雄峙沧海，老龙头探入波涛；避暑山庄烟雨楼台，依稀康乾盛世余韵。若君登临赵州桥，不妨细寻那千年车辙里的岁月留痕。",
    "山西省": "云冈石窟万千佛影，在武周山麓静观红尘；平遥古城票号犹存，诉说晋商五百年传奇。愿君夜宿晋中大院，看斗拱飞檐勾勒明月清辉。",
    "内蒙古自治区": "敕勒川阴山下，风吹草低见牛羊；成吉思汗陵前，苏鲁锭长枪守望草原。盼君醉饮马奶酒，在星空蒙古包听马头琴声悠远苍凉。",
    
    "江苏省": {
      "南京市": "秦淮画舫灯影碎，六朝金粉随水流；紫金山麓中山陵，392级台阶通向民国烟云。若君漫步明城墙，可见玄武湖波光潋滟千年不改。",
      "苏州市": "拙政园曲径通幽，留园冠云峰奇巧；评弹声声里，吴侬软语唱尽江南风月。愿君泛舟山塘街，看小桥流水人家如铺开水墨长卷。",
      "其他": "扬州瘦西湖二十四桥，月色依旧如玉人箫声；无锡鼋头渚樱花如雪，太湖烟波浩渺接远天。盼君访遍江南古镇，收集每个枕水人家的晨昏。"
    },
    
    "浙江省": {
      "杭州市": "西湖潋滟晴方好，苏堤春晓柳如烟；灵隐寺钟声穿林，惊起飞来峰上啼鸟。若君秋日访孤山，可赏满陇桂雨落如金色诗篇。",
      "宁波市": "天一阁书香氤氲，藏尽古今翰墨；保国寺无梁殿奇构，千年楠木不言。愿君漫步老外滩，看三江口潮水涌起海上丝路遗韵。",
      "其他": "绍兴兰亭曲水流觞，王羲之墨痕犹在；雁荡山灵峰夜景，夫妻峰剪影缠绵千年。盼君走读浙东山水，在楠溪江畔寻访耕读传家古风。"
    },

    "河南省": {
      "郑州市": "河南博物院九大镇馆，莲鹤方壶展翅欲飞；登封观星台仰观天象，郭守敬测算日月盈昃。愿君漫步商都遗址，触摸三千六百年文明脉搏。",
      "洛阳市": "龙门石窟十万造像，卢舍那佛微笑千年；白马寺青灯古佛，见证佛法东传第一刹。若君春日访洛阳，定要看牡丹花开动京城的盛景。",
      "开封市": "清明上河园再现汴京繁华，虹桥上车马如织；铁塔琉璃砖历经洪水地震，犹自巍然屹立。盼君夜游御河，看灯火阑珊处大宋梦华。"
    },

    "陕西省": "兵马俑军阵肃穆，每个陶俑面容各异；碑林翰墨飘香，颜柳欧赵真迹琳琅。愿君漫步古城墙，在暮色中听钟楼鼓楼对话盛唐。",
    
    "甘肃省": "莫高窟飞天舞袂，五彩斑斓如梦似幻；嘉峪关城楼巍峨，遥望祁连雪山皑皑。若君行走河西走廊，定能听见丝绸之路的驼铃回响。",

    "四川省": {
      "成都市": "杜甫草堂柴门依旧，浣花溪畔竹影摇翠；金沙遗址太阳神鸟，旋出古蜀遗落旧迹。待君鹤鸣茶馆小坐，盖碗茶烟升起闲情溪月。",
      "其他": "乐山大佛临江危坐，三江汇流脚下奔涌；峨眉金顶云海翻腾，佛光偶尔现于彩虹。待君寻访青城幽境，于都江堰叹千秋之慧。"
    },

    "湖北省": {
      "武汉市": "黄鹤楼耸立蛇山，崔颢题诗在上头；东湖樱园落英缤纷，恍若武大老斋舍书香。若君清晨过江，可见朝阳跃出江面点亮江城三镇。",
      "其他": "武当山金顶耀日，紫霄宫琉璃生辉；神农架云海茫茫，野人传说更添神秘。盼君船过西陵峡，看三峡大坝平湖高峡出奇迹。"
    },

    "湖南省": "岳阳楼俯瞰洞庭，范仲淹忧乐名言千古；马王堆辛追夫人，轻纱素衣穿越两千年。愿君泛舟张家界，看石英砂岩峰林如剑指苍穹。",
    
    "江西省": "庐山瀑布飞流，李白望而诗成；景德镇窑火千年，青花瓷如玉生烟。若君访白鹿洞书院，可闻朱陆鹅湖之辩余音绕梁。",

    "山东省": {
      "济南市": "趵突泉三股水涌，珍珠串串浮碧池；大明湖荷香四溢，历下亭前鸥鹭翩跹。愿君漫步曲水亭街，看泉水人家青石板路流淌日常。",
      "其他": "泰山十八盘陡峻，玉皇顶观日出云海；曲阜孔庙桧柏森森，杏坛讲学余韵悠长。盼君登临蓬莱阁，或许能邂逅海市蜃楼的幻境。"
    },

    "辽宁省": "沈阳故宫八角殿，满汉建筑交融典范；旅顺军港波平如镜，日俄监狱警示后人。愿君漫步星海广场，看百年风云化作海鸥翩飞。",
    "吉林省": "高句丽遗址王城，五女峰顶云雾缭绕；伪满皇宫廊腰缦回，见证末代皇帝浮沉。若君冬日访长白，定要赏天池冰封如琉璃世界。",
    "黑龙江省": "圣索菲亚教堂穹顶，鸽子绕飞如雪；漠河北极村极光，绿影摇曳如梦似幻。盼君漫步中央大街，听面包石路回响中东铁路往事。",
    "安徽省": "黄山奇松怪石，云海温泉四绝俱全；宏村月沼如镜，马头墙倒映百年沧桑。愿君走访徽州古道，在歙县牌坊群读尽忠孝节义。",
    "福建省": "武夷山九曲溪清，玉女峰亭亭玉立；鼓浪屿琴声悠扬，日光岩上看万国建筑。若君访泉州古港，可见宋元海丝遗迹星罗棋布。",
    "广东省": {
      "广州市": "陈家祠三雕两塑，岭南艺术集大成；南越王墓丝缕玉衣，诉说秦汉岭南风华。愿君夜游珠江，看小蛮腰彩灯变换如舞霓裳。",
      "深圳市": "大鹏所城城墙斑驳，守御千户所往事如烟；改革开放展览馆，记录四十年沧海桑田。盼君登莲花山，在邓小平铜像前俯瞰新城。"
    },
    "广西壮族自治区": "桂林山水甲天下，漓江倒影如画；花山岩画朱色依旧，骆越先民舞姿翩跹。愿君夜宿阳朔，在西街灯火中听各族山歌交织。",
    "海南省": "海瑞墓石兽肃立，椰风海韵伴清名；天涯海角石柱巍峨，见证贬官谪臣乡愁。盼君访五指山，在黎族村寨听鼻箫吹奏古老歌谣。",
    "贵州省": "黄果树瀑布如银河倒泻，水帘洞内观彩虹；西江千户苗寨灯火，如星辰洒落山间。愿君走访侗族村寨，听大歌回响在鼓楼花桥。",
    "云南省": "丽江古城小桥流水，纳西古乐穿越时空；大理崇圣寺三塔倒影，洱海月映苍山雪。盼君走进香格里拉，在松赞林寺感受藏地虔诚。",
    "西藏自治区": "布达拉宫金顶耀日，经幡在蓝天飘扬；大昭寺释迦牟尼十二岁等身像，引来千里磕长头信徒。愿君静坐纳木错畔，看雪山倒映圣湖。",
    "青海省": "塔尔寺八宝如意塔，转经筒声不绝；青海湖鸟岛万千候鸟，起舞在蔚蓝水面。盼君行走三江源，在可可西里邂逅藏羚羊倩影。",
    "宁夏回族自治区": "西夏王陵如金字塔，矗立贺兰山麓；沙坡头黄河拐弯，大漠孤烟直上云霄。愿君夜宿沙漠营地，看星河垂落沙丘如银。",
    "新疆维吾尔自治区": "交河故城断壁残垣，诉说车师国往事；喀什老城迷宫巷弄，维吾尔风情浓郁。盼君骑马天山草原，在喀纳斯湖寻找湖怪传说。",
    "台湾省": "台北故宫翠玉白菜，巧夺天工令人叹；赤崁楼红砖建筑，记录荷兰统治时光。愿君环岛旅行，在太鲁阁峡谷看立雾溪切割大理石。",
    "香港特别行政区": "黄大仙祠香火鼎盛，求签问卜络绎不绝；大屿山天坛大佛，慈目垂视红尘众生。盼君乘天星小轮，看维港两岸霓虹璀璨如星。",
    "澳门特别行政区": "大三巴牌坊浮雕精美，圣母踏龙头象征；妈阁庙紫烟袅袅，渔民祈福声传百年。愿君漫步议事亭前地，看葡式碎石路铺成海浪。",

    "其他": "华夏山河如展开的千里江山图，每处皆有独特笔触。盼君走遍九州，收集每个地方的晨昏雨雪，归来与我细说那些打动人心的风景。"
  },
  
  // 国际部分
  "日本": "京都清水舞台悬于峭壁，春樱秋枫皆是禅意；奈良唐招提寺鉴真目盲心明，招提月光照耀千年。若君访岚山竹林，可见周恩来诗碑立于苍翠。",
  "法国": "巴黎圣母院玫瑰窗虽经火劫，雨果笔下的钟声依旧；凡尔赛宫镜廊金碧辉煌，路易十四太阳王余威犹存。盼君塞纳河左岸咖啡馆小坐，感受存在主义遗风。",
  "意大利": "罗马斗兽场残垣断壁，角斗士呐喊似在风中；佛罗伦萨乌菲兹长廊，波提切利春神裙裾生风。愿君威尼斯乘贡多拉，看夕阳把运河染成黄金。",
  "美国": "纽约自由女神火炬高举，照亮移民百年梦想；华盛顿林肯纪念堂石座，民有民治民享刻入历史。若君行走66号公路，可见车轮碾过的拓荒传奇。",
  "英国": "伦敦大英博物馆罗塞塔石碑，破译古埃及文明密码；牛津博德利图书馆穹顶，培根笛卡尔曾在此沉思。盼君斯特拉特福镇访莎士比亚故居，听艾冯河天鹅吟诗。",
  "韩国": "景福宫勤政殿重檐巍峨，世宗大王创制韩文；济州岛城山日出峰火山口，晨光中如巨大皇冠。愿君漫步韩屋村，在青瓦白墙间品味传统茶道。",
  
  "其他": "世界如一部打开的百科全书，每页都写满文明传奇。期待君带来远方的故事，让书房飘满异域的书香与花香。"
};

const getGreeting = (country, province, city) => {
    const countryGreeting = greetings[country] || greetings["其他"];
    if (typeof countryGreeting === 'string') {
        return countryGreeting;
    }
    const provinceGreeting = countryGreeting[province] || countryGreeting["其他"];
    if (typeof provinceGreeting === 'string') {
        return provinceGreeting;
    }
    return provinceGreeting[city] || provinceGreeting["其他"] || countryGreeting["其他"];
};
const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "🌄晨光熹微，愿今日诸事顺遂";
    if (hour < 11) return "🌤️朝霞映窗，且共清风启新程";
    if (hour < 13) return "☀️日正当空，不妨小憩片刻";
    if (hour < 17) return "📖午后闲适，恰是读书品茗时";
    if (hour < 19) return "🌆暮色初临，晚风送凉宜漫步";
    if (hour < 22) return "🏮华灯初上，静享夜晚安宁";
    return "✨夜深人静，愿你好梦相伴";
};

const showErrorMessage = (message = '抱歉，无法获取信息') => {
    const welcomeInfoElement = document.getElementById("welcome-info");
    welcomeInfoElement.innerHTML = `
        <div class="error-message">
            <div class="error-icon">😕</div>
            <p>${message}</p>
            <p>请<i id="retry-button" class="fa-solid fa-arrows-rotate"></i>重试或检查网络连接</p>
        </div>
    `;

    document.getElementById('retry-button').addEventListener('click', fetchIpInfo);
};

const isHomePage = () => {
    return window.location.pathname === '/' || window.location.pathname === '/index.html';
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    addStyles();
    insertAnnouncementComponent();
    document.addEventListener('pjax:complete', insertAnnouncementComponent);
});
