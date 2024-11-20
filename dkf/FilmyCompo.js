const FilmyCompo = {
  template: `<div><div v-html="LANG == 'en' ? opis_en : opis"></div>
  <table>
    <tr>
      <th en="Title">Tytuł filmu</th>
      <th class="directors" en="Directors">Reżyseria</th>
      <th class="trailer" en="Trailer">Zwiastun</th>
      <th  class="imdb"><a href="https://www.imdb.com" target="_blank"><img src="https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_desktop_32x32._CB1582158068_.png" title="IMDb"></th>
      <th class="rym"><a href="https://rateyourmusic.com/" target="_blank"><img src="https://e.snmc.io/3.0/img/logo/cinemos-512.png" width="32px" title="Rate Your Music"></a></th>
      <th en="Ordering">Kolejność</th>
      <th en="Next">Nast.</th>
      <th en="Up">Do góry</th>
      <th en="Down">W dół</th>
      <th v-if="field.is_np" en="Won't come">Nie przyjdę</th>
    </tr>
    
    <tr v-for="f in field.filmy" :style="styling(f.title, f.isDocu)">
      <td :id="f.imdbId" class="title">
        <span>
          <img v-for="fl in f.flag" :src="flags[fl.toLowerCase()]" :title="country_codes[fl]" class="smallflag">
        </span>
        <span v-if="f.originalTitle && f.originalTitle != f.titleLocal"><b>[[f.originalTitle]]</b> (<i>[[f.titleLocal]]</i>)</span>
        <span v-else-if="f.originalTitle"><b>[[f.originalTitle]]</b></span>
        <span v-else-if="f.title != f.titleLocal"><b>[[f.title]]</b> (<i>[[f.titleLocal]]</i>)</span>
        <span v-else><b>[[f.title]]</b></span> ([[f.year]])
        
        <a :href="f.url + '/parentalguide#advisory-violence'" v-if="f.warning1" target="_blank" style="float:right; text-decoration: none">⚠️</a>
        <a :href="f.url + '/parentalguide#advisory-frightening'" v-if="f.warning2" target="_blank" target="_blank" style="float:right; text-decoration: none">⚠️</a>
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/62/Info_black.png" style="margin: 0px; height: 30px; float:right" v-if="f.info" v-on:click="alert(f.info)" :id="f.imdbId + '-info'">
        
      </td>
      <td class="directors">
        <span :id="f.imdbId + '-director'" v-on:click="window.open('https://en.wikipedia.org/wiki/' + f.directors)">
          <span v-for="d in f.directors">[[d]] </span>
        </span>
      </td>
      <td class="trailer">
            <span class="playicon" v-if="f.yttrailer.videoId" v-on:click='trailer(f.yttrailer.videoId, $event)'>
              <img width="32px" src="https://upload.wikimedia.org/wikipedia/commons/a/ad/Play_rood.png">
            </span>
      </td>
      <td class="imdb"><a :href="f.url" target="_blank">[[f.imdbRating]]</td>
      <td class="rym"><a :href="f.rymUrl" target="_blank">[[f.rymRating]]</a></td>
      <!--<td><input type="number" v-model="con[f.title]"></td>-->
      <td><b v-html="con[f.title] ? con[f.title] : '∞'" /></td>
      <td><button v-if="Object.values(con).includes(0)" @click.prevent="nxt(f.title)">Nast.</button></td>
      <td><button v-if="con[f.title] && con[f.title] != 1" @click.prevent="up(f.title)">⬆️</button></td>
      <td><button v-if="con[f.title] && con[f.title] != Object.keys(con).length" @click.prevent="down(f.title)">⬇️</button></td>
      <td v-if="field.is_np"><input type="checkbox" v-model="np[f.title]"></td>
    </tr>
  </table>
  <button id="zeruj" @click.prevent="zeruj">Zeruj wszystkie wybory</button></div>`,
  data() {
    let con = {}
    let np = {}
    let i = 1
    for (let f of this.field.filmy) {
      con[f.title] = 0
      np[f.title] = false
    }
    return {
      con,
      np,
      opis: 'Uporządkuj zaproponowane filmy w kolejności chęci obejrzenia, lub ich część – pozostawienie <b>∞</b> oznacza niezróżnicowaną niechęć. Przycisk "Nast." przydzieli filmowi kolejne miejsce. Możesz wprowadzić zmiany strzałkami lub zerując wybory przyciskiem na dole i zaczynając od nowa. <span v-if="field.is_np"> Zaznaczenie "Nie przyjdę jeśli zwycięży" nie ma wpływu na wynik głosowania, ale jest dla nas cenną informacją przy planowaniu terminu spotkania.</span> Nie ma restrykcji co do głosowania na filmy nominowane przez siebie.',
      opis_en: 'Please put the proposed films in order of your preference, all or a part of them – leaving <b>∞</b> means undifferentiated unwillingness. The button "Nast." will assign the next unassigned number to the film. You can change the order using arrows or clearing all choices using the button below and starting over. <span v-if="field.is_np">Choosing "Won\' come if selected" has no influence on the result of the vote, but is very useful to us for scheduling. There are no restrictions on voting for films nominated by yourself.</span>'
    }
  },
  props: {field: {}},
  delimiters: ['[[', ']]'],
  methods: {
    styling: function(key, isDocu) {
      if (this.np[key]) {
        return 'background-color: red; text-decoration: line-through'
      }
      
      if (this.con[key] == 1)
          return 'background-color: lime'
      if (this.con[key] != 0) {
        if (this.con[key] > this.field.filmy.length/2)
          return `background-color: ${gradient('#D3D3D3', '#A9A9A9', 2*this.con[key]/this.field.filmy.length - 1)}`
        return `background-color: ${gradient('#00ff00', '#ffff00', this.con[key]/this.field.filmy.length*2)}`
      }
      
      if(isDocu)
        return "background-color: #5b400d;"
        
      return ''
    },
    trailer: function(code, event) {
      // $(".player").html("")
      var iframe = '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + code + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
      
      $(".playicon").find("iframe").remove()
      $(".playicon").find("img").show()
      
      var span = $(event.target).parent()
      $(span).find("img").hide()
      $(span).append(iframe)
    },
    nxt(title) {
      this.con[title] = Math.max.apply(null, Object.values(this.con)) + 1
    },
    up(title) {
      if (this.con[title] == 1)
        return
      this.con[title]--
      for (let k of Object.keys(this.con)) {
        if (this.con[k] == this.con[title] && k != title)
          this.con[k]++;
      }
    },
    down(title) {
      if (this.con[title] == Math.max.apply(null, Object.values(this.con))) {
        this.con[title] = 0
        return
      }
      this.con[title]++
      for (let k of Object.keys(this.con)) {
        if (this.con[k] == this.con[title] && k != title)
          this.con[k]--;
      }
    },
    zeruj() {
      for (let k of Object.keys(this.con)) {
        this.con[k] = 0;
      }
    }
  },
  watch: {
    con: {
      handler(old, neww) {        
        // function comp(a, b) {
        //   if (neww[a.title] == 0)
        //     return true
        //   if (neww[b.title] == 0)
        //     return false
        // 
        //   return neww[a.title] > neww[b.title]
        // }
        // this.field.filmy.sort(comp)
        // let i = 1
        // for (let k of this.field.filmy) {
        //   if (this.con[k.title] != 0)
        //     this.con[k.title] = i++
        // }
        for (let k of this.field.filmy) {
          while(!Object.values(neww).includes(neww[k.title]-1) && neww[k.title] > 1)
            neww[k.title]--
        }
        this.field.con = neww
      },
      deep: true
    },
    np: {
      handler(old, neww) {
        this.field.np = neww
      },
      deep: true
    }
  },
  created() {
  },
  mounted() {
    if (location.hostname == 'localhost' && this.field.filmy.length > 12)
      ;// alert('Wiele filmów: ' + this.field.filmy.length)
    
    const filmy = this.field.filmy
    tippy('.title', {
      allowHTML: true, 
      animation: "shift-away-extreme",
      followCursor: "horizontal",
      placement: "right",
      onShow(instance) {
        // let img = instance.reference.id
        let img = filmy.filter((i) => i.imdbId == instance.reference.id)[0].rymCoverartImg
        instance.setContent('<img class="tippy-poster" src="' + img + '" style="width: 300px">')
      }
    })
    
    /*
    this.field.filmy.forEach((k) => { 
      tippy('#' + k.imdbId, {
        content: '<img class="tippy-poster" src="' + k.rymCoverartImg + '" style="width: 300px">',
        animation: "shift-away-extreme",
        allowHTML: true,
        followCursor: "horizontal", 
        placement: 'right',
        });
      
      if (k.info) 
          tippy('#' + k.imdbId + '-info', {
            content: k.info,
            animation: "shift-away-extreme",
            followCursor: "horizontal",
            // placement: 'bottom',
          });
      
      if (k['popup-director'])
        tippy('#' + k.imdbId + '-director', {
          content: k['popup-director'],
          animation: "shift-away-extreme",
          allowHTML: true,
          followCursor: "horizontal",
          placement: 'left-start'
        });
      })*/
    
    if (LANG == "en")
      for (let e of this.$el.querySelectorAll("[en]")) {
        e.innerHTML = e.getAttribute("en")
      }
  }
}