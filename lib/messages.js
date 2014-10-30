var format = require('util').format;



exports.commit = commit

function commit(release){
  return format('Release %s %s', releaseTypeWord(release), release.version)
}

function releaseTypeWord(release){
  return release.version === '0.0.1' ? 'initial' : release.type
}
