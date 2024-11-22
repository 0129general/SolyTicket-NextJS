"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import AvatarWomen from "@/app/assets/images/woman avatar.png";
import EditIcon from "@/app/assets/svg/Edit.svg";
import { ClientStorage } from "@/app/base/storage";
import { ConfigHelper } from "@/app/base/constants";
import { AuthApi } from "@/app/api/authentication";
import Swal from "sweetalert2";

const Profile = () => {
  const [userInfo, setUserInfo] = useState<userInfo>();
  const [changeEmail, setChangeEmail] = useState(false);
  const [changePass, setChangePass] = useState(false);
  const [pass, setPass] = useState("*********");
  const [againPass, setAgainPass] = useState("");
  const [passwordError, setPasswordError] = useState<string>("");
  const userId = ClientStorage.getItem(ConfigHelper.SOLY_USER_ID);

  useEffect(() => {
    const getOrgInfo = async () => {
      const api = new AuthApi({});
      const userInfo = await api.getUserInfo(userId);
      if (userInfo) {
        setUserInfo(userInfo);
      }
    };

    getOrgInfo();
  }, [userId]);

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

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Kopyalandı!");
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo((prevInfo) => {
      if (!prevInfo) return prevInfo;
      return { ...prevInfo, email: event.target.value };
    });
  };

  const handleSaveEmail = async () => {
    const api = new AuthApi({});
    if (userInfo) {
      const res = await api.updateUserInfo(userId, { email: userInfo.email });
      if (res) {
        setUserInfo((prevUserInfo) => {
          if (!prevUserInfo) return prevUserInfo;

          return {
            ...prevUserInfo,
            email: res.data.email,
          };
        });

        Swal.fire("Başarılı!", "Epostanız başarıyla değiştirildi.", "success");
      }
    }
    setChangeEmail(false);
  };

  const handleSavePass = async () => {
    if (pass !== againPass) {
      setPasswordError("Şifreler eşleşmiyor.");
      return;
    }
    const error = validatePassword(pass);
    if (error !== "") {
      setPasswordError(error);
      return;
    }
    const api = new AuthApi({});
    if (userInfo) {
      const res = await api.updateUserInfo(userId, { password: pass });
      if (res) {
        // setUserInfo((prevUserInfo) => {
        //   if (!prevUserInfo) return prevUserInfo;

        //   return {
        //     ...prevUserInfo,
        //     email: res.data.email,
        //   };
        // });
        Swal.fire("Başarılı!", "Şifreniz başarıyla değiştirildi.", "success");
      }
    }
    setChangePass(false);
    setPass("");
    setAgainPass("");
  };

  return (
    <>
      <div className="container mx-auto flex justify-center px-5 my-5 sm:my-20">
        <div className="shadow-ProfileShadow rounded-[26px] w-full  md:w-9/12 lg:w-8/12 xl:w-6/12">
          <div className="px-6 sm:px-16 py-20 text-center mx-auto">
            <h5>{userInfo?.name || "User Name"}</h5>
            <div className="text-start my-8">
              <div className="mb-5">
                <h6>
                  <label htmlFor="UserName" className="form-label">
                    Ad Soyad
                  </label>
                </h6>

                <input
                  type="text"
                  className="newInput"
                  id="UserName"
                  aria-describedby="nameHelp"
                  placeholder="User Name"
                  value={userInfo?.name || ""}
                  disabled={true}
                  readOnly
                />
              </div>
              <div className="mb-5">
                <div className="flex justify-between items-center">
                  <h6>
                    <label htmlFor="EmailAddress" className="form-label">
                      E-Posta Adresi
                    </label>
                  </h6>
                  {!changeEmail ? (
                    <button
                      type="button"
                      className="underline text-indigo-700"
                      onClick={() => setChangeEmail(true)}
                    >
                      E-Posta Değiştir
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="BlueButton px-4 py-2"
                      onClick={handleSaveEmail}
                    >
                      Kaydet
                    </button>
                  )}
                </div>
                <input
                  type="email"
                  className="newInput"
                  id="EmailAddress"
                  aria-describedby="emailHelp"
                  placeholder="Email Address"
                  value={userInfo?.email || ""}
                  onChange={handleEmailChange}
                  disabled={!changeEmail}
                />
              </div>
              <div className="mb-5">
                <div className="flex justify-between items-center">
                  <h6>
                    <label htmlFor="EmailAddress" className="form-label">
                      Parola
                    </label>
                  </h6>
                  {!changePass ? (
                    <button
                      type="button"
                      className="underline text-indigo-700"
                      onClick={() => {
                        setChangePass(true);
                        setPass("");
                      }}
                    >
                      Parola Değiştir
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="BlueButton px-4 py-2"
                      onClick={handleSavePass}
                    >
                      Kaydet
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  className="newInput"
                  id="pass"
                  aria-describedby="passHelp"
                  placeholder=""
                  value={pass || ""}
                  onChange={(e) => setPass(e.target.value)}
                  disabled={!changePass}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
                {changePass && (
                  <div className="pt-2">
                    <h6>
                      <label htmlFor="EmailAddress" className="form-label">
                        Tekrar Parola
                      </label>
                    </h6>
                    <input
                      type="password"
                      className="newInput"
                      id="againPass"
                      aria-describedby="againPassHelp"
                      placeholder=""
                      value={againPass || ""}
                      onChange={(e) => setAgainPass(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="mb-5">
                <h6>
                  <label htmlFor="PhoneNumber" className="form-label">
                    Telefon Numarası
                  </label>
                </h6>
                <input
                  type="text"
                  className="newInput"
                  id="PhoneNumber"
                  aria-describedby="phoneHelp"
                  placeholder="Phone Number"
                  value={userInfo?.phone || ""}
                  readOnly
                />
              </div>
              <div className="mb-5">
                <h6>
                  <label htmlFor="Birthday" className="form-label">
                    Doğum Tarihi
                  </label>
                </h6>
                <input
                  type="text"
                  className="newInput"
                  id="Birthday"
                  disabled={true}
                  aria-describedby="birthdayHelp"
                  placeholder="Birthday"
                  value={userInfo?.birthday.split("T")[0] || ""}
                  readOnly
                />
              </div>
              <div className="mb-5">
                <h6>
                  <label htmlFor="BcAddress" className="form-label">
                    Blockchain Cüzdanı
                  </label>
                </h6>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="newInput flex-grow"
                    id="BcAddress"
                    aria-describedby="bcAddressHelp"
                    placeholder="Blockchain Address"
                    value={userInfo?.bcAddress || ""}
                    readOnly
                    disabled={true}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyToClipboard(userInfo?.bcAddress || "")
                    }
                    className="BlueButton px-3 py-3 mt-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      width="24"
                      height="24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 8V6a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M8 12h8m-8 4h8m-7 8H6a2 2 0 01-2-2V8a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2h-3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
