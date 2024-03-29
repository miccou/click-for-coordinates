import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  faCopy,
  faTrashCan,
  faMap,
  faUpRightAndDownLeftFromCenter,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { SnackbarService } from './snackbar.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('textAreaJson') textAreaJson!: ElementRef;
  @ViewChild('textAreaCsv') textAreaCsv!: ElementRef;
  @ViewChild('resetButton') resetButton!: ElementRef;

  private map!: L.Map;

  faCopy = faCopy;
  faTrashCan = faTrashCan;
  faMap = faMap;
  faGithub = faGithub;

  coordinates: L.LatLng[] = [];
  markers: L.CircleMarker[] = [];
  line!: L.Polyline;
  coordinateOutputTypeForm: FormGroup;
  resetHtml!: string;
  resetStatus: 'none' | 'initial' | 'confirm' = 'none';
  resetTimeout!: any;

  constructor(
    fb: FormBuilder,
    private clipboard: Clipboard,
    private snackbar: SnackbarService
  ) {
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

  ngAfterViewInit(): void {
    this.map = L.map('map', this.options);

    this.map.on('click', (e) => {
      var newLatLng = L.latLng(
        parseFloat(e.latlng.lat.toFixed(6)),
        parseFloat(e.latlng.lng.toFixed(6)) % 360
      );
      var newMarker = L.circleMarker(newLatLng, {
        radius: 3,
        color: '#3F83F8',
        fillColor: '#3F83F8',
        fillOpacity: 100,
      });
      newMarker.addEventListener('click', (e) => {
        console.log(e);
        this.coordinates = this.coordinates.filter((c) => c !== newLatLng);
        this.markers = this.markers.filter((m) => m !== newMarker);
        this.map.removeLayer(newMarker);
        this.map.removeLayer(this.line);
        this.line = L.polyline(this.coordinates, { color: '#c084fc' }); //purple-500
        this.line.options.className = 'pointer';
        this.line.options.pane = 'overlayPane';
        this.line.addTo(this.map);
      });
      newMarker.bindTooltip('Remove');
      newMarker.options.className = 'pointer';
      newMarker.options.pane = 'markerPane';
      this.markers.push(newMarker.addTo(this.map));
      this.coordinates.push(newLatLng);

      if (this.coordinates.length === 1) {
        this.line = L.polyline(this.coordinates, { color: '#c084fc' }); //purple-500
        this.line.options.className = 'cursor-grab';
        this.line.options.pane = 'overlayPane';
        this.line.addTo(this.map);
      } else {
        this.map.removeLayer(this.line);
        this.line.addLatLng(newLatLng);
        this.line.options.className = 'cursor-grab';
        this.line.options.pane = 'overlayPane';
        this.line.addTo(this.map);
      }
    });
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
      .replaceAll('}', '');
  }

  copyToClipboard() {
    if (this.coordinateOutputType() === 'json') {
      this.clipboard.copy(this.textAreaJson.nativeElement.innerHTML);
    } else if (this.coordinateOutputType() === 'csv') {
      this.clipboard.copy(this.textAreaCsv.nativeElement.innerHTML);
    } else {
      throw 'invalid format exception';
    }
    this.snackbar.show('Copied to clipboard', 'success');
  }

  reset() {
    if (this.resetStatus === 'none') {
      this.resetStatus = 'initial';
      this.resetHtml = this.resetButton.nativeElement.innerHTML;
      this.resetButton.nativeElement.innerHTML =
        'Really?&nbsp;&nbsp;<fa-icon [icon]="faTrashCan"></fa-icon>';
      this.resetTimeout = setTimeout(() => {
        this.resetButton.nativeElement.innerHTML = this.resetHtml;
        this.resetStatus = 'none';
      }, 3000);
    } else {
      this.resetStatus = 'none';
      clearTimeout(this.resetTimeout);
      this.resetButton.nativeElement.innerHTML = this.resetHtml;
      this.resetHtml = '';
      this.coordinates = [];
      this.markers.forEach((m) => m.removeFrom(this.map));
      this.line.removeFrom(this.map);
    }
  }
}
