"use client";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { openSnackBar } from "@/app/lib/redux/slices/appSlice";
import { addItem, setItems } from "@/app/lib/redux/slices/itemSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/store";
import {
  ApiGetItem,
  ApiGetTypeSelectors,
  ApiPostImages,
  ApiPostItem,
  ApiUpdateItem,
} from "@/app/lib/utils/api";
import { apiUrl } from "@/app/lib/utils/config";
import { CategoryNode, IItemDto, ISelect } from "@/app/lib/utils/types";
import { categoryTree } from "@/app/lib/utils/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { MultiValue, SingleValue } from "react-select";
import AdminImage from "../AdminImage/AdminImage";
import "./AdminItems.scss";

interface IInputData extends Omit<IItemDto, "images"> { }

interface Props {
  type?: "add" | "edit";
}

export default function AdminItems({ type = "add" }: Props) {
  const { handleError } = useErrorHandler();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
    setValue,
    trigger,
  } = useForm<IInputData>({});
  const dispatch = useAppDispatch();
  const { data: items } = useAppSelector((state) => state.itemSlice);
  const [images, setImages] = useState<string[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 1279 });
  const [typeOptions, setTypeOptions] = useState<ISelect[]>([]);
  const [selectedType, setSelectedType] = useState<ISelect | null>(null);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>([]);

  const { id } = useParams();

  function handleDeleteImage(image: string) {
    setImages((prev) => prev.filter((item) => item !== image));
  }

  function handleEditImage(formData: FormData, oldImage: string) {
    ApiPostImages(formData)
      .then((newImages) => {
        const newFile = `${apiUrl}/${newImages[0].filePath}`;
        setImages((prev) =>
          prev.map((item) => (item === oldImage ? newFile : item))
        );
      })
      .catch(handleError);
  }

  const onSubmit: SubmitHandler<IInputData> = (data) => {
    const payload = {
      ...data,
      price: Number(data.price),
      images,
      // type: selectedType!.value,
    };

    const method = type === "add" ? ApiPostItem : () => ApiUpdateItem(Number(id), payload);
    method(payload)
      .then((item) => {
        if (type === "add") {
          reset();
          setImages([]);
          dispatch(addItem(item));
        } else {
          const updated = items.map((oldItem) =>
            oldItem.id === item.id ? item : oldItem
          );
          dispatch(setItems(updated));
        }
        dispatch(openSnackBar({ text: "Успешно" }));
      })
      .catch(handleError);
  };

  const handleDropImages = (files: FileList | File) => {
    const formData = new FormData();
    if (files instanceof FileList) {
      Array.from(files).forEach((file) => formData.append("files", file));
    } else {
      formData.append("files", files);
    }
    ApiPostImages(formData)
      .then((imgs) =>
        setImages((prev) => [
          ...prev,
          ...imgs.map((img) => `${apiUrl}/${img.filePath}`),
        ])
      )
      .catch(handleError);
  };

  useEffect(() => {
    ApiGetTypeSelectors()
      .then((selectors) =>
        setTypeOptions(selectors.map(({ name }) => ({ label: name, value: name })))
      )
      .catch(handleError);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (type === "edit") {
        const item = await ApiGetItem(Number(id));
        if (item) {
          setImages(item.images);
          setValue("name", item.name);
          setValue("description", item.description);
          setValue("price", item.price);
          setValue("category", item.category);
          setSelectedCategoryPath(item.category);
          // const type = selectTypes.find(i => i.value == item.type);
          // if (type) {
          //   setSelectedType(type);
          // }
          setValue("inStock", item.inStock);
          setValue("is_active", item.is_active);
          trigger();
        }
      }
    };

    fetchData();
  }, [type, id, trigger, setValue]);

  const handleChangeSelect = (newValue: SingleValue<ISelect> | MultiValue<ISelect>) => {
    setSelectedType(newValue as ISelect);
  };

  function filesOnChangeHandler(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) handleDropImages(files);
  }

  function getSubcategories(path: string[]): CategoryNode[] | undefined {
    let current = categoryTree;
    for (const value of path) {
      const found = current.find((c) => c.value === value);
      if (found?.children) {
        current = found.children;
      } else {
        return undefined;
      }
    }
    return current;
  }

  function handleCategoryChange(level: number, value: string) {
    if (value === "") {
      const newPath = selectedCategoryPath.slice(0, level);
      setSelectedCategoryPath(newPath);
      setValue("category", newPath);
    } else {
      const newPath = [...selectedCategoryPath.slice(0, level), value];
      setSelectedCategoryPath(newPath);
      setValue("category", newPath);
    }
    trigger("category");
  }

  return (
    <>
      <Link href="/admin/items" className="link admin__section-link">Назад</Link>
      <section className="admin__section">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form__container-parrent">
            <div className="form__container">
              <label className="form__label">
                {errors.name && <p className="form__error">{errors.name.message}</p>}
                <input className="form__input" placeholder="название" {...register("name", {
                  required: true, minLength: 2, maxLength: 128
                })} />
              </label>
              <label className="form__label">
                {errors.description && <p className="form__error">{errors.description.message}</p>}
                <textarea className="form__input form__input_textarea" placeholder="описание" {...register("description", { required: true })} />
              </label>
              <label>
                {errors.price && <p className="form__error">{errors.price.message}</p>}
                <input className="form__input" placeholder="цена" type="number" {...register("price", { required: true })} />
              </label>
              {/* <label className="form__label">
                Пол
                <select className="form__input" defaultValue="unisex" {...register("gender", { required: true })}>
                  <option value="male">Мужское</option>
                  <option value="female">Женское</option>
                  <option value="unisex">Унисекс</option>
                </select>
              </label> */}

              <label className="form__label">  {/* Категории*/}
                Категория
                {Array.from({ length: selectedCategoryPath.length + 1 }).map((_, level) => {
                  const options = level === 0
                    ? categoryTree
                    : getSubcategories(selectedCategoryPath.slice(0, level));
                  if (!options) return null;
                  return (
                    <select
                      key={level}
                      className="form__input"
                      value={selectedCategoryPath[level] || ""}
                      onChange={(e) => handleCategoryChange(level, e.target.value)}
                    >
                      <option value="">Выберите...</option>
                      {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  );
                })}
              </label>

              <label className="form__label">
                Активное время
                <select className="form__input" defaultValue="90d" {...register("active_time", { required: true })}>
                  <option value="90d">90 дней</option>
                  <option value="180d">180 дней</option>
                  <option value="Infinity">Бессрочно</option>
                </select>
              </label>
              {/* <label>
                <Select
                  options={selectTypes.slice(1)}
                  onChange={handleChangeSelect}
                  value={selectedType}
                  styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </label> */}
              <label className="form__label">
                Активно
                <input className="form__input" type="checkbox" defaultChecked {...register("is_active")} />
              </label>
              <label className="form__label">
                В наличии
                <input className="form__input" type="checkbox" defaultChecked {...register("inStock")} />
              </label>
            </div>
            <div className="form__label form__label_images">
              <div className="form__grid-container">
                {images?.map((image, index) => (
                  <AdminImage key={index} image={image} editCb={handleEditImage} deleteCb={handleDeleteImage} />
                ))}
              </div>
              <div className="form__label_absolute">
                {isMobile ? (
                  <label className="form__centralized-text">
                    {images.length === 0 ? "Перетащите фото (мин количество 2)" : ""}
                    <input
                      type="file"
                      onChange={filesOnChangeHandler}
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </label>
                ) : (
                  <FileUploader
                    handleChange={handleDropImages}
                    multiple
                    hoverTitle="Перетащите фото"
                  >
                    {!images.length && (
                      <p className="form__centralized-text">
                        Перетащите фото (мин количество 2)
                      </p>
                    )}
                  </FileUploader>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="form__button form__button_submit"
            disabled={images.length < 2 || !isValid || !selectedCategoryPath}
          >
            Сохранить
          </button>
        </form>
      </section>
    </>
  );
}
