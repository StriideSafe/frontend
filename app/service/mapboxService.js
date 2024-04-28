import React from 'react';

export const getMapboxDirections = async ({
    coordArray

}) => {
    // const url = `https://api.mapbox.com/directions/v5/mapbox/walking/-74.085828%2C40.850794%3B-73.9934%2C40.722016?alternatives=true&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    
    let coordUrl = "";    
    
    for (let i = 0; i < coordArray.length; i++) {
        if (i !== 0) {
            coordUrl += "%3B"
        }
        coordUrl += `${coordArray[i][0]}%2C${coordArray[i][1]}`
    }
    
    
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordUrl}?alternatives=true&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        // Process the data here
        console.log(data);
        return data
    } catch (error) {
        console.error('Error:', error);
    }
};

export const getGeocode = async ({ text }) => {
    console.log(text);

    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${text}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`;
    console.log(url);
    try {
        const response = await fetch(url);
        const data = await response.json();
        // Process the data here
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);

    };
}

