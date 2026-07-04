export type Habit = {
  id: string;
  name: string;
  description: string;
  streak: number;
  completedToday: boolean;
  createdAt: Date;
};
