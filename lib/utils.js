var Promise = require('bluebird')
var I = require('immutable')
var fs = Promise.promisifyAll(require('fs'))
var cproc = Promise.promisifyAll(require('child_process'))
var path = require('path')



exports.fs = fs

exports.cproc = cproc

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

exports.getManifestFilepath = function getManifestFilepath(){
  return path.join(process.cwd(), 'package.json')
}
