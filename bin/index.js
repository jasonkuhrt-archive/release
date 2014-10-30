var I = require('immutable')
var cli = require('commander')
var get = require('../lib/get')
var update = require('../lib/update')

var dataReleaseTypes = I.Set.of('patch', 'minor', 'major')






cli
  .version(require('../package.json').version)
  .option('-p, --patch', 'Make a patch release')
  .option('-m, --minor', 'Make a minor release')
  .option('-a, --major', 'Make a major release')
  .option('-Y, --no-prompt', 'Disable confirmation prompt')
  .option('-R, --no-registry', 'Disable registry publishing')

cli.parse(process.argv)


doRelease(findFirstKeyIntersect(dataReleaseTypes, cli))
.then(console.log)
.catch(console.error)






function doRelease(releaseType){
  get.releaseData(releaseType)
  .then(function(releaseData){
    return update.manifest(releaseData)
    .then(update.localVCS.bind(null, releaseData))
    .then(update.remoteVCS)
    .then(update.registry.bind(null, releaseData))
  })
}

function findFirstKeyIntersect(set, obj){
  return set.find(function(item){ return obj[item] })
}
