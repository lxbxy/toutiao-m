module.exports = {
  //配置要使用的 postCss 插件
  plugins: {
    // 配置要使用的 autoprefixer 插件
    // 作用 生成浏览器 css 样式规则前缀
    //   'autoprefixer': {
    // autoprefixer 插件的配置
    // 配置要兼容到的环境信息
    //     browsers: ['Android >= 4.0', 'iOS >= 8']
    //   },
    // 配置使用 postcss-pxtorem 插件
    // 作用：把 px 转为 rem
    "postcss-pxtorem": {
        rootValue({ file }) {
            return file.indexOf('vant') !== -1 ? 37.5 : 75
        },
      // 配置要转换的 CSS 属性
      // * 表示所有
      propList: ["*"],
    },
  },
};
