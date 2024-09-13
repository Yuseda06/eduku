import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ScreenWrapper from "../../../components/ScreenWrapper";
import Header from "../../../components/Header";
import { Pressable } from "react-native";
import { hp } from "../../../helpers/common";
import { theme } from "../../../constants/theme";
import { useRouter } from "expo-router";
import Icon from "../../../assets/icons";
import { useEffect, useState } from "react";
import { Button } from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";

const generateMultiplicationQuestions = () => {
  const questions = [];
  for (let i = 0; i < 20; i++) {
    const num1 = Math.floor(Math.random() * 10) + 3; // Random number between 3 and 12
    const num2 = Math.floor(Math.random() * 10) + 3; // Random number between 3 and 12
    questions.push({
      id: i + 1,
      question: `${num1} × ${num2} = ?`,
      answer: num1 * num2,
    });
  }
  return questions;
};

const useMultiplicationQuestions = (selectedNumber) => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const newQuestions = [];
    while (newQuestions.length < 20) {
      const num1 =
        selectedNumber === "random"
          ? Math.floor(Math.random() * 9) + 4
          : selectedNumber || Math.floor(Math.random() * 9) + 4;
      const num2 = Math.floor(Math.random() * 9) + 4;
      if (
        selectedNumber === "random" ||
        !selectedNumber ||
        num1 === selectedNumber ||
        num2 === selectedNumber
      ) {
        newQuestions.push({
          id: newQuestions.length + 1,
          question: `${num1} × ${num2} = ?`,
          answer: num1 * num2,
        });
      }
    }
    setQuestions(newQuestions);
  }, [selectedNumber]);

  return questions;
};

const QuestionCard = ({ question, answer, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const speakFeedback = (correct) => {
    Speech.speak(correct ? "Correct" : "Wrong", {
      language: "en",
      pitch: 1,
      rate: 0.75,
    });
  };

  const handleSubmit = () => {
    const correct = parseInt(userAnswer) === answer;
    setIsCorrect(correct);
    speakFeedback(correct);
    onAnswer(correct);
    setUserAnswer("");
  };

  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{question}</Text>
      <TextInput
        style={styles.answerInput}
        keyboardType="numeric"
        value={userAnswer}
        onChangeText={setUserAnswer}
        placeholder="Enter your answer"
        placeholderTextColor={theme.colors.textLight}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      {isCorrect !== null && (
        <Text
          style={[
            styles.feedbackText,
            isCorrect ? styles.correctText : styles.incorrectText,
          ]}
        >
          {isCorrect ? "Correct!" : "Incorrect. Try again!"}
        </Text>
      )}
    </View>
  );
};

const Multiplication = () => {
  const router = useRouter();
  const [selectedNumber, setSelectedNumber] = useState(null);
  const questions = useMultiplicationQuestions(selectedNumber);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleNumberSelection = (number) => {
    setSelectedNumber(number);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const handleAnswer = (correct) => {
    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore === 20) {
        Speech.speak("Hurray! You've completed all 20 questions correctly!", {
          language: "en",
          pitch: 1,
          rate: 0.75,
        });
      }
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const renderNumberButtons = () => {
    const buttons = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
      <TouchableOpacity
        key={num}
        style={[
          styles.numberButton,
          selectedNumber === num && styles.selectedButton,
        ]}
        onPress={() => handleNumberSelection(num)}
      >
        <Text style={styles.numberButtonText}>{num}</Text>
      </TouchableOpacity>
    ));

    buttons.push(
      <TouchableOpacity
        key="random"
        style={[styles.numberButton, styles.randomButton]}
        onPress={() => handleNumberSelection("random")}
      >
        <Text style={styles.numberButtonText}>Random</Text>
      </TouchableOpacity>
    );

    return buttons;
  };

  return (
    <ScreenWrapper>
      <View style={{ marginLeft: 12 }}>
        <Header title="Multiplication" />
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
      <View style={styles.container}>
        <Text style={styles.instructionText}>Select a number to practice:</Text>
        <View style={styles.numberButtonsContainer}>
          {renderNumberButtons()}
        </View>
        {selectedNumber && (
          <>
            <Text style={styles.scoreText}>
              Score: {score}/{questions.length}
            </Text>
            {currentQuestionIndex < questions.length ? (
              <QuestionCard
                question={questions[currentQuestionIndex].question}
                answer={questions[currentQuestionIndex].answer}
                onAnswer={handleAnswer}
              />
            ) : (
              <Text style={styles.completionText}>
                You've completed all questions!
              </Text>
            )}
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Multiplication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  questionCard: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  answerInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  correctText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 18,
  },
  incorrectText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 18,
  },
  numberButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  numberButton: {
    padding: 10,
    margin: 5,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
  },
  selectedButton: {
    backgroundColor: theme.colors.secondary,
  },
  numberButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  randomButton: {
    backgroundColor: "red",
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: theme.radius.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  feedbackText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  completionText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
