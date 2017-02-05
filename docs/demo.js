import m from 'mithril'

const proxy = {}
const counters = {}

window.m = m
window.proxy = proxy

window.swap = (z1, z2) => {
  [proxy[z1].fn, proxy[z2].fn] = [proxy[z2].fn, proxy[z1].fn]
  console.log(`swap ${ z1 } ${ z2 }`)
  m.redraw()
}

// features/tricky stuff:
//
// zone namespacing
// sorting elements within zones (static elem issues?)
// freeze on drop
// transform on drop

const ondragstart = (ev, zoneId) => {
  console.log('dragstart', ev)
  ev.dataTransfer.setData('text/plain', zoneId);
}

const ondrop = (ev, zoneId) => {
  console.log('ondrop', ev)
  ev.preventDefault()

  window.swap(ev.dataTransfer.getData('text'), zoneId);
}

const ondragover = (ev) => {
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'move'
}

const zone = (zoneId, classes, fn = undefined) => {
  if (!proxy[zoneId] || !proxy[zoneId].init) {
    console.log(zoneId, classes, fn)
    proxy[zoneId] = { fn, init : true }
  }

  let vNode = m(classes, { ondrop : (ev) => ondrop(ev, zoneId), ondragover }, proxy[zoneId].fn)
  vNode.children
    .filter((elem) => elem !== undefined && elem.attrs.draggable)
    .forEach((elem) => {
    console.log('forEach', zoneId)
    elem.attrs.ondragstart = (ev) => ondragstart(ev, zoneId)
  })
  // console.log('vNode', vNode)
  return vNode
}


m.mount(document.querySelector('#app'), {
  view : () => [
    // m('.column', [
    //   m('h2', 'todo')
    //   m('.ticket', 'Make one element work'),
    // ]),
    zone('todo', '.column', [
      m('.ticket', { draggable: true }, 'Make one element work'),
    ]),
    zone('ongoing', '.column'),
    zone('review', '.column'),
    zone('done', '.column'),
  ]
})
