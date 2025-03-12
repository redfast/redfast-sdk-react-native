import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./home";
import MovieDetailScreen from "./detail";
import { NavigationContainer } from "@react-navigation/native";
import {
  PromptAction_Init,
  PromptProvider,
  usePrompt,
} from "./utils/usePrompt";
import React from "react";
import { PromptManager } from "./utils/PromptManager";

const Stack = createStackNavigator();

const AppRoot: React.FC = () => {
  const { dispatch } = usePrompt();
  const [isReady, setReady] = React.useState(false);

  React.useEffect(() => {
    if (dispatch) {
      const promptMgr = new PromptManager(
        "<YOUR_PULSE_APP_ID>",
        "<YOUR_PULSE_USER_ID>"
      );
      const intervalId = setInterval(() => {
        if (promptMgr.isInitialized()) {
          dispatch({
            type: PromptAction_Init,
            data: promptMgr,
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
    <PromptProvider>
      <AppRoot />
    </PromptProvider>
  );
}
