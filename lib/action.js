var Promise = require('bluebird')



module.exports = Action
module.exports.Action = Action
module.exports.group = group
module.exports.willExec = willExec
module.exports.willSkip = willSkip



function Action(desc) {
  var dataRead, dataUpdated
  var action = {
    description: desc,
    _state: 'created',
    _read: function noop(){},
    _update: function update(){},
    _commit: function commit(){},
    _diff: function diff(){},
    reader: function(f) {
      action._read = f
      return action
    },
    updater: function(f) {
      action._update = f
      return action
    },
    comitter: function(f) {
      action._commit = f
      return action
    },
    differ: function(f) {
      action._diff = f
      return action
    },
    plan: function() {
      if (action._state !== 'created') throw new Error('Action must be in state "created" to use "plan"')
      return (
        Promise.resolve(action._read())
        .then(function(dataRead_){
          dataRead = dataRead_
          return (
            Promise.resolve(action._update(dataRead))
            .then(function(dataUpdated_) {
              dataUpdated = dataUpdated_
              action._state = 'planned'
              return {
                description: action.description,
                diff: action._diff(dataRead, dataUpdated)
              }
            })
          )
        })
      )
    },
    commit: function() {
      if (action._state !== 'planned') throw new Error('Action must be in state "planned" to use "commit"')
      return Promise.promise(action._commit(dataUpdated))
      .tap(function(){
        action._state = 'committed'
      })
    },
    check: function() {
      // TODO
    }
  }

  return action
}



function group(a1, a2) {
  var actions = [a1, a2]
  return {
    plan: function() {
      return Promise.all(actions.map(function(action) {
        return action.plan()
      }))
    },
    commit: function() {
      return Promise.all(actions.map(function(action) {
        return action.commit()
      }))
    },
    check: function() {
      return Promise.all(actions.map(function(action) {
        return action.check()
      }))
    },
    _actions: actions
  }
}



function willExec(fnDesc, fn) {
  function exec() {
    return Promise.reslve(fn())
  }
  exec.description = fnDesc
  exec.isSkip = false
  exec.skipReason = ''
  return exec
}



function willSkip(fnDesc, reason) {
  function exec() {}
  exec.description = fnDesc
  exec.isSkip = true
  exec.skipReason = reason
  return exec
}
