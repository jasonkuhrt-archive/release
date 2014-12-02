var Promise = require('bluebird')
var semver = require('semver')
var Action = require('./action')
var cp = Promise.promisifyAll(require('child_process'))



var gtag = Action('Tag git commit with version')

gtag.reader(function() {
  return cp.execAsync('git tag --sort -version:refname | head -n 5').get(0)
})

gtag.updater(function(dataRead) {
  return semver.inc(dataRead.split('\n')[0], 'patch')
})

gtag.comitter(function(dataUpdated) {
  return cp.execAsync('git tag ' + dataUpdated)
})

gtag.differ(function(dataRead, dataUpdated) {
  return 'git tag ' + dataUpdated
})




var gpushCmd = 'git push && git push --tags'
var gpush = Action('Push git commit and git tag')

gpush.comitter(function() {
  return cp.execAsync(gpushCmd)
})

gpush.differ(function() {
  return gpushCmd
})



module.exports = Action.group(gtag, gpush)
