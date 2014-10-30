var Promise = require('bluebird')
var I = require('immutable')
var cproc = Promise.promisifyAll(require('child_process'))
var fs = Promise.promisifyAll(require('fs'))
var path = require('path')
var messages = require('../lib/messages')



exports.registry = function updateRegistry(){
  return cproc.execAsync('npm publish')
}

exports.remoteVCS = function updateRemoteVCS(){
  return Promise.each(['git push', 'git push --tags'], cproc.execAsync)
}

exports.localVCS = function updateLocalVCS(release){
  return Promise.each([
    'git add package.json',
    'git commit -m "' + messages.commit(release) + '"',
    'git tag' + release.version
  ], cproc.execAsync)
}

exports.manifest = function updateManifest(release){
  return updateJSONData(path.join(process.cwd(), 'package.json'), { version: release.version })
}



// Helpers

function updateJSONData(JSONFilepath, newData){
  return fs
  .readFileAsync(JSONFilepath)
  .then(JSON.parse)
  .then(I.fromJS)
  .then(function(oldData){ return oldData.mergeDeep(newData) })
  .tap(function(updatedData){
    return fs.writeFileAsync(JSONFilepath, JSON.stringify(updatedData, null, 2))
  })
}
