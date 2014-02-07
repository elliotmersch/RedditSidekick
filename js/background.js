$( document ).ready(function() {

var container = $('#site-content')
var results = $('#results')


$("#buttonsearch").click(function () {
    redditsearch();
});

$("#query").keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        redditsearch();
    }
});


function redditsearch() {
    var query = $("#query").val();
    var type = document.getElementById('typeselect');
    var time = $('input[name="time"]:checked').val();
    var val = type.options[type.selectedIndex].value;
    $("#results").html("");

    $.getJSON("http://www.reddit.com/search.json?q=" + query + "&sort=" + val + "&t=" + time, function (data) {

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

            var selftextpost = '<p style="display: none">' + selftext + '</p><hr size="1" width ="98%" noshade>'
            var post = '<div style="font-size:14px">' + '<a href="' + url + '" target="_blank">' + title + '</a>' + '</div>'

                results.append(post)
                var showhide = $('<input type="button" id="hider" value="Show"></input>');
                results.append(showhide);
                $(showhide).click(function() {
                    
                    if($(this).val() == 'Hide'){
                        $(this).val('Show');
                    }else{
                        $(this).val('Hide');
                    }
                $(this).next().toggle();
                });  
                results.append(selftextpost)
             
             i++
            });
        });
    };
	});