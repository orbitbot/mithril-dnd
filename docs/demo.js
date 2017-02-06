import m from 'mithril'

window.m = m

// features/tricky stuff:
//
// zone namespacing
// sorting elements within zones (static elem issues?)
// freeze on drop
// transform on drop

const columns = {
  todo    : ['Make one element work'],
  ongoing : [],
  review  : [],
  done    : [],
}
window.columns = columns

const ondragstart = (ev, zoneId) => {
  ev.dataTransfer.setData('text/plain', zoneId)
  ev.dataTransfer.setData('identifier', columns[zoneId].indexOf(ev.target.textContent))
}

// const callback = (...args) => console.log('drop', args)
const callback = (id, src, dest) => {
  columns[dest].push(columns[src].splice(columns[src][id])[0])
}

const zone = (zoneId, tag, content) => {
  return m(tag, {
    ondrop : (ev) => {
      ev.preventDefault()
      callback(ev.dataTransfer.getData('identifier'), ev.dataTransfer.getData('text'), zoneId)
    },
    ondragover  : ()   => false,
    ondragstart : (ev) => ondragstart(ev, zoneId)
   }, content)
}


m.mount(document.querySelector('#app'), {
  view : () => [
    // m('.column', [
    //   m('h2', 'todo')
    //   m('.ticket', 'Make one element work'),
    // ]),
    zone('todo'   , '.column', columns.todo.map((el)    => m('.ticket', { draggable : true }, el) )),
    zone('ongoing', '.column', columns.ongoing.map((el) => m('.ticket', { draggable : true }, el) )),
    zone('review' , '.column', columns.review.map((el)  => m('.ticket', { draggable : true }, el) )),
    zone('done'   , '.column', columns.done.map((el)    => m('.ticket', { draggable : true }, el) )),
  ]
})
