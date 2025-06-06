import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { getSupabase } from "../lib/supabase";
import { supabaseUrl } from "../constants";

export const getUserImageSrc = (imagePath) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require("../assets/images/defaultUser.png");
  }
};

export const getSupabaseFileUrl = (filePath) => {
  if (filePath) {
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`,
    };
  }
  return null;
};

export const uploadFile = async (folderName, fileUri, isImage = true) => {
  try {

    const supabase = getSupabase(); 
    if (!supabase) return { success: false, msg: "Supabase not available" };

    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let imageData = decode(fileBase64);
    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/*" : "video/*",
      });
    if (error) {
      return { success: false, msg: "Could not upload media" };
    }
    return { success: true, data: data.path };
  } catch (error) {
    return { success: false, msg: "Could not upload media" };
  }
};
export const getFilePath = (folderName, isImage) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
