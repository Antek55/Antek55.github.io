const LANG = localStorage.getItem("lang") || "pl"

if (LANG == "en") {
  for (let t of document.querySelectorAll("[en]"))
    t.innerHTML = t.getAttribute("en")
}

const TR = {
  pn: 'Mon',
  wt: 'Tue',
  śr: 'Wed',
  cz: 'Thu',
  pt: 'Fri',
  sb: 'Sat',
  nd: 'Sun',
  marca: 'March',
  
  głosowanie: 'poll',
}

const SEL = `<div style="position: absolute; top: 0px; right: 0px">
  <a onclick="gotoLang(event)" lang="pl" style="cursor: pointer"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Flag_of_Poland_%283-2%29.svg" class="smallflag" title="polski"></a>
  <a onclick="gotoLang(event)" lang="en" style="cursor: pointer"><img src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Flag_of_the_United_Kingdom_%283-2%29.svg" class="smallflag" title="English"></a>
</div>`
document.body.insertAdjacentHTML("afterbegin", SEL)

function gotoLang(event) {
  localStorage.setItem("lang", event.currentTarget.getAttribute("lang"))
  location.reload()
}

function fragm(el) {
  if (LANG == 'en')
    for (let [k, v] of Object.entries(TR))
      el = el.replace(k, v)
  return el
}