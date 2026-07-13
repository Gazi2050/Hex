import { seedDemoData } from "@/lib/seed-demo-data";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SEED_KEY = "hex-demo-seeded-v4";

export async function maybeSeed() {
  const alreadySeeded = await AsyncStorage.getItem(SEED_KEY);
  if (alreadySeeded === "true") return;
  seedDemoData();
  await AsyncStorage.setItem(SEED_KEY, "true");
  console.log("Demo data seeded!");
}
