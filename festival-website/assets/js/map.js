let map = L.map('map').setView([41.5912, 1.5209], 7);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

import comarquesGeo from '../data/comarques.geojson';
import municipisGeo from '../data/municipis.geojson';

function styleByFilter(type) {
  return { color: type=='all'? '#3388ff' : colors[type] };
}

// Càrrega GeoJSON comarcal
L.geoJSON(comarquesGeo, { style: feature => styleByFilter(currentFilter), onEachFeature: (f, layer) => {
    layer.on('click', () => zoomComarca(f, layer));
}}).addTo(map);

// Zoom a comarca i mostrar municipis
function zoomComarca(f, layer) {
  map.fitBounds(layer.getBounds());
  document.getElementById('zoom-out-btn').style.display = 'block';
  L.geoJSON(municipisGeo, {
    filter: m => m.properties.comarca === f.properties.name,
    onEachFeature: (m, ml) => { ml.on('click', () => showMunicipi(m.properties.name)); }
  }).addTo(map);
}
