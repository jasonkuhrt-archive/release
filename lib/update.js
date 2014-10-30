var Promise = require('bluebird')
var cproc = Promise.promisifyAll(require('child_process'))
var utils = require('./utils')
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
  return utils.updateJSONData(path.join(process.cwd(), 'package.json'), { version: release.version })
}
