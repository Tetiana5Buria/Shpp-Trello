export const calculatePasswordStrength = (password: string): number => {
  let score = 0;
  if (password.length >= 3) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

export const getStrengthLabel = (score: number) => {
  switch (score) {
    case 0:
      return { label: 'Занадто слабкий', color: '#fff' };
    case 1:
      return { label: 'Занадто слабкий', color: '#ff4d4d' };
    case 2:
      return { label: 'Слабкий', color: '#ffa500' };
    case 3:
      return { label: 'Середній', color: '#4caf50' };
    case 4:
      return { label: 'Сильний', color: '#2e8be5' };
    default:
      return { label: '', color: '#ff4d4d' };
  }
};
