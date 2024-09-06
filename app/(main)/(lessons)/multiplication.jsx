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

const useMultiplicationQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setQuestions(generateMultiplicationQuestions());
  }, []);

  return questions;
};

const QuestionCard = ({ question, answer, onAnswer }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    const correct = parseInt(userAnswer) === answer;
    setIsCorrect(correct);
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
      <TouchableOpacity
        style={{
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
        }}
        onPress={handleSubmit}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Submit
        </Text>
      </TouchableOpacity>
      {isCorrect !== null && (
        <Text style={isCorrect ? styles.correctText : styles.incorrectText}>
          {isCorrect ? "Correct!" : "Incorrect. Try again!"}
        </Text>
      )}
    </View>
  );
};

const Multiplication = () => {
  const router = useRouter();
  const questions = useMultiplicationQuestions();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (correct) => {
    if (correct) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
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
        <Text style={styles.scoreText}>
          Score: {score}/{questions.length}
        </Text>
        {questions.length > 0 && (
          <QuestionCard
            question={questions[currentQuestionIndex].question}
            answer={questions[currentQuestionIndex].answer}
            onAnswer={handleAnswer}
          />
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
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.94,
    elevation: 5,
  },
  questionText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  answerInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    height: 50,
    fontSize: 18,
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
});
