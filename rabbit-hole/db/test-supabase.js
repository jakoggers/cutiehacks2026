import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("task")
    .insert({
      "task-name": "Finish homework"
    })
    .select()
    .single();

  if (error) {
    console.error("Insert failed:", error.message);
  } else {
    console.log("Task added:", data);
  }
}

testSupabaseConnection();