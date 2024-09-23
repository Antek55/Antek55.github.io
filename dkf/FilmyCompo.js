const FilmyCompo = {
  template: `<table>
    <tr>
      <th en="Film title">Tytuł filmu</th>
      <th class="directors" en="Directors">Reżyseria</th>
      <th class="trailer" en="Trailer">Zwiastun</th>
      <th  class="imdb"><a href="https://www.imdb.com" target="_blank"><img src="https://m.media-amazon.com/images/G/01/imdb/images-ANDW73HA/favicon_desktop_32x32._CB1582158068_.png" title="IMDb"></th>
      <th class="rym"><a href="https://rateyourmusic.com/" target="_blank"><img src="https://e.snmc.io/3.0/img/logo/cinemos-512.png" width="32px" title="Rate Your Music"></a></th>
      <th en="Positive">Głos dodatni</th>
      <th en="Negative">Głos ujemny</th>
      <th en="Won't come">Nie przyjdę</th>
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
      <td><input type="checkbox" v-model="f.g"></td>
      <td><input type="checkbox" v-model="f.w"></td>
      <td><input type="checkbox" v-model="f.np"></td>
    </tr>
    
  </table>`,
  // data() {
  //   return {
  //     g: {},
  //     w: {},
  //     np: {}
  //   }
  // },
  props: {field: {}},
  delimiters: ['[[', ']]'],
  methods: {
    // max2: function() {return _.filter(Object.entries(this.g), ([a,b]) => b ).map(p => p[0]).length > 2},
    max2() {return false},
    // max1neg: function() {return _.filter(Object.entries(this.w), ([a,b]) => b ).map(p => p[0]).length > 1},
    max1neg() {return false;},
    styling: function(key, isDocu) {
      // if (this.w[key]) {
      //   return 'background-color: red; text-decoration: line-through'
      // }
      // if (this.g[key] && !this.max2()) {
      //   return 'background-color: darkgreen';
      // }
      // if(isDocu) {
      //   return "background-color: #5b400d;"
      // }
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
  },
  created() {
    for (let f of this.field.filmy) {
      f.g = false;
      f.w = false;
      f.np = false;
    }
  },
  mounted() {
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
      })
  }
}