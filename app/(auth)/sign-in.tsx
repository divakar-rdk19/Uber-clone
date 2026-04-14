import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState, useCallback } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";

export default function SginInScreen() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const { signIn, setActive, isLoaded } = useSignIn();
  const [showEmailCode, setShowEmailCode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
              console.log(session?.currentTask);
              return;
            }

            router.replace("/(root)/(tabs)/home");
          },
        });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("SignIn Failed!");
      }
    } catch (err: any) {
      if (err.errors[0].longMessage === "You're already signed in.")
        router.replace("/(root)/(tabs)/home");
      else
        Alert.alert("Error:", err.errors[0].longMessage);
      
    }
  }, [isLoaded, signIn, setActive, router, form]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-full" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Hello there! 👋 {}
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Email"
            placeholder="Enter your email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
            secureTextEntry={true}
          />
        </View>
        <CustomButton
          title="Sign In"
          onPress={onSignInPress}
          className="mt-6"
        />
        <OAuth />
        <Link
          href="/(auth)/sign-up"
          className="text-lg text-center text-general-200 mt-10"
        >
          <Text>Don't have an Account? </Text>
          <Text className="text-primary-500">Create an account</Text>
        </Link>
      </View>
    </ScrollView>
  );
}
