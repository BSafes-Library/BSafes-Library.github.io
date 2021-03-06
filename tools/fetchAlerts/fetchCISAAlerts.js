const {
  exec
} = require("child_process");
var fs = require('fs');
const request = require('request');
const {
  JSDOM
} = require("jsdom");
const {
  window
} = new JSDOM("");
const $ = require("jquery")(window);

const domain = "https://us-cert.cisa.gov"
var sources = ["https://us-cert.cisa.gov/ncas/alerts/2021", "https://us-cert.cisa.gov/ncas/alerts/2020"];


function getAllSources() {
	var index = 0;

	function getFromSource() {
		if(index < sources.length) {
			getContent(sources[index], function(err, data) {
				if (err) {
					index ++;
					setTimeout(getFromSource, 1000);
				} else {
					console.log(data);

					var $content = $($.parseHTML(data));
					getAlerts($content, function(err, items) {



					});
					
					index ++;
					setTimeout(getFromSource, 1000);
				}
			});
		}
	}

	setTimeout(getFromSource, 100);
}

getAllSources();


function getContent(url, fn) {
	const options = {
  	url: url,
  	headers: {
    	'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1'
  	}
	};
  request(options, function(error, response, body) {
    if (error) {
      console.error('error:', error); // Print the error if one occurred
      fn(error, null);
      return;
    }
    if (response && response.statusCode) {
      console.log('statusCode:', response.statusCode);
      if (response.statusCode === 200) {
        fn(null, body);
      } else {
        fn("Invalid response", null);
      }
    } else {
      console.log("Invalid response");
      fn("Invalid response", null);
    }
  });
}

function getAlerts($content, fn) {
	var newItems = [];
	var $alerts = $content.find('.item-list');

	if($alerts.length) {
		var $alertsList = $alerts.find('li');
		for (var i = 0; i < $alertsList.length; i++) {
			var thisItem = {};
			var $thisAlert = $alertsList.eq(i);
			thisItem.title = $thisAlert.find('a').text().trim();
			thisItem.url = domain + $thisAlert.find('a').attr('href');			
			
			newItems.push(thisItem);
		}

	}
	
}

function formatAlert() {


}
