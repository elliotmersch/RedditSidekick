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
			time = $(this).text().toLowerCase();
		});
	});

	$("#query").keypress(function (e) {
		if (e.which == 13) {
			e.preventDefault();
			redditsearch("relevance");
		}
	});
	
	$(document).on('click', ".result", function(){
		$(this).next('.result-content').slideToggle();
	});
			
	function redditsearch(type) {
		var query = $("#query").val();
		$('#results').empty().append($("<table/>", {class: 'table table-hover'}).append($("<tbody/>", {id: 'result-tbody'})));

		$.getJSON("http://www.reddit.com/search.json?q=" + query + "&t=" + time + "&sort=" + type, function (data) {

			var i = 0
			$.each(data.data.children, function (i, item) {
				var title = item.data.title
				var url = item.data.url
				var id = item.data.id
				var subid = item.data.subreddit_id
				var subreddit = item.data.subreddit
				var selftext = item.data.selftext
				var author = item.data.author
				

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
				
				var fullpost = '<p class="postinfo">by <a href="http://reddit.com/u/' + author + '" target="_blank">' + author + '</a> in <a href="http://reddit.com/r/' + subreddit + '" target="_blank">/r/' + subreddit + '</a><br></p>' + selftext		
				
				var postcomment = "<p>test</p>";
				$.getJSON("http://www.reddit.com/r/" + subreddit + "/comments/" + id + ".json?&limit=5", function (data) { 
					$.each(data[1].data.children, function (i, item) {
							var comment = item.data.body
							var commauthor = item.data.author
							//postcomment += '<p>[Author]' + commauthor + '<br>' + comment + '</p>'
					}); //end comment each
				}); //end comment getJSON					
				
				$("#result-tbody").append(
											$("<tr/>", {class: 'result'}).append(
												$("<td/>").append(
													$("<a/>", {href: url, target: "_blank", text: title})
												)
											)
										).append(
											$("<div/>", {class: 'result-content'}).append(
												fullpost
											).hide().append(postcomment).hide()
										);
				i++;
			});
		});
	};
});