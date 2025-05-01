import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  deleteEssay,
  fetchAllEssay,
  fetchEssay,
} from "../../../services/essayService";
import { getAllUsers, getUserData } from "../../../services/userService";
import { supabase } from "../../../lib/supabase";
import ScreenWrapper from "../../../components/ScreenWrapper";
import { hp, wp } from "../../../helpers/common";
import PostCard from "../../../components/PostCard";
import Loading from "../../../components/Loading";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../contexts/AuthContext";
import Header from "../../../components/Header";
import { useRouter } from "expo-router";
import EssayCard from "../../../components/EssayCard";
import Button from "../../../components/Button";
import Icon from "../../../assets/icons";
import { ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// New LessonCard component
const LessonCard = ({ title, onPress, colors }) => (
  <TouchableOpacity onPress={onPress} style={styles.lessonCard}>
    <LinearGradient
      colors={colors}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.lessonTitle}>{title}</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const Lessons = () => {
  const [essays, setEssays] = useState([]);
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  const lessonsList = [
    { id: 1, title: "Multiplication", colors: ["#ff9a9e", "#fad0c4"] },
    { id: 2, title: "Short Essay", colors: ["#fad0c4", "#ffd1ff"] },
    { id: 3, title: "Quiz", colors: ["#a1c4fd", "#c2e9fb"] },
    { id: 4, title: "Fraction", colors: ["#d4fc79", "#96e6a1"] },
    { id: 5, title: "Vocabulary", colors: ["#84fab0", "#8fd3f4"] },
  ];

  const goToLesson = (lesson) => {
    try {
      switch (lesson) {
        case "Multiplication":
          router.push("multiplication");
          break;
        case "Short Essay":
          router.push("essay");
          break;
        case "Fraction":
          router.push("fraction");
          break;
        case "Quiz":
          router.push("quizOpenAI");
          break;
        case "Vocabulary":
          router.push("vocabulary");
          break;
        default:
          console.error("Unknown lesson type:", lesson);
      }
    } catch (error) {
      console.error("Failed to navigate:", error);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <View style={styles.container}>
        <View style={{ marginLeft: 12 }}>
          <Header title="Lessons" />
          <Pressable
            title="Add Post"
            onPress={() => router.push("notifications")}
            style={{
              alignSelf: "flex-end",
              marginTop: -34,
              marginRight: 12,
              marginBottom: 20,
            }}
          >
            <Icon
              name="threeDotsHorizontal"
              size={hp(3.2)}
              color={theme.colors.textLight}
              strokeWidth={3.0}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* {response && <Text>{response}</Text>} */}
          {lessonsList.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              title={lesson.title}
              onPress={() => goToLesson(lesson.title)}
              colors={lesson.colors}
            />
          ))}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Lessons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(4),
    marginBottom: 10,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  title: {
    fontSize: hp(2.5),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.bold,
  },
  noPosts: {
    fontSize: hp(3.2),
    textAlign: "center",
    color: theme.colors.text,
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: hp(4.3),
    width: hp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    marginBottom: hp(1),
    gap: 10,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: theme.fonts.bold,
  },
  logout: {
    marginBottom: 50,
  },
  scrollContent: {
    marginTop: hp(3),
    paddingHorizontal: wp(4),
    paddingBottom: hp(3),
  },
  lessonCard: {
    borderRadius: 20,
    height: 80,
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lessonTitle: {
    color: "white",
    fontSize: hp(3),
    fontWeight: "bold",
    textAlign: "center",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
