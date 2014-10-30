var Promise = require('bluebird')
var debug = require('debug')('release-update')
var utils = require('./utils')
var messages = require('../lib/messages')



exports.registry = function updateRegistry(release){
  return release.getIn(['initialManifest', 'private'])
  ? null
  : debug('updating npm registry'), utils.cproc
    .execAsync('npm publish')
    .tap(function(){ console.log('done: npm publish') })
}

exports.remoteVCS = function updateRemoteVCS(){
  debug('updating remote VCS')
  return utils.cproc
  .execAsync('git push')
  .then(function(){ return utils.cproc.execAsync('git push --tags') })
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
