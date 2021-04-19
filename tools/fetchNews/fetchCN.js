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

var forever = true;
var round = 0;
var delay = 10 * 60 * 1000;

var goOfficial = true;

var firstBlock, secodBlock;
var urls = {};
var lastDate;

var newItems = {};
var newItemTimes = [];


var sources = {
	'BC': {
		name: "BleepingComputer",
		domain: "https://www.bleepingcomputer.com/",
		url: "https://www.bleepingcomputer.com/news/security/",
		items: [],
		index: 0,
		handler: getBleepingcomputer	
	},
	'CN': {
		name: "Cyber Security News",
		domain: "https://cybersecuritynews.com/",
		url: "https://cybersecuritynews.com/",
		items: [],
   	index: 0,
		handler: getCyberSecurityNews
	},
	'CY': {
		name: null,
		domain: "https://cyware.com/",
		url: "https://cyware.com/cyber-security-news-articles",
		items: [],
    index: 0,
		handler: getCYWARESocial,
	},
	'HL': {
		name: "The Hill",
		domain: "https://thehill.com/",
		url: "https://thehill.com/policy/cybersecurity",
		items: [],
    index: 0,
    handler: getTheHill
	},
	'HN': {
		name: "The Hacker News",
		domain: "https://thehackernews.com/",
		url: "https://thehackernews.com/",
		items: [],
        index: 0,
		handler: getTheHackerNews
	},
	'IF': {
		name: "Infosecurity Magazine",
		domain: "https://www.infosecurity-magazine.com/",
		url: "https://www.infosecurity-magazine.com/news/",
		items: [],
        index: 0,
		handler: getInfoSecurity
	},
	'LB': {
    name: "Lawfare",
    domain: "https://www.lawfareblog.com/",
    url: "https://www.lawfareblog.com/topic/cross-border-data",
    items: [],
    index: 0,
    handler: getLawfareCybersecurity
	},
	'LC': {
		name: "Lawfare",
    domain: "https://www.lawfareblog.com/",
    url: "https://www.lawfareblog.com/topic/cybersecurity",
    items: [],
    index: 0,
    handler: getLawfareCybersecurity
	},
	'LD': {
    name: "Lawfare",
    domain: "https://www.lawfareblog.com/",
    url: "https://www.lawfareblog.com/topic/cybersecurity-and-deterrence",
    items: [],
    index: 0,
    handler: getLawfareCybersecurity
  },
	'SA': {
		name: "Security Affairs",
		domain: "http://securityaffairs.co/",
		url: "http://securityaffairs.co/wordpress/",
		tems: [],
        index: 0,
        handler: getSecurityAffairs
	},
	'SC': {
    	name: "SCMagazine",
			domain: "https://www.scmagazine.com/",
    	url: "https://www.scmagazine.com/home/security-news/",
    	items: [],
    	index: 0,
    	handler: getSCMagazine 
  	},
	'TP': {
		name: "Threatpost",
		domain: "https://threatpost.com/",
		url: "https://threatpost.com/",
		items: [],
		index: 0,
		handler: getThreatpost
	}
}

var sourceIds = ['CN'];
//var sourceIds = ['HL'];

var allDomains = [];
var errorSources = [];

function checkExcludes(url, excludes) {
	for(var i=0; i< excludes.length; i++) {
		if(url.indexOf(excludes[i]) !== -1){
			return true;
		}
	}
	return false;
}

/* Source Handlers */
function getBleepingcomputer($content, fn) {
	var newItems = [];
	var $news = $content.find('#bc-home-news-main-wrap');

	if ($news.length) {
		var $newsList = $news.children();
		console.log("# of News: ", $newsList.length);

/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

		for (var i = 0; i < $newsList.length; i++) {
			var thisItem = {};
			var $thisNew = $newsList.eq(i);
			thisItem.title = $thisNew.find('h4').find('a').text();
			thisItem.url = $thisNew.find('h4').find('a').attr('href');
			thisItem.date = $thisNew.find('.bc_news_date').text();
			thisItem.abstract = $thisNew.find('p').text();
			newItems.push(thisItem);	
		}
	}
	fn(null, newItems);
}

