mui.ready(function() {
	mui.plusReady(function() {
        var userid = plus.storage.getItem('userid');
		var self = plus.webview.currentWebview();
		var orgId = self.cmpId;
		console.log(orgId)
		
		
		mui('#articelShow').on('tap', 'li', function() {
			var id = this.getAttribute("data-id");
			var ownerid = this.getAttribute("owner-id");
			plus.nativeUI.showWaiting(); //显示原生等待框
			plus.webview.create("../html/professorArticle.html", '../html/professorArticle.html', {}, {
				articleId: id,
				ownerid:ownerid,
				oFlag:1
			});
		})
		
		plus.nativeUI.closeWaiting();
		self.show("slide-in-right", 150);
		
	
		
		/*企业文章html*/
		function getArtice22() {
			console.log(orgId)
			mui.ajax(baseUrl + "/ajax/article/pqOrgPublish", {
				type: "GET",
				timeout: 1000,
				dataType: "json",
				data: {
					"orgId": orgId,
					"pageSize": 100,
					"pageNo": 1
				},
				success: function(data) {
					
					if(data.success) {
						var obj = data.data.data;
						if(obj.length>0){
							for(var i = 0; i < obj.length; i++) {
								var liItem = document.createElement("li");
								liItem.setAttribute("data-id",obj[i].articleId);
								liItem.setAttribute("owner-id",obj[i].orgId);
								liItem.className = "mui-table-view-cell"
								var oString = '<div class="flexCenter OflexCenter mui-clearfix">'
								if(obj[i].articleImg) {
									oString += '<div class="madiaHead artHead" style="background-image:url(' + baseUrl + '/data/article/' + obj[i].articleImg + ')"></div>'
								} else {
									oString += '<div class="madiaHead artHead"></div>'
								}
								oString += '<div class="madiaInfo OmadiaInfo"><p class="mui-ellipsis-2 h1Font">' + obj[i].articleTitle + '</p>'
								oString += '</div></div>'
								liItem.innerHTML = oString;
								document.getElementById("articelShow").appendChild(liItem);
							}
						}else{
							document.getElementById("articelShow").parentNode.parentNode.style.display="none";
						}
					}
				},
				error: function() {
					plus.nativeUI.toast("服务器链接超时", toastStyle);
					return;
				}
			})
		}
		getArtice22()
	document.getElementsByClassName("topback")[0].addEventListener("tap",function(){
			var web = plus.webview.getWebviewById("cmpInforShow.html");
			if(web) 
				mui.fire(web, "newId",{
									rd: 1
							});
	})
		
	});
})