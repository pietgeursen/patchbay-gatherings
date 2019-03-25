const { h, Value, computed } = require('mutant')
const spacetime = require('spacetime')
const imageString = require('../lib/image-string')

module.exports = function gatheringCard (opts) {
  const {
    gathering,                                              // Object: gathering Message of form { key, value }
    scuttle,                                                // Object: instantiated scuttle-gathering helper
    blobUrl = i => '',                                      // Function: takes BlodId, returns url location for blob
    markdown = i => i,                                      // Function: takes text, returns rendered markdown
    color = () => `hsl(${Math.random() * 360}, 100%, 70%)`  // Function: takes gathering key, return valid background-color css
  } = opts

  const state = Value()
  scuttle.get(gathering.key, (err, data) => {
    if (err) throw (err)

    state.set(data)
  })

  return h('GatheringCard', computed(state, state => {
    if (!state) return 'Loading...' // TODO - make nicer

    const { title, description, startDateTime, image } = state
    const background = image && image.link ? `url('${blobUrl(imageString(image))}')` : ''
    var date
    if (startDateTime && startDateTime.epoch) {
      const t = spacetime(startDateTime.epoch)
      date = `${t.format('date')} ${t.format('month-short')}`
    }

    return [
      h('div.details', [
        h('h2', title), h('div.description', markdown(description)) ]),
      h('div.date-splash',
        {
          style: {
            'background-image': background,
            'background-color': color(gathering.key)
          }
        },
        [
          h('div', date)
        ]
      )
    ]
  }))
}
