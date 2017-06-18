function getFileList(){
  console.log("======= get file list================");
  var para = "";

  var access_token = Dropbox.getAuthToken();
  if(access_token == null)
    return;


  var option = {
    url: 'https://api.dropboxapi.com/1/metadata/auto/',
    headers: {
      "Authorization": "Bearer " + access_token,
      "Content-Type": "application/x-www-form-urlencoded"
      //	'User-Agent': 'request'
    },
    body: para
  }

  request.get(option)
  .on('error', function(err) {
      console.log(err)
  })
  .on('response', function(response) {
      console.log(response.statusCode); // 200
      var chunk = "";
      response.on('data', function(data) {
          // compressed data as it is received
          console.log('received ' + data.length + ' bytes of compressed data');
          
          chunk += data.toString();
      });

      response.on('end', function(){
          var data = JSON.parse(chunk);
          console.log(data);
      });
  });
}

/*{ state: 'ccc',
  code: 'I-m8xaynEZAAAAAAAAAAKwkxdMzQpN4Oqp5dx1MyH5I' }*/

    //test
    /*auth_data = {
        "access_token": "I-m8xaynEZAAAAAAAAAALK8DYIG5Z0IbM9xF2m_9y6twK2QdKW2KTbF-CoUa2zGw",
        "token_type": "bearer",
        "uid": "12345678",
        "account_id": "dbid:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    }
    getFileList();*/