import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import imagePath from '../../constants/imagePath';
import {useSelector} from 'react-redux';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  AnimatedRegion,
} from 'react-native-maps';
import {
  getCurrentLocation,
  locationPermission,
} from '../../helper/helperFunction';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../Components/Loader';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
function HomeScreen() {
  const userInfo = useSelector(state => state.app.user);
  const navigation = useNavigation();
  const mapRef = useRef();
  const markerRef = useRef();

  const [location, setLocation] = useState({
    curLoc: {
      latitude: 30.7046,
      longitude: 77.1025,
    },
    destinationCords: {},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 30.7046,
      longitude: 77.1025,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    time: 0,
    distance: 0,
    heading: 0,
  });

  const {
    curLoc,
    time,
    distance,
    destinationCords,
    isLoading,
    coordinate,
    heading,
  } = location;
  const updateState = data => setLocation(location => ({...location, ...data}));

  const animate = (latitude, longitude) => {
    const newCoordinate = {latitude, longitude};
    if (Platform.OS === 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  };

  const getLiveLocation = async () => {
    const locPermissionDenied = await locationPermission();
    if (locPermissionDenied) {
      const {latitude, longitude, heading} = await getCurrentLocation();
      console.log('get live location after 4 second', heading);
      animate(latitude, longitude);
      updateState({
        heading: heading,
        curLoc: {latitude, longitude},
        coordinate: new AnimatedRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }),
      });
    }
  };

  useEffect(() => {
    getLiveLocation();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      getLiveLocation();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const onPressLocation = () => {
    return () =>
      navigation.navigate('chooseLocation', {getCordinates: fetchValue});
  };
  const fetchValue = data => {
    console.log('this is data', data);
    updateState({
      destinationCords: {
        latitude: data.destinationCords.latitude,
        longitude: data.destinationCords.longitude,
      },
    });
  };

  const onCenter = () => {
    mapRef.current.animateToRegion({
      latitude: curLoc.latitude,
      longitude: curLoc.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const fetchTime = (d, t) => {
    updateState({
      distance: d,
      time: t,
    });
  };

  return (
    <>
      <View style={{flex: 1}}>
        {distance !== 0 && time !== 0 && (
          <View style={{alignItems: 'center', marginVertical: 16}}>
            <Text>Time left: {time.toFixed(0)} </Text>
            <Text>Distance left: {distance.toFixed(0)}</Text>
          </View>
        )}
        {userInfo && (
          <View style={{flex: 1}}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={StyleSheet.absoluteFill}
              initialRegion={{
                ...curLoc,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }}>
              {/*{userInfo.kure ? (*/}
              {/*  <Marker*/}
              {/*    draggable*/}
              {/*    coordinate={{*/}
              {/*      latitude: location?.latitude,*/}
              {/*      longitude: location?.longitude,*/}
              {/*    }}*/}
              {/*    onDragEnd={direction =>*/}
              {/*      setLocation(direction.nativeEvent.coordinate)*/}
              {/*    }*/}
              {/*    title={userInfo?.kure?.first_name}*/}
              {/*  />*/}
              {/*) : (*/}
              {/*  <Marker*/}
              {/*    draggable*/}
              {/*    coordinate={{*/}
              {/*      latitude: origin?.latitude,*/}
              {/*      longitude: origin?.latitude,*/}
              {/*    }}*/}
              {/*    onDragEnd={direction =>*/}
              {/*      setOrigin(direction.nativeEvent.coordinate)*/}
              {/*    }*/}
              {/*    title={userInfo?.kurer?.first_name}*/}
              {/*  />*/}
              {/*)}*/}

              {/*{!userInfo.kure ? (*/}
              {/*  <Marker*/}
              {/*    draggable*/}
              {/*    coordinate={{*/}
              {/*      latitude: location?.latitude,*/}
              {/*      longitude: location?.longitude,*/}
              {/*    }}*/}
              {/*    onDragEnd={direction =>*/}
              {/*      setLocation(direction.nativeEvent.coordinate)*/}
              {/*    }*/}
              {/*    title={userInfo?.kure?.first_name}*/}
              {/*  />*/}
              {/*) : (*/}
              {/*  <Marker*/}
              {/*    draggable*/}
              {/*    coordinate={{*/}
              {/*      latitude: origin?.latitude,*/}
              {/*      longitude: origin?.longitude,*/}
              {/*    }}*/}
              {/*    onDragEnd={direction =>*/}
              {/*      setOrigin(direction.nativeEvent.coordinate)*/}
              {/*    }*/}
              {/*    title={userInfo?.kurer?.first_name}*/}
              {/*  />*/}
              {/*)}*/}
              {/*<Polyline coordinates={[origin, location]} />*/}
              {!userInfo?.kurer ? (
                <Marker.Animated
                  ref={markerRef}
                  title={userInfo?.kurer?.first_name}
                  coordinate={coordinate}>
                  <Image
                    source={imagePath.icBike}
                    style={{
                      width: 40,
                      height: 40,
                      transform: [{rotate: `${heading}deg`}],
                    }}
                    resizeMode="contain"
                  />
                </Marker.Animated>
              ) : (
                <Marker.Animated
                  ref={markerRef}
                  title={userInfo?.kure?.first_name}
                  coordinate={coordinate}>
                  <Image
                    source={imagePath.icBike}
                    style={{
                      width: 40,
                      height: 40,
                      transform: [{rotate: `${heading}deg`}],
                    }}
                    resizeMode="contain"
                  />
                </Marker.Animated>
              )}
              {Object.keys(destinationCords).length > 0 && (
                <Marker
                  draggable
                  coordinate={destinationCords}
                  image={imagePath.icGreenMarker}
                />
              )}
              {Object.keys(destinationCords).length > 0 && (
                <Polyline coordinates={[coordinate, destinationCords]} />
              )}
            </MapView>
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
              }}
              onPress={onCenter}>
              <Image source={imagePath.greenIndicator} />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.bottomCard}>
          <Text>Where are you going..?</Text>
          <TouchableOpacity onPress={onPressLocation} style={styles.inpuStyle}>
            <Text>Choose your location</Text>
          </TouchableOpacity>
        </View>
        <Loader isLoading={isLoading} />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomCard: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  inpuStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchBar: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: 0,
    color: '#0a0a0a',
  },
  inputs: {
    borderColor: '#888',
    borderWidth: 1,
    color: '#0a0a0a',
  },
});
export default HomeScreen;
