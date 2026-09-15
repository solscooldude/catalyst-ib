export function dayKey(now = new Date()) {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function yesterdayKey(now = new Date()) {
  const next = new Date(now);
  next.setDate(next.getDate() - 1);
  return dayKey(next);
}

export const FEED_COST = 1;
export const FEED_DAILY_LIMIT = 3;
export const LOGIN_TOKEN = 1;
export const STREAK_REWARD_DAY = 7;
export const QUIZ_TOKEN = 1;

export {
  QUIZ_BANK,
  QUIZ_LENGTH,
  pickQuiz,
  quizItemCaption,
  type QuizItem,
} from "@/lib/quiz-bank";
