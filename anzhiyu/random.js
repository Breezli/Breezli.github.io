var posts=["2025/03/08/Github/GitHub自动化构建/","2025/03/08/Github/git基础使用/","2025/03/08/Github/保姆级GitHub主页美化教程/","2025/03/08/Github/新版git推送注意点/","2025/03/08/Github/更改 GitHub 用户名注意事项/","2025/03/08/博客/博客音乐组件实现/","2025/03/08/基础前端/CSS常见问题/","2025/03/08/基础前端/CSS搭建页面3D空间/","2025/03/08/基础前端/Scss/","2025/03/08/基础前端/TS基础/","2025/03/08/基础前端/Vue组件通信/","2025/03/08/基础前端/Vue路由/","2025/03/08/基础前端/grid网格布局/","2025/03/08/基础前端/页面circle加载动画/","2025/03/08/基础前端/grid+transform实现页面3D骰子/","2025/03/08/工具/网页视频捕获工具/","2025/03/08/基础前端/页面预加载/","2025/03/08/基础前端/varletconst区分/","2025/03/08/深入前端/Node.js基础/","2025/03/08/深入前端/ECharts官方图表库CV教程/","2025/03/08/深入前端/TS + NodeJS实现axios/","2025/03/08/深入前端/mini-vue搭建笔记/","2025/03/08/深入前端/WebRTC实现本地视频通话  全流程详解/","2025/03/08/深入前端/前端技术方向选型/","2025/03/04/深入前端/WebRTC实现本地视频通话全流程/","2025/03/08/深入前端/WebSocket/","2025/03/08/深入前端/格式化上下文--BFC与IFC/","2025/03/04/深入前端/从零实现axios/","2025/03/08/深入前端/键盘乱键问题/","2025/03/08/深入前端/快速上手EChart含图表模板_vue项目写法/","2025/03/08/深入前端/尝试编写一个桌面端计时器（半成品版）/","2025/03/04/深入前端/源码探究 runtime-core模块/","2025/03/08/深入前端/项目中z-index的规划设计/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };