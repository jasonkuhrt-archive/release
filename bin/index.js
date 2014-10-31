#!/usr/bin/env node

var I = require('immutable')
var prompt = require('prompt')
var Promise = require('bluebird')
var chalk = require('chalk')
// var inspect = require('util').inspect
var cli = require('commander')
var get = require('../lib/get')
var update = require('../lib/update')
var utils = require('../lib/utils')

var dataReleaseTypes = I.Set.of('patch', 'minor', 'major')






cli
  .version(require('../package.json').version)
  .option('-p, --patch', 'Make a patch release')
  .option('-m, --minor', 'Make a minor release')
  .option('-a, --major', 'Make a major release')
  // .option('-Y, --no-prompt', 'Disable confirmation prompt')
  // .option('-R, --no-registry', 'Disable registry publishing')

cli.parse(process.argv)


doRelease(findFirstKeyIntersect(dataReleaseTypes, cli))
.then(function(releaseData){
  console.log('Version %s successfully released!', chalk.green(releaseData.get('version')))
})
.catch(console.error)






function doRelease(releaseType){
  return get
  .releaseData(releaseType)
  .tap(function(releaseData){
    return new Promise(function(resolve, reject){
      console.log('About to make a %s release that will result in version: %s', chalk.green(releaseData.get('type')), chalk.green(releaseData.get('version')))
      var promptSchema = [{
        description: 'Confirm this release (y|yes)',
        required: true,
        message: 'To confirm enter "yes" or "y"',
        pattern: /^(?:yes|y)$/
      }]
      prompt.get(promptSchema, function(err, answer){
        if (err) return reject(err)
        resolve(answer)
      })
    })
  })
  .tap(function(releaseData){
    console.log('')
    return update.manifest(releaseData)
    .tap(function(didUpdate){
      if (didUpdate) utils.logStepDone('manifest updated')
      else utils.logStepSkipped('no manifest to update')
    })
    .tap(update.localVCS.bind(null, releaseData))
    .tap(function(didCommit){
      if (didUpdate) utils.logStepDone('git commit + tag')
      else utils.logStepDone('git tag')
    })
    .tap(update.remoteVCS)
    .tap(function(){ utils.logStepDone('git push') })
    .tap(update.registry.bind(null, releaseData))
    .tap(function(){ console.log('') })
  })
}

function findFirstKeyIntersect(set, obj){
  return set.find(function(item){ return obj[item] })
}
