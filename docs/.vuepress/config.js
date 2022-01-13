// const themeConfig = require('./config/theme')
const nav = require("./config/nav");
const sidebar = require("./config/sidebar");
module.exports = {
  title: "茶余趣谈",
  description: "开心快乐每一天",
  dest: "public",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
    // 引入jquery
    [
      "script",
      {
        language: "javascript",
        type: "text/javascript",
        src: "https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js",
      },
    ],
    [
      "script",
      {
        language: "javascript",
        type: "text/css",
        src:
          "https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css",
      },
    ],
    [
      "script",
      {
        language: "javascript",
        type: "text/javascript",
        src:
          "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/autoload.js",
      },
    ],
  ],
  theme: "reco",
  themeConfig: {
    type: "blog",
    authorAvatar: '/head.png', // 头像
    lastUpdated: '上次更新',
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "分类", // 默认文案 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "标签", // 默认文案 “标签”
      },
    },
    nav,
    sidebar,
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    sidebar: "auto",
    record: "粤ICP备2021098716号-1",
    recordLink: "https://beian.miit.gov.cn",
    cyberSecurityRecord: "公安部备案文案",
    cyberSecurityLink: "公安部备案指向链接",
    // 项目开始时间，只填写年份
    startYear: "2021",
    smoothScroll: true,
    valineConfig: {
      appId: "W3sdnnKlljJ24a4YLzGC4oj6-gzGzoHsz", // your appId
      appKey: "BQHSFPNjeiQNy1LSD1r84b0q", // your appKey
      // 设置Bilibili表情包地址
      emojiCDN: "//i0.hdslb.com/bfs/emote/",
      // 表情title和图片映射
      emojiMaps: {
        tv_doge: "6ea59c827c414b4a2955fe79e0f6fd3dcd515e24.png",
        tv_亲亲: "a8111ad55953ef5e3be3327ef94eb4a39d535d06.png",
        tv_偷笑: "bb690d4107620f1c15cff29509db529a73aee261.png",
        tv_再见: "180129b8ea851044ce71caf55cc8ce44bd4a4fc8.png",
        tv_冷漠: "b9cbc755c2b3ee43be07ca13de84e5b699a3f101.png",
        tv_发怒: "34ba3cd204d5b05fec70ce08fa9fa0dd612409ff.png",
        tv_发财: "34db290afd2963723c6eb3c4560667db7253a21a.png",
        tv_可爱: "9e55fd9b500ac4b96613539f1ce2f9499e314ed9.png",
        tv_吐血: "09dd16a7aa59b77baa1155d47484409624470c77.png",
        tv_呆: "fe1179ebaa191569b0d31cecafe7a2cd1c951c9d.png",
        tv_呕吐: "9f996894a39e282ccf5e66856af49483f81870f3.png",
        tv_困: "241ee304e44c0af029adceb294399391e4737ef2.png",
        tv_坏笑: "1f0b87f731a671079842116e0991c91c2c88645a.png",
        tv_大佬: "093c1e2c490161aca397afc45573c877cdead616.png",
        tv_大哭: "23269aeb35f99daee28dda129676f6e9ea87934f.png",
        tv_委屈: "d04dba7b5465779e9755d2ab6f0a897b9b33bb77.png",
        tv_害羞: "a37683fb5642fa3ddfc7f4e5525fd13e42a2bdb1.png",
        tv_尴尬: "7cfa62dafc59798a3d3fb262d421eeeff166cfa4.png",
        tv_微笑: "70dc5c7b56f93eb61bddba11e28fb1d18fddcd4c.png",
        tv_思考: "90cf159733e558137ed20aa04d09964436f618a1.png",
        tv_惊吓: "0d15c7e2ee58e935adc6a7193ee042388adc22af.png",
        // ... 更多表情
      },
    },
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: [
    [
      "@vuepress-reco/vuepress-plugin-bulletin-popover",
      {
        body: [
          {
            type: "title",
            content: "欢迎进入我的博客 🎉🎉🎉",
            style: "text-aligin: center;",
          },
          /* {
          type: 'image',
          src: '/rvcode_qq.png'
        } */
        ],
        /* footer: [
        {
          type: 'button',
          text: '打赏',
          link: '/donate'
        },
        {
          type: 'button',
          text: '打赏',
          link: '/donate'
        }
      ] */
      },
    ],
    ["@vuepress/medium-zoom"],
    // 流程图插件
    ["flowchart"],
    // 标签加强
    ["vuepress-plugin-boxx"],
    // 动态标题
    [
      "dynamic-title",
      {
        showIcon: "vuepress/smile.ico",
        showText: "(/≧▽≦/)欢迎帅哥美女！",
        hideIcon: "vuepress/cry.ico",
        hideText: "(●—●)呜呜，不要走嘛！！",
        recoverTime: 2000,
      },
    ],
    // 更新刷新插件
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: {
          message: "发现新内容可用",
          buttonText: "刷新",
        },
      },
    ],
    // 代码复制弹窗插件
    [
      "vuepress-plugin-nuggets-style-copy",
      {
        copyText: "复制代码",
        tip: {
          content: "复制成功!",
        },
      },
    ],
    [
      "@vuepress-reco/vuepress-plugin-bgm-player",
      {
        audios: [
          // 网络文件示例
          {
            name: "你瞒我瞒",
            artist: "周柏宇",
            url: "http://47.106.198.203/music/nimanwoman.mp3",
            cover: "https://assets.smallsunnyfox.com/music/2.jpg",
          },
          {
            name: "강남역 4번 출구",
            artist: "Plastic / Fallin` Dild",
            url: "https://assets.smallsunnyfox.com/music/2.mp3",
            cover: "https://assets.smallsunnyfox.com/music/2.jpg",
          },
        ],
        // 自动缩小
        autoShrink: true,
        // 悬浮窗模式，吸边
        shrinkMode: "float",
        // 悬浮窗位置
        floatStyle: { bottom: "10px", "z-index": "999999" },
      },
    ],
    [
      "ribbon",
      {
        size: 90, // width of the ribbon, default: 90
        opacity: 0.2, // opacity of the ribbon, default: 0.3
        zIndex: -1, // z-index property of the background, default: -1
      },
    ],
    ["cursor-effects"],
    ["go-top"],
  ],
};