function getCyberSecurityNews($content, fn) {
  var newItems = [];

  var $newsList = $content.find('.td-block-span12');
  console.log("# of News: ", $newsList.length);

/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

  for (var i = 0; i < $newsList.length; i++) {
    var thisItem = {};
    var $thisNew = $newsList.eq(i);
		if($thisNew.find('.td-excerpt').length === 0) {
			continue;
		}
    thisItem.title = $thisNew.find('.entry-title').find('a').text();
    thisItem.url = $thisNew.find('.entry-title').find('a').attr('href');
    thisItem.date = $thisNew.find('.td-module-meta-info').find('time').eq(0).text();
    thisItem.abstract = $thisNew.find('.td-excerpt').text();
    newItems.push(thisItem); 
  } 
	fn(null, newItems);
}

function getCYWARESocial($content, fn) {
 var newItems = [];
	var excludes = [];

	for(var i=0; i<allDomains.length; i++){
		if(allDomains[i].localeCompare('https://cyware.com/') === 0) {
			continue;
		}
		excludes.push(allDomains[i]);
	}

  var $news = $content.find('.cy-alert-content');
  if ($news.length) {
    var $newsList = $news.find('.cy-panel__body');
    console.log("# of News: ", $newsList.length);

/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

    for (var i = 0; i < $newsList.length; i++) {
      var thisItem = {};
      var $thisNew = $newsList.eq(i);
      thisItem.title = $.trim($thisNew.find('.cy-card__title').text());
      thisItem.url = $thisNew.find('.cy-card__title').parent().attr('href');
			if(thisItem.url.charAt(0) === '/') {
				thisItem.url = 'https://cyware.com' + thisItem.url;
			}	
			if(checkExcludes(thisItem.url, excludes)) {
				continue;
			}	
			thisItem.date = $thisNew.find('span.cy-card__meta').text(); 
			thisItem.date = thisItem.date.replace('  ', ' ');
			thisItem.source = $.trim($thisNew.find('.cy-card__meta').eq(0).find('a').text());
      thisItem.abstract = $.trim($thisNew.find('.cy-card__description').text());
      newItems.push(thisItem);
    }
  }
	fn(null, newItems);
}

function getTheHill($content, fn) {
 	var newItems = [];
  var $news = $content.find('#content');

  if ($news.length) {
    var $newsList = $news.find('.views-row');
    console.log("# of News: ", $newsList.length);
  
/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

    for (var i = 0; i < $newsList.length; i++) {
      var thisItem = {};
      var $thisNew = $newsList.eq(i);
      thisItem.title = $.trim($thisNew.find('header').find('h2').find('a').text());
      thisItem.url = 'https://thehill.com/' + $thisNew.find('header').find('h2').find('a').attr('href');
    	var dateStr = $thisNew.find('header').find('.submitted').find('.date').text();
			parts = dateStr.split(' ')[0].split('/');
    	thisItem.date = numberMonths[parts[0]] + ' ' + parts[1] + ', ' + '20'+ parts[2] ;
      thisItem.abstract = ''; 
      newItems.push(thisItem);
    }
		var index = 0;
		function getArticle() {
			if(index < newItems.length) {
				getContent(newItems[index].url, function(err, data) {
    			if (err) {
      			index ++;
						setTimeout(getArticle, 100);		
    			} else {
      			//console.log(data);
      			var $article = $($.parseHTML(data));
						$article.remove('.rollover-block');
						var $thisJQ = $article.find('.content-wrapper');
						for(var i=0; i<$thisJQ.length; i++) {
							if($thisJQ.eq(i).hasClass('title') || $thisJQ.eq(i).hasClass('social')) {
								continue;
							}
							$thisQ = $thisJQ.eq(i);
						}
						$thisJQ = $thisQ.find('#content');
						$thisJQ = $thisJQ.find('.content-wrp');
						$thisJQ = $thisJQ.find('.field-name-body').find('.field-item');
//						var $fieldItem = $article.find('.content-wrapper').find('#content').find('.content-wrp').find('.field-name-body').find('.field-item').eq(0);
						var $paragraphs = $thisJQ.find('p');
						for(var i =0; i< $paragraphs.length; i ++) {
							var thisStr = $($paragraphs.eq(i)).html();
							if(!thisStr.startsWith('<em>')) {
								var $thisP = $($paragraphs.eq(i));
								var $rolloverBlocks = $thisP.find('.rollover-block');
								for(var j=0; j< $rolloverBlocks.length; j ++) {
									var thisBlock = $($rolloverBlocks.eq(i)).html();
									thisStr = thisStr.replace(thisBlock, '');
								}
								var $cleaned = $($.parseHTML(thisStr));
								newItems[index].abstract = $cleaned.text() ;	
								break;
							} 
						}
						index ++;
            setTimeout(getArticle, 100);
					}	
				});
			} else {
				fn(null, newItems);
			}
		}
		getArticle() 
  } else {
		fn(null, newItems);
	}
}

