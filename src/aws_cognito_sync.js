require('amazon-cognito-js');

function cognitoSync(table, data){
  AWS.config.credentials.get(function(){
    var syncClient = new AWS.CognitoSyncManager();

    syncClient.openOrCreateDataset(table, function(err, dataset) {

      for(let i in data){
        dataset.put(i, data[i], function(err, record){});
      }

      dataset.synchronize({

        onSuccess: function(dataset, newRecords) {
          //...
          console.log("onSuccess");
        },
    
        onFailure: function(err) {
          //...
          console.log("onFailure");
          console.log(err);
        },
    
        onConflict: function(dataset, conflicts, callback) {
          //....
          console.log("onConflict");
        },
    
        onDatasetDeleted: function(dataset, datasetName, callback) {
          //...
          console.log("onDatasetDeleted");
        },
    
        onDatasetMerged: function(dataset, datasetNames, callback) {
          //...
          console.log("onDatasetMerged");
        }
      });

    });

      
  });
}



exports.cognitoSync = cognitoSync;