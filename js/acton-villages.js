let map;
let featureLayer;
let actonCoordinates;
let infoboxLabel;

function initMap() {
  actonCoordinates = new google.maps.LatLng(42.48417, -71.43950);

  map = new google.maps.Map(document.getElementById("map-canvas"), {
    zoom: 13,
    mapId: "50fd7bf865e31480",
    center: actonCoordinates
  });

  featureLayer = map.getFeatureLayer("LOCALITY");

  showActonBoundary();

  initInfoBox();

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
    strokeColor: "#333333",
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

function initInfoBox() {
  infoboxLabel = new InfoBox({
    content: '',
    boxStyle: {
      border: '1px solid black',
      textAlign: 'center',
      fontSize: '8pt',
      backgroundColor: '#F8F8F8',
      padding: '4',
    },
    disableAutoPan: true,
    position: actonCoordinates,
    closeBoxURL: "",
    isHidden: false,
    pane: "floatPane",
    enableEventPropagation: true
  });
}

function showInnerVillages() {
  var kml_parser = new geoXML3.parser({
    map: map,
    processStyles: true,
    singleInfoWindow: true,
    suppressInfoWindows: true,
    afterParse: loadKml,
    zoom: false
  });
  kml_parser.parse("kml/East-Acton-Bounding.kml");
  kml_parser.parse("kml/South-Acton-Bounding.kml");
}

function loadKml(doc) {
  for (var i = 0; i < doc[0].placemarks.length; i++) {
    var placemark = doc[0].placemarks[i];
    polygonMouseover(placemark);
  }
}

function polygonMouseover(placemark) {
  var poly = placemark.polygon;
  poly.setOptions({
    strokeColor: '#3366CC',
    strokeWeight: 2,
  });

  var box = document.createElement('div');
  box.textContent = placemark.name;
  box.style.cssText = 'border: 1px solid #333333; margin: 0; padding: 4px;';

  google.maps.event.addListener(poly, 'mouseover', function (evt) {
    poly.setOptions({
      fillColor: '#99CCFF',
      fillOpacity: 0.5,
      padding: 0
    });
    infoboxLabel.setContent(box);
    infoboxLabel.setPosition(evt.latLng);
    infoboxLabel.open(map);
  });

  google.maps.event.addListener(poly, 'mouseout', function (evt) {
    poly.setOptions({
      fillColor: '#ffffff',
      fillOpacity: 0
    });
    infoboxLabel.close();
  });
}

window.addEventListener('load', initMap);
