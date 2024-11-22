"use client";
import React, { useState, ChangeEvent, FormEvent, Suspense } from "react";
import Logo from "@/app/assets/svg/solyticket_logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthApi } from "@/app/api/authentication";
import { jwtDecode } from "jwt-decode";
import { ClientStorage } from "@/app/base/storage";
import { ConfigHelper } from "@/app/base/constants";
import { withoutToken } from "@/app/hoc/withoutToken";
import Swal from "sweetalert2";
import LogoFiller from "@/app/components/Base/Spinner/LogoFiller";

interface LoginModel {
  email: string;
  password: string;
}

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

const Login: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [formData, setFormData] = useState<LoginModel>({
    email: "",
    password: "",
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setIsFormValid(formData.email !== "" && formData.password !== "");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      const authApi = new AuthApi({});
      const res = await authApi.login(formData);
      if (res.success && res.data) {
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
        if (token.roles[0].name === "soly-org") {
          router.push("/home");
        } else {
          router.push("/");
        }
      }
    } else {
      alert("Lütfen tüm alanları doldurun.");
    }
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: "Şifreyi Yenile",
      input: "email",
      inputLabel: "Email adresinizi girin",
      inputPlaceholder: "Email adresiniz",
      showCancelButton: true,
      confirmButtonText: "Gönder",
      cancelButtonText: "İptal",
    });

    if (email) {
      const authApi = new AuthApi({});
      const emailResponse = await authApi.requestPasswordReset(email);

      if (emailResponse.success) {
        const { value: formValues } = await Swal.fire({
          title: "Yeni Şifre Belirleyin",
          html:
            '<input id="swal-input1" class="swal2-input" placeholder="Yeni şifre" type="password">' +
            '<input id="swal-input2" class="swal2-input" placeholder="Şifreyi onaylayın" type="password">',
          focusConfirm: false,
          preConfirm: () => {
            return [
              (document.getElementById("swal-input1") as HTMLInputElement)
                .value,
              (document.getElementById("swal-input2") as HTMLInputElement)
                .value,
            ];
          },
          showCancelButton: true,
          confirmButtonText: "Gönder",
          cancelButtonText: "İptal",
        });

        if (formValues) {
          const [newPassword, confirmPassword] = formValues;
          const passwordValidationMessage = validatePassword(newPassword);

          if (passwordValidationMessage) {
            Swal.fire("Hata", passwordValidationMessage, "error");
            return;
          }

          if (newPassword === confirmPassword) {
            const passwordResponse = await authApi.resetPassword(
              email,
              emailResponse?.data?.resetToken ?? "",
              newPassword
            );
            if (passwordResponse.success) {
              Swal.fire(
                "Başarılı!",
                "Şifreniz başarıyla değiştirildi.",
                "success"
              );
            } else {
              Swal.fire(
                "Hata",
                "Şifre değiştirme işlemi başarısız oldu.",
                "error"
              );
            }
          } else {
            Swal.fire("Hata", "Şifreler eşleşmiyor.", "error");
          }
        }
      } else {
        Swal.fire("Hata", "Email gönderimi başarısız oldu.", "error");
      }
    }
  };
  const overlayStyle = {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    overflow: "hidden", // Prevent scrolling
  };

  const pageStyle = {
    height: "100vh",
    overflow: "hidden", // Prevent scrolling
  };

  return (
    <Suspense
      fallback={
        <div style={pageStyle}>
          <div style={overlayStyle}>
            <LogoFiller />
          </div>
        </div>
      }
    >
      <div className="container mx-auto flex justify-center px-5 my-5 sm:my-20">
        <div className="bg-[#F6F6FE] rounded-[26px] w-full md:w-9/12 lg:w-6/12">
          <div className="px-6 sm:px-16 py-20 text-center mx-auto">
            <div>
              <Image src={Logo} alt="" className="block" />
            </div>
            <h5 className="text-black">Giriş Yapın</h5>
            {/* <p className="text-black">Lütfen hesabınıza giriş yapın</p> */}

            <form onSubmit={handleSubmit} className="text-start my-8">
              <div className="mb-5">
                <h6>
                  <label
                    htmlFor="EmailAddress"
                    className="form-label text-black"
                  >
                    E-posta
                  </label>
                </h6>
                <input
                  type="email"
                  className="newInput"
                  id="EmailAddress"
                  aria-describedby="emailHelp"
                  placeholder="E-posta"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-5">
                <h6>
                  <label
                    htmlFor="LoginPassword"
                    className="form-label text-black"
                  >
                    Şifre
                  </label>
                </h6>
                <input
                  type="password"
                  className="newInput"
                  id="LoginPassword"
                  aria-describedby="emailHelp"
                  placeholder="Şifre"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="text-end">
                <h6>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="hover:text-blue-700  focus:outline-none"
                  >
                    Şifremi Unuttum?
                  </button>
                </h6>
              </div>
              <div className="my-8">
                <button
                  className={`BlueButton w-full ${
                    isFormValid ? "" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  type="submit"
                  disabled={!isFormValid}
                >
                  Giriş
                </button>
              </div>
            </form>

            <div>
              <p className="text-black">
                Hesabınız yok mu?{" "}
                <span className="font-bold">
                  <Link
                    className={`link ${pathname === "/signup" ? "active" : ""}`}
                    href="/signup"
                  >
                    Kayıt Ol
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default withoutToken(Login);