function getTheHackerNews($content, fn) {
 var newItems = [];
  var $news = $content.find('.blog-posts');
  if ($news.length) {
    var $newsList = $news.find('.body-post');
    console.log("# of News: ", $newsList.length);
   
/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

    for (var i = 0; i < $newsList.length; i++) {
      var thisItem = {};
      var $thisNew = $newsList.eq(i);
      thisItem.title = $.trim($thisNew.find('.home-title').text());
      thisItem.url = $thisNew.find('.story-link').attr('href');
	  var itemLabel = $thisNew.find('.item-label').html();
	  thisItem.date = itemLabel.split('</i>')[1].split('<span>')[0];
      thisItem.abstract = $.trim($thisNew.find('.home-desc').text());
      newItems.push(thisItem);
    }
  }
	fn(null, newItems);
}

function getInfoSecurity($content, fn) {
 var newItems = [];
  var $news = $content.find('#webpages-list');
  if ($news.length) {
    var $newsList = $news.find('.webpage-item');
    console.log("# of News: ", $newsList.length);
  
/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

    for (var i = 0; i < $newsList.length; i++) {
      var thisItem = {};
      var $thisNew = $newsList.eq(i);
      thisItem.title = $.trim($thisNew.find('a').find('h3').text());
      thisItem.url = $thisNew.find('a').attr('href');
      var dateStr = $thisNew.find('time').text();
	  var parts = dateStr.split(' ');
      thisItem.date = shortMonths[parts[1]] + ' ' + parts[0] + ', ' + parts[2] ;
      thisItem.abstract = $.trim($thisNew.find('p').text());
      newItems.push(thisItem);
    }
  }
	fn(null, newItems);
}

function getLawfareCybersecurity($content, fn) {
 var newItems = [];
  var $news = $content.find('.region-content').find('.view-content');
  if ($news.length) {
    var $newsList = $news.find('.views-row');
    console.log("# of News: ", $newsList.length);
 
/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

    for (var i = 0; i < $newsList.length; i++) {
      var thisItem = {};
      var $thisNew = $newsList.eq(i);
      thisItem.title = $.trim($thisNew.find('.teaser__title').find('a').text());
      thisItem.url = 'https://www.lawfareblog.com'+ $thisNew.find('.teaser__title').find('a').attr('href');
      var dateStr = $thisNew.find('.submitted').html();
			var parts = dateStr.split('strong>');
			parts = parts[parts.length - 1].split(' ');
			var year = parts[5].substr(0, 4);
      thisItem.date = shortMonths[parts[3]] + ' ' +  parts[4] + ' ' + year;
      thisItem.abstract = $.trim($thisNew.find('.node__content').find('p').text());
      newItems.push(thisItem);
    }
  }
	fn(null, newItems);
}

function getSecurityAffairs($content, fn) {
 var newItems = [];
  var $news = $content.find('.sidebar_content');
  if ($news.length) {
    var $newsList = $news.find('.type-post');
    console.log("# of News: ", $newsList.length);
   
/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

    for (var i = 0; i < $newsList.length; i++) {
      var thisItem = {};
      var $thisNew = $newsList.eq(i);
      thisItem.title = $.trim($thisNew.find('.post_header_wrapper').find('h3').find('a').text());
      thisItem.url = $thisNew.find('.post_header_wrapper').find('h3').find('a').attr('href');
      thisItem.date = $.trim($thisNew.find('.post_detail').find('a').eq(0).text());
      thisItem.abstract = $.trim($thisNew.find('.post_wrapper_inner').find('p').text());
      newItems.push(thisItem);
    }
  }
	fn(null, newItems);
}

