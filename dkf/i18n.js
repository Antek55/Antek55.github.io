const LANG = localStorage.getItem("lang") || (location.pathname.endsWith("en.html") ? "en" : "pl")

if (LANG == "en") {
  for (let t of document.querySelectorAll("[en]"))
    t.innerHTML = t.getAttribute("en")
  
  for (let t of document.querySelectorAll("[data-i18n]")) {
    for (let [k, v] of Object.entries(t.dataset)) {
      if (k.startsWith(LANG))
        t.setAttribute(k.substr(2), v)
    }
  }
}

const TR = {
  pn: 'Mon',
  wt: 'Tue',
  śr: 'Wed',
  cz: 'Thu',
  pt: 'Fri',
  sb: 'Sat',
  nd: 'Sun',
  stycznia: 'January',
  lutego: 'February',
  marca: 'March',
  kwietnia: 'April',
  maja: 'May',
  czerwca: 'June',
  lipca: 'July',
  sierpnia: 'August',
  września: 'September',
  października: 'October',
  listopada: 'November',
  grudnia: 'December',
  
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

const TRANS = {
  'Proszę o cierpliwość, trwa przesyłanie…': 'Please be patient, sending in progress…',
  'Nie można przesłać z powodu nieznanego błędu. Spróbuj jeszcze raz lub skontaktuj się osobiście przez wiadomość prywatną.': 'Sending unsuccessful due to an unknown error. Please try again or contact the organisers directly via a private message.',
  "Wysłano odpowiedź.": 'Response sent.',
  nominacje: 'nominations',
}

function fragm(el) {
  if (LANG == 'en')
    for (let [k, v] of Object.entries(TRANS))
      el = el.replace(k, v)
  return el
}

function transl(t) {
  if (LANG == 'en' && TRANS[t])
    return TRANS[t]
  return t
}