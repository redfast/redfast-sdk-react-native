import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './home';
import MovieDetailScreen from './detail';
import { NavigationContainer } from '@react-navigation/native';
import {
  PromotionAction_Init,
  PromotionProvider,
  usePromotion,
} from '@redfast/react-native-redfast';
import React from 'react';
import { PromotionManager } from '@redfast/react-native-redfast';

const Stack = createStackNavigator();

const AppRoot: React.FC = () => {
  const { dispatch } = usePromotion();
  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => {
    if (dispatch) {
      const promotionMgr = new PromotionManager(
        '<YOUR_PULSE_APP_ID>',
        '<YOUR_PULSE_USER_ID>'
      );
      const intervalId = setInterval(() => {
        if (promotionMgr.isInitialized()) {
          dispatch({
            type: PromotionAction_Init,
            data: promotionMgr,
          });
          setReady(true);
          clearInterval(intervalId);
        }
      }, 1000);
      return () => clearInterval(intervalId);
    }
    return () => {};
  }, [dispatch]);

  React.useEffect(() => {}, []); // Empt

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
    <PromotionProvider>
      <AppRoot />
    </PromotionProvider>
  );
}
