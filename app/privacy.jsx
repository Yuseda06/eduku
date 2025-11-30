import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";

const Privacy = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Privacy Policy for Eduku</Text>
          <Text style={styles.date}>Effective Date: June 02, 2025</Text>
          
          <View style={styles.privacyContainer}>
            <Text style={styles.privacyText}>
              This Alexa skill does not collect, store, or share any personal user information. 
              All score data is stored securely in Supabase and used solely for displaying children's quiz scores via Alexa.
              We do not use any data for advertising or tracking purposes.
            </Text>
            <Text style={styles.privacyText}>
              By using this skill, you agree to the handling of information as described above.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Back to Welcome"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onPress={() => router.back()}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Privacy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    paddingTop: hp(5),
  },
  title: {
    fontSize: hp(3),
    color: theme.fonts.text,
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
    marginBottom: hp(2),
  },
  date: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    marginBottom: hp(4),
  },
  privacyContainer: {
    gap: hp(2),
    paddingHorizontal: wp(4),
  },
  privacyText: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    lineHeight: hp(2.5),
    textAlign: "justify",
  },
  footer: {
    paddingVertical: hp(3),
  },
}); 