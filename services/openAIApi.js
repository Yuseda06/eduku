import { Platform } from "react-native";

export const getResponse = async (payload) => {
  const baseUrl =
    Platform.OS === "web"
      ? "https://eduku-git-main-yusri-saads-projects.vercel.app" 
      : "http://localhost:5000"; 

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
  try {
    const res = await fetch('/api/getSentence', {
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
  try {
    const res = await fetch('/api/generateImage', {
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
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "echo",
      input: inputText,
    });
    const uri = `${FileSystem.cacheDirectory}speech.mp3`;

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await FileSystem.writeAsStringAsync(uri, buffer.toString("base64"), {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Now play the saved audio file
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({
      uri: `data:audio/mp3;base64,${buffer.toString("base64")}`,
    });
    await soundObject.playAsync();

    return uri;
  } catch (error) {
    console.error("Error generating and playing speech to file:", error);
  }
};

export const playTextAsSpeech = async (tts_text) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptForPronunciation(tts_text)),
    });

    const jsonResponse = await response.json();
    const audioData = jsonResponse.choices[0].message.audio.data;
    const audioBuffer = Buffer.from(audioData, "base64");
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync({
      uri: `data:audio/mp3;base64,${audioBuffer.toString("base64")}`,
    });
    await soundObject.playAsync();
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};