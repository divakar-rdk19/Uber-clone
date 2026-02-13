import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState, useCallback } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { EmailCodeFactor } from "@clerk/types";
import { ReactNativeModal } from "react-native-modal";

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
      } else if (signInAttempt.status === "needs_second_factor") {
        // Check if email_code is a valid second factor
        // This is required when Client Trust is enabled and the user
        // is signing in from a new device.
        // See https://clerk.com/docs/guides/secure/client-trust
        const emailCodeFactor = signInAttempt.supportedSecondFactors?.find(
          (factor): factor is EmailCodeFactor =>
            factor.strategy === "email_code",
        );

        if (emailCodeFactor) {
          await signIn.prepareSecondFactor({
            strategy: "email_code",
            emailAddressId: emailCodeFactor.emailAddressId,
          });
          setShowEmailCode(true);
        }
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      Alert.alert("Error:", err.errors[0].longMessage);
      if (err.errors[0].longMessage === "You're already signed in.")
        router.replace("/(root)/(tabs)/home");
    }
  }, [isLoaded, signIn, setActive, router, form]);

  const onVerifyPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: verification.code,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
        });
        console.log("hit1");
        setVerification({ ...verification, state: "success" });
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification Failed!",
        });
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      setVerification({
        ...verification,
        state: "failed",
        error: "Verification Failed!",
      });
    }
  }, [isLoaded, signIn, setActive, router, verification.code]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-full" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Hello there! 👋
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
              Welcome to Back
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
          isVisible={showEmailCode}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verify it's you...
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
