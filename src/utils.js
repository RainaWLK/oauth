
function parseFragments(parsedUrl){  
  let result = {};

  if(parsedUrl.hash.length > 0){
    let fragments = parsedUrl.hash.split('&');

    for(let i in fragments){
      let keyIndex = fragments[i].indexOf('=');
      let key = fragments[i].substring(0, keyIndex);
      let value = fragments[i].substring(keyIndex+1);

      result[key] = value;
    }
  }

  return result;
}

function getUrlParameter(url) {
  var parsedUrl = new URL(url);

  let inputData = parseFragments(parsedUrl);
  return inputData;
};

exports.getUrlParameter = getUrlParameter;
