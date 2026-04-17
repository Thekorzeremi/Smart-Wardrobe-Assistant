import { Alert } from 'react-native'
import { useEffect, useState } from 'react'
import * as Location from 'expo-location'

export function usePhoneLocation() {
	const [coords, setCoords] = useState(null)

	//check if location is enable or not
	const checkIfLocationEnabled = async () => {
		let enabled = await Location.hasServicesEnabledAsync();       //returns true or false
		if (!enabled) {                     //if not enable 
			Alert.alert('Location not enabled', 'Please enable your Location', [
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			]);
		}
	}
	//get current location
	const getCurrentLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();  //used for the pop up box where we give permission to use location 
		console.log(status);
		if (status !== 'granted') {
			Alert.alert('Permission denied', 'Allow the app to use the location services', [
				{
					text: 'Cancel',
					onPress: () => console.log('Cancel Pressed'),
					style: 'cancel',
				},
				{ text: 'OK', onPress: () => console.log('OK Pressed') },
			]);
		}

		//get current position lat and long
		const { coords } = await Location.getCurrentPositionAsync();
		console.log(coords)

		if (coords) {
			const { latitude, longitude } = coords;
			console.log(latitude, longitude);
			// setCoords(coords)

			//provide lat and long to get the the actual address
			let responce = await Location.reverseGeocodeAsync({
				latitude,
				longitude
			});
			setCoords(responce)
			console.log(responce);
		}
	}

	useEffect(() => {
		checkIfLocationEnabled();
		getCurrentLocation();
	}, [])
	
	return coords?.[0]
}