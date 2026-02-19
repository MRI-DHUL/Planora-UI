interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleSwitch({ checked, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
        checked ? "bg-orange-500" : "bg-neutral-700"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
          checked ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </button>
  );
}
