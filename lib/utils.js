var Promise = require('bluebird')
var I = require('immutable')
var fs = Promise.promisifyAll(require('fs'))
var cproc = Promise.promisifyAll(require('child_process'))
var path = require('path')
var chalk = require('chalk')


exports.logStepDone = function(message){
  console.log('%s %s', chalk.black('✓ done:'), chalk.magenta(message))
}

exports.logStepSkipped = function(message){
  console.log('%s %s', chalk.black('✓ skipped:'), chalk.magenta(message))
}

exports.fs = fs

exports.cproc = cproc
exports.execAsync = cproc.execAsync.bind(cproc)

exports.updateJSONFile = function updateJSONFile(JSONFilepath, newData){
  return fs
  .readFileAsync(JSONFilepath)
  .then(JSON.parse)
  .then(I.fromJS)
  .then(function(oldData){ return oldData.mergeDeep(newData) })
  .tap(function(updatedData){
    return fs.writeFileAsync(JSONFilepath, JSON.stringify(updatedData, null, 2))
  })
}

var manifestNames = I.Map({
  npm: 'package.json',
  component: 'component.json',
  bower: 'bower.json'
})

exports.getManifestFilepath = function getManifestFilepath(type){
  return path.join(process.cwd(), manifestNames.get(type))
}
