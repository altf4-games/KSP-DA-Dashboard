function IncidentDetailsMarkersManager(e, t) {
  (this.incidentMarkers = {}),
    (this.map = e),
    (this.incidentMarkerFactory = t),
    (this.addMarkers = this.addMarkers.bind(this)),
    (this._addMarker = this._addMarker.bind(this)),
    (this._mapResponseToFeaturesDictionary =
      this._mapResponseToFeaturesDictionary.bind(this)),
    (this.getMarkers = this.getMarkers.bind(this));
}
function IncidentsDetailsManager(e, t, n) {
  (this.map = e),
    (this.services = t),
    (this.options = n),
    (this.onDetailsUpdated = this.options.onDetailsUpdated),
    (this.incidentsMarkerManager = new IncidentDetailsMarkersManager(
      e,
      n.incidentMarkerFactory
    )),
    (this._fetchIncidentDetails = this._fetchIncidentDetails.bind(this)),
    (this._registerEvents = this._registerEvents.bind(this)),
    (this._updateIncidentMarkers = this._updateIncidentMarkers.bind(this)),
    this._updateIncidentMarkers(),
    this._registerEvents();
}
(IncidentDetailsMarkersManager.prototype.addMarkers = function (e) {
  var t = this._mapResponseToFeaturesDictionary(e);
  Object.keys(this.incidentMarkers).forEach(
    function (e) {
      t[e]
        ? (this.incidentMarkers[e].update(t[e]), delete t[e])
        : (this.incidentMarkers[e].getMarker().remove(),
          delete this.incidentMarkers[e]);
    }.bind(this)
  ),
    Object.values(t).forEach(
      function (e) {
        this._addMarker(e);
      }.bind(this)
    );
}),
  (IncidentDetailsMarkersManager.prototype._addMarker = function (e) {
    var t = e.properties.id,
      n = this.incidentMarkerFactory();
    n.markerFactory(e),
      (this.incidentMarkers[t] = n),
      n.getMarker().addTo(this.map);
  }),
  (IncidentDetailsMarkersManager.prototype._mapResponseToFeaturesDictionary =
    function (e) {
      return e.incidents.reduce(function (e, t) {
        var n = {};
        return (
          (t.geometry.type = "Point"),
          (t.geometry.coordinates = t.geometry.coordinates[0]),
          (n[t.properties.id] = t),
          Object.assign(e, n)
        );
      }, Object.create(null));
    }),
  (IncidentDetailsMarkersManager.prototype.getMarkers = function () {
    var e = {};
    return (
      Object.keys(this.incidentMarkers).forEach(
        function (t) {
          e[t] = this.incidentMarkers[t].getMarker();
        }.bind(this)
      ),
      e
    );
  }),
  (IncidentsDetailsManager.prototype._fetchIncidentDetails = function () {
    var e = {
      key: this.options.key,
      boundingBox: this.map.getBounds(),
      fields:
        "{\n            incidents {\n                type,\n                geometry {\n                    type,\n                    coordinates\n                },\n                properties {\n                    id,\n                    iconCategory,\n                    magnitudeOfDelay,\n                    events {\n                        description,\n                        code,\n                        iconCategory\n                    },\n                    startTime,\n                    endTime,\n                    from,\n                    to,\n                    length,\n                    delay,\n                    roadNumbers,\n                    aci {\n                        probabilityOfOccurrence,\n                        numberOfReports,\n                        lastReportTime\n                    }\n                }\n            }\n        }",
    };
    return this.services.incidentDetailsV5(e);
  }),
  (IncidentsDetailsManager.prototype._registerEvents = function () {
    var e = window.debounce(
      function (e) {
        "vectorTilesIncidents" === e.sourceId && this._updateIncidentMarkers();
      }.bind(this),
      500
    );
    this.map.on("sourcedata", e),
      this.map.on("moveend", this._updateIncidentMarkers),
      this.map.on("zoomend", this._updateIncidentMarkers);
  }),
  (IncidentsDetailsManager.prototype._updateIncidentMarkers = function () {
    this.map.getZoom() > 9 &&
      this._fetchIncidentDetails().then(
        function (e) {
          this.incidentsMarkerManager.addMarkers(e),
            this.onDetailsUpdated({
              trafficIncidents: e,
              markers: this.incidentsMarkerManager.getMarkers(),
            });
        }.bind(this)
      );
  }),
  (window.IncidentsDetailsManager =
    window.IncidentsDetailsManager || IncidentsDetailsManager);
