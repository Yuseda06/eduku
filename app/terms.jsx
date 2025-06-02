import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";

const Terms = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Terms of Use for Eduku Score</Text>
          <Text style={styles.date}>Effective Date: June 02, 2025</Text>
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              This skill is provided for educational and entertainment purposes only. 
              By enabling and using this skill, you agree to use it responsibly and acknowledge that all quiz data is stored on your own linked Supabase account.
            </Text>
            <Text style={styles.termsText}>
              We reserve the right to update or modify this skill at any time without notice.
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

export default Terms;

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
  termsContainer: {
    gap: hp(2),
    paddingHorizontal: wp(4),
  },
  termsText: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    lineHeight: hp(2.5),
    textAlign: "justify",
  },
  footer: {
    paddingVertical: hp(3),
  },
}); 