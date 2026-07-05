import { Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Plus } from "lucide-react-native";
import { router } from "expo-router";

export function HeaderPlusButton() {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={() => router.push("/create-habit")}
      style={[
        styles.button,
        { top: insets.top + 6 },
      ]}
    >
      <Plus size={22} color="#000000" strokeWidth={2.75} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});
