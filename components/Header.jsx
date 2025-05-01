import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import BackButton from "./BackButton";
import { theme } from "../constants/theme";
import { hp } from "../helpers/common";
import Icon from "../assets/icons";

const Header = ({
  title,
  showBackButton = true,
  mb = 10,
  showRightIcon = false,
  onRightIconPress,
}) => {
  const router = useRouter();
  return (
    <View style={[styles.container, { marginBottom: mb }]}>
      {showBackButton && (
        <View style={styles.backButton}>
          <BackButton router={router} />
        </View>
      )}
      <Text style={styles.title}>{title || ""}</Text>
      {showRightIcon && (
        <Pressable style={styles.rightIcon} onPress={onRightIconPress}>
          <Icon name="edit" size={hp(3.2)} color={theme.colors.textLight} />
        </Pressable>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    gap: 10,
  },
  title: {
    fontSize: hp(2.7),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.textDark,
  },
  backButton: {
    position: "absolute",
    left: 0,
  },
  rightIcon: {
    position: "absolute",
    right: 0,
    marginRight: 26,
  },
});
