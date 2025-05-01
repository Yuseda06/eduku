import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import { RadioButton } from "react-native-paper"; // Ensure you have installed react-native-paper
import { theme } from "../../constants/theme";
import { fetchAllQuiz } from "../../services/quizService";
import { useRouter, useLocalSearchParams } from "expo-router";
import { hp } from "../../helpers/common";
import { Ionicons } from "@expo/vector-icons";
// Adjust the path accordingly

const Quiz = (props) => {
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [results, setResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [checkButtonEnabled, setCheckButtonEnabled] = useState(false);

  const { chapter } = useLocalSearchParams();

  useEffect(() => {
    // Fetch quiz data from Supabase

    const fetchQuiz = async () => {
      const { success, data, msg } = await fetchAllQuiz(chapter);

      if (success) {
        setQuizData(data);
        setSelectedOptions(Array(data.length).fill(null));
        setResults(
          Array(data.length).fill({ correct: null, correctAnswer: null })
        );
      } else {
        console.log(msg);
      }
      setLoading(false);
    };

    fetchQuiz();
  }, []);

  const checkAnswers = () => {
    const results = quizData.map((question, index) => {
      const userAnswer = selectedOptions[index];
      const correctOption = question.options.find(
        (option) => option.is_correct
      );

      const isCorrect =
        userAnswer !== null &&
        correctOption &&
        question.options[userAnswer]?.text === correctOption.text;

      return {
        correct: isCorrect,
        correctAnswer: correctOption ? correctOption.text : null,
      };
    });
    setResults(results);
  };

  const tryAgain = () => {
    setSelectedOptions(Array(quizData.length).fill(null));
    setResults(
      Array(quizData.length).fill({ correct: null, correctAnswer: null })
    );
  };

  const correctCount = results.filter((result) => result.correct).length;

  if (loading) {
    return (
      <ScreenWrapper>
        <Text>Loading...</Text>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={{ width: "100%", marginLeft: 12 }}>
        <Header
          title="Quiz"
          subtitle={`Quiz title: General Knowledge, ${quizData.length} questions, ${correctCount} correct`}
        />
        <View>
          {/* <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: theme.colors.primary,
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            🌟 General Knowledge 🌟
          </Text> */}
          <Text
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: theme.colors.primary,
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            {quizData.length} Questions
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "grey",
              textAlign: "center",
              marginVertical: 10,
            }}
          >
            {correctCount} Correct Answers
          </Text>
        </View>
      </View>
      <ScrollView
        style={{
          marginTop: 20,
          paddingHorizontal: 12,
          marginBottom: 40,
        }}
      >
        {quizData.map((question, index) => (
          <View
            key={question.id}
            style={{
              marginBottom: 20,
              alignItems: "flex-start",
              marginHorizontal: 16,
            }}
          >
            <Text style={styles.questionText}>
              {index + 1}. {question.question}
            </Text>
            {question.options.map((option, optionIndex) => (
              <View key={option.id} style={styles.optionContainer}>
                <View
                  style={{
                    ...styles.circle,
                    backgroundColor:
                      results[index].correctAnswer === option.text
                        ? theme.colors.rose
                        : selectedOptions[index] === optionIndex
                        ? theme.colors.primary
                        : "white",
                  }}
                />
                <RadioButton
                  value={optionIndex}
                  status={
                    selectedOptions[index] === optionIndex
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() =>
                    setSelectedOptions(
                      selectedOptions.map((opt, i) =>
                        i === index ? optionIndex : opt
                      )
                    )
                  }
                  color={theme.colors.primary}
                />
                <Text style={{ marginLeft: 10 }}>{option.text}</Text>
              </View>
            ))}
          </View>
        ))}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity>
                <Ionicons
                  name="close"
                  size={24}
                  color="black"
                  onPress={() => setModalVisible(false)}
                />
              </TouchableOpacity>
              <Text style={styles.modalText}>
                Enter your password to check answers
              </Text>
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Password"
                secureTextEntry={true}
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => {
                  if (password === "quiz") {
                    setCheckButtonEnabled(true);
                    setModalVisible(false);
                    checkAnswers();
                    setPassword("");
                  } else {
                    Alert.alert("Wrong password", "Please try again");
                  }
                }}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={[styles.checkButton, { borderRadius: 50, padding: 10 }]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.modalButtonText}>Check Answers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.checkButton,
            {
              marginTop: 20,
              backgroundColor: theme.colors.rose,
              borderRadius: 50,
              padding: 10,
            },
          ]}
          onPress={tryAgain}
        >
          <Text style={styles.modalButtonText}>Try Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "left",
  },
  optionContainer: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginRight: 16,
  },
  circle: {
    position: "absolute",
    left: 3,
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "grey",
    marginRight: 10,
  },
  checkButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    marginHorizontal: 12,
  },
  checkButtonText: {
    color: "white",
    textAlign: "center",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
    color: "grey",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: "auto",
    borderColor: "gray",
    borderWidth: 1,
    fontSize: hp(2),
    padding: 14,
    borderRadius: 10,
  },
  modalText: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: "center",
    fontSize: hp(2),
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: hp(2.5),
  },
});

export default Quiz;
