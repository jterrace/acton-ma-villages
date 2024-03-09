let map;
let featureLayer;
let actonCoordinates;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  actonCoordinates = new google.maps.LatLng(42.48417, -71.43950);

  map = new Map(document.getElementById("map-canvas"), {
    zoom: 13,
    mapId: "50fd7bf865e31480",
    center: actonCoordinates
  });

  featureLayer = map.getFeatureLayer("LOCALITY");

  showActonBoundary();

  showInnerVillages();
}

async function showActonBoundary() {
  const request = {
    textQuery: "Acton, MA",
    fields: ["id", "location"],
    includedType: "locality",
    locationBias: actonCoordinates,
  };
  const { Place } = await google.maps.importLibrary("places");
  const { places } = await Place.searchByText(request);

  if (places.length) {
    const place = places[0];

    styleBoundary(place.id);
    map.setCenter(place.location);
  }
}

function styleBoundary(placeid) {
  // Define a style of transparent purple with opaque stroke.
  const styleFill = {
    strokeColor: "#810FCB",
    strokeOpacity: 1.0,
    strokeWeight: 0.5,
    fillColor: "#FFFFE0",
    fillOpacity: 0.25,
  };

  // Define the feature style function.
  featureLayer.style = (params) => {
    if (params.feature.placeId == placeid) {
      return styleFill;
    }
  };
}

function showInnerVillages() {
  new google.maps.KmlLayer({
    url: "https://jterrace.github.io/acton-ma-villages/kml/South-Acton-Bounding.kml",
    preserveViewport: true,
    map: map,
  });

  new google.maps.KmlLayer({
    url: "https://jterrace.github.io/acton-ma-villages/kml/East-Acton-Bounding.kml",
    preserveViewport: true,
    map: map,
  });
}

initMap();
