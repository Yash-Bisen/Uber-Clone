import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const { user } = useUser()

  return (
    <SafeAreaView className="bg-general-500">
      {/* <Flatlist data={[]}/> */}
    </SafeAreaView>
  )
}


export default Home;