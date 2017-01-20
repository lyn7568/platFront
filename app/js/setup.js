//设置
mui.ready(function() {

	/*定义全局变量*/
	var removeId = document.getElementById("removeid");
	var security = document.getElementById("security");
	var userAgreement = document.getElementById("userAgreement");
	var about = document.getElementById("about");
	var kefu = document.getElementById("kefu");
	var checkNewVersion = document.getElementById("checkNewVersion");
	
	/*账户与安全*/
	security.addEventListener('tap',function(){
		plus.nativeUI.showWaiting();//显示原生等待框
        webviewShow = plus.webview.create("../html/security.html","../html/security.html");
	});
	
	/*关于科袖*/
	about.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/aboutus.html',
			id: '../html/aboutus.html',
			show: {
				aniShow: "slide-in-right"
			}
		});
		
	});
	
	/*用户协议*/
	userAgreement.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/privacy.html',
			id: '../html/privacy.html',
			show: {
				aniShow: "slide-in-right"
			}
		});
	});

	/*退出按钮*/
	removeId.addEventListener('tap', function() {
		var btn = ["退出", "取消"];
		mui.confirm("是否退出", "提示", btn, function(e) {
			if(e.index == 0) {
				plus.storage.removeItem("userid");
				console.log('点击退出时id=='+plus.storage.getItem('userid'));
				//plus.cache.clear();
				//plus.storage.clear();
				var userId = "null";
				mui.currentWebview.close();
				mui.back();
				var myaccountPage = plus.webview.getWebviewById('html/myaccount.html');
				mui.fire(myaccountPage, 'closeUser', {
					id: userId
				});
				var consultPage = plus.webview.getWebviewById('consultlist.html');
				mui.fire(consultPage, 'exited', {
					id: userId
				});
			}
		});
	});
	
	/*客服帮助*/
	kefu.addEventListener('tap',function(){
		mui.openWindow({
			url: '../html/kefuhelp.html',
			id: '../html/kefuhelp.html',
			show: {
				aniShow: "slide-in-right"
			}
		});
		
	});
	
	/*检查新版本*/
	/*checkNewVersion.addEventListener('tap',function(){
		checkVersion();	
	});*/
	
	function checkVersion(){
		mui.plusReady(function(){
			// 获取本地应用资源版本号
		    plus.runtime.getProperty(plus.runtime.appid,function(inf){
			    wgtVer=inf.version;
			    console.log("当前应用版本："+wgtVer);
			    mui.ajax(baseUrl + "/data/manager/version.json", {
					dataType: 'json', //数据格式类型
					type: 'GET', //http请求类型
					timeout: 10000, //超时设置
					async: false,
					success: function(data) {
						console.log(JSON.stringify(data));
						if (data.version > wgtVer) {
							var btn = ["确定更新", "取消更新"];
							mui.confirm("检测到新版本，是否更新？", "提示", btn, function(e) {
								if(e.index == 0) {
								try {
									     plus.nativeUI.showWaiting("检测更新...");
									     //var d="http://192.168.3.233/download/app1.0.6.apk";
										 plus.downloader.createDownload( data.wgt, {filename:"_doc/update/"}, function(d,status){
									        if ( status == 200 ) { 
									            plus.runtime.install(d.filename, {}, function() {
													console.log("安装新版本文件成功！");
													/*plus.nativeUI.alert("应用资源更新完成,程序需要立即重启", function() {
														plus.runtime.restart();
													});*/
												}, function(e) {
													console.log("安装新版文件失败[" + e.code + "]：" + e.message);
													plus.nativeUI.toast("安装新版文件失败[" + e.code + "]：" + e.message);
												});
									            
									        } else {
									            console.log("下载新版本失败！");
									            plus.nativeUI.toast("下载新版本失败！");
									        }
							       			plus.nativeUI.closeWaiting();
							    		}).start();
						    		} catch (e) {
										console.log(e.message);
									}	
								}
							});
						}else{
							plus.nativeUI.toast("您使用的是最新版本，请放心使用！", toastStyle);
						}
					},
					error: function() {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
						return;
					}
				});
			});
		})
	}
	
	
});
