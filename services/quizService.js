import { supabase } from "../lib/supabase";

export const fetchAllQuiz = async (chapter) => {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        id,
        question,
        options (id, text, is_correct)
      `
      )
      .eq("chapter", chapter)
      .limit(40);

    if (!data || data.length === 0) {
      return { success: true, data: [] };
    }

    if (error) {
      console.log("error", error);
      return { success: false, msg: "Could not fetch questions" };
    }

    // Sort the data if needed, e.g., by `id`
    const sortedData = data.sort((a, b) => a.id - b.id);

    return { success: true, data: sortedData };
  } catch (error) {
    return { success: false, msg: "Could not fetch questions", error };
  }
};

export const fetchAllChapter = async (subject) => {
  console.log("subject in fetchAllChapter ", subject);
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("chapter")
      .eq("subject", subject);

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
