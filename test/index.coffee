messages = require('../lib/messages')
utils = require('../lib/utils')


foobarfilepath = "#{__dirname}/fixture/foobar.json"
foobarfileContents = JSON.stringify(a:1, b:2)



describe 'release lib messages', ->

  it '.commit() creates a spcial "initial" message for first release', ->
    eq messages.commit(I.Map version: '0.0.1', type: 'patch'), 'Release initial 0.0.1'

  it '.commit() creates a commit message for the release type', ->
    eq messages.commit(I.Map version: '0.0.2', type: 'patch'), 'Release patch 0.0.2'



describe 'release lib utils', ->
  beforeEach -> fs.writeFileAsync(foobarfilepath, foobarfileContents)
  afterEach -> fs.unlinkAsync(foobarfilepath)

  it '.updateJSONFile() writes data updates to disk', ->
    utils.updateJSONFile foobarfilepath, c:3
    .then fs.readFileAsync.bind(fs, foobarfilepath)
    .then JSON.parse
    .then (updatedData)-> eq updatedData, a:1, b:2, c:3
