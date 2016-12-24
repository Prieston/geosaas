
function initMap(){
      var styles = [
        'Road',
        'Aerial',
        'AerialWithLabels',
        'collinsBart',
        'ordnanceSurvey'
      ];
      ollayers = {}
      var layers = [];
      var i, ii;
      for (i = 0, ii = styles.length; i < ii; ++i) {
        layers.push(new ol.layer.Tile({
          visible: false,
          preload: Infinity,
          source: new ol.source.BingMaps({
            key: 'a1dZTSDUa8gdrk24bTNX~4SyceOQSo191nPjArv-1sQ~ApdOyKQNMYQ9_5uTFaoLrZKHthJmlqjO-NTCLNaOUovhYRlLmp9qMA6B5HsGaLz9',
            imagerySet: styles[i]
            // use maxZoom 19 to see stretched tiles instead of the BingMaps
            // "no photos at this zoom level" tiles
            // maxZoom: 19
          })
        }));
      }
       map = new ol.Map({
        layers: layers,
        // Improve user experience by loading tiles while dragging/zooming. Will make
        // zooming choppy on mobile or slow devices.
        loadTilesWhileInteracting: true,
        target: 'map',
        view: new ol.View({
          center: [-6655.5402445057125, 6709968.258934638],
          zoom: 13
        })
      });

      var select = document.getElementById('ol_basemap');
      function onChange() {
        var style = select.value;
        for (var i = 0, ii = layers.length; i < ii; ++i) {
          layers[i].setVisible(styles[i] === style);
        }
      }
      select.addEventListener('change', onChange);
      onChange();


  
};