var fs = require("fs")
var path = require("path")
var webpack = require("webpack")
var HtmlWebpackPlugin = require("html-webpack-plugin")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

var WEBCONFIG = require("./config/webconfig")

var themeVariables = {}
var publicPath = "/"

module.exports = {
    // mode: "development",
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].js",
        publicPath: "/"
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: WEBCONFIG.PORT
    },
    devtool: "eval",
    module: {
        rules: [
            {
                test: /\.(tsx|ts)?$/,
                use: [
                    {
                        loader: "react-hot-loader/webpack"
                    },
                    {
                        loader: "babel-loader"
                    },
                    {
                        loader: "awesome-typescript-loader"
                    }
                ]
            },
            {
                test: /\.jsx?$/,
                use: ["babel-loader"],
                // type: "javascript/auto",
                include: path.resolve(__dirname, "src"),
                exclude: /node_modules/
            },
            {
                test: /\.(jsx|js)$/,
                enforce: "pre",
                loader: "eslint-loader"
            },
            {
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    // fallback: "style-loader",
                    use: ["css-loader", "less-loader"],
                    publicPath: "/"
                })
            },
            // {
            //     test: /\.less$/,
            //     use: ["style-loader","css-loader","less-loader"]
            // },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader:
                    "url-loader?limit=8192&name=assets/image/[name].[ext]&publicPath=" +
                    publicPath
            },
            {
                test: /\.(ttf|eot|svg|woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader:
                    "url-loader?limit=8192&name=iconfont/[name].[ext]&publicPath=" +
                    publicPath
            }
        ]
    },
    plugins: [
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "vendor",
        //     filename: "js/vendor.js",
        //     chunks: ["index"]
        //   }),
        new webpack.ProvidePlugin({
            React: "react",
            ReactDOM: "react-dom",
            moment: "moment"
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": `'${process.env.NODE_ENV}'`
        }),
        new ExtractTextPlugin({
            filename: "assets/styles/[name].css",
            allChunks: true
        }),
        new HtmlWebpackPlugin({
            title: "NLP",
            template: path.resolve(__dirname, "src/assets", "index.html"),
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            },
            chunksSortMode: "dependency"
        })
        // new AutoDllPlugin({
        //     inject: true, // will inject the DLL bundle to index.html
        //     debug: true,
        //     filename: "[name].js",
        //     path: "./dll",
        //     entry: {
        //         dll: [
        //             "react",
        //             "react-dom",
        //             "react-router",
        //             "antd",
        //             "leaflet",
        //             "highcharts",
        //             "immutable",
        //             "moment",
        //             "NProgress"
        //         ]
        //     }
        // })
    ],
    externals: {
        React: "react"
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx", ".css", ".jsx", ".less"]
    }
}
