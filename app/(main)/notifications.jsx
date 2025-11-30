import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputComponent,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState, useImperativeHandle } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";
import Icon from "../../assets/icons";
import Button from "../../components/Button";
import * as ImagePicker from "expo-image-picker";
import { getSupabaseFileUrl } from "../../services/imageService";
import { Video } from "expo-av";
import { createOrUpdatePost } from "../../services/postService";
import { TouchableWithoutFeedback } from "react-native";
import { insertEssay } from "../../services/essayService";
import { Input } from "@rneui/themed";

const CreateEssay = () => {
  const { user } = useAuth();
  const [essayBody, setEssayBody] = useState("");
  const titleRef = useRef("");

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(false);

  const onSubmit = async () => {
    if (!titleRef.current.trim()) {
      Alert.alert("Error", "Please enter a title");
      return;
    }
    if (!essayBody.trim()) {
      Alert.alert("Error", "Please enter essay content");
      return;
    }

    let data = {
      title: titleRef.current,
      essay: essayBody,
      userId: user?.id,
    };

    setLoading(true);
    let res = await insertEssay(data);
    setLoading(false);

    if (res.success) {
      titleRef.current = "";
      setEssayBody("");
      router.navigate("essay");
    } else {
      Alert.alert("Post", res.msg);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <TouchableWithoutFeedback>
        <View style={styles.container}>
          <Header title="Create an Essay" />

          <ScrollView contentContainerStyle={{ gap: 20 }}>
            <View style={styles.header}>
              <Avatar
                uri={user?.image}
                size={hp(6.5)}
                rounded={theme.radius.xl}
              />
              <View style={{ gap: 2 }}>
                <Text style={styles.username}>{user && user?.name}</Text>
                <Text style={styles.publicText}>Public</Text>
              </View>
            </View>

            <View style={styles.textEditor}>
              <View style={{ flexDirection: "column", marginBottom: 20 }}>
                <Text
                  style={[styles.publicText, { marginLeft: 10, marginTop: 10 }]}
                >
                  Title of an Essay
                </Text>
                <Input onChangeText={(text) => (titleRef.current = text)} />
              </View>

              <View style={{ flexDirection: "column" }}>
                <Text
                  style={[styles.publicText, { marginLeft: 10, marginTop: 10 }]}
                >
                  Essay Content
                </Text>
                <TextInput
                  style={styles.essayInput}
                  placeholder="Write your essay here..."
                  placeholderTextColor={theme.colors.textLight}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                  value={essayBody}
                  onChangeText={setEssayBody}
                />
              </View>
            </View>
          </ScrollView>

          <Button
            buttonStyle={{ height: hp(6.2) }}
            title="Post"
            loading={loading}
            hasShadow={false}
            onPress={onSubmit}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
};

export default CreateEssay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
    marginBottom: 30,
    paddingHorizontal: wp(4),
    gap: 15,
  },
  title: {
    marginBottom: 10,
    fontSize: theme.fonts.semibold,
    fontWeight: theme.colors.textLight,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  publicText: {
    fontSize: hp(1.7),
    fontWeight: theme.fonts.medium,
  },
  textEditor: {
    flex: 1,
  },
  essayInput: {
    minHeight: hp(30),
    borderWidth: 1.5,
    borderColor: theme.colors.gray,
    borderRadius: theme.radius.xl,
    padding: 15,
    fontSize: hp(1.8),
    color: theme.colors.text,
    textAlignVertical: "top",
  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  file: {
    height: hp(30),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "rgba(255,0,0,0.5)",
  },
});
