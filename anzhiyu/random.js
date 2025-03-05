var posts=["2025/03/04/Github/测试/","2025/03/03/hello-world/","2025/03/04/深入前端/WebRTC实现本地视频通话全流程/","2025/03/04/深入前端/源码探究 runtime-core模块/","2025/03/04/深入前端/从零实现axios/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };