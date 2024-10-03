import { SafeAreaView, StyleSheet, StatusBar, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { useEffect, useState } from 'react';
import axios from 'axios'

export default function App() {

  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [pokemons, setPokemons] = useState([])

  async function getCurrentLocation() {
    const response = await Location.requestForegroundPermissionsAsync()

    if (response.granted === true) {

      const myLocation = await Location.getCurrentPositionAsync()

      setLatitude(myLocation.coords.latitude)
      setLongitude(myLocation.coords.longitude)

    } else {
      Alert.alert("AVISO", "Sem a permissão, não conseguimos pegar a sua localização :(")
    }
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])

  useEffect(() => {
    axios.get("http://192.168.0.37:3000/pokemons")
      .then((response) => {
        setPokemons(response.data)
      })
      .catch(() => Alert.alert("Houve um erro ao pegar os pokemons"))
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#f3c715' />

      {
        (latitude && longitude) ? (
          <MapView
            style={styles.map}
            
            initialRegion={
              {
                latitude: -7.5529504, // latitude do brasil
                longitude: -48.8832875, // longitude do brasil
                latitudeDelta: 1,
                longitudeDelta: 1
              }
            }
          >
            {
              pokemons.map((pokemon) => (
                <Marker
                  key={pokemon.id}
                  coordinate={{
                    latitude: pokemon.latitude,
                    longitude: pokemon.longitude
                  }}
                  title={pokemon.name}
                  description={pokemon.type}
                  icon={{uri: pokemon.image, width: 100, height: 100}}
                />
              ))
            }
          </MapView>
        )
          : <Text>Carregando dados ....</Text>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  map: {
    width: '100%',
    height: '100%'
  }
});
