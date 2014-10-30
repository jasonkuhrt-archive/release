update = require('../lib/update')
utils = require('../lib/utils')
foobarfilepath = "#{__dirname}/fixture/foobar.json"
foobarfileContents = JSON.stringify(a:1, b:2)



describe 'relesae lib update', ->
  getManifestFilepath = utils.getManifestFilepath

  beforeEach ->
    utils.getManifestFilepath = -> foobarfilepath
    cproc
    .execAsync 'git checkout -b test'
    .then -> fs.writeFileAsync(foobarfilepath, foobarfileContents)

  afterEach ->
    utils.getManifestFilepath = getManifestFilepath
    cproc.execAsync 'git checkout master'
    .then -> cproc.execAsync 'git branch -D test'
    .then -> cproc.execAsync 'git tag -d 100.0.2'


  it '.localVCS() commits and tags the release', ->
    release = I.fromJS
      version:'100.0.2'
      type: 'patch'
      initialManifest:
        version: '100.0.1'
    update
    .localVCS release
    .then -> cproc.execAsync 'git log -n 1 --pretty=format:%s'
    .get 0
    .then (message)-> eq message, 'Release patch 100.0.2'
