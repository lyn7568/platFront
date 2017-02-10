mui.ready(function() {
	mui.plusReady(function() {
		var userid = plus.storage.getItem('userid');
		var ws = plus.webview.currentWebview();
		console.log(ws.flag);
		//查询应用行业
		var industryShow = function(data) {
			if(data != undefined && data.length != 0) {
				var subs = new Array();
				if(data.indexOf(',')) {
					subs = data.split(',');
				} else {
					subs[0] = data;
				}
				if(subs.length > 0) {
					var html = [];
					for(var i = 0; i < subs.length; i++) {
						html.push("<li>" + subs[i] + "<em class='mui-icon mui-icon-closeempty'></em></li>");
					};
					document.getElementsByClassName("labelshow")[0].innerHTML = html.join('');
				}
			}
		}

		function personalMessage() {
			mui.ajax(baseUrl + "/ajax/professor/info/" + userid, {
				dataType: 'json', //数据格式类型
				type: 'GET', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					var $data = data.data;
					//应用行业
					if($data.industry) {
						industryShow($data.industry);
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		}

		function trim(str) { //删除左右两端的空格
			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		mui(".labelshow").on("tap", "em", function() {
			var val = this.parentNode;
			document.getElementsByClassName('labelshow')[0].removeChild(val);
		});
		document.getElementsByClassName("addlabelbtn")[0].addEventListener("tap", function() {
			var addContent = document.getElementsByTagName('input')[0].value;
			var content = trim(addContent);
			if(content) {
				var node = document.createElement("li");
				node.innerHTML = content + '<em class="mui-icon mui-icon-closeempty"></em>';
				document.getElementsByClassName("labelshow")[0].appendChild(node);
				document.getElementsByTagName('input')[0].value = ''
			} else {
				plus.nativeUI.toast("添加内容不能为空", toastStyle);
			}
		});
		document.getElementsByClassName("topsave")[0].addEventListener("tap", function() {
			var subjects = document.getElementsByTagName("li");
			var subjectAll = "";
			if(subjects.length > 0) {
				for(var i = 0; i < subjects.length; i++) {
					subjectAll += subjects[i].innerText;
					subjectAll += ',';
				};
				subjectAll = subjectAll.substring(0, subjectAll.length - 1);
			}
			console.log(subjectAll);
			mui.ajax(baseUrl + '/ajax/professor/industry', {
				data: {
					"id": userid,
					"industry": subjectAll
				},
				dataType: 'json', //数据格式类型
				async: false,
				type: 'POST', //http请求类型
				timeout: 10000, //超时设置
				success: function(data) {
					if(data.success) {
						plus.nativeUI.showWaiting();
						if(ws.flag == 1) {
							var web = plus.webview.getWebviewById("html/companyUpdata.html");
							mui.fire(web, "newId", {
								rd: 1
							});
							mui.back();
						} else if(ws.flag == 2) {
							var web = plus.webview.getWebviewById("html/proinforupdate.html");
							mui.fire(web, "newId", {
								rd: 1
							});
							mui.back();
						}

					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			});
		});
		personalMessage();
	});
})