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
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import {
  Plus,
  Minus,
  Check,
  Infinity,
  CheckSquare,
  Hexagon,
} from "lucide-react-native";
import { HABIT_ICONS, HABIT_ICON_NAMES } from "@/lib/habit-icons";

type HabitFormValues = {
  name: string;
  description: string;
  color: string;
  iconName: string;
  repeatDays: boolean[];
  frequency: number;
  reminder: boolean;
  reminderTime?: string;
  priority: boolean;
};

interface HabitFormProps {
  initialValues?: Partial<HabitFormValues>;
  onSubmit: (values: HabitFormValues) => void;
  submitLabel: string;
  onDelete?: () => void;
  existingPriorityCount?: number;
}

function parseTimeString(
  s?: string
): { hour: number; minute: number; isPm: boolean } {
  if (!s) return { hour: 8, minute: 0, isPm: false };
  const match = s.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return { hour: 8, minute: 0, isPm: false };
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const isPm = match[3].toUpperCase() === "PM";
  if (isNaN(h) || h < 1 || h > 12) return { hour: 8, minute: 0, isPm: false };
  if (isNaN(m) || m < 0 || m > 59) return { hour: 8, minute: 0, isPm: false };
  return { hour: h, minute: m, isPm };
}

const PRESET_COLORS = [
  "#59D499",
  "#57C1FF",
  "#A78BFA",
  "#FB7185",
  "#FBBF24",
  "#F97316",
  "#94A3B8",
  "#F4F4F6",
];

const DAYS_OF_WEEK = ["M", "T", "W", "T", "F", "S", "S"];

