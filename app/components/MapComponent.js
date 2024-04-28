// "use client"

import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

export const MapComponent = (
    {
        route,
        startLong,
        startLat,
        endLong,
        endLat,
        streetLightCoords
    }) => {

    const [centerLong, setCenterLong] = useState(-72.058291);
    const [centerLat, setCenterLat] = useState(42.360253);

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

        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: route
            }
        };

 

        console.log("geojson", geojson);

        // if the route already exists on the map, we'll reset it using setData
        map.on('load', function () {
            console.log("map loaded")


            // if the route already exists on the map, we'll reset it using setData

            if (route && map.getSource('route')) {
                console.log("route exists")
                map.getSource('route').setData(geojson);
            }
            // otherwise, we'll make a new request
            else {
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: {
                        type: 'geojson',
                        data: geojson
                    },
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3887be',
                        'line-width': 5,
                        'line-opacity': 0.75
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
                    'circle-radius': 10
                }
            });
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
    }, [route, startLong, startLat, endLong, endLat, centerLong, centerLat]);

    return (
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
    );
}