function getSCMagazine($content, fn) {
 var newItems = [];
  var $news = $content.find('div[itemprop="mainEntityOfPage"]');
  if ($news.length) {
    var $newsList = $news.find('article');
    console.log("# of News: ", $newsList.length);
	
/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

    for (var i = 0; i < $newsList.length; i++) {
      var thisItem = {};
      var $thisNew = $newsList.eq(i);
      thisItem.title = $.trim($thisNew.find('.title').find('a').text());
      thisItem.url = $thisNew.find('.title').find('a').attr('href');
      thisItem.date = $.trim($thisNew.find('.meta').find('time').eq(0).text());
      thisItem.abstract = $.trim($thisNew.find('.content').find('p').text());
      newItems.push(thisItem);
    }
  }
	fn(null, newItems);
}

function getThreatpost($content, fn) {
  var newItems = [];
	var $news = $content.find('#latest_news_container');

  if ($news.length) {
    var $newsList = $news.find('article');
    console.log("# of News: ", $newsList.length);

/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

    for (var i = 0; i < $newsList.length; i++) {
			var thisItem = {};
      var $thisNew = $newsList.eq(i);
      thisItem.title = $thisNew.find('.c-card__title').text();
      thisItem.url = $thisNew.find('.c-card__title').find('a').attr('href');
      thisItem.date = $thisNew.find('.c-card__info').find('.c-card__time').find('time').eq(0).text();
			thisItem.abstract = $thisNew.find('.c-card__col-desc').find('p').text();
			newItems.push(thisItem);
		}
	}
	fn(null, newItems);
}

const numberMonths = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
}

const shortMonths = {
	'Jan': 'January',
	'Feb': 'February',
	'Mar': 'March',
	'Apr': 'April',
	'May': 'May',
	'Jun': 'June',
	'Jul': 'July',
	'Aug': 'August',
	'Sep': 'September',
	'Oct': 'October',
	'Nov': 'November',
	'Dec': 'December'
}


const months = {
	JANUARY: 1,
	FEBRUARY: 2,
	MARCH: 3,
	APRIL: 4,
	MAY: 5,
	JUNE: 6,
	JULY: 7,
	AUGUST: 8,
	SEPTEMBER: 9,
	OCTOBER: 10,
	NOVEMBER: 11,
	DECEMBER: 12
}

function newCycle() {
	var now = new Date();
	round ++;
	console.log(round + ':' + now);

	newItems = {};
  	newItemTimes = [];
	errorSources = [];

	/* Build excludes */
	for(var i=0; i<sourceIds.length; i++) {
		var thisDomain = sources[sourceIds[i]].domain;
		allDomains.push(thisDomain);	
	}
	
	/* Copy the original index.md to local folder */
	exec('cp ../../index.md .', (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log("Copied index.md");
		setTimeout(readOriginalFile, 500);
	});
}

newCycle();

/* Read the original index.md, divide the content into 2 parts - above previous news and prvious news*/

function readOriginalFile() {
	console.log("readOriginalFile:");
	var content = fs.readFileSync('index.md', 'utf8');
	var blocks = content.split('{: .fs-6 .label .label-yellow }');
	firstBlock = blocks[0] + '{: .fs-6 .label .label-yellow }';
	// console.log(firstBlock);
	secodBlock = blocks[1];
	// console.log(secodBlock);

	/* Read the date of lastest item*/
	lastDate = readLastDate();

	/* Write the first part to a new_index.md*/
	writeFirstPart();

	/* Generate a dictionary of previous news*/
	generateDictionary(content);

	setTimeout(fetchNews, 500);
}

