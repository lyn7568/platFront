//首页
var pageIndex = 1; // 页数
var allPages = 1; // 总页数
var table = document.body.querySelector('.list');
var search = document.getElementById("search");

mui.plusReady(function(){
	plus.nativeUI.showWaiting();
})


mui('.list').on('tap','a',function(){
	var id=this.getAttribute("data-id");
	console.log(id);
	plus.nativeUI.showWaiting();//显示原生等待框
    webviewShow = plus.webview.create("../html/proinforbrow.html",'proinforbrow.html',{},{proid:id});//后台创建webview并打开show.html
})


/*点击搜索按钮*/
search.addEventListener('focus', function() {
	var nwaiting = plus.nativeUI.showWaiting();//显示原生等待框
    webviewShow = plus.webview.create("../html/search-home.html","../html/search-home.html");//后台创建webview并打开show.html
    webviewShow.addEventListener("loaded", function() {
        nwaiting.close(); //新webview的载入完毕后关闭等待框
        webviewShow.show("slide-in-right",150); //把新webview窗体显示出来，显示动画效果为速度150毫秒的右侧移入动画
    }, false);
});

/*点击热门领域*/
mui('.gridbg').on('tap','li',function(){
	var subject = this.getAttribute("data-title");
	plus.nativeUI.showWaiting();//显示原生等待框
    webviewShow = plus.webview.create("../html/search.html",'search.html',{},{subject:subject,bigClass:1});//后台创建webview并打开show.html
})


/*页面数据初始化*/
getOnePase();

mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});

function pullupRefresh() {
	pageIndex = ++pageIndex;
	setTimeout(function() {
		getaData()
	}, 1000);
}

if(mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pulldownLoading();
		}, 500);
	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pulldownLoading();
	});
}

/*获取上拉加载更多数据*/
function getaData() {
	mui.plusReady(function() {
		mui.ajax(baseUrl + '/ajax/professor/pqHot', {
			data: {
				"pageNo": pageIndex,
				"pageSize": 10,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			async:false,
			success: function(data) {
				if(data.success) {
			
					//console.log("成功");
					var dice1 = data.data.total; //总条数
					var dice2 = data.data.pageSize; //每页条数
					var result = '';
					if(pageIndex == 1) { //下拉刷新需要先清空数据
						table.innerHTML = ''; // 在这里清空可以防止刷新时白屏
					}
					allPages = dice1 / dice2;
					var datalist = data.data.data;
					datalistEach(datalist);
					if(pageIndex < allPages) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
			}
		});
	});
}

/*获取第一页数据*/
function getOnePase() {
	mui.plusReady(function() {
		mui.ajax(baseUrl + '/ajax/professor/pqHot', {
			data: {
				"pageNo": 1,
				"pageSize": 10,
			},
			dataType: 'json', //数据格式类型
			type: 'GET', //http请求类型
			timeout: 10000,
			success: function(data) {
				if(data.success) {
					plus.nativeUI.closeWaiting();
					var datalist = data.data.data;
					datalistEach(datalist);
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
			}
		});
	});
}

/*数据遍历*/
function datalistEach(datalist) {
	mui.each(datalist, function(index, item) {
		
		/*获取头像*/
		if(item.hasHeadImage == 1) {
			var img = baseUrl + "/images/head/" + item.id + "_l.jpg";
		} else {
			var img = "../images/default-photo.jpg";
		}

		/*获取研究方向信息*/
		var researchAreas = item.researchAreas;
		var rlist = ''
		for(var n = 0; n < researchAreas.length; n++) {
			//console.log(researchAreas[n].caption);
			rlist = '<span>' + researchAreas[n].caption + '</span>、';
		}

		/*获取资源信息*/
		var resources = item.resources;
		var zlist = ''
		for(var m = 0; m < resources.length; m++) {
			//console.log(resources[m].caption);
			zlist = '<span>' + resources[m].resourceName + '</span>、';
		}
		
		var title = item.title || "";
		var office = item.office || "";
		var orgName = item.orgName || "";
		var address = item.address || "";

		if(title != "") {
			title = title + " , ";
		}
		if(office != "") {
			office = office + " , ";
		}
		if(orgName != "") {
			orgName = orgName;
		}
		if(address != "") {
			address = " | " + address;
		}

		var li = document.createElement('li');
		li.className = 'mui-table-view-cell mui-media';

		li.innerHTML = '<a class="proinfor" data-id="'+item.id+'"' +
			'<p><img class="mui-media-object mui-pull-left headimg headRadius" src="' + img + '"></p>' +
			'<div class="mui-media-body">' +
			'<span class="listtit">' + item.name + '<em class="mui-icon iconfont icon-vip authicon"></em></span>' +
			'<p class="listtit2"><span>' + title + '</span><span>' + office + '</span><span>' + orgName + '</span><span>' + address + '</span></p>' +
			'<p class="mui-ellipsis listtit3">' + rlist + '</p>' +
			'<p class="mui-ellipsis listtit3">' + zlist + '</p>' +
			'</div></a></li>';

		table.appendChild(li, table.firstChild);
	});
}
