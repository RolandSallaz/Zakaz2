import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { closeAuthPopup } from "../../lib/redux/slices/authPopupSlice";
import { ApiLogin, checkUser, sendAuthCode } from "../../lib/utils/api";
import "./AuthPopup.scss";
import { login } from "../../lib/redux/slices/userSlice";
import { openSnackBar } from "../../lib/redux/slices/appSlice";
import useErrorHandler from "../../lib/hooks/useErrorHandler";
import { useAppDispatch } from "@/app/lib/redux/store";

enum PopupState {
  login,
  awaitingCode,
}

interface IFormAuth {
  email: string;
}

interface IFormAuthCode {
  code: string;
}

export default function AuthPopup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty, isLoading },
    getValues,
  } = useForm<IFormAuth>({ mode: "onSubmit" });
  const formAuthCode = useForm<IFormAuthCode>({ mode: "onSubmit" });
  const [popupState, setPopupState] = useState<PopupState>(PopupState.login);
  const [buttonText, setButtonText] = useState<string>(
    "Войти / Зарегистрироваться"
  );
  const dispatch = useAppDispatch();
  const { handleError } = useErrorHandler();
  function handleClosePopup(e: MouseEvent<HTMLDivElement>) {
    if (e.target == e.currentTarget) {
      dispatch(closeAuthPopup());
    }
  }

  const onSubmit: SubmitHandler<IFormAuth> = (data) => {
    sendAuthCode(data.email).then(() => setPopupState(PopupState.awaitingCode));
  };

  const onSubmitAuth: SubmitHandler<IFormAuthCode> = (data) => {
    ApiLogin({ email: getValues("email"), code: Number(data.code) })
      .then((user) => {
        dispatch(login(user));
        dispatch(closeAuthPopup());
        dispatch(openSnackBar({ text: "Вы успешно вошли в аккаунт" }));
      })
      .catch(handleError);
  };

  useEffect(() => {
    if (isValid) {
      setButtonText("Проверяем емейл");
      checkUser(getValues("email"))
        .then(() => {
          setButtonText("Войти");
        })
        .catch(() => {
          setButtonText("Зарегистрироваться");
        });
    }
  }, [isValid]);

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      formAuthCode.setValue("code", value, { shouldValidate: true });
      if (value.length === 6) {
        formAuthCode.handleSubmit(onSubmitAuth)();
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const loginForm = (
    <form className="AuthPopup__form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="AuthPopup__heading">Вход/Регистрация</h2>
      <div className="AuthPopup__input-container">
        <span className="AuthPopup__error-text">{errors.email?.message}</span>
        <input
          placeholder="Емейл"
          className="AuthPopup__input"
          type="email"
          {...register("email", {
            required: "Данное поле обязательно для заполнения",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Некорректный емейл",
            },
          })}
        />
      </div>

      <button
        className="AuthPopup__button AuthPopup__button_submit"
        type="submit"
        disabled={!isDirty || !isValid || isLoading}
      >
        {buttonText}
      </button>
    </form>
  );

  const codeForm = (
    <form
      className="AuthPopup__form"
      onSubmit={formAuthCode.handleSubmit(onSubmitAuth)}
    >
      <h2 className="AuthPopup__heading">Введите код подтверждения</h2>
      <button
        type="button"
        className="AuthPopup__button AuthPopup__button_back"
        onClick={() => setPopupState(PopupState.login)}
      >
        Назад
      </button>
      <input
        placeholder="Код подтверждения"
        className="AuthPopup__input"
        type="text"
        inputMode="numeric"
        maxLength={6}
        {...formAuthCode.register("code", {
          required: "Данное поле обязательно для заполнения",
          minLength: { value: 6, message: "Минимальная длина - 6 символов" },
          maxLength: { value: 6, message: "Максимальная длина - 6 символов" },
          onChange: handleCodeChange, // Добавляем обработчик события onChange
        })}
        onKeyPress={handleKeyPress} // Добавляем обработчик нажатия клавиш
        disabled={formAuthCode.formState.isLoading}
      />
    </form>
  );

  return (
    <div className="AuthPopup" onClick={handleClosePopup}>
      {popupState == PopupState.login ? loginForm : codeForm}
    </div>
  );
}
