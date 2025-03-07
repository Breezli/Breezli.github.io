var posts=["2025/03/04/深入前端/WebRTC实现本地视频通话全流程/","2025/03/04/深入前端/从零实现axios/","2025/03/04/深入前端/源码探究 runtime-core模块/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };