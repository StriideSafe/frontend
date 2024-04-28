"use client"

import Image from "next/image";
import { AddressAutofill } from '@mapbox/search-js-react';
import { Input, Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { MapComponent } from "./components/MapComponent";
import { getMapboxDirections, getGeocode } from "./service/mapboxService";
import { bostonStreetLampCoords } from "./assets/bostonStreetLamp";
import { cambridgeStreetLamp } from "./assets/cambridgeStreetLamp";
import { cambridgeCrimeData } from "./assets/cambridgeCrimeData";
import { BsSignDoNotEnterFill } from "react-icons/bs";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdOutlineLocalPolice } from "react-icons/md";
import { FaRunning } from "react-icons/fa";
import { TiWeatherStormy } from "react-icons/ti";
import { FaPeopleGroup } from "react-icons/fa6";
import { GiHazardSign } from "react-icons/gi";
import { TbHealthRecognition } from "react-icons/tb";
import { MdAddBusiness } from "react-icons/md";



export default function Home() {

  const [startText, setStartText] = useState("394 Marlborough St, Boston, MA 02115");
  const [endText, setEndText] = useState("Harvard");
  const [middleText, setMiddleText] = useState("Boston Common, Boston, MA 02108");

  const [fromWayPointLong, setFromWayPointLong] = useState(null);
  const [fromWayPointLat, setFromWayPointLat] = useState(null);
  const [toWayPointLong, setToWayPointLong] = useState(null);
  const [toWayPointLat, setToWayPointLat] = useState(null);
  const [middleWayPointLong, setMiddleWayPointLong] = useState(null);
  const [middleWayPointLat, setMiddleWayPointLat] = useState(null);

  const [fastRoute, setFastRoute] = useState(null);
  const [safeRoute, setSafeRoute] = useState(null);

  const getDirections = async () => {

    const fromGeocode = await getGeocode({ text: startText });
    const toGeocode = await getGeocode({ text: endText });
    const middleGeocode = await getGeocode({ text: middleText });

    console.log("fromGeocode", fromGeocode)
    console.log("toGeocode", toGeocode)

    const fromFeature = fromGeocode.features[0];
    const toFeature = toGeocode.features[0];
    const middleFeature = middleGeocode.features[0];

    const fromCoordinates = fromFeature.geometry.coordinates;
    const toCoordinates = toFeature.geometry.coordinates;
    const middleCoordinates = middleFeature.geometry.coordinates;

    setStartText(fromFeature.properties.full_address);
    setFromWayPointLong(fromCoordinates[0]);
    setFromWayPointLat(fromCoordinates[1]);

    setEndText(toFeature.properties.full_address);
    setToWayPointLong(toCoordinates[0]);
    setToWayPointLat(toCoordinates[1]);

    setMiddleText(middleFeature.properties.full_address);
    setMiddleWayPointLong(middleCoordinates[0]);
    setMiddleWayPointLat(middleCoordinates[1]);

    const directionsResponse = await getMapboxDirections({
      coordArray: [
        [fromCoordinates[0], fromCoordinates[1]],
        [toCoordinates[0], toCoordinates[1]]
      ]
    });

    setFastRoute(directionsResponse.routes[0].geometry.coordinates);

    const safeDirectionsResponse = await getMapboxDirections({
      coordArray: [
        [fromCoordinates[0], fromCoordinates[1]],
        [middleCoordinates[0], middleCoordinates[1]],
        [toCoordinates[0], toCoordinates[1]]
      ]
    });

    setSafeRoute(safeDirectionsResponse.routes[0].geometry.coordinates);
  }

  let streetLightCoords = bostonStreetLampCoords.map(coord => [coord[1], coord[0]]);
  streetLightCoords = streetLightCoords.concat(cambridgeStreetLamp);

  let crimeCoords = cambridgeCrimeData

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
        <MapComponent 
          fastRoute={fastRoute}
          safeRoute={safeRoute}
          startLong={fromWayPointLong}
          startLat={fromWayPointLat}
          endLong={toWayPointLong}
          endLat={toWayPointLat}
          streetLightCoords={streetLightCoords}
          crimeCoords={crimeCoords}
        />
      </div>


  <div className="feature-buttons" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '20px', background: '#E3DCF4', display: 'flex', justifyContent: 'center' }}>

      <div className="flex gap-4 items-center">
      <Button style={{ backgroundColor: '#D9CBFB', color: 'black' }} variant="bordered" endContent={<BsSignDoNotEnterFill/>}> 
      Closure
      </Button>    
      <Button style={{ backgroundColor: '#D9CBFB', color: 'black' }} variant="bordered" endContent={<HiOutlineLightBulb />}>
      Lighting
      </Button>    
      <Button style={{ backgroundColor: '#D9CBFB', color: 'black' }} variant="bordered" endContent={<MdOutlineLocalPolice />}>
      Police
      </Button>    
      <Button style={{ backgroundColor: '#D9CBFB', color: 'black' }} variant="bordered" endContent={<FaRunning />}>
      Foot Traffic
      </Button>    
      <Button style={{ backgroundColor: '#D9CBFB', color: 'black' }} variant="bordered" endContent={<TiWeatherStormy />}>
      Bad Weather
      </Button>    
      <Button style={{ backgroundColor: '#D9CBFB', color: 'black' }} variant="bordered" endContent={<FaPeopleGroup />}>
      Safe Haven
      </Button>    
      <Button style={{ backgroundColor: '#D9CBFB', color: 'black' }} variant="bordered" endContent={<GiHazardSign />}>
      Hazard
      </Button>    
      <Button style={{ backgroundColor: '#D9CBFB', color: 'black' }} variant="bordered" endContent={<TbHealthRecognition />}>
      Quality of Area
      </Button>    
      <Button style={{ backgroundColor: '#D9CBFB', color: 'black' }} variant="bordered" endContent={<MdAddBusiness />}>
      Open Business
      </Button>    
    </div>
    </div>

    </main>
  );
}
