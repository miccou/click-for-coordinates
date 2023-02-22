import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  private map!: L.Map;

  coordinates: L.LatLng[] = [];

  coordinateOutputTypeForm: FormGroup;
  constructor(fb: FormBuilder) {
    this.coordinateOutputTypeForm = fb.group({
      format: ['json', Validators.required]
    });
  }

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 5,
    center: { lat: -35.307841, lng: 149.12447 }
  }

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
      .replaceAll('}', '')
      ;
  }



  ngAfterViewInit(): void {
    this.map = L.map('map', this.options);

    this.map.on("click", e => {
      var newLatLng = L.latLng(parseFloat(e.latlng.lat.toFixed(6)), parseFloat(e.latlng.lng.toFixed(6)) % 360);
      console.log(newLatLng); // get the coordinates
      var newMarker = L.circleMarker(newLatLng, { radius: 3 }).addTo(this.map);
      this.coordinates.push(newLatLng);
    });
  }
}
