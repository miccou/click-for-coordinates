import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
  title = 'click-for-coordinates';

  private map: L.Map = L.map('map');

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
