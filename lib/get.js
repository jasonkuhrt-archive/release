var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))
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
  return fs
  .readFileAsync(path.join(process.cwd(), 'package.json'))
  .then(JSON.parse)
  .get('version')
}

exports.manifest = function getManifestFile(){
  return fs
  .readFileAsync(path.join(process.cwd(), 'package.json'))
  .then(JSON.parse)
}
