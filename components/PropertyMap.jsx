"use client";

import { useEffect, useState, useRef } from "react";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilersdk from "@maptiler/sdk";
import * as maptilerClient from "@maptiler/client";
import Spinner from "@/components/Spinner";

// add your API key
maptilerClient.config.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const PropertyMap = ({ property }) => {
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  const mapContainer = useRef(null);

  // POINT: centering the map on the actual visitor location, optionally using the zoom option (zoom level 13 if none is provided). As a more precise option, if the user has previously granted access to the browser location (more precise) than this is going to be used.

  useEffect(() => {
    const getCoordinates = async () => {
      try {
        const result = await maptilerClient.geocoding.forward(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        const [long, lati] = result?.features[0]?.geometry?.coordinates;
        setLongitude(long);
        setLatitude(lati);

        //  Check for results
        if (result && Object.keys(result).length === 0) {
          // No results found
          setGeocodeError(true);
          return;
        }
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
      } finally {
        setIsLoading(false);
      }
    };

    getCoordinates();
  }, []);

  if (mapContainer.current) {
    // Use mapContainer.current to access the DOM element
    const map = new maptilersdk.Map({
      container: mapContainer.current,
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      style: maptilersdk.MapStyle.STREETS_DARK,
      geolocate: maptilersdk.GeolocationType.POINT,
      //* set the longitude and latitude in the Marker function bellow
      //center: [21.469700, 41.989170], // starting position [longitude, latitude] E = longitude = 21.469700 N = latitude = 41.989170 (GPS coordinates:  41° 59' 21.012'' N    21° 28' 10.92'' E) Skopje, Bul. Jane Sandanski
      center: [longitude, latitude],
      zoom: 15, // starting zoom
    });

    // create the popup (when user clicks on the marker)
    const popup = new maptilersdk.Popup({ offset: 25 }).setText(
      `Property: ${property.name}`
    );

    const marker = new maptilersdk.Marker()
      .setLngLat([longitude, latitude]) // sets the marker at the coordinates point
      .setPopup(popup) // sets a popup on this marker
      .addTo(map); // add to Map
  }

  if (isLoading) return <Spinner />;

  // Handle case where geocoding failed
  if (geocodeError) {
    return <div className="text-xl">No location data found</div>;
  }

  return (
    !isLoading && (
      <div style={{ width: "100%", height: "500px" }} ref={mapContainer}></div>
    )
  );
};

export default PropertyMap;
