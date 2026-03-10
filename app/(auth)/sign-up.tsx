import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

export default function SginUpScreen() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { isLoaded, signUp, setActive } = useSignUp();
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      console.log("FULL CLERK ERROR:", JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      if (!verification.code.trim()) {
        Alert.alert("Verfication code cannot be empty");
        return;
      }
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (signUpAttempt.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: signUpAttempt.createdUserId,
          }),
        });
        await setActive({
          session: signUpAttempt.createdSessionId,
        });
        setVerification({ ...verification, state: "success" });
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification Failed!",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: "failed",
        error: err.erros[0].longMessage,
      });
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-full" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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
          title="Sign Up"
          onPress={onSignUpPress}
          className="mt-6"
        />
        <OAuth />
        <Link
          href="/sign-in"
          className="text-lg text-center text-general-200 mt-10"
        >
          <Text>Already have an Account? </Text>
          <Text className="text-primary-500">Log In</Text>
        </Link>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w=[110px] h-[100px] mx-auto my-5"
              resizeMode="contain"
            />
            <Text className="text-center text-3xl font-JakartaBold">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center">
              Welcome to Ryde {form.name}!
            </Text>
            <CustomButton
              title="Explore Ryde!"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(root)/(tabs)/home");
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We have sent you a verfication code to {form.email.slice(0, 3)}
              ***@gmail.com
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="Enter your verification code here"
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            ></InputField>
            {verification.error && (
              <Text className="text-sm text-red-500 font-Jakarta mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify"
              onPress={onVerifyPress}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
}
