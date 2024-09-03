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

export const deleteEssay = async (id) => {
  try {
    const { error } = await supabase.from("english").delete().eq("id", id);
    if (error) {
      router.navigate("home");
      router.navigate("essay");
      return { success: false, msg: "Could not delete essay" };
    }
    return { success: true, msg: "Essay deleted successfully" };
  } catch (error) {
    return { success: false, msg: "An error occurred during deletion" };
  }
};

export const fetchAllEssay = async () => {
  try {
    const { data, error } = await supabase.from("english").select("*");

    const sortedData = data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    if (error) {
      return { success: false, msg: "Could not fetch essays" };
    }

    return { success: true, data: sortedData };
  } catch (error) {
    return { success: false, msg: "Could not fetch essays", error };
  }
};
