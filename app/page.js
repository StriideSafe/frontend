"use client"

import Image from "next/image";
import { AddressAutofill } from '@mapbox/search-js-react';
import { Input, Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { MapComponent } from "./components/MapComponent";
import { getMapboxDirections, getGeocode } from "./service/mapboxService";

export default function Home() {

  const [startText, setStartText] = useState("394 Marlborough St, Boston, MA 02115");
  const [endText, setEndText] = useState("Harvard");

  const [fromWayPointLong, setFromWayPointLong] = useState(null);
  const [fromWayPointLat, setFromWayPointLat] = useState(null);
  const [toWayPointLong, setToWayPointLong] = useState(null);
  const [toWayPointLat, setToWayPointLat] = useState(null);

  const [routeResponse, setRouteResponse] = useState(null);
  const [route, setRoute] = useState(null);

  const getDirections = async () => {

    const fromGeocode = await getGeocode({ text: startText });
    const toGeocode = await getGeocode({ text: endText });

    console.log("fromGeocode", fromGeocode)
    console.log("toGeocode", toGeocode)

    const fromFeature = fromGeocode.features[0];
    const toFeature = toGeocode.features[0];

    const fromCoordinates = fromFeature.geometry.coordinates;
    const toCoordinates = toFeature.geometry.coordinates;

    setStartText(fromFeature.properties.full_address);
    setFromWayPointLong(fromCoordinates[0]);
    setFromWayPointLat(fromCoordinates[1]);

    setEndText(toFeature.properties.full_address);
    setToWayPointLong(toCoordinates[0]);
    setToWayPointLat(toCoordinates[1]);

    const directionsResponse = await getMapboxDirections({
      startLong: fromCoordinates[0],
      startLat: fromCoordinates[1],
      endLong: toCoordinates[0],
      endLat: toCoordinates[1]
    });

    console.log("response", directionsResponse)
    setRouteResponse(directionsResponse);

    setRoute(directionsResponse.routes[0].geometry.coordinates);
  }

  const streetLightCoords = [
    [-71.07604438, 42.3531592 ],
    [-71.0934, 42.322016]
  ]


  // console.log("process.env.MAPBOX_ACCESS_TOKEN", process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN)

  return (
    <main className="flex flex-col justify-center items-center w-3/5 h-screen space-y-4 mx-auto">
      <div className="flex gap-4">
        <AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}>
          <Input label="Origin" placeholder="Origin" value={startText} onValueChange={setStartText} />
        </AddressAutofill>

        <AddressAutofill accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}>
          <Input label="Destination" placeholder="Destination" value={endText} onValueChange={setEndText} />
        </AddressAutofill>

        <Button color="primary" onClick={() => getDirections()}>
          Go
        </Button>
      </div>



      <div className="w-full h-2/3">
        <MapComponent route = {route}
          startLong = {fromWayPointLong}
          startLat = {fromWayPointLat}
          endLong = {toWayPointLong}
          endLat = {toWayPointLat}
          streetLightCoords = {streetLightCoords}
        />
      </div>



    </main>
  );
}
