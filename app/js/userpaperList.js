var proId;
mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			height:50,
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
var Num=1;
function pullupRefresh() {
	setTimeout(function() {
		Num++;
		getPaper(10,Num);
	}, 1000);

}
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	proId = self.proid;
	mui("#paper").on("tap", "li", function() {
		var id = this.getAttribute("data-id");
		plus.nativeUI.showWaiting();
		plus.webview.create("../html/paperShow.html", 'paperShow.html', {}, {
			"paperId": id
		});
	})
	getPaper(10,1)
})
function getPaper(pageSize,pageNo) {
	mui.plusReady(function() {
		mui.ajax(baseUrl + "/ajax/ppaper/byProfessor", {
			type: "GET",
			timeout: 10000,
			dataType: "json",
			data: {
				"id": proId,
				"pageSize":pageSize,
				"pageNo":pageNo
			},
			success: function(data) {
				plus.nativeUI.closeWaiting();
				plus.webview.currentWebview().show("slide-in-right", 150);
				if(data.success) {
					if(pageNo!=data.data.pageNo) {
						data.data.data=[];
					}
					var obj = data.data.data;
					if(obj.length > 0) {
						for(var i = 0; i < obj.length; i++) {
							var li = document.createElement("li");
							li.setAttribute("data-id", obj[i].id);
							li.className = "mui-table-view-cell";
							li.innerHTML = '<div class="flexCenter OflexCenter mui-clearfix">' +
								'<div class="madiaHead paperHead"></div>' +
								'<div class="madiaInfo OmadiaInfo">' +
								'<p class="mui-ellipsis-2 h1Font">' + obj[i].name + '</p>' +
								'<p class="mui-ellipsis h2Font">' + obj[i].authors.substring(0, obj[i].authors.length - 1) + '</p>' +
								'</div>' +
								'</div>'
							document.getElementById("paper").appendChild(li);
						}
					} 
					if(pageNo < Math.ceil(data.data.total / data.data.pageSize)) {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); /*能上拉*/
					} else {
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); /*不能上拉*/
					}
				}
			},
			error: function() {
				plus.nativeUI.toast("服务器链接超时", toastStyle);
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				return;
			}
		})
	})
}
