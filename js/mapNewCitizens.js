// mapNewCitizens JavaScript source code

    var map = L.map('map', {
        scrollWheelZoom: false,
        worldCopyJump: true,
    }).setView([37.8, -96], 3);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    minZoom: 2,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibnNhbmluIiwiYSI6ImNpdmxwYzd1cjBjcmEyeXAzeTU5ZG0wMjkifQ.SVD3HiqEGThW6_V_mYzfRw'
}).addTo(map);


var markerIcon = L.icon({
    iconUrl: 'images/marker.png',

    iconSize: [20, 30],
});



function style(feature) {
    return {
        fillColor: '#FFA500',
        weight: 2,
        opacity: 1,
        color: 'BEIGE',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

L.geoJson(statesData, { style: style }).addTo(map);


function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#fff',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);

}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}


function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};


//hover info function
info.update = function (props) {
    this._div.innerHTML = '<h4>US Naturalizations</h4>' + (props ?
        '<h3><center>' + props.state + '</center></h3><p class="popup">' + props.numberCitizens + ' new citizens ' : 'Hover over a state</p>');
};


info.addTo(map);


var markers = new L.layerGroup();


function populate() {
    for (var i = 0; i < cities.length; ++i) {
        var marker = L.marker([cities[i].lat, cities[i].lng], { icon: markerIcon })
        .bindPopup('<h3><center>' + cities[i].city + '</center></h3><br>' + cities[i].numberCitizens + ' citizens<br>').addTo(map);
        markers.addLayer(marker);
    }
    return false;
}


function addMarkers() {
    map.addLayer(markers);
    populate();
}
function removeMarkers() {
    map.removeLayer(markers);
}


map.on('zoomend', function () {
    if (map.getZoom() >= 6 && map.hasLayer(markers) == false) {
        addMarkers();
    } else if (map.getZoom() < 6 && map.hasLayer(markers)) {
        removeMarkers();
    }
});

