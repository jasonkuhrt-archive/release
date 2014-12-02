var i = require('immutable')
var List = i.List,
    fromJS = i.fromJS


/*
Construct and add a logical unit to the assembly line.
*/
module.exports = function Sequence() {
  return List()
}

module.exports.registerAction = registerAction



function registerAction(sequence, action) {
  action = fromJS(action)
  action = action.set('side', action.has('before') ? 0 : 1)
  action = action.set('selector', action.get('before') || action.get('after'))

  if (sequence.size === 0) return sequence.push(action)

  var index = action.get('side') + findActionIndex(sequence, action)
  return sequence.splice(index, 0, action)
}


function findActionIndex(sequence, action){
  // If hooking before something find the first instance those tags, but if
  // hooking after something, find the last instance of those tags.
  var index = sequence[['findIndex', 'findLastIndex'][action.get('side')]](function(existingAction) {
    return existingAction.get('tags').isSuperset(action.get('selector'))
  })

  if (index === -1) index = sequence.size - 1

  return index
}
