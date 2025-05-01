import OpenAI from "openai";
import { Audio } from "expo-av";
import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

// Safe fallback untuk semua mode (expo/dev/prod)
const { OPENAI_API_KEY, OPENAI_ORGANIZATION, OPENAI_PROJECT } =
  Constants?.manifest?.extra ?? Constants?.expoConfig?.extra ?? {};

// Debugging check (optional)
if (!OPENAI_API_KEY) {
  console.warn(
    "❌ OPENAI_API_KEY is missing. Please check your .env and app.config.js setup."
  );
}

const openai = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
      organization: OPENAI_ORGANIZATION,
      project: OPENAI_PROJECT,
    })
  : null;

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

export const getResponse = async ({
  subject,
  chapter,
  grade,
  level,
  model,
}) => {
  try {
    const response = await openai.chat.completions.create({
      // model: "gpt-4o-mini",
      model: model,
      // model: "o1-preview",
      messages: [
        {
          role: "user",
          content: `
                  Please generate 11 multiple choice questions in JSON format for a ${level} student (Grade ${grade}) in Malaysia.

                  Subject: ${subject}
                  Chapter: ${chapter}

                  If the subject is English, use English for the questions. Otherwise, use Bahasa Malaysia.

                  The first question must be a brief explanation of the chapter, written as a list of key points.

                  The output must strictly follow this format:
                  {
                    "questions": [
                      {
                        "question": "Chapter Explanation: [brief explanation here]",
                        "options": [
                          "1. Point 1",
                          "2. Point 2",
                          "3. Point 3"
                        ]
                      },
                      {
                        "question": "Apa maksud solat?",
                        "options": [
                          "Doa sebelum makan",
                          "Perjalanan ke sekolah",
                          "Ibadah khusus yang bermula dengan takbir dan tamat dengan salam",
                          "Membaca buku agama"
                        ],
                        "answer": "Ibadah khusus yang bermula dengan takbir dan tamat dengan salam"
                      }
                    ]
                  }

                   "question": "Apa maksud solat?", this is only an example, do not include this in the output

                  Do not include any explanation or extra text outside the JSON format.
                  Keep the structure consistent for every request.
                  `,
        },
      ],
      stream: false,
    });

    const messageContent = response.choices[0].message.content;
    // console.log("Generated message:", messageContent);

    return messageContent;
  } catch (error) {
    console.error("Error fetching response:", error);
  }
};

export const getTranslation = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      // model: "o1-mini",
      // model: "o1-preview",
      messages: [
        {
          role: "user",
          content: `Please translate the following text to Bahasa Malaysia, keeping the response under 20 words. If there are multiple meanings, list them numerically as shown below:
            1. Meaning 1
            2. Meaning 2
            3. Meaning 3
            Translate: ${text}`,
        },
      ],
      stream: false,
    });

    const messageContent = response.choices[0].message.content;
    // console.log("Generated message:", messageContent);

    return messageContent;
  } catch (error) {
    console.error("Error fetching response:", error);
  }
};

export const getSentence = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      // model: "o1-mini",
      // model: "o1-preview",
      messages: [
        {
          role: "user",
          content: `Make sentences in English for the following word: ${text}. Provide minimum 2 example sentences using simple words. Write the word ${text} in UPPERCASE and bold (**${text}**). Add a blank line between sentences.`,
        },
      ],
      stream: false,
    });

    const messageContent = response.choices[0].message.content;
    // console.log("Generated message:", messageContent);

    return messageContent;
  } catch (error) {
    console.error("Error fetching response:", error);
  }
};

const promptForPronunciation = (text) => {
  return {
    model: "gpt-4o-audio-preview",
    modalities: ["text", "audio"],
    audio: { voice: "onyx", format: "mp3" },
    messages: [
      {
        role: "system",
        content:
          "Please pronounce the following word or sentence exactly as it is written.",
      },
      {
        role: "user",
        content: text,
      },
    ],
  };
};

export const generateImage = async (description) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-2", // or "dall-e-3" for the latest version
          prompt: description,
          n: 1, // Number of images to generate
          size: "256x256", // Size of the image - smallest available size
        }),
      }
    );

    const jsonResponse = await response.json();
    if (!jsonResponse.data || jsonResponse.data.length === 0) {
      throw new Error("No data returned from the API");
    }
    return jsonResponse.data[0].url; // Assuming the API returns the URL of the generated image
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
