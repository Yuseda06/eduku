import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "../assets/icons";
import RenderHtml from "react-native-render-html";
import { getSupabaseFileUrl } from "../services/imageService";
import { Video } from "expo-av";
import * as Speech from "expo-speech";
import ScreenWrapper from "../components/ScreenWrapper";
import queryString from "query-string";
import * as ScreenOrientation from "expo-screen-orientation";
import { deleteEssay } from "../services/essayService";
import { useRouter } from "expo-router";
import { getUserData } from "../services/userService";

const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const textStyles = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const EssayCard = ({ item, currentUser, hasShadow = true, allUsers }) => {
  const liked = false;
  const likes = [];
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [sentence, setSentence] = useState(item?.essay);
  const [voices, setVoices] = useState([]);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");

  useEffect(() => {
    setSentence(item?.essay.replace(/<\/?[^>]+(>|$)/g, ""));
  }, [item]);

  useEffect(() => {
    if (allUsers && allUsers.data) {
      const matchingUser = allUsers.data.find(
        (user) => user.id === item.userId
      );
      if (matchingUser) {
        setUserName(matchingUser.name);
        setUserImage(matchingUser.image);
      }
    }
  }, [allUsers, item.userId]);

  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const createdAt = moment(item?.created_at).format("MMM D, h:mm A");

  const openPostDetails = () => {
    router.push("postDetails", { post: item });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    let res = await deleteEssay(id);
    setLoading(false);
  };

  useEffect(() => {
    // Unlock the screen orientation to allow all orientations
    ScreenOrientation.unlockAsync();
  }, []);

  const handleSentencePress = async (sentence) => {
    Speech.speak(sentence);
  };

  const handleTranslate = async (word) => {
    // Translate the word
    try {
      const translation = await translate(word, "en", "ms"); // Translate to Malay (ms)

      Alert.alert(capitalizeFirstWord(translation));
    } catch (error) {}
  };

  const capitalizeFirstWord = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleWordPress = (word) => {
    Speech.speak(word);
  };

  const translate = async (text, sourceLanguage, targetLanguage) => {
    const params = {
      key: "AIzaSyBxHV4XrCiO-4vwU8flCtvmyJQvlT78ZZQ", // Replace with your Google Translate API key
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
    };

    const url = `https://translation.googleapis.com/language/translate/v2?${queryString.stringify(
      params
    )}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    setSentence(item?.essay.replace(/<\/?[^>]+(>|$)/g, ""));
  }, []);

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar size={hp(4.5)} uri={userImage} rounded={theme.radius.md} />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{userName}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity onPress={Speech.stop}>
            <Icon
              name="stop"
              size={hp(3.6)}
              strokeWidth={1}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSentencePress(sentence)}>
            <Icon
              name="read"
              size={hp(3.6)}
              strokeWidth={1}
              color={theme.colors.textLight}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item?.id)}>
            <Icon
              name="delete"
              size={hp(3.4)}
              strokeWidth={1}
              color={theme.colors.rose}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <Text
          style={[
            styles.username,
            {
              marginTop: 30,
              fontSize: hp(2.6),
              fontFamily: "arial",
              fontWeight: "600",
              textAlign: "center",
              color: theme.colors.primary,
            },
          ]}
        >
          {item?.title}
        </Text>

        <View style={styles.postBody}>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 40 }}
          >
            {sentence.split(" ").map((word, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleWordPress(word)}
                onLongPress={() => handleTranslate(word)}
                style={{ marginRight: 2 }}
              >
                <Text style={{ fontSize: 18 }}>
                  {word + (index < sentence.split(" ").length - 1 ? " " : "")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default EssayCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 30,

    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
    height: "auto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  postTime: {
    fontSize: hp(1.4),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  postMedia: {
    borderCurve: "continuous",
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
  },
  postBody: {
    marginLeft: 5,
    marginTop: 20,
  },
  username: {
    fontSize: hp(2.2),
    color: theme.colors.textDark,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: hp(1.8),
  },
});