function readLastDate() {
	console.log("readLastDate: ");
	var parts = secodBlock.split('<div class="code-example dont-break-out" markdown="1" style="padding-top:0px;padding-bottom:0px">\n');
	var subParts = parts[1].split(' ');
	var lastPart = subParts[2].trim();
	var dateString = subParts[0] + ' ' + subParts[1] + ' ' + lastPart.substring(0, 4);
	console.log(dateString);
	var thisDate = new Date(dateString);
	console.log(thisDate.toLocaleTimeString());

	var month = months[subParts[0].toUpperCase()];
	if (month === undefined) {
		console.log("Error month");
		return null;
	}
	var day = parseInt(subParts[1].replace(',', ''));
	var year = parseInt(subParts[2]);
	console.log("Date: ", month, day, year);
	return thisDate;
}

function writeFirstPart() {
	fs.writeFileSync('new_index.md', firstBlock);
}

function generateDictionary(content) {
	var blocks = content.split('<a href="');
	console.log("blocks:", blocks.length);
	for (var i = 1; i < blocks.length; i++) {
		var thisBlock = blocks[i];
		var subBlocks = thisBlock.split('"');
		var thisUrl = subBlocks[0];
		if (urls[encodeURI(thisUrl)] === undefined) {
			urls[encodeURI(thisUrl)] = 'true';
			console.log(urls[encodeURI(thisUrl)])
		}
		console.log(subBlocks[0]);
	}

	console.log(urls);
}

/* Fetch news */
function fetchNews() {
	var index = 0;

	function fetchOneSource() {
		if(index < sourceIds.length) {
			console.log("Handling :", sources[sourceIds[index]].name);
			getItemsFromSource(sourceIds[index], function(err){
				if(err) {
					errorSources.push(sourceIds[index]);
					index ++;
          setTimeout(fetchOneSource, 500);	
				} else {
					index ++;
					setTimeout(fetchOneSource, 500);
				}
			})
		} else {
			if(index !== 0) {
				publish();
			}
		}	
	}	

	fetchOneSource();
}


