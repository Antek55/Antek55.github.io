function hextoclr(a) {
    const ar = parseInt(a.slice(1,3), 16)
    const ab = parseInt(a.slice(3,5), 16)
    const ag = parseInt(a.slice(5,7), 16)

    return [ar, ab, ag]
}

function clrtohex(c) {
    let d = '#'

    for (let i of c) {
    let k = Math.round(i).toString(16)
    if (k.length == 1)
        k = '0' + k
    
    d += k
    }
    return d
}

function gradient(a, b, i) {
    i = Math.min(i, 1)
    i = Math.max(i, 0)

    const [ar, ab, ag] = hextoclr(a)
    const [br, bb, bg] = hextoclr(b)

    let c = [ar + (br-ar)*i, ab + (bb - ab)*i, ag + (bg - ag)*i]
    return clrtohex(c)
}
    
function random_color() {
    return clrtohex([Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)])
}