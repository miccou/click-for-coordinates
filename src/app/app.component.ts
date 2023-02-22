import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  private map!: L.Map;

  coordinates: L.LatLng[] = [];
  line!: L.Polyline;

  coordinateOutputTypeForm: FormGroup;
  constructor(fb: FormBuilder) {
    this.coordinateOutputTypeForm = fb.group({
      format: ['json', Validators.required],
    });
  }

  options = {
    layers: [
      L.tileLayer(
        'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 20,
          attribution:
            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        }
      ),
    ],
    zoom: 5,
    center: { lat: -35.307841, lng: 149.12447 },
    zoomControl: false,
    doubleClickZoom: false,
  };

  coordinateOutputType() {
    return this.coordinateOutputTypeForm.get('format')?.value;
  }

  coordinatesJson() {
    return JSON.stringify(this.coordinates);
  }

  coordinatesCsv() {
    return this.coordinatesJson()
      .replaceAll(/((\[)|(\])|(\")|(\{)|(\:)|(lat)|(lng))+/g, '')
      .replaceAll('},', '\n')
      .replaceAll('}', '');
  }

  ngAfterViewInit(): void {
    this.map = L.map('map', this.options);

    this.map.on('click', (e) => {
      var newLatLng = L.latLng(
        parseFloat(e.latlng.lat.toFixed(6)),
        parseFloat(e.latlng.lng.toFixed(6)) % 360
      );
      console.log(newLatLng); // get the coordinates
      var newMarker = L.circleMarker(newLatLng, {
        radius: 3,
        color: '#3F83F8',
        fillColor: '#3F83F8',
        fillOpacity: 100,
      });
      newMarker.options.className = '!cursor-grab';
      newMarker.addTo(this.map);
      this.coordinates.push(newLatLng);

      if (this.coordinates.length === 1) {
        this.line = L.polyline(this.coordinates, { color: '#c084fc' }); //purple-500
        this.line.options.className = '!cursor-grab';
        this.line.addTo(this.map);
      } else {
        this.map.removeLayer(this.line);
        this.line.addLatLng(newLatLng);
        this.line.addTo(this.map);
      }
    });
  }
}
