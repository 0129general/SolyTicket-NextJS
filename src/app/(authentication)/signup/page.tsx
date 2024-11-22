"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Logo from "@/app/assets/svg/solyticket_logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { AuthApi } from "@/app/api/authentication";
import { ClientStorage } from "@/app/base/storage";
import { ConfigHelper } from "@/app/base/constants";
import { useRouter } from "next/navigation";
import { withoutToken } from "@/app/hoc/withoutToken";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import { tr } from "date-fns/locale";

interface FormModel {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  role: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [formData, setFormData] = useState<FormModel>({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    role: "CUSTOMER",
    password: "",
    confirmPassword: "",
  });

  const [phoneError, setPhoneError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (formData.birthday) {
      setSelectedDate(parseISO(formData.birthday));
    }
  }, [formData.birthday]);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      handleChange({
        target: {
          id: "birthday",
          value: date.toISOString(),
        },
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  useEffect(() => {
    const isFormValid =
      Object.values(formData).every((value) => value.trim() !== "") &&
      !phoneError &&
      !passwordError &&
      !confirmPasswordError;
    setIsFormValid(isFormValid);
  }, [formData, phoneError, passwordError, confirmPasswordError]);

  const formatPhoneNumber = (value: string): string => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}`;
    }
    if (phoneNumberLength < 9) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
      )} ${phoneNumber.slice(6, 8)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )} ${phoneNumber.slice(6, 8)} ${phoneNumber.slice(8, 10)}`;
  };

  const validatePassword = (password: string): string => {
    const minLength = 8;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (password.length < minLength) {
      return `Şifre en az ${minLength} karakter uzunluğunda olmalıdır.`;
    }
    if (!regex.test(password)) {
      return "Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.";
    }
    return "";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;

    if (id === "phone") {
      setFormData((prevState) => ({
        ...prevState,
        phone: formatPhoneNumber(value),
      }));

      const formattedValue = formatPhoneNumber(value);
      if (formattedValue.replace(/[^\d]/g, "").length !== 10) {
        setPhoneError("Telefon numarası geçersiz.");
      } else {
        setPhoneError("");
      }
    } else if (id === "password") {
      const error = validatePassword(value);
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
      setPasswordError(error);
    } else if (id === "confirmPassword") {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const startVerificationModal = async (userId: string) => {
    let timerInterval: NodeJS.Timeout;
    const { value: verificationCode } = await Swal.fire({
      title: "Doğrulama Kodu Girin",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Doğrulama Kodu">
        <br>
        <div>Kalan süre: <span id="swal-timer">180</span> saniye</div>
        <div id="swal-timer-bar" style="background: #4E43F1; height: 5px; width: 100%;"></div>
      `,
      showCancelButton: true,
      confirmButtonText: "Doğrula",
      cancelButtonText: "İptal",
      didOpen: () => {
        const content = Swal.getHtmlContainer();
        if (content) {
          const timerSpan = content.querySelector(
            "#swal-timer"
          ) as HTMLSpanElement;
          const timerBar = content.querySelector(
            "#swal-timer-bar"
          ) as HTMLDivElement;
          let timeLeft = 180;

          timerInterval = setInterval(() => {
            timeLeft--;
            if (timerSpan) timerSpan.textContent = timeLeft.toString();
            if (timerBar) timerBar.style.width = `${(timeLeft / 180) * 100}%`;

            if (timeLeft <= 0) {
              clearInterval(timerInterval);
            }
          }, 1000);
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
      preConfirm: async () => {
        const code = (
          document.getElementById("swal-input1") as HTMLInputElement
        ).value;
        const authApi = new AuthApi({});
        const res = await authApi.verifyAccount(
          userId,
          code,
          formData.password
        );
        if (!res.success) {
          Swal.showValidationMessage(
            "Doğrulama başarısız oldu. Lütfen tekrar deneyin."
          );
        }
        const token = res.data as any;

        ClientStorage.setItem(ConfigHelper.SOLY_USER_ROLE, token.roles[0].name);
        ClientStorage.setItem(
          ConfigHelper.SOLY_USER_TOKEN_CREATE_TIME,
          new Date().getTime()
        );
        ClientStorage.setItem(ConfigHelper.SOLY_USERNAME, token.name);

        ClientStorage.setItem(ConfigHelper.SOLY_USER_ID, token.userId);
        ClientStorage.setItem(ConfigHelper.SOLY_USER_TOKEN, token.access_token);
        ClientStorage.setItem(
          ConfigHelper.SOLY_USER_REFRESH,
          token.refresh_token
        );
        router.push("/");
        return res;
      },
    });

    if (verificationCode) {
      Swal.fire("Başarılı!", "Hesabınız doğrulandı.", "success");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Şifreler eşleşmiyor.");
      return;
    } else {
      setConfirmPasswordError("");
    }

    if (!isFormValid) {
      alert("Lütfen tüm alanları doğru bir şekilde doldurun.");
      return;
    }
    const req: CreateAccountModels = {
      birthday: formData.birthday,
      email: formData.email,
      name: formData.name,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
    };
    const authApi = new AuthApi({});
    const res = await authApi.createAccount(req);
    if (res.success && res.data?.userId) {
      startVerificationModal(res.data.userId);
    }
  };

  return (
    <>
      <div className="container mx-auto flex justify-center px-5 my-5 sm:my-20">
        <div className="bg-[#F6F6FE] rounded-[26px] w-full md:w-9/12 lg:w-6/12">
          <div className="px-6 sm:px-16 py-20 text-center mx-auto">
            <div>
              <Image src={Logo} alt="" className="block" />
            </div>
            <h5 className="text-black pt-3">Hesabınızı Oluşturun</h5>

            <form onSubmit={handleSubmit} className="text-start my-8">
              <div className="mb-5">
                <h6>
                  <label htmlFor="name" className="form-label text-black">
                    Ad Soyad
                  </label>
                </h6>
                <input
                  type="text"
                  className="newInput"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ad Soyad"
                  required
                />
              </div>
              <div className="mb-5">
                <h6>
                  <label htmlFor="email" className="form-label text-black">
                    E-posta
                  </label>
                </h6>
                <input
                  type="email"
                  className="newInput"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-posta"
                  required
                />
              </div>
              <div className="mb-5">
                <h6>
                  <label htmlFor="phone" className="form-label text-black">
                    Telefon
                  </label>
                </h6>
                <input
                  type="text"
                  className="newInput"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(5**) *** ** **"
                  maxLength={15}
                  required
                />
                {phoneError && (
                  <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                )}
              </div>
              <div className="mb-5">
                <h6>
                  <label htmlFor="birthday" className="form-label text-black">
                    Doğum Tarihi
                  </label>
                </h6>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="date-picker-container">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="yyyy-MM-dd"
                      className="newInput"
                      calendarClassName="custom-calendar"
                      dayClassName={(date) =>
                        date.getDay() === 0 || date.getDay() === 6
                          ? "text-red-500"
                          : "text-gray-900"
                      }
                      locale={tr} // Set locale to Turkish
                      popperPlacement="bottom-start"
                      popperClassName="react-datepicker-popper-custom"
                      required
                      wrapperClassName="date-picker-wrapper"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select" // Can be "scroll" or "select"
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        monthDate,
                      }) => (
                        <div className="flex justify-center">
                          <select
                            value={date.getMonth()}
                            onChange={({ target: { value } }) =>
                              changeMonth(parseInt(value))
                            }
                            className="mx-1 p-1 bg-white text-indigo-700 rounded-lg px-2 py-1"
                          >
                            {Array.from({ length: 12 }, (_, i) => (
                              <option key={i} value={i}>
                                {new Date(0, i).toLocaleString("tr-TR", {
                                  month: "long",
                                })}
                              </option>
                            ))}
                          </select>

                          <select
                            value={date.getFullYear()}
                            onChange={({ target: { value } }) =>
                              changeYear(parseInt(value))
                            }
                            className="mx-1 p-1 bg-white text-indigo-700 rounded-lg px-2 py-1"
                          >
                            {Array.from({ length: 100 }, (_, i) => (
                              <option key={i} value={i + 1900}>
                                {i + 1900}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    />
                  </div>
                  <div className="absolute inset-y-0 right-0 pr-5 pt-2 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM3 6a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V6zM9 12h2a1 1 0 110 2H9a1 1 0 110-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h6>
                  <label htmlFor="password" className="form-label text-black">
                    Şifre
                  </label>
                </h6>
                <input
                  type="password"
                  className="newInput"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Şifre"
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              <div className="mb-5">
                <h6>
                  <label
                    htmlFor="confirmPassword"
                    className="form-label text-black"
                  >
                    Şifreyi Onaylayın
                  </label>
                </h6>
                <input
                  type="password"
                  className="newInput"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Şifre"
                  required
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-sm mt-1">
                    {confirmPasswordError}
                  </p>
                )}
              </div>
              <div className="my-8">
                <button
                  type="submit"
                  className={`BlueButton w-full ${
                    !isFormValid ? "bg-gray-400 cursor-not-allowed" : ""
                  }`}
                  disabled={!isFormValid}
                >
                  Kaydol
                </button>
              </div>
            </form>
            <div>
              {pathname !== "/login" && (
                <p className="text-black">
                  Hesabınız var mı?{" "}
                  <span className="font-bold">
                    <Link
                      className={`link ${
                        pathname === "/login" ? "active" : ""
                      }`}
                      href="/login"
                    >
                      Giriş Yap
                    </Link>
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withoutToken(Signup);
