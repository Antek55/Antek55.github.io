const MapCompo = {
  template: `<div>
<div class="map" style="height: 72vh"></div>
<p class="dist" v-if="length"></p>
<p class="date"></p>
<button @click="fullscreen">Pełen ekran</button>
<a :href="gpxs[0]" target="_blank" id="gpx_button" v-if="gpxs?.length == 1"><button>Pobierz plik gpx</button></a>
<a :href="geojsons[0]" target="_blank" id="geojson_button" v-if="geojsons?.length == 1"><button>Pobierz plik geojson</button></a>
<!--<button @click="pinezka">Udostępnij pinezkę</button>-->
</div>`,
  // props: ['gpxs', 'geojsons', 'length'],
  props: {
    gpxs: {},
    geojsons: {},
    length: {default: true}
  },
  methods: {
    bounds_push(bound) {
      this.bounds.push(bound)
      //  layer_no++
      if (this.bounds.length == this.layers_total) {
        let b = this.bounds[0]
        for (let i = 1; i < this.layers_total; i++)
          b.extend(this.bounds[i])
        this.mymap.fitBounds(b);
      }
    },
    fullscreen() {
      this.mapdiv.requestFullscreen()
    },
    pinezka() {
      $("#pinezka_help").show()
      const mymap = this.mymap
      mymap.on('click', function(event) {
        L.marker(event.latlng).addTo(mymap);
        document.querySelector('#dialogUrl').innerHTML = location.toString().split('*')[0]+`*${event.latlng.lat},${event.latlng.lng}`; document.querySelector('dialog').showModal();
        mymap.off('click')
        $("#pinezka_help").hide()
      })
    },
    gstreetview(event) {
        const url = `https://www.gps-coordinates.net/street-view/@${event.latlng.lat},${event.latlng.lng},h170,p-3,z1`
        window.open(url, '_blank')
    },
    gmaps(event) {
        window.open(`https://www.google.com/maps/@${event.latlng.lat},${event.latlng.lng},136m/data=!3m1!1e3?entry=ttu/`, '_blank')
      }
  },
  mounted() {
    console.log(this)
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
      maxNativeZoom: 19,
      maxZoom: 21
    })
    const geoportal = L.tileLayer.wms('https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution', {layers:   'Raster', maxZoom: 21, attribution: '<a href="https://www.geoportal.gov.pl/">Geoportal</a>'})
    const geoportalHighRes = L.tileLayer.wms('https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution', {layers: 'Raster', maxZoom: 21, attribution: '<a href="https://www.geoportal.gov.pl/">Geoportal</a>'})
    const OpenTopoMap = L.tileLayer("https://a.tile.opentopomap.org/{z}/{x}/{y}.png")
    const bdot500 = L.tileLayer.wms('https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaBazDanychObiektowTopograficznych', {layers: 'BDOT', maxZoom: 21, minZoom: 16})

    const baseMaps = {
      "OpenStreetMap": osm,
      "Geoportal Orthofotomapa Standard Resolution": geoportal,
      "Geoportal Orthofotomapa High Resolution": geoportalHighRes,
      OpenTopoMap,
      bdot500,
    }
    const el = this.$el
    const comp = this
    this.mapdiv = this.$el.querySelector('.map')
    const mymap = L.map(this.mapdiv, {
      center: [51.4322845, 15.6538632],
      zoom: 10,
      layers: [osm],
      measureControl: true,
    })
    L.control.layers(baseMaps, {}).addTo(mymap)
    mymap.on('contextmenu', this.gstreetview)
    this.mymap = mymap
    this.baseMaps = baseMaps
    this.bounds = []
    let layer_no = 0
    this.layers_total = (this.gpxs?.length || 0) + (this.geojsons?.length || 0)
    let len = 0

    for (let fn of this.gpxs || []) {
      new L.GPX(fn, {
        async: true,
        marker_options: {startIconUrl: null, endIconUrl: null}
      }).on('loaded', function(e) {
        comp.bounds_push(e.target.getBounds())
        len += e.target.get_distance()/1000
        if (comp.length)
          el.querySelector(".dist").innerHTML = "Łączna długość: " + len.toFixed(2) + " km"
        if (e.target.get_start_time() > new Date(2020, 1, 1)) {
          let st = dayjs(e.target.get_start_time())
          dayjs.locale('pl')
          el.querySelector(".date").innerHTML = `W dniu ${st.format('D MMMM YYYY')}. Średnia prędkość: ${e.target.get_total_speed().toFixed(2)} km/h (maks. ${e.target.get_speed_max().toFixed(2)} km/h). Czas trwania ${e.target.get_duration_string_iso(e.target.get_total_time())}`
        }
      }).addTo(mymap)
    }

    for (let fn of this.geojsons || []) {
      fetch(fn).then(t => t.json()).then(t => L.geoJSON(t, {
        style(feature) {
          return feature?.properties?.style || {}
        },
        onEachFeature(feature, layer) {
          comp.bounds_push(layer.getBounds())
          if (feature?.properties?.name)
            layer.bindPopup(feature.properties.name)
        }
      }).on('add', function (e) {mymap.fitBounds(e.target.getBounds())}).addTo(mymap))
    }
  }
}
