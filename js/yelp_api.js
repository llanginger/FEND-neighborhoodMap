function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var yelp_url = "https://api.yelp.com/v2/search?term=food&location=San+Francisco";

var httpMethod = "GET",
  // url = "https://api.yelp.com/v2/search?term=food&location=San+Francisco",
  parameters = {
    oauth_consumer_key: "PcW8VHWt5Q4dqYBZmSpgfw",
    oauth_token: "0p4u8u_z9gJFOsWbfT69kEVIs64kiZkD",
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_signature_method: "HMAC-SHA1",
    oauth_version: "1.0",
    callback: "cb",
    location: '1032+Castro+Street%2C+Mountain+View',
    term: 'cafe',
    cll: '37.385083%2C-122.08460200000002'
  };
  consumerSecret = "m2La4b5iWT9Ckn31Az0Tudmwp4k",
  tokenSecret = "EOpAUZakWe2SNhx8TqKpyhGHMRc",
  encodedSignature = oauthSignature.generate(httpMethod, yelp_url, parameters, consumerSecret, tokenSecret),
  encodedSignature = oauthSignature.generate(httpMethod, yelp_url, parameters, consumerSecret, tokenSecret, {encodedSignature: false}),
  settings = {
    url: yelp_url,
    data: parameters,
    cache: true,
    dataType: "jsonp",
    success: function(results){
      console.log("Success!");
    },
    fail: function(){
      console.log("Fail!");
    }
  };

  $.ajax(settings);
  console.log(settings);
