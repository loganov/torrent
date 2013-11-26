var _ = require('underscore')
var xml2js = require('xml2js')
var https = require('https')
var xpath = require('xpath')
      , dom = require('xmldom').DOMParser

var fullResponse = ""

var url = 'https://broadcasthe.net/feeds.php?feed=torrents_notify_27050_xbljbw8uuikoa9ah9lbheq26la33unpp&user=18051&auth=8a88d3c99f8f1ad359fcacee0de7db77&passkey=xbljbw8uuikoa9ah9lbheq26la33unpp&authkey=c332d8e81c029b882b34c35b1c0ba538&name=The+Daily+Show';

https.get(url, function(res) {
  //console.log("statusCode: ", res.statusCode);
  //console.log("headers: ", res.headers);

  	res.on('data', function(chunk) {
    	fullResponse = fullResponse + chunk;
  	});


  	res.on('end', function() {
		var parser = new xml2js.Parser();

  		var xml = fullResponse.toString();
  		var doc = new dom().parseFromString(xml);
  		//var title = xpath.select("//channel/title/text()", doc).toString()
  		

  		var items = xpath.select("//channel//item", doc);
  		var i = 0
  		_.each(items, function(item) {	
			parser.parseString(item, function(err, data) {
				var regex = /\[(.*?)\]/g;
				var results = new String(data.item.title).match(regex);
				
				//console.log(results);

				var torrents = []
				details = results[1].split('|');
				_.each(details, function(detail) {
					detail = detail.replace(/ /g, '');
					detail = detail.replace(/\[/g, '');
					detail = detail.replace(/\]/g, '');
					torrents.push(detail);
				});


				torrent = {
					"codec" : details[0],
					"container" : details[1],
					"source" : details[2],
					"resolution" : details[3],
					"ripper" : details[4],
				}

				console.log(torrents);
				
			});
			
  		});

		//var parser = new xml2js.Parser();
  		//parser.parseString(items, function(err, data) {
  		//	console.log(JSON.stringify(data, null, 4));
  		//});
  		//_.each(items, function(item) {
  		//	//console.log(xpath.select('./title' ,doc).toString());
  		//	console.log(item.toString());
  		//});

  		// var torrent = {
  		// 	"title" : title,
  		// 	"name" : cleanString(result[3]),
  		// 	"year": cleanString(result[0]),
  		// 	"codec" : cleanString(tag[0]),
  		// 	"container" : cleanString(tag[1]),
  		// 	"source" : cleanString(tag[2]),
  		// 	"resolution": cleanString(tag[3]),
  		// 	"ripper": cleanString(tag[4]),
  		// 	"link": cleanString(new String(item.link)),
  		// 	"guid": cleanString(new String(item.guid))
  		// }

  		//console.log(title);
  		//console.log(items);
  		
  		//console.log(torrent);
	});

}).on('error', function(e) {
  console.error(e);
});
