Release = require('../lib/release')



describe 'Release', ->

  it 'accepts settings and returns an instance', ->
    cwd = __dirname + '/fixture'
    release = Release cwd: cwd

    eq release.config.get('cwd'), cwd
    eq release.sequence, []

  it '.use() registers a plugin', ->
    release = Release().use (release)->
      release.registerAction({
        read: -> 'foobar'
      })
    eq release.sequence.size, 1


  describe.skip '.plan() runs the sequence\'s read-phase', ->
    release = undefined

    beforeEach ->
      release = Release().use (release)->
        release.registerAction({
          description: 'Increment number'
          read: -> 1
          update: (readData)-> readData + 1
        })

    it 'transitions each action into confirm state', ->
      release.plan().get(0).then (proposal)->
        eq proposal.before, 1
        eq proposal.after, 2
