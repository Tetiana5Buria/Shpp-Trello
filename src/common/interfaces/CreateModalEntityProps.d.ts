export interface CreateModalEntityProps {
  entity: string;
  buttonText: string;
  buttonClass: string;
  colorPickerClass: string;
  defaultColor?: string;
  onCreate: (
    title: string,
    color: string,
    image: string,
    reset: () => void,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
}
