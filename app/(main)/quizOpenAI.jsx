import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  getResponse
} from "../../services/openAIApi";
import { theme } from "../../constants/theme";
import Header from "../../components/Header";

const QuizOpenAI = () => {
  const [answers, setAnswers] = useState({});
  const [response, setResponse] = useState("");
  const [parsedResponse, setParsedResponse] = useState(null);
  const [password, setPassword] = useState("");
  const [compareAnswers, setCompareAnswers] = useState(0);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("Select Level");
  const [selectedGrade, setSelectedGrade] = useState("Select Grade");
  const [selectedSubject, setSelectedSubject] = useState("Select Subject");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [showAnswers, setShowAnswers] = useState(false);
  const [isGradeModalVisible, setIsGradeModalVisible] = useState(false);
  const [isLevelModalVisible, setIsLevelModalVisible] = useState(false);
  const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);
  const [isModelModalVisible, setIsModelModalVisible] = useState(false);
  const quizData = parsedResponse?.questions;

  useEffect(() => {
    if (response) {
      try {
        const jsonStart = response.indexOf("{");
        const jsonEnd = response.lastIndexOf("}") + 1;
        const jsonData = response.slice(jsonStart, jsonEnd);
        const jsonObject = JSON.parse(jsonData);
        setParsedResponse(jsonObject);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    }
  }, [response]);

  const handleOptionChange = (questionIndex, option) => {
    setAnswers({
      ...answers,
      [questionIndex]: option,
    });
  };

  const resetQuiz = () => {
    setAnswers({});
    setResponse("");
    setParsedResponse(null);
    setCompareAnswers(0);
    setPassword("");
    setPasswordModalVisible(false);
  };

  const handleSubmit = () => {
    setPasswordModalVisible(true);
  };

  const checkPassword = () => {
    if (password === "dfgnm") {
      let correctCount = 0;
      quizData?.forEach((question, index) => {
        if (answers[index] && answers[index] === question.answer) {
          correctCount++;
        }
      });

      setCompareAnswers(correctCount);
      setShowAnswers(true);

      setPassword(""); // Close the modal
    } else {
      Alert.alert("Password Incorrect", "Please try again.");
    }
  };

  const handleGetResponse = async () => {
    setShowAnswers(false);
    setIsLoading(true); // Start loading
    try {
      const res = await getResponse({
        subject: selectedSubject,
        chapter: selectedChapter,
        grade: selectedGrade,
        level: selectedLevel,
        model: selectedModel,
      });
      console.log("API Response >>>>>>>>>>>>>>>>:", res); // <<< TENGOK KAT CONSOLE NI
      setResponse(res);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false); // End loading
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
  };

  const handleSelectGrade = (grade) => {
    setSelectedGrade(grade);
  };

  const handleSelectSubject = (subject) => {
    setSelectedSubject(subject);
  };

  const handleSelectChapter = (chapter) => {
    setSelectedChapter(chapter);
  };

  const handleSelectModel = (model) => {
    setSelectedModel(model);
  };

  return (
    <ScreenWrapper>
      <View style={[styles.headerView, { marginLeft: 16 }]}>
        <Header title="Quiz Time" />
      </View>

      <ScrollView
        style={{ flex: 1, padding: 16, position: "relative", height: "100%" }}
      >
        <View>
          {!response && (
            <View style={styles.dropdownContainer}>
              <View style={styles.dropdownWrapper}>
                <Text style={styles.label}>Level:</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setIsLevelModalVisible(true)}
                >
                  <Text>{selectedLevel}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dropdownWrapper}>
                <Text style={styles.label}>Grade:</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setIsGradeModalVisible(true)}
                >
                  <Text>{selectedGrade}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dropdownWrapper}>
                <Text style={styles.label}>Subject:</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setIsSubjectModalVisible(true)}
                >
                  <Text>{selectedSubject}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dropdownWrapper}>
                <Text style={styles.label}>Chapter:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setSelectedChapter}
                  value={selectedChapter}
                  placeholder=""
                  keyboardType="default"
                />
              </View>

              <View style={styles.dropdownWrapper}>
                <Text style={styles.label}>Model:</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setIsModelModalVisible(true)}
                >
                  <Text>{selectedModel}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleGetResponse}
                style={{
                  backgroundColor: "white",
                  padding: 15,
                  borderRadius: 25,
                  alignItems: "center",
                  marginTop: 20,
                  marginBottom: 50,
                  width: "90%",
                  alignSelf: "center",
                  borderWidth: 1,
                  borderColor: theme.colors.primary,
                }}
              >
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Build The Quiz
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading ? ( // Conditional rendering based on isLoading
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <View style={{ marginBottom: 100 }}>
              {quizData?.map((question, index) => (
                <Question
                  key={index}
                  question={question}
                  questionIndex={index}
                  selectedOption={answers[index]}
                  handleOptionChange={handleOptionChange}
                  showAnswers={showAnswers}
                />
              ))}
            </View>
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isPasswordModalVisible}
          onRequestClose={() => {
            setPasswordModalVisible(!isPasswordModalVisible);
            resetQuiz();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView1}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1,
                  padding: 8,
                }}
                onPress={() => setPasswordModalVisible(false)}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
              </TouchableOpacity>

              {showAnswers && (
                <View
                  style={{
                    backgroundColor: theme.colors.roseLight,
                    padding: 12,
                    borderRadius: 8,
                    marginHorizontal: 16,
                    marginBottom: 16,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "auto",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 30,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Score: {compareAnswers} / {quizData?.length - 1 || 0}
                  </Text>
                </View>
              )}
              <Text style={styles.modalText}>Enter Password:</Text>
              <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => checkPassword()}
              >
                <Text style={styles.textStyleSubmit}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isGradeModalVisible}
          onRequestClose={() => setIsGradeModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1,
                  padding: 8,
                }}
                onPress={() => setIsGradeModalVisible(false)}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                {[
                  "Grade 1",
                  "Grade 2",
                  "Grade 3",
                  "Grade 4",
                  "Grade 5",
                  "Grade 6",
                ].map((grade) => (
                  <TouchableOpacity
                    key={grade}
                    style={styles.modalButton}
                    onPress={() => {
                      handleSelectGrade(grade);
                      setIsGradeModalVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>{grade}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isLevelModalVisible}
          onRequestClose={() => setIsLevelModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1,
                  padding: 8,
                }}
                onPress={() => setIsLevelModalVisible(false)}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                {["Primary", "Secondary"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={styles.modalButton}
                    onPress={() => {
                      handleSelectLevel(level);
                      setIsLevelModalVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModelModalVisible}
          onRequestClose={() => setIsModelModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1,
                  padding: 8,
                }}
                onPress={() => setIsModelModalVisible(false)}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                {["gpt-4o", "gpt-4o-mini", "o1-preview"].map((model) => (
                  <TouchableOpacity
                    key={model}
                    style={styles.modalButton}
                    onPress={() => {
                      handleSelectModel(model);
                      setIsModelModalVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>{model}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isSubjectModalVisible}
          onRequestClose={() => setIsSubjectModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  zIndex: 1,
                  padding: 8,
                }}
                onPress={() => setIsSubjectModalVisible(false)}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>✕</Text>
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                {[
                  "Mathematics",
                  "Science",
                  "English",
                  "Bahasa Melayu",
                  "History",
                  "Geography",
                  "Pendidikan Islam",
                  "Pendidikan Jasmani",
                  "Pendidikan Seni Visual",
                  "Physics",
                  "Economics",
                  "Accounting",
                  "Chemistry",
                  "Biology",
                  "Bahasa Arab",
                ].map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={styles.modalButton}
                    onPress={() => {
                      handleSelectSubject(subject);
                      setIsSubjectModalVisible(false);
                    }}
                  >
                    <Text style={styles.textStyle}>{subject}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ScrollView>

      {response && (
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: theme.colors.primary,
            padding: 15,
            borderRadius: 25,
            alignItems: "center",
            marginTop: 20,
            marginBottom: 50,
            width: "90%",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Submit Quiz
          </Text>
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
};

const Question = ({
  question,
  questionIndex,
  selectedOption,
  handleOptionChange,
  showAnswers,
}) => {
  return (
    <View style={{ marginBottom: 20, marginRight: 30 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: questionIndex === 0 ? theme.colors.rose : "#000",
        }}
      >
        {questionIndex === 0
          ? `${question.question}`
          : `${questionIndex}. ${question.question}`}
      </Text>
      {question.options.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          onPress={() => handleOptionChange(questionIndex, option)}
          disabled={showAnswers}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 8,
            }}
          >
            {questionIndex === 0 ? (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 9,
                  backgroundColor: theme.colors.primary,
                  marginRight: 8,
                  marginTop: 2,
                }}
              />
            ) : (
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: showAnswers
                    ? option === question.answer
                      ? theme.colors.primary
                      : option === selectedOption
                      ? theme.colors.roseLight
                      : "#777"
                    : selectedOption === option
                    ? theme.colors.primary
                    : "#777",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                  backgroundColor: showAnswers
                    ? option === question.answer
                      ? theme.colors.primary
                      : option === selectedOption
                      ? theme.colors.roseLight
                      : theme.colors.gray
                    : theme.colors.gray,
                }}
              >
                {selectedOption === option && (
                  <View
                    style={{
                      height: 10,
                      width: 10,
                      borderRadius: 5,
                      backgroundColor: theme.colors.primary,
                    }}
                  />
                )}
              </View>
            )}

            <Text>{option}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 22,
  },

  modalView1: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: "auto",
    width: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: "40%",
    width: "80%",
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
    height: 40,
    marginVertical: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 30,
  },
  buttonClose: {
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    color: "white",
  },
  textStyle: {
    color: theme.colors.textDark,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  textStyleSubmit: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  dropdownContainer: {
    padding: 10,
    backgroundColor: "#f2f2f2", // Light grey background for the dropdown container
  },
  dropdownWrapper: {
    marginBottom: 20, // Space between dropdowns
  },
  dropdown: {
    backgroundColor: "white", // Background color for dropdown
    padding: 10,
    borderRadius: 5, // Rounded corners for the dropdown
    borderWidth: 1,
    borderColor: "#ccc", // Light grey border for the dropdown
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5, // Space between label and dropdown
  },
  modalButton: {
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
});

export default QuizOpenAI;
