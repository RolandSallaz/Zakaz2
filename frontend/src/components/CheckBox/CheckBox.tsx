import { ChangeEvent } from 'react';
import './CheckBox.scss';

interface props {
  labelId?: string;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckBox({
  labelId,
  checked = false,
  onChange,
}: props) {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e);
  }

  return (
    <label
      className={`CheckBox ${checked && 'CheckBox_checked'}`}
      htmlFor={labelId}
    >
      <input
        type="checkbox"
        id={labelId}
        checked={checked}
        onChange={handleChange}
      />
    </label>
  );
}
