const merge = require("webpack-merge");
const common = require("./webpack.common");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common, {
  devtool: "cheap-module-source-map",
  mode: "development",
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
  // plugins: [
  //   new BundleAnalyzerPlugin(),
  // ]
});
