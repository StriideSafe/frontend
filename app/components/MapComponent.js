// "use client"

import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

export const MapComponent = (
    {
        fastRoute,
        safeRoute,
        startLong,
        startLat,
        endLong,
        endLat,
        streetLightCoords,
        crimeCoords
    }) => {

    const [centerLong, setCenterLong] = useState(-71.1040018);
    const [centerLat, setCenterLat] = useState(42.3655767);

    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

        if (startLong && startLat && endLong && endLat) {
            setCenterLong((startLong + endLong) / 2);
            setCenterLat((startLat + endLat) / 2);
        } else if (startLong && startLat) {
            setCenterLong(startLong);
            setCenterLat(startLat);
        }


        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/dark-v11',
            center: [centerLong, centerLat], // starting position
            zoom: 12
        });

        const fastGeoJson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: fastRoute
            }
        };

        const safeGeoJson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: safeRoute
            }
        };



        console.log("geojson", fastGeoJson);

        // if the route already exists on the map, we'll reset it using setData
        map.on('load', function () {
            console.log("map loaded")


            // if the route already exists on the map, we'll reset it using setData

            if (fastRoute && map.getSource('fastRoute')) {
                console.log("route exists")
                map.getSource('fastRoute').setData(fastGeoJson);
            }
            // otherwise, we'll make a new request
            else {
                map.addLayer({
                    id: 'fastRoute',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: fastGeoJson
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#8B0000',
                        'line-width': 10,
                        'line-opacity': 0.75
                    }
                });
            }


            if (safeRoute && map.getSource('safeRoute')) {
                console.log("route exists")
                map.getSource('safeRoute').setData(safeGeoJson);
            }
            // otherwise, we'll make a new request
            else {
                map.addLayer({
                    id: 'safeRoute',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: safeGeoJson
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#bf00ff',
                        'line-width': 10,
                        'line-opacity': 1
                    }
                });
            }


            // 'cluster' option to true.
            map.addSource('streetLights', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: streetLightCoords.map((coord) => ({
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: coord
                        }
                    }))
                },
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });

            map.addLayer({
                id: 'streetLights',
                type: 'circle',
                source: 'streetLights',
                paint: {
                    'circle-color': '#ffff00', // yellow color
                    'circle-radius': 5,
                    'circle-blur': 0.5
                }
            });

            map.addSource('crimeData', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': crimeCoords.map(coord => ({
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Point',
                            'coordinates': coord
                        }
                    }))
                }
            });

            map.addLayer({
                id: 'crimeData',
                type: 'circle',
                source: 'crimeData',
                paint: {
                    'circle-color': '#FF0000', // red color
                    'circle-radius': ['interpolate', ['linear'], ['zoom'], 0, 10, 20, 10],
                    'circle-blur': 0.5
                }
            });

            let toggle = true;

            setInterval(() => {
                map.setPaintProperty('crimeData', 'circle-color', toggle ? '#FF0000' : '#FFC0CB'); // red and pink
                map.setPaintProperty('crimeData', 'circle-blur', toggle ? 0 : 1); // toggle blur
                toggle = !toggle;
            }, 1000); // change every second


        });
        // add turn instructions here at the end


        // set the bounds of the map
        // const bounds = [
        //     [-123.069003, 45.395273],
        //     [-122.303707, 45.612333]
        // ];
        // map.setMaxBounds(bounds);

        // const directions = new MapboxDirections({
        //     accessToken: mapboxgl.accessToken,
        //     unit: 'metric',
        //     profile: 'mapbox/walking',
        //     alternatives: true,
        //     // interactive: true,


        //   });

        // map.addControl(directions, 'top-left');

        return () => map.remove();
    }, [fastRoute, safeRoute, startLong, startLat, endLong, endLat, centerLong, centerLat, streetLightCoords, crimeCoords]);

    return (
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
    );
}

