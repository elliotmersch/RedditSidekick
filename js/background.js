$( document ).ready(function() {

	var container = $('#site-content')
	var time = "all"


	$(".search-type").each(function(){
		$(this).click(function () {
			redditsearch($(this).text().toLowerCase());
		});
	});

	$(".time-type").each(function(){
		$(this).click(function() {
			time = $(this).text();
		});
	});

	$("#query").keypress(function (e) {
		if (e.which == 13) {
			e.preventDefault();
			redditsearch("relevance");
		}
	});
	
	$(document).on('click', ".result", function(){
		$(this).next('.result-content').toggle();
	});
			
	function redditsearch(type) {
		var query = $("#query").val();
		$('#results').append($("<table/>", {class: 'table table-hover'}).append($("<tbody/>", {id: 'result-tbody'})));
		//$("#results").html("");

		$.getJSON("http://www.reddit.com/search.json?q=" + query + "&t=" + time + "&sort=" + type, function (data) {

			var i = 0
			$.each(data.data.children, function (i, item) {
				var title = item.data.title
				var url = item.data.url
				var id = item.data.id
				var subid = item.data.subreddit_id
				var selftext = item.data.selftext

				//check for imgur or youtube
				if (selftext == "") {
					if(url.indexOf("reddit") >= 0){
					   selftext = ''
					}
					else if (url.indexOf("imgur.com/a") >= 0){
						selftext = '<a href="' + url + '" target="_blank">Click for album</a>'
					}
					else if (url.indexOf("imgur") >= 0) {
						selftext = '<a href="' + url + '" target="_blank"><img src="' + url + '.jpg" height="30%" width="30%"></img></a>'
					}
					else if (url.indexOf("gif") >= 0) {
						selftext = '<a href="' + url + '" target="_blank"><img src="' + url + '" height="30%" width="30%"></img></a>'
					}
					else if (url.indexOf("jpg") >= 0) {
						selftext = '<a href="' + url + '" target="_blank"><img src="' + url + '" height="30%" width="30%"></img></a>'
					}                
					if (url.indexOf("youtu") >= 0) {
						selftext = '<a href="' + url + '" target="_blank">Youtube Video</a>'
					}
					
				}
				
				$("#result-tbody").append(
											$("<tr/>", {class: 'result'}).append(
												$("<td/>").append(
													$("<a/>", {href: url, text: title})
												)
											)
										).append(
											$("<div/>", {class: 'result-content'}).append(
												selftext
											).hide()
				);
				i++;
			});
		});
	};
});