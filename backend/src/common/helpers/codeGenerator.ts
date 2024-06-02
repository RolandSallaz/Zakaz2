export function generateSixDigitCode() {
  // Генерируем случайное число от 100000 до 999999
  return Math.floor(100000 + Math.random() * 900000);
}
