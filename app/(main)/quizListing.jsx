import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { theme } from "../../constants/theme";
import { ChevronDown } from "react-native-feather";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { hp } from "../../helpers/common";
import { fetchAllChapter } from "../../services/quizService";
import Icon from "react-native-vector-icons/FontAwesome"; // Ensure you have installed react-native-vector-icons

const QuizListing = () => {
  const router = useRouter();

  const [expandedDarjah, setExpandedDarjah] = useState(false);
  const [expandedTingkatan, setExpandedTingkatan] = useState(false);
  const [expandedSubjectDarjah, setExpandedSubjectDarjah] = useState(false);
  const [expandedSubjectTingkatan, setExpandedSubjectTingkatan] =
    useState(false);

  const [subjectData, setSubjectData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [number, setNumber] = useState(null);

  const handlePressDarjah = () => setExpandedDarjah(!expandedDarjah);
  const handlePressTingkatan = () => setExpandedTingkatan(!expandedTingkatan);
  const handlePressSubjectDarjah = () =>
    setExpandedSubjectDarjah(!expandedSubjectDarjah);
  const handlePressSubjectTingkatan = () =>
    setExpandedSubjectTingkatan(!expandedSubjectTingkatan);

  useEffect(() => {
    subjectData?.length && setIsVisible(true);
  }, [subjectData]);

  const schoolSubjects = {
    primary: [
      "Bahasa Malaysia",
      "English Language",
      "Mathematics",
      "Science", // Standard 1-6
      "History", // Standard 4-6
      "Pendidikan Islam", // for Muslim students
    ],
    secondary: {
      core: [
        "Bahasa Malaysia",
        "English Language",
        "Mathematics",
        "Science", // Form 1-3
        "Sejarah", // Form 1-5
        "Pendidikan Islam", // for Muslim students
        "Geography", // Visual Arts Education
      ],
      lowerSecondary: [
        "Geography", // Form 1-3
        "Kemahiran Hidup", // Living Skills, Form 1-3
      ],
      upperSecondary: {
        scienceStream: [
          "Additional Mathematics",
          "Physics",
          "Chemistry",
          "Biology",
        ],
        artsStream: ["Economics", "Accountancy", "Business Studies"],
        electives: ["Information and Communications Technology (ICT)"],
      },
    },
  };

  const chapterModal = (subject) => {
    return (
      <View style={styles.modalContent}>
        {subjectData &&
          subjectData.map((chapter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chapterItem}
              onPress={() => {
                [
                  router.navigate({
                    pathname: "quiz",
                    params: { chapter: chapter },
                  }),
                  setIsVisible(false),
                ];
              }}
            >
              <Text style={styles.chapterText}>{chapter}</Text>
            </TouchableOpacity>
          ))}
      </View>
    );
  };

  const getCoreSubjects = (level) => {
    if (level === "primary") {
      return schoolSubjects.primary;
    } else if (level === "secondary") {
      return schoolSubjects.secondary.core;
    } else {
      return "Invalid level specified. Please use 'primary' or 'secondary'.";
    }
  };

  const makeSubject = (title) => {
    title = title.toLowerCase();
    const level = title === "primary" ? "standard" : "form"; // Define the level based on title
    const level_number = number; // Set level_number or retrieve it dynamically as needed

    return (
      <View style={styles.chapterContainer}>
        {getCoreSubjects(title).map((subject, index) => (
          <TouchableOpacity
            key={index}
            style={styles.subjectItem}
            onPress={() =>
              fetchSubject(subject.toLowerCase(), level, level_number)
            }
          >
            <Text style={styles.chapterText}>{subject}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const QuizCard = ({ title, text, expanded, onPressExpanded }) => (
    <View style={styles.quizCard}>
      <Pressable onPress={onPressExpanded} style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{title}</Text>
          <ChevronDown
            size={24}
            color={expanded ? theme.colors.text : theme.colors.textLight}
            style={styles.chevronIcon}
          />
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.cardContent}>
          {Array.from({ length: 6 }).map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.cardTextContainer,
                title === "Primary"
                  ? { backgroundColor: theme.colors.primary }
                  : { backgroundColor: theme.colors.roseLight },
              ]}
              onPress={() => {
                if (title === "Primary") {
                  handlePressSubjectDarjah();
                } else {
                  handlePressSubjectTingkatan();
                }
                setNumber(i + 1);
              }}
            >
              <Text style={styles.cardText}>{i + 1}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const fetchSubject = async (subject, level, level_number) => {
    const { success, data, msg } = await fetchAllChapter(
      subject,
      level,
      level_number
    );

    if (success) {
      setSubjectData(data);
    } else {
      console.log(msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.headerView}>
        <Header title="Quiz List" />
      </View>

      <ScrollView>
        <QuizCard
          title="Primary"
          expanded={expandedDarjah}
          onPressExpanded={handlePressDarjah}
          text={"Peta lakar"}
        />
        {expandedSubjectDarjah && makeSubject("primary")}
        <QuizCard
          title="Secondary"
          expanded={expandedTingkatan}
          onPressExpanded={handlePressTingkatan}
        />
        {expandedSubjectTingkatan && makeSubject("secondary")}
        <Modal animationType="slide" transparent={true} visible={isVisible}>
          <View style={styles.centeredView}>
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={hp(4)} color="white" />
            </TouchableOpacity>
            {chapterModal()}
          </View>
        </Modal>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    marginBottom: 30,
  },
  cardTextContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chapterItem: {
    marginHorizontal: 16,
    marginVertical: 5,
    marginTop: 10,
  },
  chapterText: {
    color: "black",
    fontSize: hp(3),
  },
  card: {
    borderRadius: 10,
    marginTop: 10,
  },
  cardHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: "grey",
  },
  cardContent: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  cardText: {
    fontSize: hp(4),
    color: "white",
    paddingVertical: 2,
  },
  quizCard: {
    marginTop: 10,
    flexDirection: "column",
  },
  chevronIcon: {
    marginLeft: 10,
  },
  subjectItem: {
    marginHorizontal: 16,
    marginVertical: 5,
    marginTop: 10,
  },
  headerView: {
    width: "100%",
    marginLeft: 12,
  },
});

export default QuizListing;
