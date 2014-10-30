var I = require('immutable')
var utils = require('./utils')
var debug = require('debug')('release-get')
var semver = require('semver')




exports.releaseData = function(releaseType){
  debug('calculating release data')
  return exports.manifest().then(function(manifest){
    return I.Map({
      type: releaseType,
      version: semver.inc(manifest.get('version'), releaseType),
      initialManifest: manifest
    })
  })
}

exports.manifest = function getManifestFile(){
  var manifestPath = utils.getManifestFilepath()
  debug('getting manifest: %s', manifestPath)
  return utils.fs.readFileAsync(manifestPath).then(JSON.parse).then(I.fromJS)
}
