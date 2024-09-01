import { supabase } from "../lib/supabase";

export const insertEssay = async (essay) => {
  try {
    const { data, error } = await supabase
      .from("english")
      .upsert(essay)
      .select()
      .single();

    if (error) {
      return { success: false, msg: "Could not create your post" };
    }
    return { success: true, data };
  } catch (error) {
    return { success: false, msg: "Could not create your post" };
    throw error;
  }
};

export const fetchEssay = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("english")
      .select(`*, user: users (id, name, image)`)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      return { success: false, msg: "Could not fetch essays" };
    }

    return { success: true, data: data };
  } catch (error) {
    return { success: false, msg: "Could not fetch essays" };
    throw error;
  }
};
