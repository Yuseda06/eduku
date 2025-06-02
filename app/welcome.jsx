import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";
const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      {/* welcome image */}
      <View style={styles.container}>
        <Image
          resizeMode="contain"
          source={require("../assets/images/welcome.png")}
          style={styles.welcomeImage}
        />

        {/* title */}

        <View style={{ gap: 20 }}>
          <Text style={styles.title}>MySchool Quiz</Text>
          <Text style={styles.punchline}>
            Mastering subjects from Bahasa to Science, one quiz at a time.
          </Text>
        </View>

        {/* footer  */}

        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.push("signUp")}
          />

          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account! </Text>

            <Pressable onPress={() => router.push("login")}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                Login
              </Text>
            </Pressable>
          </View>

          <View style={styles.termsContainer}>
            <Pressable onPress={() => router.push("terms")}>
              <Text style={styles.termsText}>Terms of Service</Text>
            </Pressable>
            <Pressable onPress={() => router.push("privacy")}>
              <Text style={styles.termsText}>Privacy Policy</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};
export default Welcome;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    width: wp(100),
    height: hp(30),
    alignSelf: "center",
  },
  title: {
    fontSize: hp(4),
    color: theme.fonts.text,
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  punchline: {
    fontSize: hp(1.7),
    color: theme.fonts.text,
    textAlign: "center",
    paddingHorizontal: wp(10),
  },
  footer: {
    gap: 30,
    width: "100%",
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    color: theme.colors.text,
    fontSize: hp(1.6),
    textAlign: "center",
  },
  termsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  termsText: {
    color: theme.colors.text,
    fontSize: hp(1.6),
    textAlign: "center",
  },
  
});
