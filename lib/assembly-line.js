var format = require('util').format
var I = require('immutable')



/*
Construct and add a logical unit to the assembly line.
*/
module.exports = function Step(line, stepConfig){
  if (!I.Iterable.isIndexed(line)) throw new Error('"line" must be a List')
  if (!I.Iterable.isKeyed(stepConfig)) throw new Error('"stepConfig" must be a Map')
  var index = findStepIndex(line, stepConfig)
  return index === null
  // if the location of this step does not matter add it to the end
  ? line.push(stepConfig)
  : line.splice(index, 0, stepConfig)
}

function findStepIndex(line, stepConfig){
  if (!I.Iterable.isIndexed(line)) throw new Error('"line" must be a List')
  if (!I.Iterable.isKeyed(stepConfig)) throw new Error('"stepConfig" must be a Map')
  // Discover if this step is located before or after its hook
  var side = getSide(stepConfig)
  // return null if the step location is unspecified
  if (side === null) return side

  // If hooking before something find the first instance those tags, but if
  // hooking after something, find the last instance of those tags.
  var foundIndex = line[sideToFindType(side)](function(step){
    return step.get('tags').isSuperset(stepConfig.get(sideToProp(side)))
  })

  if (foundIndex === - 1) {
    var message = format('Could not position step %s target %s because that target does not exist', ['before', 'after'][side], stepConfig.get(['before', 'after'][side]))
    throw new Error(message)
  }

  // console.log(side, foundIndex, line, stepConfig)
  return side + foundIndex
}



function sideToFindType(side){
  return ['findIndex', 'findLastIndex'][side]
}

function sideToProp(side){
  return ['before', 'after'][side]
}

function getSide(stepConfig){
  return stepConfig.get('before')
  ? 0
  : stepConfig.get('after')
  ? 1
  : null
}
