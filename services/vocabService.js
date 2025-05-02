import { getSupabase } from "../lib/supabase";



export const fetchAllVocab = async (user, page = 1, limit = 10) => {
  const offset = (page - 1) * limit; // Calculate the offset
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("vocab")
      .select(
        `
        id,
        word,
        translation,
        sentence,
        user: users (id, name, image)

      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1); // Apply pagination

    if (error) {
      console.log("error", error);
      return { success: false, msg: "Could not fetch questions" };
    }

    const sortedData = data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    if (!data || data.length === 0) {
      return { success: true, data: [] };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, msg: "Could not fetch questions", error };
  }
};

export const insertVocab = async (vocab) => {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("vocab")
      .upsert(vocab)
      .select()
      .single();

    if (error) {
      return { success: false, msg: "Could not create your vocab" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("error", error);
    return { success: false, msg: "Could not create your vocab" };
    throw error;
  }
};

export const deleteVocab = async (id) => {
  const supabase = getSupabase();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("vocab")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    return { success: false, msg: "Could not delete your vocab" };
  }
  return { success: true, data };
};

export const editVocab = async (id, updates) => {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("vocab")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, msg: "Could not update your vocab" };
    }
    return { success: true, data };
  } catch (error) {
    console.log("error", error);
    return { success: false, msg: "Could not update your vocab" };
    throw error;
  }
};
