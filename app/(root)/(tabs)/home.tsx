import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  FlatList,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RideCard from "@/components/RideCard";
import { icons, images } from "@/constants";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";
import * as Location from "expo-location";


const handleSignOut = () => {};
const handleDestinationPress = () => {};

export default function HomeScreen() {
  const { user } = useUser();
  const [isMapReady, setIsMapReady] = useState(false);
  const {setUserLocation, setDestinationLocation} = useLocationStore();
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  // Add a tiny delay to allow the FlatList to stabilize before showing the Map
  useEffect(() => {
    const timer = setTimeout(() => setIsMapReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const requestLocationPermission = async () =>{
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { 
        setHasLocationPermission(false);
        return;
      }
      setHasLocationPermission(true);
      let location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address[0]?.name ? `${address[0].name}, ${address[0].region}` : "Unknown Location",
      });
    }
    requestLocationPermission();
  }, []);  

  const recentRides = [
    {
      ride_id: "1",
      origin_address: "Gandhipuram Central Bus Stand, Coimbatore",
      destination_address: "Brookefields Mall, RS Puram, Coimbatore",
      origin_latitude: 11.0168,
      origin_longitude: 76.9688,
      destination_latitude: 11.0092,
      destination_longitude: 76.9619,
      ride_time: 12,
      fare_price: 150.0,
      payment_status: "paid",
      driver_id: 2,
      user_id: "1",
      created_at: "2026-04-15 08:30:00.000000",
      driver: {
        driver_id: "2",
        first_name: "Karthik",
        last_name: "Raja",
        profile_image_url:
          "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
        car_image_url:
          "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
        car_seats: 5,
        rating: "4.60",
      },
    },
    {
      ride_id: "2",
      origin_address: "Coimbatore International Airport (CJB)",
      destination_address: "Tidel Park, Avinashi Road, Coimbatore",
      origin_latitude: 11.03,
      origin_longitude: 77.0434,
      destination_latitude: 11.0285,
      destination_longitude: 77.0263,
      ride_time: 15,
      fare_price: 350.0,
      payment_status: "paid",
      driver_id: 1,
      user_id: "1",
      created_at: "2026-04-15 11:20:15.000000",
      driver: {
        driver_id: "1",
        first_name: "Senthil",
        last_name: "Kumar",
        profile_image_url:
          "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
        car_image_url:
          "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
        car_seats: 4,
        rating: "4.80",
      },
    },
    {
      ride_id: "3",
      origin_address: "Codissia Trade Fair Complex, Coimbatore",
      destination_address: "Race Course Road, Coimbatore",
      origin_latitude: 11.0427,
      origin_longitude: 77.035,
      destination_latitude: 10.9996,
      destination_longitude: 76.9754,
      ride_time: 25,
      fare_price: 280.0,
      payment_status: "paid",
      driver_id: 1,
      user_id: "1",
      created_at: "2026-04-15 15:10:45.000000",
      driver: {
        driver_id: "1",
        first_name: "Vijay",
        last_name: "Raghavan",
        profile_image_url:
          "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
        car_image_url:
          "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
        car_seats: 4,
        rating: "4.80",
      },
    },
    {
      ride_id: "4",
      origin_address: "PSG College of Technology, Peelamedu",
      destination_address: "Fun Republic Mall, Avinashi Road",
      origin_latitude: 11.0247,
      origin_longitude: 77.0033,
      destination_latitude: 11.0242,
      destination_longitude: 77.0106,
      ride_time: 8,
      fare_price: 100.0,
      payment_status: "paid",
      driver_id: 3,
      user_id: "1",
      created_at: "2026-04-15 19:45:30.000000",
      driver: {
        driver_id: "3",
        first_name: "Arun",
        last_name: "Pandiyan",
        profile_image_url:
          "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
        car_image_url:
          "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
        car_seats: 4,
        rating: "4.70",
      },
    },
  ];
  const handleSignOut = () => {};
  const handleDestinationPress = () => {};

  return (
    <SafeAreaView className="bg-general-500 flex-1">
      <FlatList
        data={recentRides}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item) => item.ride_id.toString()}
        removeClippedSubviews={false}
        initialNumToRender={5}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between my-5">
              <Text className="text-xl font-JakartaExtraBold capitalize">
                Welcome {user?.firstName || "Guest"} 👋
              </Text>
              <TouchableOpacity
                onPress={handleSignOut}
                className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
              >
                <Image source={icons.out} className="w-5 h-5" />
              </TouchableOpacity>
            </View>

            <GoogleTextInput
              icon={icons.search}
              containerStyle="bg-white shadow-md shadow-neutral-300"
              handlePress={handleDestinationPress}
            />

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Your Current Location
            </Text>
            <View
              className="w-full h-[300px] bg-transparent rounded-2xl overflow-hidden"
            >
              {isMapReady ? (
                <Map />
              ) : (
                <ActivityIndicator size="large" color="#000" />
              )}
            </View>

            <Text className="text-xl font-JakartaBold mt-5 mb-3">
              Recent Rides
            </Text>
          </View>
        }
        ListEmptyComponent={() => (
          <View className="flex flex-col items-center justify-center py-10">
            <Image
              source={images.noResult}
              className="h-40 w-40"
              resizeMode="contain"
            />
            <Text className="text-sm">No recent rides found.</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
