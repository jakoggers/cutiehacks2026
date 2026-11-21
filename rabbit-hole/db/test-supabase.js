import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Supabase connection failed:");
    console.error(error.message);
    process.exit(1);
  }

  console.log("Supabase connection successful!");
  console.log("Returned data:", data);
}

testSupabaseConnection();