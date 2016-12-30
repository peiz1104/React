//可以通过闭包实现模块化开发
(function ($, React, ReactRouter) {
// 定义一些变量
var BANNER_NUM = 2;
var ITEM_NUM = 33;
var app = $('#app')
// 定义数据容器
var DataBase;
//将可以服用的方法放入一个对象中以便可以进行复用
//tong过混合引入进行使用
var Methods={
  //将得到背景图的方法封装出来
	getBackgroundImageUrl:function(){
      var num=parseInt(Math.random()*ITEM_NUM);
      return 'url(img/item/item'+num+'.jpg)'
	},
	 createList:function(){
    	// console.log(this)
    	var self=this;
    	return this.state.list.map(function(value,index){
          var style={backgroundImage:self.getBackgroundImageUrl()}
          return (
             <li key={index} style={style}>
					<a href={value.site} target="_blank">
						<div className="content">
							<h1>{value.name}</h1>
						</div>
						<div className="layer">
							<p>
								<span>{'公司:'+value.company}</span>
							</p>
							<p>
								<span>{'类型:'+value.type}</span>
							</p>
							<p>
								<span>{'描述信息：'+value.description}</span>
							</p>
						</div>
					</a>
				</li>
          	)
    	})
    }
}
//借助reflux进行数据之间的传递

// 定义Header组件
var Header = React.createClass({
	goSearch:function(e){
      // console.log(e.keyCode);
      if(e.keyCode===13){
          var val=e.target.value
          // console.log(val)
          //对val进行判断去掉首尾空白符
          val=val.replace(/^\s+|\s$/g,'');
          if(val==''){
          	alert('输入内容不能为空');
          	return
          }
          //对输入的内容要进行编码
         val = encodeURIComponent(val);
         //对输入的路由做替换
         ReactRouter.HashLocation.replace('/search/'+val)
         //对input里面的内容进行clean
         e.target.value='';
      }
	},
	carouser:function(e){  

	},
	render: function () {
		return (
			<div>
               <header className='header'>
                  <div className='container'>
                        <input onKeyUp={this.goSearch} type="text" className="pull-right"/>
						<a href="#/"><img src="img/logo.png" alt="" className="pull-left"/></a>
						<ul className="nav nav-pills nav-justified">
							<li>
								<a href="#/type/movie">视频</a>
							</li>
							<li>
								<a href="#/type/games">游戏</a>
							</li>
							<li>
								<a href="#/type/news">新闻</a>
							</li>
							<li>
								<a href="#/type/sports">体育</a>
							</li>
							<li>
								<a href="#/type/buy">购物</a>
							</li>
							<li>
								<a href="#/type/friends">社交</a>
							</li>
						</ul>
                  </div>
               </header>
               <div className="container">
                   <div className="banner">
                     <ul carouser={this.carouser()} className="carouser">
                     	<li  className='b1 current'></li>
                     	<li className='b2'></li>
                     </ul>
                   </div>
               </div>
               
			</div>
		)
	}
})
//创建Indexaction
var IndexAction=Reflux.createActions(['onChangeIndex']);
//定义store
var IndexStore=Reflux.createStore({
	//引入IndexAction
	listenables:[IndexAction],
	onChangeIndex:function(query){
		var result=[];
		DataBase.forEach(function(obj){
			// console.log(obj)
			if(query=='#/'){
				result.push(obj)
			}
		})
		//因为Reflux是观察者模式
		this.trigger(result);
	}
})
// 定义首页组件
var IndexPage = React.createClass({
	mixins:[Reflux.connect(IndexStore,'list'),Methods],
	//定义初始化状态得到请求数据
	getInitialState:function(){
        return{
        	list:DataBase
        }
	},
	render: function () {
		return (
              <div className="main">
				<ul className="clearfix">{this.createList()}</ul>
			</div>
			)
	}
})
//第一步创建typeaction
var TypeAction=Reflux.createActions(['onChangeType']);
//第二步定义store
var TypeStore=Reflux.createStore({
	//关于action
	listenables:[TypeAction],
	onChangeType:function(query){
		//通过query过滤数组
		var result=[];
		DataBase.forEach(function(obj){
         //进行类型的判断是否与
         if(obj.type==query){
         	result.push(obj)
         }
		})
		this.trigger(result);
	}
})

// 定义分类列表页组件
var TypePage = React.createClass({
	mixins:[Reflux.connect(TypeStore, 'list'),Methods],
	getInitialState:function(){
		return{
			list:[]
		}
	},
	render: function () {
		return (
             <div className="main">
				<ul className="clearfix">{this.createList()}</ul>
			</div>
			)
	}
})
//第一步创建Action
var SearchAction=Reflux.createActions(['onChangeSearch']);
//第二步定义store
var SearchStore=Reflux.createStore({
	listenables:[SearchAction],
	onChangeSearch:function(query){
		//使用query对数据过滤
		var result=[];
		DataBase.forEach(function (obj) {
			// console.log(query)
			// 检索属性值是否包含query
			for (var i in obj) {

				// 如果该属性值包含query
				// console.log(obj[i])
				if (obj[i].indexOf(query) >= 0) {
					// 缓存对象
					result.push(obj)
					return;
				}
			}
		})
		this.trigger(result);
	}
})
// 定义搜索页面组件
var SearchPage = React.createClass({
	//通过mixins引入方法与Reflux
	mixins:[Reflux.connect(SearchStore,'list'),Methods],
	 getInitialState:function(){
	 	 //设置默认状态数据
       return{
           list:[]
       }

	  },
	render: function() {
		return (
             <div className="main">
				<ul className="clearfix">{this.createList()}</ul>
			</div>
			)
	}
})
var App = React.createClass({
	render: function () {
		// 查看属性中的路由参数对象
		// console.log(this.props.params)
		return (
			<div>
				<Header></Header>
				{/*第一步定义路由容器元素*/}
				<ReactRouter.RouteHandler></ReactRouter.RouteHandler>
			</div>
		)
	},
	// 发送消息
	sendAction: function () {
		// 获取query
		var query = decodeURIComponent(this.props.params.params.query)
		var page = this.props.params.path
		// 如果是type页面
		if (page.indexOf('/type/') >= 0) {
			//  此时向typeaction发出消息，通知store更新数据 
			TypeAction.onChangeType(query)
		} else if(page.indexOf('/search/') >= 0) {
			SearchAction.onChangeSearch(query)
		}else if(page.indexOf('/')>=0){
			var hash=location.hash;
			IndexAction.onChangeIndex(hash)
		}
		// console.log(this.props.params)
	},
	// 组件构架完成发送消息
	componentDidUpdate: function() {
		// TypeAction.changeType('app')
		this.sendAction()
	},
	componentDidMount: function() {
		this.sendAction()
	}
})

// 第二步 定义路由组件
var Route = React.createFactory(ReactRouter.Route)
var DefaultRoute = React.createFactory(ReactRouter.DefaultRoute)

// 第三步 定义规则
var routes = (
	<Route path="" handler={App}>
		<Route path="/type/:query" handler={TypePage}></Route>
		<Route path="/search/:query" handler={SearchPage}></Route>
		<DefaultRoute path='#' handler={IndexPage}></DefaultRoute>
	</Route>
)

/**
 * 定义图片加载器
 * @step 	每张图片加载成功时候的回调函数
 * @success 加载成功时候的回调函数
 * @fail	加载失败时候执行的回调函数
 **/ 

var ImageLoader = function (step, success, fail) {
	this.step = step;
	this.success = success;
	this.fail = fail;
	this.init();
}
ImageLoader.prototype = {
	// 初始化一些数据的
	init: function () {
		// item图片总数，以及当前图片数
		this.totalNum = this.num = ITEM_NUM;
		// banner图片的总数，以及当前banner图片数
		this.totalBannerNum = this.bannerNum = BANNER_NUM;
		// 加载这些图片
		this.loader()
	},
	// 加载图片
	loader: function () {
		// 加载banner
		while(--this.bannerNum >= 0) {
			// 加载banner图片
			this.loadImage(this.bannerNum, true)
		}
		this.bannerNum++;
		// 加载item图片
		while(--this.num >= 0) {
			// 加载图片
			this.loadImage(this.num)
		}
		this.num++;
	},
	/**
	 * 处理加载的图片数据
	 * @isBanner 	是否是bannner图片
	 ***/ 
	dealNum: function (isBanner) {
		// 判断是否是banner图片
		if (isBanner) {
			// 加bannerNum
			this.bannerNum++;
		} else {
			// 加num
			this.num++;
		}
	},
	/**
	 * 执行回调函数
	 * @isFail 	是否是失败的
	 **/ 
	isReady: function (isFail) {
		// 已经加载完成的图片
		var num = this.num + this.bannerNum;
		// 图片总数
		var total = this.totalNum + this.totalBannerNum;
		// 都要执行一次step,传入已经加载完成的图片，以及图片总数
		if (isFail) {
			this.fail()
		} else {
			this.step(num, total);
		}
		// 加载完成
		if (num === total) {
			this.success()
		}
	},
	/**
	 * 加载一张图片的
	 * @num 		图片索引值
	 * @isBanner 	是否是banner图片
	 **/
	loadImage: function (num, isBanner) {
		var img = new Image();
		// 图片加载成功回调
		img.onload = function () {
			// 处理加载的图片数据
			this.dealNum(isBanner);
			// 执行回调函数
			this.isReady();
		}.bind(this)
		// 图片加载失败执行fail
		img.onerror = function () {
			// 处理加载的图片数据
			this.dealNum(isBanner);
			// 执行回调函数
			this.isReady(true);
		}.bind(this)
		// 加载图片
		img.src = this.getImageUrl(num, isBanner)
	},
	/**
	 * 获取图片地址的
	 * @num 		图片索引值
	 * @isBanner 	是否是banner图片
	 * return 		图片地址
	 **/
	getImageUrl: function (num, isBanner) {
		if (isBanner) {
			return 'img/banner/banner' + num + '.jpg';
		} else {
			return 'img/item/item' + num + '.jpg';
		}
	}
}

$.get('data/sites.json', function (res) {
	if (res && res.errno === 0) {
		// 存储数据
		DataBase = res.data;
		// 加载图片
		new ImageLoader(
			function (num, total) {
				// console.log('step', num, total)
				app.find('.loader-text span').html((num / total * 100).toFixed(2))
			},
			function () {
				// console.log(this)
				$('.banner').css('backgroundImage','url(../img/banner/banner0.jpg)')
				// 第四步 启动路由
				ReactRouter.run(routes, function (Handler, params) {
				     if(params.path==''){
				     	window.location.hash='#/'
				     }
					// 渲染组件
					React.render(<Handler params={params}></Handler>, app[0])
				})
			}
		)
	}
})


})(jQuery, React, ReactRouter);