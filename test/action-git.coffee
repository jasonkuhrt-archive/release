actgit = require '../lib/action-git'



describe 'action-git', ->

  it '.plan() creates a plan', ->
    actgit.plan().then (res)->
      eq res.length, 2
      eq actgit._actions[0]._state, 'planned'
