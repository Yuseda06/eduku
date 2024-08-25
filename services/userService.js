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

export const getAllUsers = async () => {
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      return { success: false, msg: error?.message };
    }

    return {
      success: true,
      data: users, // Return users instead of data
    };
  } catch (error) {
    return { success: false, msg: error?.message };
  }
};
