import api from '../api/request';
import { toast } from 'sonner';

export const confirmAndDelete = async (message: string, endpoint: string, onSuccess?: () => void) => {
  // eslint-disable-next-line no-alert
  if (!window.confirm(message)) return;
  try {
    await api.delete(endpoint);
    toast.success('Успішно видалено');
    onSuccess?.();
  } catch {
    toast.error('Помилка при видаленні');
  }
};
