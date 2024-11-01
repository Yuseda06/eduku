import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import Icon from "../../assets/icons";
import { hp } from "../../helpers/common";
import { theme } from "../../constants/theme";

const Fraction = () => {
  const [numerator, setNumerator] = useState(0);
  const [denominator, setDenominator] = useState(0);
  const [answerWhole, setAnswerWhole] = useState(0);
  const [answerNumerator, setAnswerNumerator] = useState(0);
  const [answerDenominator, setAnswerDenominator] = useState(0);
  const [result, setResult] = useState("");

  const generateFraction = () => {
    const newDenominator = Math.floor(Math.random() * 10) + 2;
    const newNumerator =
      Math.floor(Math.random() * (50 - newDenominator + 1)) + newDenominator;
    setNumerator(newNumerator);
    setDenominator(newDenominator);
    setAnswerWhole(0);
    setAnswerNumerator(0);
    setAnswerDenominator(0);
  };

  const checkAnswer = () => {
    const userAnswer = answerWhole + answerNumerator / answerDenominator;
    const correctAnswer = numerator / denominator;
    if (userAnswer === correctAnswer) {
      setResult("Correct!");
    } else {
      setResult(
        `Incorrect. The correct answer is ${Math.floor(correctAnswer)} ${
          correctAnswer % 1 !== 0 ? correctAnswer % 1 : ""
        }`
      );
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <View style={{ width: "100%", marginLeft: 12 }}>
          <Header title="Fraction" />
          {/* <Pressable
            title="Fraction"
            onPress={() => router.push("notifications")}
            style={{
              alignSelf: "flex-end",
              marginTop: -32,
              marginRight: 12,
              marginBottom: 20,
            }}
          >
            <Icon name="edit" size={hp(3.2)} color={theme.colors.textLight} />
          </Pressable> */}
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
          <View style={styles.centerView}>
            <TouchableOpacity onPress={generateFraction}>
              <Text style={styles.centerText}>Generate Fraction</Text>
            </TouchableOpacity>
            {numerator !== 0 && denominator !== 0 && (
              <View style={styles.centerView}>
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.fraction}>{numerator}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.fraction}>{denominator}</Text>
                  </View>

                  <Text style={{ fontSize: 32, alignSelf: "center" }}> = </Text>

                  <View
                    style={{
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={styles.fraction}>{numerator}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.fraction}>{denominator}</Text>
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={String(answerWhole)}
                    onChangeText={(text) => setAnswerWhole(Number(text))}
                    keyboardType="numeric"
                    placeholder="Enter the whole number"
                  />
                  <TextInput
                    style={styles.input}
                    value={String(answerNumerator)}
                    onChangeText={(text) => setAnswerNumerator(Number(text))}
                    keyboardType="numeric"
                    placeholder="Enter the numerator"
                  />
                  <TextInput
                    style={styles.input}
                    value={String(answerDenominator)}
                    onChangeText={(text) => setAnswerDenominator(Number(text))}
                    keyboardType="numeric"
                    placeholder="Enter the denominator"
                  />
                </View>
                <TouchableOpacity onPress={checkAnswer}>
                  <Text style={styles.centerText}>Check Answer</Text>
                </TouchableOpacity>
                {result !== "" && (
                  <Text style={[styles.centerText, styles.result]}>
                    {result}
                  </Text>
                )}
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenWrapper>
  );
};

export default Fraction;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  centerView: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
  },
  fraction: {
    fontSize: 32,
    textAlign: "center",
    textAlignVertical: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  input: {
    fontSize: 24,
    textAlign: "center",
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    margin: 5,
  },
  divider: {
    width: 50,
    height: 2,
    backgroundColor: "#000",
    alignSelf: "center",
    marginVertical: 10,
  },
  result: {
    fontSize: 24,
    color: "red",
    margin: 10,
  },
});
