get = require('../lib/get')

foobarfilepath = "#{__dirname}/fixture/foobar.json"
foobarfileContents = JSON.stringify(a:1, b:2)

describe 'release lib get', ->
  cwd = process.cwd
  before -> process.cwd = -> "#{__dirname}/fixture"
  after -> process.cwd = cwd

  it '.manifest() returns project manifest file', ->
    get.manifest().then (manifest)->
      a manifest.equals I.Map({ version: '100.0.1' })

  it '.releaseData() returns the data of the release about to be made', ->
    get.releaseData('patch').then (release)->
      a release.equals I.fromJS
        version: '100.0.2'
        type: 'patch'
        initialManifest:
          version: '100.0.1'
