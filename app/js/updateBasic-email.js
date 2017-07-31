mui.ready(function() {
	mui.plusReady(function() {
		var web = plus.webview.currentWebview()
		web.show("slide-in-right", 150);
		var userid = plus.storage.getItem('userid');
		function person() {
			plus.nativeUI.closeWaiting();
			var title = document.getElementById("title");
			title.innerHTML = web.email;
			if(web.email.length) {
				document.getElementById("fontAdd").innerHTML = web.email.length;
				document.getElementById("login").removeAttribute("disabled");
			}
			document.getElementById("title").addEventListener("keyup", function() {
				if(this.innerHTML.length > 50) {
					this.innerHTML = this.innerHTML.substring(0, 50);
				}else if(this.innerHTML.length>0) {
					document.getElementById("login").removeAttribute("disabled");
				}else if(this.innerHTML.length==0) {
					document.getElementById("login").setAttribute("disabled","true");
				}
				document.getElementById("fontAdd").innerHTML = this.innerHTML.length;
			})
		}
		person();
		/*校验用户账号*/
		function userEmail() {
			var gunf = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
			if(!gunf.test(trim(document.getElementById("title").innerHTML))) {
				plus.nativeUI.toast("联系邮箱格式有误，请检查后重新填写", toastStyle);
				return 0;
			}
		}
		function trim(str) { //删除左右两端的空格
			　　
			return str.replace(/(^\s*)|(\s*$)/g, "");　　
		}
		document.getElementById("login").addEventListener("tap",function(){
			if(userEmail()==0){
				return;
			}
			 savePro();
		})
		function savePro() {
			var mess = {};
			if(document.getElementById("title").innerHTML.length) {
				if(document.getElementById("title").innerHTML.length>20) {
					plus.nativeUI.toast("联系邮箱不得超过50个字", toastStyle);
					return;
				}
			}
			mess.name = web.name;
			mess.orgName = web.orgName;
			mess.department =web.department;
			mess.title = web.title;
			mess.office =web.office;	
			mess.address = web.address;
			mess.province=web.province;
			mess.email = document.getElementById("title").innerHTML;
			mess.phone =web.phone;			
			mess.id = userid;
			var mess1 = JSON.stringify(mess);
			console.log(JSON.stringify(mess))
			$.ajax({
				"url": baseUrl + '/ajax/professor',
				"type": "PUT",
				"async": true,
				"data": mess1,
				"contentType": "application/json",
				"success": function(data) {
					console.log(JSON.stringify(data))
					if(data.success) {
						plus.nativeUI.showWaiting();
							var web = plus.webview.getWebviewById("updateBasic.html");
							mui.fire(web, "newId", {
								rd: 1
							});
						mui.back();
					} else {
						plus.nativeUI.toast("服务器链接超时", toastStyle);
					}
				}
			});
		}
	})
})