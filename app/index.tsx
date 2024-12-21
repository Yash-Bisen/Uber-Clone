import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { LogBox } from "react-native";

LogBox.ignoreLogs([
    "[Reanimated] Reduced motion setting is enabled on this device",
  ]);

const Page = () =>{
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/(root)/(tabs)/home'} />
  }

    return <Redirect href="/(auth)/welcome" />

};

export default Page;