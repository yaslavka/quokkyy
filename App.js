/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import * as actions from './src/actions/app.actions';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SigInScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChooseLocation from './src/screens/ChooseLocation';
const Stack = createNativeStackNavigator();
const App: () => Node = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(actions.userInfo());
    }
  }, [isAuthenticated, dispatch]);
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {isAuthenticated ? (
            <>
              <Stack.Screen
                name="Dashboard"
                component={HomeScreen}
                options={{headerShown: false}}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Auth"
                component={SignInScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen name="chooseLocation" component={ChooseLocation} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
