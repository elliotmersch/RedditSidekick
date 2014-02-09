var icons = ['alert.png', 'icon.png'];
var icon_index = 0;
var switch_icon = true;
var q = "";

chrome.runtime.onConnect.addListener(function(port){
  console.assert(port.name == "getSelection");
  port.onMessage.addListener(function(msg){
    alert(msg);
    if(msg.type == "setSwitch"){
      switch_icon == msg.switch_icon;
      if(!setSwitch){
        port.postMessage({type:"query", query: q});
      }
    }
  });
});

function animateIcon(){
  if(switch_icon){
    chrome.browserAction.setIcon({path: '/img/'+icons[icon_index]});
    icon_index = (icon_index + 1) % icons.length;
    window.setTimeout(animateIcon, 300);
   }
}

function genericOnClick(info, tab) {
  animateIcon();
  q = info.selectionText;
}

var id = chrome.contextMenus.create({"title": "Search for '%s' with redditsidekick", 
								     "contexts":["selection"],
                     "onclick": genericOnClick
});
 