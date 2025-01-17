import React from 'react';
import { Alert } from 'react-native';
import Loading from './Loading';
import * as Location from 'expo-location';
import axios from 'axios';
import Weather from './Weather';

const API_KEY = 'a339da6f28089d15cee7a8cb54084f1d';

export default class extends React.Component {
	state = {
		isLoading: true,
	};

	getWeather = async (latitude, longitude) => {
		const {
			data: {
				main: { temp },
				weather,
			},
		} = await axios.get(
			`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
		);
		this.setState({
			isLoading: false,
			condition: weather[0].main,
			temp,
		});
	};

	getLocation = async () => {
		try {
			await Location.requestPermissionsAsync();

			const {
				coords: { latitude, longitude },
			} = await Location.getCurrentPositionAsync();
			// Send to API and get Weather

			this.getWeather(latitude, longitude);
		} catch (error) {
			Alert.alert('can find location');
		}
	};

	componentDidMount() {
		this.getLocation();
	}

	render() {
		const { isLoading, temp, condition } = this.state;
		return isLoading ? (
			<Loading />
		) : (
			<Weather temp={Math.ceil(temp)} condition={condition} />
		);
	}
}
