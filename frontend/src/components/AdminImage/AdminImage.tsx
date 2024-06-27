import { ChangeEvent } from 'react';
import './AdminImage.scss';

interface props {
  image: string;
  editCb: (file: FormData) => void;
  deleteCb: (image: string) => void;
}

export default function AdminImage({ image, editCb, deleteCb }: props) {
  function onDeleteClick() {
    deleteCb(image);
  }

  function onEditClick(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      const formData = new FormData();
      formData.append('file', file);
      editCb(formData);
    }
  }

  return (
    <div className="AdminImage" style={{ backgroundImage: `url(${image})` }}>
      <button
        className="AdminImage__button AdminImage__button_delete"
        type="button"
        onClick={onDeleteClick}
      />
      <label className="AdminImage__button AdminImage__button_edit">
        <svg
          viewBox="0 0 780 1000"
          fill="currentColor"
          height="1em"
          width="1em"
        >
          <path d="M718 170c21.333 21.333 37 42.667 47 64s15 37.333 15 48v16L528 550 238 838 0 890l50-240 290-288 252-252c36-8 78 12 126 60M224 810l24-24c-1.333-29.333-18.667-60.667-52-94-14.667-14.667-29.667-26.333-45-35-15.333-8.667-27-13-35-13l-14-2-22 24-18 80c18.667 10.667 34 22 46 34 16 16 28 32 36 48l80-18" />
        </svg>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={onEditClick}
        />
      </label>
    </div>
  );
}
