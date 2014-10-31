var I = require('immutable')
var utils = require('./utils')
var debug = require('debug')('release-get')
var semver = require('semver')




exports.releaseData = function(releaseType){
  debug('calculating release data')
  return exports.manifest()
  .then(function(manifest){
    return manifest
      ? releaseData(
        releaseType,
        semver.inc(manifest.get('version'), releaseType),
        manifest
      )
      : getLatestVersionFromVCS()
      .then(function(version){
        return releaseData(
          releaseType,
          semver.inc(version, releaseType),
          null
        )
      })


  })
}

exports.manifest = function getManifestFile(){
  var manifestPath = utils.getManifestFilepath('npm')
  debug('getting manifest: %s', manifestPath)
  return utils.fs
  .readFileAsync(manifestPath).then(JSON.parse).then(I.fromJS)
  .catch(isNoManifest, function(){ return null })
}

function getLatestVersionFromVCS(){
  return utils
  .execAsync('git tag --sort=-version:refname --list *.*.*')
  .then(function(versions){ return versions.split('\n')[0] })
}

function releaseData(type, version, manifest){
  return I.Map({
    type: type,
    version: version,
    initialManifest: manifest
  })
}

function isNoManifest(err){ return err.code === 'ENOENT' }
