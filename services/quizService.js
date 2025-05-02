import { getSupabase } from "../lib/supabase";


export const fetchAllQuiz = async (chapter) => {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        id,
        question,
        options (id, text, is_correct)
      `
      )
      .eq("chapter", chapter);

    if (error) {
      console.log("error", error);
      return { success: false, msg: "Could not fetch questions" };
    }

    if (!data || data.length === 0) {
      return { success: true, data: [] };
    }

    // Shuffle the data to randomize
    const shuffledData = data.sort(() => Math.random() - 0.5);

    // Limit to 20 items
    const limitedData = shuffledData.slice(0, 20);

    return { success: true, data: limitedData };
  } catch (error) {
    return { success: false, msg: "Could not fetch questions", error };
  }
};

export const fetchAllChapter = async (subject, level, level_number) => {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("questions")
      .select("chapter")
      .ilike("subject", `%${subject}%`)
      .eq("level", level)
      .eq("level_number", level_number);

    if (error) {
      console.log("error", error);
      return { success: false, msg: "Could not fetch questions" };
    }

    if (!data || data.length === 0) {
      return { success: true, data: [] };
    }

    // Extract unique chapters
    const uniqueChapters = [...new Set(data.map((item) => item.chapter))];

    return { success: true, data: uniqueChapters };
  } catch (error) {
    return { success: false, msg: "Could not fetch questions", error };
  }
};
