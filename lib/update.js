var Promise = require('bluebird')
var debug = require('debug')('release-update')
var utils = require('./utils')
var messages = require('../lib/messages')



exports.registry = function updateRegistry(release){
  return release.getIn(['initialManifest', 'private'])
  ? null
  : utils.cproc
    .execAsync('npm publish')
    .tap(console.log.bind(null, 'done: npm publish'))
}

exports.remoteVCS = function updateRemoteVCS(){
  return Promise.each(['git push', 'git push --tags'], utils.cproc.execAsync.bind(utils.cproc))
}

exports.localVCS = function updateLocalVCS(release){
  debug('updating local VCS')
  return utils.cproc.execAsync('git add ' + utils.getManifestFilepath())
  .then(function(){
    debug('commiting release: %s', messages.commit(release))
    return utils.cproc.execAsync('git commit -m "' + messages.commit(release) + '"')
  })
  .then(function(){
    return utils.cproc.execAsync('git tag ' + release.get('version'))
  })
}

exports.manifest = function updateManifest(release){
  return utils.updateJSONFile(utils.getManifestFilepath(), { version: release.get('version') })
}
