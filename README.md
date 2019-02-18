# webpack-vue
a multi-page development environment that use vue

## 一、项目初衷

1、本想借用之前创建的[webpack-demo](http://github.com/StarShi/webpack-demo)多页面开发环境写一个展示作品的博客的，但奈何进行过程中，无法简单高效的开发组件，于是我就想到了经常使用的vue。

2、本环境正是借鉴vue单页面打包应用的webpack配置，衍生出了vue多页面应用的开发环境，在此环境中可利用vue高阶组件的方式进行开发，也可随心所欲的使用vue的搭配工具。

3、在vue单页面应用普及的情况下，本环境存在的意义于我而言有三点，其一该环境无需使用前端路由，使用后端路由；其二该环境无需通过ajax请求html组件的方式，便可实现页面应用的组件式开发；其三该环境可借助vue丰富的组件体系，高效的开发组件;其四配置该环境使我更熟练的掌握了webpack的配置。

## 二、搭建环境步骤

1、搭建一个多页面开发环境或直接拉取[webpack-demo](http://github.com/StarShi/webpack-demo)

	git clone https://github.com/StarShi/webpack-demo.git

2、根据vue-cli生成的单页面应用开发环境，改造相应的目录结构

![](https://i.imgur.com/0h0spKs.png)

> 将原来存放在assets的样式文件以及页面入口文件一起移动到views(视图文件夹)中，根据vue单页面改造目录，如图；

3、修改入口配置文件entry.config.js

	/**
	 * 页面入口配置
	 * 动态查找所有入口文件
	*/
	
	// 导入模块
	const path = require("path");
	const glob = require("glob");
	
	let newEntry = {};
	// 获取src/assets下的index.js入口文件
	let jsFiles = glob.sync(path.resolve(__dirname,'../src/views/**/index.js'));
		// console.log(jsFiles)
	for(let item of jsFiles){
		let patternUrl = /.*(\/src\/.*?index\.js)/;//获取文件路径
		let patternName = /.*\/(.*?)\/index\.js$/; //获取文件名称
		let url = patternUrl.exec(item)[1];//0-原串 1-匹配的内容
		let name = patternName.exec(item)[1];
		newEntry[name] = '.'+url;
	}
	
	module.exports = newEntry;

>由于所有页面的入口文件index.js都移动到views下，所以需将原来的assets换成views，如此才能找到入口文件

4、在根目录下新建页面的统一模版index.html，修改出口文件配置web.config.js


![](https://i.imgur.com/cH2qQs6.png)
	
	/**
	 *  页面模版配置
	 *  动态查找所有HTML文件
	*/
	
	// 导入模块
	const path = require("path");
	const glob = require("glob");
	const HtmlWebpackPlugin = require("html-webpack-plugin");
	
	// 获取src/views下的html文件
	let files = glob.sync(path.resolve(__dirname,'../src/views/**/*.vue'));
	let newHtmls = [];
	let title = {
		contact: 'contact页面',
		index: 'index页面'
	};
	for(let item of files){
		let patternUrl = /.*(\/src\/.*?\.vue)/;//获取路径
		let patternName = /.*\/(.*?)\.vue$/; //获取名字
		let url = patternUrl.exec(item)[1];//0-原串 1-匹配的内容 null-未匹配
		let name = patternName.exec(item)[1];
		url = path.join(__dirname, '..'+url);
		newHtmls.push(new HtmlWebpackPlugin({
			filename:name+'.html',
			template:'index.html',
			inject:true,//默认true插入body,head | body | false 
			title:title[name],
			minify:{
				// collapseWhitespace: true,//移除空格
				removeComments: true,//移除注释
			},
			chunks:['common',name],
			//common为提取出来的公共代码，如在多页面里均引入的jquery一样，提取出来减少打包体积
		}));
	}
	// console.log(newHtmls)
	module.exports = newHtmls;

>因为所有页面初始统一使用根目录下的index.html模版，所以我们需要借用html-webpack-plugin传递title参数,改变打包后生成的html文件的title值；

>配置文件中所有.html文件后缀，需全换成.vue

5、最后也是最关键的一点，需要修改webpack.base.config.js

>安装

	npm i --save vue
	npm i -save-dev vue vue-loader vue-template-compiler vue-style-loader

>修改

- 引入vue-loader-plugin

 
![](https://i.imgur.com/KcjeKbr.png)

- 使用vue-loader-plugin

![](https://i.imgur.com/3t8XUlg.png)

- 解析.vue文件

![](https://i.imgur.com/1UF8zZF.png)



	//导入文件
	const path = require('path');
	const entry = require('./entry.config');
	const htmls = require('./web.config');
	const CopyWebpackPlugin = require('copy-webpack-plugin');
	const VueLoaderPlugin = require('vue-loader/lib/plugin');
	
	function resolve (dir) {//处理别名路径
		return path.join(__dirname, '..', dir);
	}
	let config = {
	entry:entry,
	output: {//出口文件
		filename: "[name]/js/[name]-[hash].js",//打包后输出文件的文件名
		path: path.join(__dirname, "../public"),//打包后的文件存放的地方,__dirname指当前根目录
		publicPath:'/',
	},
	resolve: {
	    extensions: ['.js','.json','.css','.scss','.vue'],//引用可省略扩展
	    alias: { //别名
	        'vue$': 'vue/dist/vue.esm.js',
	        '@': resolve('src'),
	    }
	},
	module: {
	    rules: [
			{
				test: /\.vue$/,//处理vue文件
				use: {
					loader:'vue-loader',
					options: {
						loaders: {//处理vue文件中不同类型的样式
							css:['css-loader', 'postcss-loader'],
							scss: ['css-loader', 'postcss-loader','sass-loader']
						}
					}
				},
			
			},
			{
				test: /\.js$/,//转换js文件中的es6语法
				use: 'babel-loader',
				include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
			},
			{
			    test:/\.(png|jpg|gif|jpeg|svg)(\?.*)?$/,//打包图片
			    use:[{
			            loader: "url-loader",
			            options: {
			                name: "[name].[hash].[ext]",//文件名称
			                limit: 10000, //限制大小，超过则默认使用file-loader处理
			                outputPath:'static/images' //输出路径
			            }
			    }],
			    include:[resolve('src')]
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,//打包音视频文件
			    use:[{
			            loader: "url-loader",
			            options: {
			                name: "[name].[hash].[ext]",//文件名称
			                limit: 10000, //限制大小，超过则默认使用file-loader处理
			                outputPath:'static/media'//输出路径
			            }
			    }],
					include:[resolve('src')]
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,//打包字体文件
				use:[{
			            loader: "url-loader",
			            options: {
			                name: "[name].[hash].[ext]",//文件名称
			                limit: 10000, //限制大小，超过则默认使用file-loader处理
			                outputPath:'static/fonts'//输出路径
			            }
			    }],
			    include:[resolve('src')]
			}
		]
	},
	plugins:[
			new CopyWebpackPlugin([//复制静态资源
				{
					from: path.resolve(__dirname, '../static'),
					to: path.join(__dirname,'../public/static'),
					ignore: ['.*'],
				}
			]),
			new VueLoaderPlugin()
		]
	};
	for(let item of htmls){
		config.plugins.push(item);
	}
	module.exports = config;

## 总结

本项目的难点在于改造vue-cli的单页面应用环境以及处理.vue文件，只要按照文章所述,一步步走便可轻松搞定基于vue多页面应用的开发环境。当然，如果你弄清了webpack的配置项，不管是搭建普通的多页面应用，还是基于组件的多页面引用都信手拈来。

在文章快写结束的时候，突然想起在webpack打包环境中，可以使用import的方式引入组件的字符串模版,即把组件的html结构与样式以字符串的形式录入js文件中，但无论是使用web components模式注册组件（兼容不好），还是获取元素拼接字符串，都不是我最想要的结果，前者使用受限，而后者虽然在webpack的帮助下，减少了许多ajax请求，但带有组件特殊标识的<div>，与html5封装的<video>比起来，我想你会更愿意使用`<video></video>`而不是`<div id=video></div>`。

以上就是本文的内容，如果你觉得这个项目能为你带来帮助，请点个star!