export function HabitForm({
  initialValues,
  onSubmit,
  submitLabel,
  onDelete,
  existingPriorityCount = 0,
}: HabitFormProps) {
  const insets = useSafeAreaInsets();

  const parsed = parseTimeString(initialValues?.reminderTime);

  const [selectedIconName, setSelectedIconName] = useState(
    initialValues?.iconName ?? "Hexagon"
  );
  const [name, setName] = useState(initialValues?.name ?? "");
  const [selectedColor, setSelectedColor] = useState(
    initialValues?.color ?? "#59D499"
  );
  const [repeatDays, setRepeatDays] = useState<boolean[]>(
    initialValues?.repeatDays ?? [true, true, true, true, true, true, true]
  );
  const [frequency, setFrequency] = useState(initialValues?.frequency ?? 1);
  const [reminder, setReminder] = useState(initialValues?.reminder ?? false);
  const [priorityChecked, setPriorityChecked] = useState(initialValues?.priority ?? false);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [isPm, setIsPm] = useState(parsed.isPm);
  const [showTimePicker, setShowTimePicker] = useState(false);
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

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter a name for the habit/todo");
      return;
    }

    const timeString = `${hour}:${displayMin} ${isPm ? "PM" : "AM"}`;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const activeDays = days.filter((_, idx) => repeatDays[idx]);
    const repeatDesc =
      activeDays.length === 7
        ? `Every day • ${frequency}x/day`
        : `${activeDays.join(", ")} • ${frequency}x/day`;

    onSubmit({
      name: name.trim(),
      description: repeatDesc,
      color: selectedColor,
      iconName: selectedIconName,
      repeatDays,
      frequency,
      reminder,
      reminderTime: reminder ? timeString : undefined,
      priority: priorityChecked,
    });
  };

  const SelectedIconComponent = HABIT_ICONS[selectedIconName] ?? Hexagon;

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 140,
          paddingHorizontal: 16,
          paddingTop: 20,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center mb-8">
          <View
            style={{
              borderColor: selectedColor,
              backgroundColor: `${selectedColor}15`,
            }}
            className="w-20 h-20 rounded-full border-2 items-center justify-center mb-4"
          >
            <SelectedIconComponent
              size={36}
              color={selectedColor}
              strokeWidth={2}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            className="w-full mt-2"
          >
            {HABIT_ICON_NAMES.map((name) => {
              const IconItem = HABIT_ICONS[name];
              const isSelected = selectedIconName === name;
              return (
                <Pressable
                  key={name}
                  onPress={() => setSelectedIconName(name)}
                  className="p-2.5 mx-1 rounded-xl bg-bg-surface border border-border-hairline active:scale-95"
                  style={{
                    borderColor: isSelected ? selectedColor : "#242728",
                  }}
                >
                  <IconItem
                    size={22}
                    color={isSelected ? selectedColor : "#9C9C9D"}
                    strokeWidth={2}
                  />
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View className="mb-6">
          <Text className="text-body-sm font-semibold text-text-muted uppercase tracking-wider mb-2">
            Name
          </Text>
          <TextInput
            className="bg-bg-surface border border-border-hairline rounded-xl px-4 py-3.5 text-text-primary text-body-md"
            placeholder="e.g. Drink Water"
            placeholderTextColor="#9C9C9D"
            value={name}
            onChangeText={setName}
            maxLength={40}
          />
        </View>

        <View className="mb-6">
          <Text className="text-body-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Color
          </Text>
          <View className="flex-row justify-between">
            {PRESET_COLORS.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <Pressable
                  key={color}
                  onPress={() => {
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.easeInEaseOut
                    );
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

        <View className="mb-6">
          <Text className="text-body-sm font-semibold text-text-muted uppercase tracking-wider mb-3">
            Repeat
          </Text>
          <View className="flex-row justify-between">
            {DAYS_OF_WEEK.map((day, idx) => {
              const isSelected = repeatDays[idx];
              return (
                <Pressable
                  key={idx}
                  onPress={() => toggleDay(idx)}
                  style={{
                    backgroundColor: isSelected ? selectedColor : "#131313",
                    borderColor: "#242728",
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

          <View
            style={{
              backgroundColor: isHabit ? `${selectedColor}10` : "#57C1FF10",
              borderColor: isHabit ? `${selectedColor}30` : "#57C1FF30",
            }}
            className="mt-5 p-3.5 rounded-xl border flex-row items-center"
          >
            {isHabit ? (
              <View
                style={{ backgroundColor: `${selectedColor}20` }}
                className="p-2.5 rounded-lg mr-3.5"
              >
                <Infinity
                  size={20}
                  color={selectedColor}
                  strokeWidth={2.5}
                />
              </View>
            ) : (
              <View
                style={{ backgroundColor: "#57C1FF20" }}
                className="p-2.5 rounded-lg mr-3.5"
              >
                <CheckSquare
                  size={20}
                  color="#57C1FF"
                  strokeWidth={2.5}
                />
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

        <View className="mb-6 flex-row items-center justify-between bg-bg-surface border border-border-hairline p-4 rounded-xl">
          <View>
            <Text className="text-body-md font-semibold text-text-primary">
              Frequency
            </Text>
            <Text className="text-body-sm text-text-muted mt-0.5">
              Times per day
            </Text>
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

        {/* Priority */}
        <View className="mb-6 bg-bg-surface border border-border-hairline p-4 rounded-xl">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-body-md font-semibold text-text-primary">
                Show on Home
              </Text>
              <Text className="text-body-sm text-text-muted mt-0.5">
                Display as a priority task{!priorityChecked && existingPriorityCount >= 3 ? " (max 3 reached)" : ""}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                if (!priorityChecked && existingPriorityCount >= 3) return;
                setPriorityChecked(!priorityChecked);
              }}
              className="w-6 h-6 rounded-md border-2 items-center justify-center active:scale-90"
              style={{
                backgroundColor: priorityChecked ? "#59D499" : "transparent",
                borderColor: priorityChecked ? "#59D499" : "#6A6B6C",
              }}
            >
              {priorityChecked && <Check size={14} color="#000000" strokeWidth={3} />}
            </Pressable>
          </View>
        </View>

        <View className="mb-6 bg-bg-surface border border-border-hairline p-4 rounded-xl opacity-50">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-body-md font-semibold text-text-primary">
                Daily Reminder
              </Text>
              <Text className="text-body-sm text-text-muted mt-0.5">
                Coming Soon
              </Text>
            </View>
            <View className="w-12 h-7 rounded-full bg-neutral-800 items-center justify-center">
              <View className="w-5 h-5 rounded-full bg-neutral-700" />
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={{ paddingBottom: Math.max(insets.bottom, 28) }}
        className="absolute bottom-0 left-0 right-0 px-4 pt-2 bg-bg-canvas"
      >
        <Pressable
          onPress={handleSubmit}
          className="h-14 items-center justify-center rounded-2xl bg-cta-bg active:bg-cta-pressed shadow-md"
        >
          <Text className="text-button-md text-text-inverse font-bold">
            {submitLabel}
          </Text>
        </Pressable>
        {onDelete && (
          <Pressable
            onPress={onDelete}
            className="h-12 items-center justify-center rounded-2xl border border-feedback-danger mt-2"
          >
            <Text className="text-body-md font-bold text-feedback-danger">
              Delete Habit
            </Text>
          </Pressable>
        )}
      </View>

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
            onPress={(e) => e.stopPropagation()}
            className="bg-bg-surface border-t border-border-hairline rounded-t-3xl p-6"
            style={{ paddingBottom: Math.max(insets.bottom, 32) }}
          >
            <View className="w-12 h-1 bg-neutral-800 rounded-full self-center mb-5" />

            <Text className="text-body-lg font-bold text-text-primary text-center mb-6">
              Set Reminder Time
            </Text>

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
                      const cleaned = text.replace(/[^0-9]/g, "");
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
                <Text className="text-heading-xl font-bold text-text-muted mx-4 pb-2">
                  :
                </Text>
                <View className="bg-bg-canvas border border-border-hairline rounded-2xl w-24 py-1">
                  <TextInput
                    className="text-heading-xl font-bold text-text-primary text-center h-14"
                    style={{ padding: 0 }}
                    value={tempMinute}
                    onChangeText={(text) => {
                      const cleaned = text.replace(/[^0-9]/g, "");
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
                        setTempMinute(
                          m < 10 ? `0${m}` : String(m)
                        );
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

              <View className="flex-row justify-center bg-bg-canvas border border-border-hairline rounded-xl overflow-hidden self-center mb-8">
                <Pressable
                  onPress={() => setTempIsPm(false)}
                  style={{
                    backgroundColor: !tempIsPm ? selectedColor : "transparent",
                  }}
                  className="px-6 py-2.5 active:opacity-80"
                >
                  <Text
                    style={{
                      color: !tempIsPm ? "#000000" : "#9C9C9D",
                    }}
                    className="font-bold text-body-sm"
                  >
                    AM
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setTempIsPm(true)}
                  style={{
                    backgroundColor: tempIsPm ? selectedColor : "transparent",
                  }}
                  className="px-6 py-2.5 active:opacity-80"
                >
                  <Text
                    style={{
                      color: tempIsPm ? "#000000" : "#9C9C9D",
                    }}
                    className="font-bold text-body-sm"
                  >
                    PM
                  </Text>
                </Pressable>
              </View>

              <Pressable
                onPress={handleConfirmTime}
                className="h-14 items-center justify-center rounded-2xl bg-cta-bg active:bg-cta-pressed shadow-md"
              >
                <Text className="text-button-md text-text-inverse font-bold">
                  Confirm Time
                </Text>
              </Pressable>
            </KeyboardAvoidingView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
