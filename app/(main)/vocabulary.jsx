import React, { useState, useEffect, useRef } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Header from "../../components/Header";
import {
  Pressable,
  Text,
  View,
  Modal,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "../../assets/icons";
import { hp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { useRouter } from "expo-router";
import {
  fetchAllVocab,
  insertVocab,
  deleteVocab,
  editVocab,
} from "../../services/vocabService";
import { FlatList } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

import {
  playTextAsSpeech,
  getTranslation,
  generateImage,
  getSentence,
  generateSpeechToFile,
  getAnswerAndChoicesFromWord,
} from "../../services/openAIApi";

import { insertScore } from "../../services/scoreService";

// Define styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  userInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  userDate: {
    marginTop: 5,
    fontSize: 16,
    color: "black",
  },
  wordText: {
    marginTop: 10,
    fontSize: 16,
    color: "gray",
  },
  interactionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  interactionGroup: {
    flexDirection: "row",
  },
  interactionIcon: {
    marginLeft: 5,
  },
});

const Vocabulary = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [vocab, setVocab] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [sentence, setSentence] = useState("");
  const [editId, setEditId] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const flatListRef = useRef();
  const [apiLoading, setApiLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [choices, setChoices] = useState("");


  useEffect(() => {
    const fetchVocab = async () => {
      setLoading(true);
      const res = await fetchAllVocab(user, page, limit);
      if (res.success) {
        setVocab(res.data);
      } else {
        // Handle error here, e.g., show a message
      }
      setLoading(false);
    };

    fetchVocab();
  }, [page, limit]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = (id) => {
    setLoading(true);
    deleteVocab(id).then((res) => {
      if (res.success) {
        setVocab(vocab.filter((item) => item.id !== id));
      }
      setLoading(false);
    });
  };

  const handleEdit = (id) => {
    setModalVisible(true);
    setEditId(id);
    setWord(vocab.find((item) => item.id === id).word);
    setTranslation(vocab.find((item) => item.id === id).translation);
    setSentence(vocab.find((item) => item.id === id).sentence);
    setIsEdit(true);
  };

  const mapUUID = (id) => {
    if (!id) return null;
  
    const trimmedId = id.trim();
    const childMap = {
      "e56a7fe1-0181-4293-a566-84cd07a384c6": "zakwan",
      "3e4c5b1d-ccfb-4e93-8de2-c75c30e4642d": "naufal",
      "aeffb8fa-547a-4c5e-8cf0-2a491816532e": "irfan",
    };
  
    return childMap[trimmedId] || null;
  };
  

  const onSubmit = async () => {
    setLoading(true);
    setModalVisible(false);
  
    const mappedChild = mapUUID(user?.id);
    console.log("Mapped Child:", mappedChild);
  
    let data = {
      word,
      translation,
      sentence,
      answer,
      choices: choices.split(",").map(item => item.trim()),
      user_id: user?.id,
      child_id: mappedChild, // Now should be proper value
    };
  
    let res = await insertVocab(data);
  
    if (res.success) {
      setVocab([res.data, ...vocab]);
    }
  
    setLoading(false);
    setWord("");
    setTranslation("");
    setSentence("");
    setIsEdit(false);
  };
  

  const clearData = () => {
    setWord("");
    setTranslation("");
    setSentence("");
    setIsEdit(false);
  };

  const openVocabModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          clearData();
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          activeOpacity={1}
          onPressOut={() => {
            setModalVisible(false);
            clearData();
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "white",
              borderRadius: 20,
              padding: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
            onStartShouldSetResponder={() => true}
          >
            <Text style={{ marginBottom: 15, fontSize: 18 }}>Add New Word</Text>
            <TextInput
              style={{
                height: 40,
                width: "100%",
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                fontSize: 16,
                backgroundColor: "#f9f9f9",
              }}
              placeholder="Word"
              onChangeText={(text) => setWord(text)}
              value={word}
            />
            <TextInput
              style={{
                minHeight: 80,
                width: "100%",
                marginBottom: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                fontSize: 16,
                backgroundColor: "#f9f9f9",
                textAlignVertical: "top",
              }}
              placeholder="Meaning"
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setTranslation(text)}
              value={translation}
            />

            <TextInput
              style={{
                minHeight: 80,
                width: "100%",
                marginBottom: 20,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                padding: 10,
                fontSize: 16,
                backgroundColor: "#f9f9f9",
                textAlignVertical: "top",
              }}
              placeholder="Sentence"
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => setSentence(text)}
              value={sentence}
            />

              <TextInput
                style={{
                  height: 40,
                  width: "100%",
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: "#f9f9f9",
                }}
                placeholder="Answer"
                value={answer}
                onChangeText={(text) => setAnswer(text)}
              />

              <TextInput
                style={{
                  height: 40,
                  width: "100%",
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 5,
                  padding: 10,
                  fontSize: 16,
                  backgroundColor: "#f9f9f9",
                }}
                placeholder="Choices (comma separated)"
                value={choices}
                onChangeText={(text) => setChoices(text)}
              />

            <View
              style={{
                marginVertical: 12,
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <View>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.colors.primary,
                    padding: 15,
                    borderRadius: 40,
                    marginTop: 10,
                    marginBottom: 10,
                    minWidth: 100,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={async () => {
                    setApiLoading(true);
                    try {
                      const translationResult = await getTranslation(word);
                      const sentenceResult = await getSentence(word);
                      const choiceResult = await getAnswerAndChoicesFromWord(word, translationResult);
                  
                      setTranslation(translationResult);
                      setSentence(sentenceResult);
                  
                      if (choiceResult) {
                        setAnswer(choiceResult.answer);
                        setChoices(choiceResult.choices.join(", "));
                      }
                  
                    } catch (err) {
                      console.error("Error in generating vocab fields:", err);
                    }
                    setApiLoading(false);
                  }}
                  
                  
                >
                  {apiLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: hp(1.8),
                      }}
                    >
                      Generate
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              {isEdit ? (
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: 14,
                      borderRadius: 40,
                      borderWidth: 1,
                      borderColor: theme.colors.roseLight,
                      marginTop: 10,
                      marginBottom: 10,
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      editVocab(editId, { word, translation, sentence });
                      setModalVisible(false);
                      setWord("");
                      setTranslation("");
                      setSentence("");
                      setEditId(null);
                      setVocab(
                        vocab.map((item) =>
                          item.id === editId
                            ? { ...item, word, translation, sentence }
                            : item
                        )
                      );
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.roseLight,
                        fontWeight: "bold",
                        fontSize: hp(1.8),
                      }}
                    >
                      Edit Word
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: 14,
                      borderRadius: 40,
                      borderWidth: 1,
                      borderColor: theme.colors.primary,
                      marginTop: 10,
                      marginBottom: 10,
                      alignSelf: "center",
                    }}
                    onPress={onSubmit}
                  >
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontWeight: "bold",
                        fontSize: hp(1.8),
                      }}
                    >
                      Add Word
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          marginLeft: 12,
          justifyContent: "space-between",
        }}
      >
        <Header
          title="Vocabulary"
          showRightIcon={true}
          onRightIconPress={() => setModalVisible(true)}
        />
      </View>

      <FlatList
        ref={flatListRef}
        data={vocab}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={{
                    marginBottom: 5,
                    borderRadius: 20,
                    padding: 8,
                    marginRight: 0,
                    backgroundColor: theme.colors.primary,
                  }}
                  onPress={() => {
                    // playTextAsSpeech(item.word);
                    generateSpeechToFile(item.word);
                  }}
                >
                  <Text style={styles.userName}>
                    {capitalizeFirstLetter(item.word)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View>
                <Text style={styles.userDate}>{item.translation}</Text>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => {
                    // getSpeakSentence(item.sentence);
                    generateSpeechToFile(item.sentence);
                  }}
                >
                  <View
                    style={{
                      marginTop: 15,
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: 5,
                    }}
                  >
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#E5E5E5",
                        width: "100%",
                      }}
                    />

                    <Text style={styles.wordText}>{item.sentence}</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  position: "absolute",
                  right: 0,
                  top: 0,
                }}
              >
                <View
                  style={{
                    borderRadius: 20,
                    backgroundColor: "gray",
                    paddingHorizontal: 5,
                    paddingVertical: 0,
                    marginTop: 12,
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {index + 1 + (page - 1) * limit}
                  </Text>
                </View>
                <Icon
                  name="edit"
                  size={20}
                  color={theme.colors.primary}
                  onPress={() => handleEdit(item.id)}
                  style={{ marginTop: 10, marginLeft: 10 }}
                />
                <Icon
                  name="delete"
                  size={20}
                  color={theme.colors.rose}
                  onPress={() => handleDelete(item.id)}
                  style={{ marginTop: 10, marginLeft: 10 }}
                />
              </View>
            </View>
          </View>
        )}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 30,
        }}
      >
        <Pressable
          onPress={() => {
            handlePageChange(page - 1);
            scrollToTop();
          }}
          disabled={page === 1}
          style={{
            backgroundColor: page === 1 ? "gray" : theme.colors.primary,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white" }}>Prev</Text>
        </Pressable>
        <Text>Page {page}</Text>
        <Pressable
          onPress={() => {
            handlePageChange(page + 1);
            scrollToTop();
          }}
          disabled={vocab.length === 0}
          style={{
            backgroundColor: vocab.length === 0 ? "gray" : theme.colors.primary,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white" }}>Next</Text>
        </Pressable>
      </View>

      {openVocabModal()}
    </ScreenWrapper>
  );
};

export default Vocabulary;
