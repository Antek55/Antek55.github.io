function uniform(a, b) {
  return a + Math.random() * (b-a)
}
const SVGNS = "http://www.w3.org/2000/svg"
function createElement(tag, attrs={}, otherargs={}) {
    let el
    if (!otherargs.ns)
        el = document.createElement(tag)
    else 
        el = document.createElementNS(otherargs.ns, tag)

    for (let [k, v] of Object.entries(attrs))
        el.setAttribute(k, v)

    if (otherargs.parent) {
        otherargs.parent.appendChild(el)
    }
    if (otherargs.children) {
        for (let c of otherargs.children)
            el.appendChild(c)
    }
        
    return el
}

let svg
class Point {
    x;
    velo;
    elem;
    constructor(x) {
        this.x = x || window.innerWidth
        this.iy = Math.random() * 1000
        this.period_nom = uniform(100, 300)
        this.ampl = uniform(20, 60)
        this.velo = Math.max(Math.random() * 10, 1);
        const elem = document.createElementNS("http://www.w3.org/2000/svg", 'circle')
        elem.setAttribute('cx', this.x)
        elem.setAttribute('cy', this.iy)
        elem.setAttribute('r', 10*Math.random())
        elem.setAttribute('fill', gradient("#ffff00", '#FF5733', Math.random()))
        elem.setAttribute('filter', `saturate(${this.velo/10 + 0.1}) blur(${1/(this.velo/10)})`)
        elem.setAttribute('class', "paralax-circle")
        this.elem = elem
        svg.appendChild(elem)
    }
    remove() {
        this.elem.remove()
    }
}
const pts = []

const FREQ = 20
let VMUL = 1
let nxt = 0
function dist(ax, ay, bx, by) {
  return Math.sqrt((ax-bx)**2 + (ay-by)**2)
}

function f() {
    const tbd = []
    for (let i = 0; i < pts.length; i++) {
        let p = pts[i]
        p.x -= p.velo*VMUL
        // p.iy -= VY*p.velo
        // p.elem.setAttribute('cy', p.iy + p.ampl*Math.sin(p.x/p.period_nom))
        p.elem.setAttribute('cy', p.iy)
        // const d = dist(p.x, p.iy, topx, leftx)
        p.elem.setAttribute('cx', p.x)

        if (p.x < 0)
            tbd.push(i)
    }
    for (let n of tbd) {
        pts[n].remove()
        pts.splice(n, 1)
    }

    if (nxt <= 0 && pts.length <= 75) {
        nxt = FREQ * Math.random()
        pts.push(new Point())
    }
    // text.innerHTML = pts.length
    nxt--
    requestAnimationFrame(f)
}

if (window.innerWidth > window.innerHeight) {
  svg = createElement('svg', {width: '100%', height: '100%', viewBox: `0 0 ${window.innerWidth} ${window.innerHeight}`, style: 'position: fixed; z-index: -1'}, {ns: SVGNS})
  document.body.prepend(svg)
  for (let i = 0; i < 25; i++)
    pts.push(new Point(uniform(0, window.innerWidth)))
  f()
  document.addEventListener("scroll", () => {
    const d = window.scrollY - scrollY
    for (let f of pts) {
      f.iy -= d
      if (f.iy < 0)
        f.iy += window.innerHeight
      f.iy %= window.innerHeight
    }
    scrollY = window.scrollY
  })
}

let scrollY = window.scrollY