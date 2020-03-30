const merge = require('webpack-merge');
const common = require('./webpack.common');
const TerserPlugin = require("terser-webpack-plugin");

// const zopfli = require('@gfx/zopfli');
// const CompressionPlugin = require("compression-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



module.exports = merge(common, {
  mode: "production",
//   watch: true,
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "all",
          name: "vendor",
          test: "/node_modules/"
        }
      }
    },
    nodeEnv: "production",
    mangleWasmImports: true,
    minimizer: [new TerserPlugin()]
  },
  // plugins: [
  //   // new BundleAnalyzerPlugin(),
  //   // new CompressionPlugin({
  //   //   compressionOptions: {
  //   //     numiterations: 5
  //   //   },
  //   //   // algorithm(input, compressionOptions, callback) {
  //   //   //   return zopfli.gzip(input, compressionOptions, callback);
  //   //   // }
  //   // }),
  // ]
});
