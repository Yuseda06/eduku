import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Pressable,
  Platform,
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

const textStyles = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

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

  const shadowStyles = Platform.select({
    web: {
      boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.06)",
    },
    default: {
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 1,
    },
  });

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
    if (!sentence || !sentence.trim()) return;

    const sentenceToSpeak = sentence.trim();

    // Use Web Speech API on web for better quality
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new window.SpeechSynthesisUtterance(sentenceToSpeak);
      utterance.lang = "en-US";
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Function to get and set the best available voice
      const setBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();

        // Priority order: Google, Microsoft, Natural, then any English voice
        const preferredVoice =
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              (voice.name.includes("Google") ||
                voice.name.includes("Google US"))
          ) ||
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              (voice.name.includes("Microsoft") || voice.name.includes("Zira"))
          ) ||
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") && voice.name.includes("Natural")
          ) ||
          voices.find((voice) => voice.lang.startsWith("en-US")) ||
          voices.find((voice) => voice.lang.startsWith("en"));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      };

      // Try to get voices immediately
      setBestVoice();

      // If voices aren't loaded yet, wait for the voiceschanged event
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          setBestVoice();
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // Fallback to expo-speech for native platforms
      Speech.speak(sentenceToSpeak, { language: "en" });
    }
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
    // Clean the word of punctuation for pronunciation
    const cleanWord = word.replace(/[.,!?;:()\[\]{}'"]/g, "");
    if (!cleanWord.trim()) return;

    const wordToSpeak = cleanWord.trim();

    // Use Web Speech API on web for better quality
    if (
      Platform.OS === "web" &&
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    ) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new window.SpeechSynthesisUtterance(wordToSpeak);
      utterance.lang = "en-US";
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Function to get and set the best available voice
      const setBestVoice = () => {
        const voices = window.speechSynthesis.getVoices();

        // Priority order: Google, Microsoft, Natural, then any English voice
        const preferredVoice =
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              (voice.name.includes("Google") ||
                voice.name.includes("Google US"))
          ) ||
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              (voice.name.includes("Microsoft") || voice.name.includes("Zira"))
          ) ||
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") && voice.name.includes("Natural")
          ) ||
          voices.find((voice) => voice.lang.startsWith("en-US")) ||
          voices.find((voice) => voice.lang.startsWith("en"));

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      };

      // Try to get voices immediately
      setBestVoice();

      // If voices aren't loaded yet, wait for the voiceschanged event
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          setBestVoice();
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // Fallback to expo-speech for native platforms
      Speech.speak(wordToSpeak, { language: "en" });
    }
  };

  // Split text into words for rendering
  const splitIntoWords = (text) => {
    if (!text) return [];
    // Split by spaces and filter out empty strings
    return text.split(/\s+/).filter((word) => word.length > 0);
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
          <View style={styles.essayTextContainer}>
            {(() => {
              const words = splitIntoWords(sentence);
              return words.map((word, index) => {
                const handleClick = () => {
                  handleWordPress(word);
                };

                if (Platform.OS === "web") {
                  return (
                    <Pressable
                      key={`word-${index}-${word}`}
                      onPress={handleClick}
                      style={({ pressed }) => [
                        styles.wordPressableWeb,
                        pressed && { opacity: 0.6 },
                      ]}
                    >
                      <Text style={styles.essayText}>{word}</Text>
                      {index < words.length - 1 ? <Text> </Text> : null}
                    </Pressable>
                  );
                }

                return (
                  <TouchableOpacity
                    key={`word-${index}-${word}`}
                    onPress={handleClick}
                    activeOpacity={0.7}
                    style={styles.wordPressable}
                    hitSlop={{ top: 5, bottom: 5, left: 2, right: 2 }}
                  >
                    <Text style={styles.essayText} pointerEvents="none">
                      {word}
                      {index < words.length - 1 ? " " : ""}
                    </Text>
                  </TouchableOpacity>
                );
              });
            })()}
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
    ...(Platform.OS === "web" ? {} : { shadowColor: "#000" }),
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
  essayTextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 5,
    ...(Platform.OS === "web" && {
      pointerEvents: "auto",
    }),
  },
  wordPressable: {
    marginRight: 2,
    paddingVertical: 4,
    paddingHorizontal: 2,
    minHeight: 20,
    justifyContent: "center",
  },
  wordPressableWeb: {
    marginRight: 2,
    paddingVertical: 4,
    paddingHorizontal: 2,
    display: "inline-block",
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    WebkitTouchCallout: "none",
    zIndex: 10,
    position: "relative",
  },
  wordPressed: {
    opacity: 0.6,
  },
  essayText: {
    fontSize: hp(2),
    color: theme.colors.primary,
    lineHeight: hp(3),
    display: "inline",
    pointerEvents: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    cursor: "inherit",
  },
});
