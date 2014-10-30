var Promise = require('bluebird')
var I = require('immutable')
var fs = Promise.promisifyAll(require('fs'))

exports.fs = fs

exports.updateJSONFile = function updateJSONFile(JSONFilepath, newData){
  return fs
  .readFileAsync(JSONFilepath)
  .then(JSON.parse)
  .then(I.fromJS)
  .then(function(oldData){ return oldData.mergeDeep(newData) })
  .tap(function(updatedData){
    return fs.writeFileAsync(JSONFilepath, JSON.stringify(updatedData, null, 2))
  })
}
