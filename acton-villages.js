let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  const acton = new google.maps.LatLng(42.48417, -71.43950);

  map = new Map(document.getElementById("map-canvas"), {
    zoom: 13,
    center: acton
  });

  const southActonLayer = new google.maps.KmlLayer({
    url: "https://jterrace.github.io/acton-ma-villages/kml/South-Acton-Bounding.kml",
    preserveViewport: true,
    map: map,
  });
}

initMap();
