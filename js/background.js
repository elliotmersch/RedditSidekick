$( document ).ready(function() {

	var container = $('#site-content')
	var time = "all";
	var sort = "relevance";
	
	var sort_types = ["relevance", "hot", "top", "new"];
	
	var times_map = {
		"all time":"all",
		"this hour":"hour",
		"this day":"day",
		"this week":"week",
		"this month":"month",
		"this year":"year"
	};
	function find_key(value){
		for(var key in times_map){
			if (times_map[key] == value) {return key};
		}
	}
	
	$(document).on('click', ".search-type", function(){
		sort = ($(this).text().toLowerCase());
		sort_dropdown();
		redditsearch();
	});

	$(document).on('click', ".time-type", function(){
		time = times_map[$(this).text().toLowerCase()];
		time_dropdown(time);
	});

	$("#query").keypress(function (e) {
		if (e.which == 13) {
			e.preventDefault();
			redditsearch();
		}
	});
	
	$(document).on('click', ".result", function(){
		$(this).next('.result-content').slideToggle();
	});
	
	function sort_dropdown(){
		var sd = $("#search-dropdown");
		sd.empty();
		for(var i=0; i<sort_types.length; i++){
			if(i == 0){
				sd.append($('<li/>').append($('<a/>', {class: "search-type", href: "#"}).text(sort)));
				sd.append($('<li/>', {class:"divider"}));
			}
			if(sort_types[i] != sort){
				sd.append($('<li/>').append($('<a/>', {class: "search-type", href: "#"}).text(sort_types[i])));
			}
		}
	}
	
	function time_dropdown(selected){
		var td = $("#time-dropdown");
		td.empty();
		var first = true;
		for(var key in times_map){
			if(first){
				td.append($('<li/>').append($('<a/>', {class: "time-type", href: "#"}).text(find_key(selected))));
				td.append($('<li/>', {class:"divider"}));
				first = false;
			}
			if(times_map[key] != selected){
				td.append($('<li/>').append($('<a/>', {class: "time-type", href: "#"}).text(key)));
			}
		}
	}
			
	function redditsearch() {
		var query = $("#query").val();
		$('#results').empty().append($("<table/>", {class: 'table table-hover'}).append($("<tbody/>", {id: 'result-tbody'})));

		$.getJSON("http://www.reddit.com/search.json?q=" + query + "&t=" + time + "&sort=" + sort, function (data) {

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
				
				$("#result-tbody").append(
											$("<tr/>", {class: 'result'}).append(
												$("<td/>").append(
													$("<a/>", {href: url, target: "_blank", text: title})
												)
											)
										).append(
											$("<div/>", {class: 'result-content'}).append(
												fullpost
											).hide()
				);
				i++;
			});
		});
	};
});