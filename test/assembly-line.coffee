assemblyLine = require('../lib/assembly-line')



describe 'assemblyLine()', ->

  it 'accepts a line and a step, and adds the step to the line', ->
    unit = Map({ tags: Set.of('a'), action: -> })
    got = assemblyLine(List(), unit)
    eq got.toJS(), [unit.toJS()]


describe 'stepConfig', ->
  al = al2 = undefined

  beforeEach ->
    al = assemblyLine(List([]), Map({ tags: Set.of('a'), action: -> }))
    al2 = assemblyLine(al, Map({ tags: Set.of('a'), action: -> }))


  describe '"before"', ->
    it 'positions step before respective item', ->
      unit = Map({ before: Set.of('a'), tags: Set.of('z','y'), action: -> })
      index = assemblyLine(al, unit).indexOf unit
      eq index, 0

    it 'positions step before ALL respective items', ->
      unit = Map({ before: Set.of('a'), tags: Set.of('z','y'), action: -> })
      index = assemblyLine(al2, unit).indexOf unit
      eq index, 0


  describe '"after"', ->

    it 'positions step after respective item', ->
      unit = Map({ after: Set.of('a'), tags: Set.of('z','y'), action: -> })
      index = assemblyLine(al, unit).indexOf unit
      eq index, 1

    it 'positions step after ALL respective items', ->
      unit = Map({ after: Set.of('a'), tags: Set.of('z','y'), action: -> })
      index = assemblyLine(al2, unit).indexOf unit
      eq index, 2
