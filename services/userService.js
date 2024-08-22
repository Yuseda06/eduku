import { supabase } from "../lib/supabase";

export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (error) {
      return { success: false, msg: error?.message };
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    return { success: false, msg: error?.message };
  }
};

export const updateUser = async (userId, data) => {
  console.log("userId", userId);
  console.log("data", data);
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) {
      return { success: false, msg: error?.message };
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    return { success: false, msg: error?.message };
  }
};
