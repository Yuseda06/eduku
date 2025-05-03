import { Platform } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export const getResponse = async (payload) => {
  const baseUrl =
  Platform.OS === "web"
    ? "https://eduku-api.vercel.app" // ni backend punya domain
    : "http://localhost:5000"; // masa run native local


  const res = await fetch(`${baseUrl}/api/getResponse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  return json.result;
};



export const getTranslation = async (text) => {
  const baseUrl =
  Platform.OS === "web"
    ? "https://eduku-api.vercel.app" // ni backend punya domain
    : "http://localhost:5000"; // masa run native local
  try {
    const res = await fetch(`${baseUrl}/api/getTranslation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error("Fetch error (getTranslation):", err);
    return null;
  }
};


export const getSentence = async (text) => {
  const baseUrl =
  Platform.OS === "web"
    ? "https://eduku-api.vercel.app" // ni backend punya domain
    : "http://localhost:5000"; // masa run native local
  try {
    const res = await fetch(`${baseUrl}/api/getSentence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error('Fetch error (getSentence):', err);
    return null;
  }
};

export const generateImage = async (description) => {
  const baseUrl =
  Platform.OS === "web"
    ? "https://eduku-api.vercel.app" // ni backend punya domain
    : "http://localhost:5000"; // masa run native local
  try {
    const res = await fetch(`${baseUrl}/api/generateImage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    });

    const data = await res.json();
    return data.url;
  } catch (err) {
    console.error('Fetch error (generateImage):', err);
    return null;
  }
};



export const generateSpeechToFile = async (inputText) => {
  try {
    const baseUrl =
      Platform.OS === "web"
        ? "https://eduku-api.vercel.app"
        : "http://localhost:5000";

    const response = await fetch(`${baseUrl}/api/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText }),
    });

    const { audioBase64 } = await response.json();
    const uri = `${FileSystem.cacheDirectory}speech.mp3`;

    const soundObject = new Audio.Sound();

    if (Platform.OS === "web") {
      await soundObject.loadAsync({
        uri: `data:audio/mp3;base64,${audioBase64}`,
      });
    } else {
      await FileSystem.writeAsStringAsync(uri, audioBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await soundObject.loadAsync({ uri });
    }

    await soundObject.playAsync();
    return uri;
  } catch (err) {
    console.error("Error generating and playing speech to file:", err);
  }
};



export const playTextAsSpeech = async (tts_text) => {
  try {
    const baseUrl =
      Platform.OS === "web"
        ? "https://eduku-api.vercel.app"
        : "http://localhost:5000";

    const response = await fetch(`${baseUrl}/api/pronounce`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: tts_text }),
    });

    const { audioBase64 } = await response.json();
    const uri = `${FileSystem.cacheDirectory}pronounce.mp3`;

    await FileSystem.writeAsStringAsync(uri, audioBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({ uri });
    await soundObject.playAsync();
  } catch (err) {
    console.error("Error playing pronunciation:", err);
  }
};
