import { Pressable, View } from "react-native";
import { useUIStore } from "@/lib/ui-store";
import { useHabitStore } from "@/lib/store";
import { toast } from "@ncrft/native-toast";
import { Text } from "@/components/ui/text";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export function DeleteHabitDialog() {
  const deleteTargetId = useUIStore((s) => s.deleteTargetId);
  const cancelDelete = useUIStore((s) => s.cancelDelete);
  const habits = useHabitStore((s) => s.habits);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);
  const habit = habits.find((h) => h.id === deleteTargetId);
  const open = deleteTargetId !== null;

  const handleConfirm = () => {
    if (deleteTargetId) deleteHabit(deleteTargetId);
    toast.success("Habit deleted");
    cancelDelete();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && cancelDelete()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete &quot;{habit?.name}&quot;?</DialogTitle>
          <DialogDescription>
            This habit and all its history will be permanently deleted. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <View className="flex-row gap-3 mt-2">
          <DialogClose asChild>
            <Pressable className="flex-1 rounded-xl border border-border-hairline px-4 py-3 items-center">
              <Text className="text-body-sm font-bold text-text-muted">Cancel</Text>
            </Pressable>
          </DialogClose>
          <Pressable
            className="flex-1 rounded-xl bg-feedback-danger px-4 py-3 items-center"
            onPress={handleConfirm}
          >
            <Text className="text-body-sm font-bold text-white">Delete</Text>
          </Pressable>
        </View>
      </DialogContent>
    </Dialog>
  );
}
