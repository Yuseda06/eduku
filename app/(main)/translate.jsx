import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Speech from "expo-speech";
import ScreenWrapper from "../../components/ScreenWrapper";
import queryString from "query-string";
import * as ScreenOrientation from "expo-screen-orientation";

const Reading = () => {
  const [sentence, setSentence] = useState(`
    Subject: Exciting Jumbo Sale at Malacca-V Mall!
    
    Hi Melissa,
    
    I just saw a brochure for a Jumbo Sale happening at Malacca-V Mall on 5th April 2023.
    They're offering a 50% discount on everything!
    
    There will be handbags, clothes, educational toys, storybooks, musical instruments, and house appliances.
    
    The sale starts at 9 AM and ends at 9 PM.
    
    Would you like to come with me? It would be a great chance to grab some awesome deals!
    
    Let me know!
    
    Best,
    Zakwan
    `);

  useEffect(() => {
    // Unlock the screen orientation to allow all orientations
    ScreenOrientation.unlockAsync();
  }, []);

  const handleWordPress = async (word) => {
    // Pronounce the word
    Speech.speak(word);
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
    <ScreenWrapper>
      <View style={{ flexDirection: "row", flexWrap: "wrap", margin: 10 }}>
        {sentence.split(" ").map((word, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleWordPress(word)}
            onLongPress={() => handleTranslate(word)}
            style={{ margin: 2 }}
          >
            <Text style={{ fontSize: 18 }}>{word}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenWrapper>
  );
};

export default Reading;
