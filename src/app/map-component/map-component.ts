import { Component, effect, inject, OnInit } from '@angular/core';
import { Feature, LngLat, LngLatLike, Map, StyleSpecification } from 'maplibre-gl';
import { GeoJsonImportFeature, Geoman, type GmOptionsPartial } from "@geoman-io/maplibre-geoman-free";
import 'maplibre-gl/dist/maplibre-gl.css';
import "@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css";
import { CartoApiService } from '../../services/cartoapi.service';
import { tap } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { MapService } from '../../services/map.service';
import { MapAction } from '../dto/mapAction.enum';
import { EnveloppeDto } from '../dto/enveloppe.dto';
import { DataFormatDto } from '../dto/dataFormat.dto';
import * as turf from '@turf/turf'
@Component({
  selector: 'app-map-component',
  imports: [],
  templateUrl: './map-component.html',
  styleUrl: './map-component.css',
})
export class MapComponent implements OnInit {
  tokenService = inject(TokenService);
  router = inject(Router)
  mapService = inject(MapService)
  cartoApi = inject(CartoApiService)
  map: Map | null = null;
  draw: any = null;
  enveloppe: string | object = '';
  geoman: Geoman | null = null;
  gmOptions: GmOptionsPartial = {
    controls: {
      draw: {
        polygon: {
          title: 'Draw a polygon',
          active: true
        },
        rectangle: {
          active: false
        },
        circle: {
          active: false
        }
      }
    }
  }

  constructor() {
    effect(() => {
      console.log("Received map action:", this.mapService.getAction());
      switch (this.mapService.getAction()) {
        case MapAction.GET_ENVELOPPE:
          this.getEnveloppeToMap();
          break;
        case MapAction.GET_POTENTIAL:
          this.getPotentielToMap();
          break;
        case MapAction.EDIT_ENVELOPPE:
          this.editEnveloppe();
          break;
        case MapAction.EDIT_POTENTIEL:
          this.editPotentiel();
          break;
        case MapAction.CANCEL_EDIT_ENVELOPPE:
          this.cancelEditEnveloppe();
          break;
        case MapAction.CANCEL_EDIT_POTENTIEL:
          this.cancelEditPotentiel();
          break;
        case MapAction.SAVE_ENVELOPPE:
          this.saveEnveloppe();
          break;
        case MapAction.SAVE_POTENTIEL:
          this.savePotentiel();
          break;
        case MapAction.REMOVE_ENVELOPPE:
          this.removeEnveloppeFromMap();
          break;
        case MapAction.REMOVE_POTENTIEL:
          this.removePotentielFromMap();
          break;
        // case MapAction.FLY_TO:
        //   this.flyToPoint();
        //   break
        default:
          console.warn("Unknown map action received: ", this.mapService.getAction())
      }
    })
    effect(() => {
      if (this.mapService.communeSaved()) {
        this.flyToPoint()
      }
    })
  }

  public mapLayers = [
    {
      name: 'osm-bright',
      label: "OSM Bright",
      url: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
    },
    {
      name: 'satellite',
      label: "Satellite",
      url: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: [
              // NOTE: Layers from Stadia Maps do not require an API key for localhost development or most production
              // web deployments. See https://docs.stadiamaps.com/authentication/ for details.
              'https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=ZPejd8sczutpcUGGjeNt',
            ],
            tileSize: 256,
            attribution:
              'Map tiles by <a target="_blank" href="https://stamen.com">Stamen Design</a>; Hosting by <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>. Data &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      }
    },
  ]

  ngOnInit(): void {
    this.map = new Map({
      container: 'map', // container id
      style: this.mapLayers[1].url as string | StyleSpecification, // style URL
      center: [0, 0], // starting position [lng, lat]
      zoom: 1 // starting zoom
    });

    this.map.flyTo({
      center: [2.3488, 46.1], // starting position [lng, lat]
      zoom: 5,
      curve: 1,
      speed: 1,
      essential: true
    })

    this.map.on('click', (e) => {
      console.log(`Clicked at ${e.lngLat}`);
    })
  }

  flyToPoint(): void {
    this.map?.flyTo({
      center: this.mapService.communeSaved()!.centre.coordinates as LngLatLike,
      zoom: 11,
      curve: 1,
      speed: 1
    })
  }

  getEnveloppeToMap(): void {
    if (this.map?.getLayer('enveloppe')) {
      this.map.addLayer({
        id: "enveloppe",
        type: 'line',
        source: 'enveloppe',
        paint: {
          'line-color': 'red',
          'line-width': 2
        }
      })
      return;
    }
    this.cartoApi.getEnveloppe().pipe(
      tap((data) => {
        if (data) {
          console.log("Adding source enveloppe to map", data)
          this.mapService.requestEnveloppe(true)
          this.enveloppe = data.data.features[0];
          this.map!.addSource('enveloppe', {
            type: 'geojson',
            data: data.data.features[0],
          })
          this.map!.addLayer({
            id: "enveloppe",
            type: 'line',
            source: 'enveloppe',
            paint: {
              'line-color': 'red',
              'line-width': 2
            }
          })
          const center = turf.centroid(data.data.features[0]).geometry.coordinates
          this.map!.flyTo({
            center: [center[0], center[1]], //[4.9010, 44.1169], // starting position [lng, lat]
            zoom: 12,
            curve: 1,
            speed: 1,
            essential: true
          })
        } else {
          this.mapService.requestAction(MapAction.NO_PROCESS_DATA)
          this.mapService.requestEnveloppe(false)
        }
      })).subscribe()
  }

  editEnveloppe(): void {
    this.geoman = new Geoman(this.map!, this.gmOptions)
    this.map?.on("gm:loaded", () => {
      console.log("Geoman loaded, adding controls")
      this.geoman!.features.importGeoJson(this.enveloppe as GeoJsonImportFeature)
      this.geoman!.options.disableMode('edit', 'polygon');
    })
  }

  saveEnveloppe(): void {
    const newEnveloppe = this.geoman?.features.exportGeoJson();
    this.removeEnveloppeFromMap();
    const newEnveloppeData : DataFormatDto = {
      type: "enveloppe",
      data: JSON.stringify(newEnveloppe!),
    }
    this.cartoApi.saveEnveloppe(newEnveloppeData).subscribe(
      (response) => {
        this.map!.addSource('enveloppe', {
          type: 'geojson',
          data: newEnveloppe!.features[0],
        })
        this.map!.addLayer({
          id: "enveloppe",
          type: 'line',
          source: 'enveloppe',
          paint: {
            'line-color': 'red',
            'line-width': 2
          }
        })
        this.geoman?.destroy();
        this.geoman = null;
      }
    )
  }

  cancelEditEnveloppe(): void {
    this.geoman?.destroy();
    this.geoman = null;
    this.removeEnveloppeFromMap();
    this.getEnveloppeToMap();
  }

  cancelEditPotentiel(): void {

  }

  savePotentiel(): void {
    const newPotentiel = this.geoman?.features.exportGeoJson();
    // Save to database 
    console.log("New potentiel to save:", newPotentiel);
  }

  getPotentielToMap(): void {

  }

  editPotentiel(): void {

  }

  removeEnveloppeFromMap(): void {
    this.map?.removeLayer('enveloppe');
    this.map?.removeSource('enveloppe');
  }

  removePotentielFromMap(): void {

  }
};

