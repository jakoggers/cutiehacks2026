import { supabase } from "./supabase";
import type { Journey } from "@/src/components/Dashboard/JourneyContext";

// Retrieve the logged-in user's journey
export const fetchJourney = async (): Promise<Journey | null> => {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData.user;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  const { data, error } = await supabase
    .from("journeys")
    .select("journey_data")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;

  return data?.journey_data as Journey ?? null;
};


// Save or update the user's journey
export const saveJourney = async (
  journey: Journey
): Promise<void> => {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData.user;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  const { error } = await supabase
    .from("journeys")
    .upsert(
      {
        user_id: user.id,
        journey_data: journey,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) throw error;
};


// Delete the user's journey
export const deleteJourney = async (): Promise<void> => {
  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError) throw userError;

  const user = userData.user;

  if (!user) {
    throw new Error("User is not logged in.");
  }

  const { error } = await supabase
    .from("journeys")
    .delete()
    .eq("user_id", user.id);

  if (error) throw error;
};