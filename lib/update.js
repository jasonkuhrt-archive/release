var Promise = require('bluebird')
var debug = require('debug')('release-update')
var utils = require('./utils')
var messages = require('../lib/messages')



exports.registry = function updateRegistry(release){
  if (!release.get('initialManifest') || release.getIn(['initialManifest', 'private'])) {
   utils.logStepSkipped('no registry to publish to')
   return null
 } else {
   debug('updating npm registry')
   return utils
   .execAsync('npm publish')
   .tap(function(){ utils.logStepDone('npm publish') })
  }
}

exports.remoteVCS = function updateRemoteVCS(){
  debug('updating remote VCS')
  return utils.cproc
  .execAsync('git push')
  .then(function(){ return utils.execAsync('git push --tags') })
}

exports.localVCS = function updateLocalVCS(release){
  debug('updating local VCS')
  return vcsCommit(release)
  .tap(function(){
    return utils.execAsync('git tag ' + release.get('version'))
  })
}

function vcsCommit(release){
  if (!release.get('initialManifest')) return Promise.resolve(false)
  return utils
  .execAsync('git add ' + utils.getManifestFilepath('npm'))
  .then(function(){
    debug('commiting release: %s', messages.commit(release))
    return utils.execAsync('git commit -m "' + messages.commit(release) + '"')
  })
}

exports.manifest = function updateManifest(release){
  if (!release.get('initialManifest')) return Promise.resolve(false)
  return utils.updateJSONFile(utils.getManifestFilepath('npm'), { version: release.get('version') }).return(true)
}
