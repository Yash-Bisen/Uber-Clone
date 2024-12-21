import CustomButton from "@/components/CustomButton";
import InputFeild from "@/components/inputFeild";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {Image, ScrollView, Text, View} from "react-native";


const SignIn = () =>{
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
  
  
    const [form, setForm] = useState({
        email:'',
        password:""
    });

    const onSignInPress = useCallback(async () => {
        if (!isLoaded) return
    
        // Start the sign-in process using the email and password provided
        try {
          const signInAttempt = await signIn.create({
            identifier: form.email,
            password: form.password,
          })
    
          // If sign-in process is complete, set the created session as active
          // and redirect the user
          if (signInAttempt.status === 'complete') {
            await setActive({ session: signInAttempt.createdSessionId })
            router.replace('/')
          } else {
            // If the status isn't complete, check why. User might need to
            // complete further steps.
            console.error(JSON.stringify(signInAttempt, null, 2))
          }
        } catch (err) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2))
        }
      }, [isLoaded, form.email, form.password])
    
    


    return (
        <ScrollView className= "flex-1 g-white">
            <View className="flex-1 bg-white">
                <View>
                    <Image source={images.signUpCar} className="z-0 w-full h-[250]"/>
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                       Welcome🖐️
                    </Text>
                </View>
                <View className="p-5">
                      <InputFeild label = "Email"
                     placeholder= "Enter Your Email"
                     icon = {icons.email}
                     value = {form.email}
                     onChangeText ={(value)=> setForm({
                        ...form,
                        email: value
                     })} />
                      <InputFeild label = "Password"
                     placeholder= "Enter Your Password"
                     icon = {icons.lock}
                     secureTextEntry = {true}
                     value = {form.password}
                     onChangeText ={(value)=> setForm({
                        ...form,
                        password: value
                     })} />

                     <CustomButton title="Sign In" onPress={onSignInPress}
                     className="mt-6"/>

                     <OAuth/>

                     <Link href="/sign-up" className="text-lg text-center text-general-200 mt-10">
                        <Text>Don't have an Account?</Text>
                        <Text className="text-primary-500">SingUp</Text>
                     </Link>

                </View>
            </View>
        </ScrollView>
        )

    }

export default SignIn;