var utils = require('./utils')
var path = require('path')
var semver = require('semver')




exports.releaseData = function(releaseType){
  return exports.manifest().then(function(manifestFile){
    return {
      type: releaseType,
      version: semver.inc(manifestFile.version, releaseType)
    }
  })
}

exports.version = function getCurrentVersion(){
  return utils.fs
  .readFileAsync(path.join(process.cwd(), 'package.json'))
  .then(JSON.parse)
  .get('version')
}

exports.manifest = function getManifestFile(){
  return utils.fs
  .readFileAsync(path.join(process.cwd(), 'package.json'))
  .then(JSON.parse)
}
