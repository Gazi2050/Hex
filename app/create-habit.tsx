import { useState } from "react";
import { 
  View, 
  ScrollView, 
  TextInput, 
  Pressable, 
  Switch, 
  LayoutAnimation, 
  KeyboardAvoidingView, 
  Platform,
  Modal 
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Check,
  Hexagon, 
  Droplets, 
  BookOpen, 
  Dumbbell, 
  Moon, 
  Flame, 
  Brain, 
  Heart, 
  Music, 
  Coffee, 
  Bike, 
  Apple, 
  Pencil,
  Activity,
  Award,
  Bath,
  BedDouble,
  Bell,
  Briefcase,
  Brush,
  Calculator,
  Calendar,
  Camera,
  Car,
  CheckSquare,
  Clock,
  Coins,
  Compass,
  CreditCard,
  FileText,
  Footprints,
  Gamepad2,
  GlassWater,
  GraduationCap,
  Hammer,
  Infinity,
  Key,
  Laptop,
  Leaf,
  Library,
  ListTodo,
  Mail,
  Monitor,
  Notebook,
  Palette,
  Paperclip,
  Phone,
  Pill,
  PiggyBank,
  Salad,
  Scale,
  Shield,
  ShoppingBag,
  Smile,
  Sparkles,
  Stethoscope,
  Sun,
  Target,
  Trophy,
  Tv,
  Utensils,
  Wallet,
  Wrench
} from "lucide-react-native";

const BUILT_IN_ICONS = [
  { name: "Hexagon", component: Hexagon },
  { name: "Droplets", component: Droplets },
  { name: "BookOpen", component: BookOpen },
  { name: "Dumbbell", component: Dumbbell },
  { name: "Moon", component: Moon },
  { name: "Flame", component: Flame },
  { name: "Brain", component: Brain },
  { name: "Heart", component: Heart },
  { name: "Music", component: Music },
  { name: "Coffee", component: Coffee },
  { name: "Bike", component: Bike },
  { name: "Apple", component: Apple },
  { name: "Pencil", component: Pencil },
  { name: "Activity", component: Activity },
  { name: "Award", component: Award },
  { name: "Bath", component: Bath },
  { name: "BedDouble", component: BedDouble },
  { name: "Bell", component: Bell },
  { name: "Briefcase", component: Briefcase },
  { name: "Brush", component: Brush },
  { name: "Calculator", component: Calculator },
  { name: "Calendar", component: Calendar },
  { name: "Camera", component: Camera },
  { name: "Car", component: Car },
  { name: "CheckSquare", component: CheckSquare },
  { name: "Clock", component: Clock },
  { name: "Coins", component: Coins },
  { name: "Compass", component: Compass },
  { name: "CreditCard", component: CreditCard },
  { name: "FileText", component: FileText },
  { name: "Footprints", component: Footprints },
  { name: "Gamepad2", component: Gamepad2 },
  { name: "GlassWater", component: GlassWater },
  { name: "GraduationCap", component: GraduationCap },
  { name: "Hammer", component: Hammer },
  { name: "Infinity", component: Infinity },
  { name: "Key", component: Key },
  { name: "Laptop", component: Laptop },
  { name: "Leaf", component: Leaf },
  { name: "Library", component: Library },
  { name: "ListTodo", component: ListTodo },
  { name: "Mail", component: Mail },
  { name: "Monitor", component: Monitor },
  { name: "Notebook", component: Notebook },
  { name: "Palette", component: Palette },
  { name: "Paperclip", component: Paperclip },
  { name: "Phone", component: Phone },
  { name: "Pill", component: Pill },
  { name: "PiggyBank", component: PiggyBank },
  { name: "Salad", component: Salad },
  { name: "Scale", component: Scale },
  { name: "Shield", component: Shield },
  { name: "ShoppingBag", component: ShoppingBag },
  { name: "Smile", component: Smile },
  { name: "Sparkles", component: Sparkles },
  { name: "Stethoscope", component: Stethoscope },
  { name: "Sun", component: Sun },
  { name: "Target", component: Target },
  { name: "Trophy", component: Trophy },
  { name: "Tv", component: Tv },
  { name: "Utensils", component: Utensils },
  { name: "Wallet", component: Wallet },
  { name: "Wrench", component: Wrench }
];

const PRESET_COLORS = [
  "#59D499", // Mint (default)
  "#57C1FF", // Sky
  "#A78BFA", // Lavender
  "#FB7185", // Rose
  "#FBBF24", // Amber
  "#F97316", // Coral
  "#94A3B8", // Slate
  "#F4F4F6"  // White
];

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

