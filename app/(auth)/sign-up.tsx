import CustomButton from "@/components/CustomButton";
import InputFeild from "@/components/inputFeild";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import {Alert, Image, ScrollView, Text, View} from "react-native";
import { ReactNativeModal } from "react-native-modal";

const SignUp = () =>{
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const { isLoaded, signUp, setActive } = useSignUp()

    const [form, setForm] = useState({
        name:'',
        email:'',
        password:""
    });

    const [verification, setVerification] = useState({
        state:'default',
        error:'',
        code:''
    });
    

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
     await signUp.create({
        emailAddress: form.email,
        password: form.password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({...verification, state: "pending"})
    } catch (err: any) {
        console.log(JSON.stringify(err, null, 2));
        Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
                name: form.name,
                email: form.email,
                clerkId: signUpAttempt.createdUserId
            }),
        });
        await setActive({ session: signUpAttempt.createdSessionId });
       setVerification({...verification, state: "success"})
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setVerification({
            ...verification, 
            state: "failed",
            error: "verification failed. Please try again."
        });
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err:any ) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({...verification, error:err.error[0].longMessage, state: "failed"})
       
      console.error(JSON.stringify(err, null, 2))
    }
  }


    return (
        <ScrollView className= "flex-1 g-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250]"/>
                    <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
                        Create Your Account
                    </Text>
                </View>
                <View className="p-5">
                    <InputFeild label = "Name"
                     placeholder= "Enter name"
                     icon = {icons.person}
                     value = {form.name}
                     onChangeText ={(value)=> setForm({
                        ...form,
                        name: value
                     })} />

                    <InputFeild label = "Email"
                     placeholder= "Enter email"
                     textContentType="emailAddress"
                     icon = {icons.email}
                     value = {form.email}
                     onChangeText ={(value)=> setForm({
                        ...form,
                        email: value
                     })} />

                      <InputFeild label = "Password"
                     placeholder= "Enter password"
                     icon = {icons.lock}
                    textContentType="password"
                     secureTextEntry = {true}
                     value = {form.password}
                     onChangeText ={(value)=> setForm({
                        ...form,
                        password: value
                     })} />

                     <CustomButton title="Sign Up" 
                     onPress={onSignUpPress}
                     className="mt-5"
                     />

                     <OAuth/>
                     <Link href="/sign-in" className="text-lg text-center text-general-200 mt-6">
                        <Text>Already have an Account?</Text>
                        <Text className="text-primary-500">Log In</Text>
                     </Link>

                </View>

                
                <ReactNativeModal
                 isVisible={verification.state === 'pending'}
                 onModalHide={()=>{
                   if(verification.state === "success"){
                    setShowSuccessModal(true);
                   }
                }}
                >
                        <View className="bg-white px-5 py-9 rounded-2xl min-h-[300px]">
                            <Text className="text-2xl font-JakartaExtraBold mb-2">
                                Verification
                            </Text>

                            <Text className="font-Jakarta mb-5">
                                We have sent a verification code to {form.email}
                            </Text>

                            <InputFeild
                            label={"Code"}
                            icon={icons.lock}
                            placeholder={"123456"}
                            value={verification.code} 
                            keyboardType="numeric"
                            onChangeText={(code)=>
                                setVerification({...verification, code})
                            }
                            />

                            {verification.error && (
                                <Text  className="text-red-500 text-sm mt-1">
                                    {verification.error}
                                </Text>
                            )}

                            <CustomButton 
                                title="Verify Email"
                                onPress= {onVerifyPress}
                                className="mt-5 bg-success-500"
                                />
                        </View>
                     </ReactNativeModal>

                     <ReactNativeModal isVisible={showSuccessModal}>
                        <View className="bg-white px-5 py-9 rounded-2xl min-h-[300px]">
                            <Image source={images.check} className="w-[110px] h-[110px] mx-auto my-5"
                            />

                            <Text className="text-3xl font-JakartaBold text-center">
                                Verified
                            </Text>

                            <Text className="text-base text-grey-400 font-Jakarta text-center mt-2">
                                You have successfully verified Your account
                            </Text>
                            <CustomButton 
                                title="Browse Home"
                                onPress= {()=> router.replace("/(root)/(tabs)/home")}
                                className="mt-5"
                                />
                        </View>
                     </ReactNativeModal>

            </View>
        </ScrollView>
        )

    }

export default SignUp;