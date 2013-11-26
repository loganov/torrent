var https = require('https');
var xml2js = require('xml2js');
var _ = require('underscore')

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
  	parser.parseString(fullResponse, function(err, data) {
  		channel = data.rss.channel;
  		_.each(channel, function(watch) {
  			_.each(watch.item, function(item) {
  				//console.log(item.title);
  				var regex = /\[(.*?)\]/g
  				var i = new String(item.title);
  				var result = i.match(regex);
  				var tag = result[1].split('|')

  				var torrent = {
  					"title" : cleanString(new String(watch.title)).split("::")[0],
  					"name" : cleanString(result[3]),
  					"year": cleanString(result[0]),
  					"codec" : cleanString(tag[0]),
  					"container" : cleanString(tag[1]),
  					"source" : cleanString(tag[2]),
  					"resolution": cleanString(tag[3]),
  					"ripper": cleanString(tag[4]),
  					"link": cleanString(new String(item.link)),
  					"guid": cleanString(new String(item.guid))
  				}
  				//console.log(cleanString(torrent));
  				console.log(torrent);
  			});
  		});
  	});
  });

}).on('error', function(e) {
  console.error(e);
});

function cleanString (str) {
	str = str.replace(/ /g, '');
	str = str.replace(/\[/, '');
	str = str.replace(/\]/, '');
	return str;
}