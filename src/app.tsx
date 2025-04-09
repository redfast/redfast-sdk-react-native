import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './home';
import MovieDetailScreen from './detail';
import { NavigationContainer } from '@react-navigation/native';
import {
  PromptAction_Init,
  PromptAction_Font_Button,
  PromptAction_Font_Timer,
  PromptAction_Font_LegalText,
  PromptProvider,
  usePrompt,
} from '@redfast/react-native-redfast';
import React from 'react';
import { PromptManager } from '@redfast/react-native-redfast';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

const AppRoot: React.FC = () => {
  const { dispatch } = usePrompt();
  const [isReady, setReady] = React.useState(false);
  useFonts({
    buttonFont: require('../assets/fonts/AllProDisplayC-Medium.ttf'),
    otherFont: require('../assets/fonts/AllProDisplayC-Regular.ttf'),
  });

  React.useEffect(() => {
    if (dispatch) {
      const promptMgr = new PromptManager(
        '<YOUR_PULSE_APP_ID>',
        '<YOUR_PULSE_USER_ID>'
      );
      const intervalId = setInterval(() => {
        if (promptMgr.isInitialized()) {
          dispatch({
            type: PromptAction_Init,
            data: promptMgr,
          });
          dispatch({
            type: PromptAction_Font_Button,
            data: 'buttonFont',
          });
          dispatch({
            type: PromptAction_Font_Timer,
            data: 'otherFont',
          });
          dispatch({
            type: PromptAction_Font_LegalText,
            data: 'otherFont',
          });
          setReady(true);
          clearInterval(intervalId);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
    return () => {};
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isReady && (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <PromptProvider>
      <AppRoot />
    </PromptProvider>
  );
}
