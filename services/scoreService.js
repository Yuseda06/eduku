import { supabase } from "../lib/supabase";

export const getScore = async (user) => {
  try {
    const { data, error } = await supabase
      .from("score")
      .select(
        `
        id,
        score,
        section,
        user: users (id, name, image)

      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("error", error);
      return { success: false, msg: "Could not fetch score" };
    }

    if (!data || data.length === 0) {
      return { success: true, data: [] };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, msg: "Could not fetch score", error };
  }
};

export const insertScore = async (score) => {
  try {
    const { data, error } = await supabase.from("score").insert(score);
  } catch (error) {
    return { success: false, msg: "Could not insert score", error };
  }
};

export const updateScore = async (score) => {
  try {
    const { data, error } = await supabase
      .from("score")
      .upsert(score)
      .select()
      .single();

    if (error) {
      return { success: false, msg: "Could not create your score" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("error", error);
    return { success: false, msg: "Could not create your score" };
    throw error;
  }
};