export default function CreateHabitScreen() {
  const insets = useSafeAreaInsets();
  
  // Form states
  const [selectedIconName, setSelectedIconName] = useState("Hexagon");
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#59D499");
  const [repeatDays, setRepeatDays] = useState([true, true, true, true, true, true, true]); // Mon-Sun
  const [frequency, setFrequency] = useState(1);
  const [reminder, setReminder] = useState(false);
  
  // Time states
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [isPm, setIsPm] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Time picker temp states
  const [tempHour, setTempHour] = useState("8");
  const [tempMinute, setTempMinute] = useState("00");
  const [tempIsPm, setTempIsPm] = useState(false);

  const activeDaysCount = repeatDays.filter(Boolean).length;
  const isHabit = activeDaysCount >= 4;

  const displayMin = minute < 10 ? `0${minute}` : minute;

  const toggleDay = (index: number) => {
    const isTogglingOff = repeatDays[index];
    if (isTogglingOff && activeDaysCount === 1) {
      return;
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updated = [...repeatDays];
    updated[index] = !updated[index];
    setRepeatDays(updated);
  };

  const handleReminderToggle = (value: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setReminder(value);
    if (value) {
      openTimePicker();
    }
  };

  const openTimePicker = () => {
    setTempHour(String(hour));
    setTempMinute(minute < 10 ? `0${minute}` : String(minute));
    setTempIsPm(isPm);
    setShowTimePicker(true);
  };

  const handleConfirmTime = () => {
    let h = parseInt(tempHour, 10);
    if (isNaN(h) || h < 1 || h > 12) {
      h = 12;
    }

    let m = parseInt(tempMinute, 10);
    if (isNaN(m) || m < 0 || m > 59) {
      m = 0;
    }

    setHour(h);
    setMinute(m);
    setIsPm(tempIsPm);
    setShowTimePicker(false);
  };

  const handleCreate = () => {
    if (!name.trim()) {
      alert("Please enter a name for the habit/todo");
      return;
    }
    
    const timeString = `${hour}:${displayMin} ${isPm ? "PM" : "AM"}`;
    alert(
      `Successfully Created!\n\nName: ${name}\nType: ${isHabit ? "Habit" : "Todo"}\nIcon: ${selectedIconName}\nColor: ${selectedColor}\nFrequency: ${frequency}x/day\nReminder: ${reminder ? `ON (${timeString})` : "OFF"}`
    );
    router.back();
  };

  const SelectedIconComponent = BUILT_IN_ICONS.find(i => i.name === selectedIconName)?.component || Hexagon;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-bg-canvas"
    >
      <View className="flex-1" style={{ paddingTop: Math.max(insets.top, 20) }}>
        {/* Custom Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-hairline">
          <Pressable 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-bg-surface border border-border-hairline active:bg-bg-elevated"
          >
            <ArrowLeft size={20} color="#F4F4F6" />
          </Pressable>
          <Text className="text-body-lg font-semibold text-text-primary">Create Habit</Text>
          <View className="w-10" />
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 140, paddingHorizontal: 16, paddingTop: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Section 1: Icon Picker Preview & List */}
          <View className="items-center mb-8">
            <View 
              style={{ borderColor: selectedColor, backgroundColor: `${selectedColor}15` }}
              className="w-20 h-20 rounded-full border-2 items-center justify-center mb-4"
            >
              <SelectedIconComponent size={36} color={selectedColor} strokeWidth={2} />
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              className="w-full mt-2"
            >
              {BUILT_IN_ICONS.map((item) => {
                const IconItem = item.component;
                const isSelected = selectedIconName === item.name;
                return (
                  <Pressable
                    key={item.name}
                    onPress={() => setSelectedIconName(item.name)}
                    className="p-2.5 mx-1 rounded-xl bg-bg-surface border border-border-hairline active:scale-95"
                    style={{ borderColor: isSelected ? selectedColor : "#242728" }}
                  >
                    <IconItem size={22} color={isSelected ? selectedColor : "#9C9C9D"} strokeWidth={2} />
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Section 2: Habit Name */}
          <View className="mb-6">
            <Text className="text-body-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Name</Text>
            <TextInput
              className="bg-bg-surface border border-border-hairline rounded-xl px-4 py-3.5 text-text-primary text-body-md"
              placeholder="e.g. Drink Water"
              placeholderTextColor="#9C9C9D"
              value={name}
              onChangeText={setName}
              maxLength={40}
            />
          </View>

          {/* Section 3: Color Picker */}
          <View className="mb-6">
            <Text className="text-body-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Color</Text>
            <View className="flex-row justify-between">
              {PRESET_COLORS.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <Pressable
                    key={color}
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setSelectedColor(color);
                    }}
                    style={{ backgroundColor: color }}
                    className="w-8 h-8 rounded-full items-center justify-center active:scale-90"
                  >
                    {isSelected && (
                      <Check 
                        size={16} 
                        color={color === "#F4F4F6" ? "#000000" : "#FFFFFF"} 
                        strokeWidth={3.5} 
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Section 4: Repeat Days */}
          <View className="mb-6">
            <Text className="text-body-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Repeat</Text>
            <View className="flex-row justify-between">
              {DAYS_OF_WEEK.map((day, idx) => {
                const isSelected = repeatDays[idx];
                return (
                  <Pressable
                    key={idx}
                    onPress={() => toggleDay(idx)}
                    style={{ 
                      backgroundColor: isSelected ? selectedColor : "#131313",
                      borderColor: "#242728"
                    }}
                    className="w-11 h-11 items-center justify-center rounded-xl border active:scale-95"
                  >
                    <Text
                      style={{ color: isSelected ? "#000000" : "#9C9C9D" }}
                      className="font-bold text-body-sm"
                    >
                      {day}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Dynamic Classification Banner */}
            <View 
              style={{ 
                backgroundColor: isHabit ? `${selectedColor}10` : "#57C1FF10",
                borderColor: isHabit ? `${selectedColor}30` : "#57C1FF30" 
              }}
              className="mt-5 p-3.5 rounded-xl border flex-row items-center"
            >
              {isHabit ? (
                <View style={{ backgroundColor: `${selectedColor}20` }} className="p-2.5 rounded-lg mr-3.5">
                  <Infinity size={20} color={selectedColor} strokeWidth={2.5} />
                </View>
              ) : (
                <View style={{ backgroundColor: "#57C1FF20" }} className="p-2.5 rounded-lg mr-3.5">
                  <CheckSquare size={20} color="#57C1FF" strokeWidth={2.5} />
                </View>
              )}
              <View className="flex-1 pr-2">
                <Text 
                  style={{ color: isHabit ? selectedColor : "#57C1FF" }} 
                  className="font-bold text-body-sm tracking-wide uppercase"
                >
                  {isHabit ? "Building a Habit" : "One-Off Task"}
                </Text>
                <Text className="text-caption-sm text-text-muted mt-1 font-medium leading-4">
                  {isHabit 
                    ? "4+ days selected. Consistency is key!" 
                    : "Less than 4 days. Scheduled as a task."}
                </Text>
              </View>
            </View>
          </View>

          {/* Section 5: Frequency Stepper */}
          <View className="mb-6 flex-row items-center justify-between bg-bg-surface border border-border-hairline p-4 rounded-xl">
            <View>
              <Text className="text-body-md font-semibold text-text-primary">Frequency</Text>
              <Text className="text-body-sm text-text-muted mt-0.5">Times per day</Text>
            </View>
            <View className="flex-row items-center">
              <Pressable
                onPress={() => setFrequency(Math.max(1, frequency - 1))}
                className="w-9 h-9 items-center justify-center rounded-full bg-bg-canvas border border-border-hairline active:scale-90"
              >
                <Minus size={16} color="#F4F4F6" />
              </Pressable>
              <Text className="text-body-lg font-bold text-text-primary mx-4 min-w-[20px] text-center">
                {frequency}
              </Text>
              <Pressable
                onPress={() => setFrequency(Math.min(20, frequency + 1))}
                className="w-9 h-9 items-center justify-center rounded-full bg-bg-canvas border border-border-hairline active:scale-90"
              >
                <Plus size={16} color="#F4F4F6" />
              </Pressable>
            </View>
          </View>

          {/* Section 6: Reminder */}
          <View className="mb-6 bg-bg-surface border border-border-hairline p-4 rounded-xl">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-body-md font-semibold text-text-primary">Daily Reminder</Text>
                <Text className="text-body-sm text-text-muted mt-0.5">Get notified at your set time</Text>
              </View>
              <Switch
                trackColor={{ false: "#242728", true: selectedColor }}
                thumbColor="#FFFFFF"
                ios_backgroundColor="#242728"
                onValueChange={handleReminderToggle}
                value={reminder}
              />
            </View>
            {reminder && (
              <View className="mt-3 pt-3 border-t border-border-hairline">
                <Pressable 
                  onPress={openTimePicker}
                  className="flex-row items-center justify-between py-2 active:opacity-70"
                >
                  <Text className="text-body-sm text-text-muted">Notification Time</Text>
                  <Text style={{ color: selectedColor }} className="text-body-md font-bold">
                    {`${hour}:${displayMin} ${isPm ? "PM" : "AM"}`}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating CTA Create Button */}
        <View 
          style={{ paddingBottom: Math.max(insets.bottom, 28) }}
          className="absolute bottom-0 left-0 right-0 px-4 pt-2 bg-bg-canvas"
        >
          <Pressable
            onPress={handleCreate}
            className="h-14 items-center justify-center rounded-2xl bg-cta-bg active:bg-cta-pressed shadow-md"
          >
            <Text className="text-button-md text-text-inverse font-bold">Create Habit</Text>
          </Pressable>
        </View>

        {/* Dedicated Bottom Sheet Time Picker Modal */}
        <Modal
          visible={showTimePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <Pressable 
            onPress={() => setShowTimePicker(false)}
            className="flex-1 bg-black/60 justify-end"
          >
            <Pressable 
              onPress={(e) => e.stopPropagation()} // Prevent clicking modal content from closing it
              className="bg-bg-surface border-t border-border-hairline rounded-t-3xl p-6"
              style={{ paddingBottom: Math.max(insets.bottom, 32) }}
            >
              {/* Drag Handle */}
              <View className="w-12 h-1 bg-neutral-800 rounded-full self-center mb-5" />

              <Text className="text-body-lg font-bold text-text-primary text-center mb-6">
                Set Reminder Time
              </Text>

              {/* Modal Keyboard Avoiding View container */}
              <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="w-full"
              >
                <View className="flex-row items-center justify-center mb-6">
                  <View className="bg-bg-canvas border border-border-hairline rounded-2xl w-24 py-1">
                    <TextInput
                      className="text-heading-xl font-bold text-text-primary text-center h-14"
                      style={{ padding: 0 }}
                      value={tempHour}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, '');
                        if (cleaned === "") {
                          setTempHour("");
                          return;
                        }
                        const val = parseInt(cleaned, 10);
                        if (val > 12) {
                          setTempHour("12");
                        } else {
                          setTempHour(cleaned);
                        }
                      }}
                      onBlur={() => {
                        let h = parseInt(tempHour, 10);
                        if (isNaN(h) || h < 1 || h > 12) {
                          setTempHour("12");
                        } else {
                          setTempHour(String(h));
                        }
                      }}
                      keyboardType="number-pad"
                      maxLength={2}
                      selectTextOnFocus
                      placeholder="08"
                      placeholderTextColor="#9C9C9D"
                    />
                  </View>
                  <Text className="text-heading-xl font-bold text-text-muted mx-4 pb-2">:</Text>
                  <View className="bg-bg-canvas border border-border-hairline rounded-2xl w-24 py-1">
                    <TextInput
                      className="text-heading-xl font-bold text-text-primary text-center h-14"
                      style={{ padding: 0 }}
                      value={tempMinute}
                      onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, '');
                        if (cleaned === "") {
                          setTempMinute("");
                          return;
                        }
                        const val = parseInt(cleaned, 10);
                        if (val > 59) {
                          setTempMinute("59");
                        } else {
                          setTempMinute(cleaned);
                        }
                      }}
                      onBlur={() => {
                        let m = parseInt(tempMinute, 10);
                        if (isNaN(m) || m < 0 || m > 59) {
                          setTempMinute("00");
                        } else {
                          setTempMinute(m < 10 ? `0${m}` : String(m));
                        }
                      }}
                      keyboardType="number-pad"
                      maxLength={2}
                      selectTextOnFocus
                      placeholder="00"
                      placeholderTextColor="#9C9C9D"
                    />
                  </View>
                </View>

                {/* AM/PM Switcher */}
                <View className="flex-row justify-center bg-bg-canvas border border-border-hairline rounded-xl overflow-hidden self-center mb-8">
                  <Pressable
                    onPress={() => setTempIsPm(false)}
                    style={{ backgroundColor: !tempIsPm ? selectedColor : "transparent" }}
                    className="px-6 py-2.5 active:opacity-80"
                  >
                    <Text style={{ color: !tempIsPm ? "#000000" : "#9C9C9D" }} className="font-bold text-body-sm">AM</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setTempIsPm(true)}
                    style={{ backgroundColor: tempIsPm ? selectedColor : "transparent" }}
                    className="px-6 py-2.5 active:opacity-80"
                  >
                    <Text style={{ color: tempIsPm ? "#000000" : "#9C9C9D" }} className="font-bold text-body-sm">PM</Text>
                  </Pressable>
                </View>

                {/* Confirm Button inside Modal */}
                <Pressable
                  onPress={handleConfirmTime}
                  className="h-14 items-center justify-center rounded-2xl bg-cta-bg active:bg-cta-pressed shadow-md"
                >
                  <Text className="text-button-md text-text-inverse font-bold">Confirm Time</Text>
                </Pressable>
              </KeyboardAvoidingView>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
