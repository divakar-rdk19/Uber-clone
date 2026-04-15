import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useDriverStore, useLocationStore } from "@/store";
import { calculateRegion, generateMarkersFromData } from "@/utils/map";
import { MarkerData } from "@/types/type";
import { icons } from "@/constants";

const drivers = [
  {
    driver_id: 1,
    first_name: "Senthil",
    last_name: "Kumar",
    profile_image_url:
      "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    car_seats: 4,
    rating: 4.8,
  },
  {
    driver_id: 2,
    first_name: "Karthik",
    last_name: "Raja",
    profile_image_url:
      "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    car_image_url:
      "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
    car_seats: 5,
    rating: 4.6,
  },
  {
    driver_id: 3,
    first_name: "Arun",
    last_name: "Pandiyan",
    profile_image_url:
      "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    car_image_url:
      "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
    car_seats: 4,
    rating: 4.7,
  },
  {
    driver_id: 4,
    first_name: "Vijay",
    last_name: "Raghavan",
    profile_image_url:
      "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    car_image_url:
      "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
    car_seats: 4,
    rating: 4.9,
  },
];

export default function Map() {
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });
  const {selectedDriver, setDrivers} = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  useEffect(() => {
    if(Array.isArray(drivers) && drivers.length > 0){
        if (!userLatitude || !userLongitude) return;
        const newMarkers = generateMarkersFromData({
          data: drivers,
          userLatitude,
          userLongitude,
        });
        setDrivers(newMarkers);
        setMarkers(newMarkers);
    }
  }, [drivers, userLatitude, userLongitude]);

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={StyleSheet.absoluteFillObject}
      tintColor="black"
      mapType="standard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker key={marker.id} coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} title={marker.title} image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}    />
      ))}
    </MapView>
  );
}
