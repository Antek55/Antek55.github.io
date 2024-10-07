const SUCCESS = "Wysłano odpowiedź ✓ Do zobaczenia!"
const ERR = '<h2 style="color: red">Nie można przesłać z powodu nieznanego błędu. Spróbuj jeszcze raz lub skontaktuj się osobiście przez wiadomość prywatną.</h2>'
const WAIT = "Proszę o cierpliwość, trwa przesyłanie…"

function randomStringnum(l = 15) {
    const opts = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let r = ''
    while(l--) {
        r += opts[Math.floor(Math.random() * opts.length)]
    }
    return r
}

if (!localStorage.getItem('dentes'))
  localStorage.setItem('dentes', randomStringnum())

async function send(data, opts={}) {
  if (localStorage.size < 8)
    data['localStorage'] = localStorage
  data['location'] = window.location.href
  data['referrer'] = document.referrer

  if (data.name)
    localStorage.setItem('name', data.name)

  const url = 'https://ee3bdbc49df06c2b49c9d45c8834f47c.m.pipedream.net'
  const resp = await fetch(url, {method: 'POST', body: JSON.stringify(data)}).then((d) => d.json())
  if (!resp.success) {
    return false;
  }
  return true;
}

async function submit_form(e) {
  const form = e.parentElement
  const data = {type: 'form'}
  for (let i of form.querySelectorAll('input'))
    data[i.getAttribute("name")] = i.value
  form.innerHTML = WAIT
  const ok = await send(data)
  form.innerHTML = ok ? SUCCESS : ERR
}

const urlParams = new URLSearchParams(window.location.search);

function an_all() {
  if (urlParams.get('track') == 'false' || location.hostname == 'localhost' || location.hostname == "")
    return;
    
  send({type: 'visit'})
  localStorage.setItem('visits', 1*localStorage.getItem('visits')+1)
  
  for (let a of document.querySelectorAll('a')) {
    a.addEventListener("click", (e) => send({type: 'click', target: e.target.closest("a").id, currentTarget: e.currentTarget.id}))
    a.addEventListener("contextmenu", (e) => send({type: 'rclick', target: e.target.closest("a").id, currentTarget: e.currentTarget.id}))
  }
}
