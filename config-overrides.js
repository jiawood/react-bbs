const { override, fixBabelImports, addLessLoader, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  // 针对antd 实现按需打包：根据import来打包 (使用babel-plugin-import)
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true, //自动打包相关的样式 默认为 style:'css'
  }),
  // 使用less-loader对源码重的less的变量进行重新制定，设置antd自定义主题
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: { "@primary-color": "#303133" },

    }
  })
);