function getContent(url, fn) {
	request(url, function(error, response, body) {
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

function formatNewItem(date, title, url, abstract, source) {
	var newItem = '\n<div class="code-example dont-break-out" markdown="1" style="padding-top:0px;padding-bottom:0px">\n';
	newItem += date + '\n' + '{: .fs-4 .fw-700 .lh-0  }\n';
	newItem += '<p style="font-weight:500; margin:0px" markdown="1">\n';
	newItem += title + '<a href="' + url + '">' + ' Full Text' + '</a>\n';
	newItem += '</p>\n';
	newItem += '<details>\n';
	newItem += '  <summary>Abstract</summary>\n';
	newItem += abstract + '\n';
	newItem += '</details>\n';
	newItem += '<div style="text-align: right" markdown="1">\n';
	newItem += source + '\n';
	newItem += '{: .fs-2 .fw-300 .lh-0}\n'
	newItem += '</div>\n';
	newItem += '</div>\n';
	return newItem;
}

function getItemsFromSource(id, fn) {
	sources[id].items = [];
	sources[id].index = 0;
	getContent(sources[id].url, function(err, data) {
		if (err) {
			fn(err);
			return;
		} else {
			//console.log(data);
			var $content = $($.parseHTML(data));
			 
            sources[id].handler($content, function(err, newsList) {
				if (newsList.length) {
					console.log("# of News: ", newsList.length);
				
					/* Check each new item, append a new item to new_index.md if the item doesn't exist in the dictionrary. */

					for (var i = 0; i < newsList.length; i++) {
						var thisNew = newsList[i];
						var thisTitle = thisNew.title;
						var thisURL =  thisNew.url;
						var thisDate = thisNew.date; 
						var thisTime = new Date(thisDate).getTime();
						if (thisTime < lastDate.getTime()) {
							console.log("Old item");
							break;
						}
						var thisSource = sources[id].name;
						if(thisSource === null) {
							thisSource = thisNew.source;
						}
						var thisAbstract = thisNew.abstract;
						console.log("---");
						console.log("New :", i, thisTitle);
						console.log("Date :", thisDate);
						console.log("Abstract :", thisAbstract);

						if (urls[encodeURI(thisURL)] === undefined) {

							var newItem = {
								time: thisTime,	
								post: formatNewItem(thisDate, thisTitle, thisURL, thisAbstract, thisSource),
								url: thisURL
							}
							sources[id].items.push(newItem)

							console.log(newItem);
							urls[encodeURI(thisURL)] = 'true';

						} else {
							console.log("Found: ", thisURL);
						}
					}
					//console.log("urls:", urls );
					//console.log(sources[id].items);
					fn(null);
				} else {
					fn(null);
				}
			});
		}
	});
}



function publish() {
	console.log("publish:");
	/* Publish items from all sources in equal order */
	arrangeItems();
	console.log(newItems);
	/* Append the second part to new_index.md*/
	fs.appendFileSync('new_index.md', secodBlock);
	/* Copy new_index.md to index.md in project root folder*/
	if (goOfficial) {
		copyIndex(function(err) {
			if (err) {

			} else {
				/* Push to Github */
				pushToGithub();		
			}
		})
	}
}

function arrangeItems() {
	//console.log("arrangeItems");
	var goAhead = true;
	while (goAhead) {
		//console.log("New round");
		goAhead = false;
		for (var i = 0; i < sourceIds.length; i++) {
			var id = sourceIds[i];
			//console.log("From :", id, sources[id].index, sources[id].items.length);
			if (sources[id].index < sources[id].items.length) {
				var thisTime = sources[id].items[sources[id].index].time;
				var thisPost = sources[id].items[sources[id].index].post;
				var thisUrl = sources[id].items[sources[id].index].url;
				if(newItems[thisTime] === undefined) {
					newItems[thisTime] = [{url: thisUrl, post:thisPost}];
					newItemTimes.push(thisTime);
				} else {
					newItems[thisTime].push({url: thisUrl, post:thisPost});
				}
				//		console.log(thisItem)
				//fs.appendFileSync('new_index.md', thisPost);
				//newItems.push(thisItem);
				sources[id].index++;
				goAhead = true;
			}
		}
	}
	var sortedTimes = newItemTimes.sort();
	for(var i=sortedTimes.length-1; i>-1; i--) {
		var thisNewItems = newItems[sortedTimes[i]];
		for(var j=0; j< thisNewItems.length; j++) {
			fs.appendFileSync('new_index.md', thisNewItems[j].post);
		}	
	}
}

function copyIndex(fn) {
	exec('cp new_index.md ../../index.md ', (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			fn(error);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			fn("error");
			return;
		}
		console.log("Copied index.md");
		fn(null);
	});
}

function pushToGithub() {
	var commit = 'cd ../../; git commit -m ' + (new Date()).toISOString();;
	console.log(commit);
	/* $ git status  */
	exec("cd ../../; git status", (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);

		/* $ git add --all  */
		exec("cd ../../; git add --all", (error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
				return;
			}
			console.log(`stdout: ${stdout}`);

			/* $ git commit */
			exec(commit, (error, stdout, stderr) => {
				if (error) {
					console.log(`error: ${error.message}`);
					if(forever) {
						var now = new Date();
        				console.log(round + ':' + now);
                        setTimeout(newCycle, delay);
                    }
                    return;
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`);
					if(forever) {
						var now = new Date();
        				console.log(round + ':' + now);
        				setTimeout(newCycle, delay);
    				}
					return;
				}
				console.log(`stdout: ${stdout}`);

				/* $ git push */
				exec('cd ../../; git push origin master', (error, stdout, stderr) => {
					if (error) {
						console.log(`error: ${error.message}`);
						if(forever) {
                        	var now = new Date();
                        	console.log(round + ':' + now);
                        	setTimeout(newCycle, delay);
                    	}
						return;
					}
					if (stderr) {
						console.log(`stderr: ${stderr}`);
						if(forever) {
                        	var now = new Date();
                        	console.log(round + ':' + now);
                        	setTimeout(newCycle, delay);
                    	}
						return;
					}
					console.log(`stdout: ${stdout}`);

					setTimeout(finished, 100);
				});
			});
		});
	});
}

function finished() {
	console.log("Finished");
	errorSources.push("End of Errors");
	if(errorSources.length) {
		console.log(errorSources.join());
	}
	if(forever) {
		var now = new Date();
    	console.log(round + ':' + now);
		setTimeout(newCycle, delay);
	} 
}
