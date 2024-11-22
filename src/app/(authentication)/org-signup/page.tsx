"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import Logo from "@/app/assets/svg/solyticket_logo.svg";
import { withoutToken } from "@/app/hoc/withoutToken";
import { usePathname, useRouter } from "next/navigation";
import Stepper from "@/app/components/Base/stepper/stepper";
import { deleteFileFromR2, uploadFileToR2 } from "@/app/utilities/r2Uploader";
import { AuthApi } from "@/app/api/authentication";
import Swal from "sweetalert2";

interface AccountFormModel {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  password: string;
  confirmPassword: string;
}

interface CompanyFormModel {
  companyType: string;
  imzaSirkusu?: File | null;
  vergiLevha?: File | null;
  ticaretSicilGazetesi?: File | null;
  tcFotokopi?: File | null;
  imzaBeyannamesi?: File | null;
  companyAddress: string;
  companyPhone: string;
  bankAccount: string;
  bankBranch: string;
  iban: string;
  accountName: string;
  companyEmail: string;
  accountantEmail: string;
}

const Signup: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const pathname = usePathname();
  const router = useRouter();
  const [formData, setFormData] = useState<AccountFormModel>({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
  const [CompanyFormData, setCompanyFormData] = useState<CompanyFormModel>({
    companyType: "",
    companyAddress: "",
    companyPhone: "",
    bankAccount: "",
    bankBranch: "",
    iban: "",
    accountName: "",
    companyEmail: "",
    accountantEmail: "",
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    if (formData.birthday) {
      setSelectedDate(new Date(formData.birthday));
    }
  }, [formData.birthday]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

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

  const handleSubmitStep1 = (e: FormEvent) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.password &&
      formData.confirmPassword
    ) {
      setStep(2);
    } else {
      alert("Please fill all required fields in step 1.");
    }
  };

  const handleSubmitStep2 = (e: FormEvent) => {
    e.preventDefault();
    if (
      CompanyFormData.companyType &&
      CompanyFormData.companyAddress &&
      CompanyFormData.companyPhone &&
      CompanyFormData.bankAccount &&
      CompanyFormData.bankBranch &&
      CompanyFormData.iban &&
      CompanyFormData.accountName &&
      CompanyFormData.companyEmail &&
      CompanyFormData.accountantEmail
    ) {
      setStep(3); // Step 3'e geç
    } else {
      alert("Please fill all required fields in step 2.");
    }
  };

  const handleSubmitFinal = async (e: FormEvent) => {
    e.preventDefault();

    const formData2 = new FormData();

    const uploadedFiles: string[] = []; // Yüklenen dosya isimlerini saklamak için
    try {
      const fileFields = [
        "imzaSirkusu",
        "vergiLevha",
        "ticaretSicilGazetesi",
        "tcFotokopi",
        "imzaBeyannamesi",
      ];

      // Dosya yükleme işlemi
      for (let field of fileFields) {
        const file = CompanyFormData[
          field as keyof CompanyFormModel
        ] as File | null;
        if (file) {
          const result = await uploadFileToR2(
            file,
            CompanyFormData.accountName
          );

          if (result.success) {
            uploadedFiles.push(
              `resources/${CompanyFormData.accountName}/${file.name}`
            );
          } else {
            alert(
              `Dosya yüklemede hata: ${CompanyFormData.accountName} ${file.name}`
            );
            for (let uploadedFile of uploadedFiles) {
              await deleteFileFromR2(uploadedFile);
            }
            throw new Error(
              "Yükleme sırasında bir hata oluştu, yüklenen dosyalar geri alındı."
            );
          }
        }
      }

      // Dosya isimlerini kullanarak API isteği
      const authApi = new AuthApi({});
      const res = await authApi.createOrg(
        formData.name,
        formData.email,
        formData.phone,
        formData.birthday,
        formData.password,
        CompanyFormData.companyType,
        uploadedFiles[0] || "", // imzaSirkusu
        uploadedFiles[1] || "", // vergiLevha
        uploadedFiles[2] || "", // ticaretSicilGazetesi
        uploadedFiles[3] || "", // tcFotokopi
        uploadedFiles[4] || "", // imzaBeyannamesi
        CompanyFormData.companyAddress,
        CompanyFormData.companyPhone,
        CompanyFormData.bankAccount,
        CompanyFormData.bankBranch,
        CompanyFormData.iban,
        CompanyFormData.accountName,
        CompanyFormData.accountantEmail
      );

      if (res) {
        Swal.fire("Başarılı!", "Hesabınız oluşturuldu.", "success");
        router.push("/");
      } else {
        // alert("API isteğinde bir hata oluştu.");
      }
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
      // alert("Dosya yükleme sırasında bir hata oluştu.");
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const formattedPhoneNumber = formatPhoneNumber(value);

    setCompanyFormData((prevState) => ({
      ...prevState,
      companyPhone: formattedPhoneNumber,
    }));
  };

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

  const handleIbanChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, "");
    if (!value.startsWith("TR")) {
      value = "TR" + value.slice(2);
    }

    if (value.length > 26) {
      value = value.slice(0, 26);
    }

    value = value.replace(/(.{4})/g, "$1 ").trim();

    setCompanyFormData({ ...CompanyFormData, iban: value });
  };

  return (
    <div className="container mx-auto flex justify-center px-5 my-5 sm:my-20">
      <div className="bg-[#F6F6FE] rounded-[26px] w-full md:w-9/12 lg:w-6/12">
        <div className="px-6 sm:px-16 py-20 text-center mx-auto">
          <div>
            <Image src={Logo} alt="logo" className="block" />
          </div>
          <h5 className="text-black pt-3">Organizatör Hesabı Oluşturun</h5>

          <Stepper
            steps={["Hesap Bilgileri", "Şirket Bilgileri", "Şirket Belgeleri"]}
            currentStep={step}
            onStepClick={setStep}
          />

          {step === 1 && (
            <form onSubmit={handleSubmitStep1} className="text-start my-8">
              <div className="mb-5">
                <label htmlFor="name" className="form-label text-black">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="newInput"
                  placeholder="Ad Soyad"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="form-label text-black">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="newInput"
                  placeholder="E-posta"
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="phone" className="form-label text-black">
                  Telefon
                </label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="newInput"
                  placeholder="(5**) *** ** **"
                  maxLength={15}
                  required
                />
              </div>
              <div className="mb-5">
                <label htmlFor="birthday" className="form-label text-black">
                  Doğum Tarihi
                </label>
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
              <div className="mb-5">
                <label htmlFor="password" className="form-label text-black">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="newInput"
                  placeholder="Şifre"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="confirmPassword"
                  className="form-label text-black"
                >
                  Şifreyi Onaylayın
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="newInput"
                  placeholder="Şifre"
                  required
                />
              </div>

              <div className="my-8">
                <button type="submit" className="BlueButton w-full">
                  İleri
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitStep2} className="text-start my-8">
              <div className="mb-5">
                <label htmlFor="companyType" className="form-label text-black">
                  Şirket Tipi
                </label>
                <select
                  id="companyType"
                  value={CompanyFormData.companyType}
                  onChange={(e) =>
                    setCompanyFormData({
                      ...CompanyFormData,
                      companyType: e.target.value,
                    })
                  }
                  className="newInput"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Şahıs">Şahıs</option>
                  <option value="Limited&Anonim">Limited & Anonim</option>
                </select>
              </div>

              <div className="mb-5">
                <label
                  htmlFor="companyAddress"
                  className="form-label text-black"
                >
                  Şirket Adresi
                </label>
                <textarea
                  id="companyAddress"
                  value={CompanyFormData.companyAddress}
                  onChange={(e) =>
                    setCompanyFormData({
                      ...CompanyFormData,
                      companyAddress: e.target.value,
                    })
                  }
                  className={`newInput`}
                  placeholder="Şirket Adresi"
                  rows={2}
                  required
                />
              </div>

              <div className="mb-5">
                <label htmlFor="companyPhone" className="form-label text-black">
                  Şirket Telefon Numarası
                </label>
                <input
                  type="text"
                  id="companyPhone"
                  value={CompanyFormData.companyPhone}
                  onChange={handlePhoneChange}
                  className={`newInput ${
                    CompanyFormData.companyPhone &&
                    CompanyFormData.companyPhone.replace(/[^\d]/g, "")
                      .length !== 10
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="(5**) *** ** **"
                  maxLength={16}
                  required
                />
                {CompanyFormData.companyPhone &&
                  CompanyFormData.companyPhone.replace(/[^\d]/g, "").length !==
                    10 && (
                    <p className="text-red-500 text-sm">
                      Lütfen geçerli bir telefon numarası girin (ör. (555) 555
                      55 55).
                    </p>
                  )}
              </div>

              <div className="mb-5">
                <label htmlFor="bankAccount" className="form-label text-black">
                  Banka Hesap Numarası
                </label>
                <input
                  type="text"
                  id="bankAccount"
                  value={CompanyFormData.bankAccount}
                  onChange={(e) =>
                    setCompanyFormData({
                      ...CompanyFormData,
                      bankAccount: e.target.value,
                    })
                  }
                  className="newInput"
                  placeholder="Banka Hesap Numarası"
                  required
                />
              </div>

              <div className="mb-5">
                <label htmlFor="bankBranch" className="form-label text-black">
                  Banka Şube Adı
                </label>
                <input
                  type="text"
                  id="bankBranch"
                  value={CompanyFormData.bankBranch}
                  onChange={(e) =>
                    setCompanyFormData({
                      ...CompanyFormData,
                      bankBranch: e.target.value,
                    })
                  }
                  className="newInput"
                  placeholder="Banka Şube Adı"
                  required
                />
              </div>

              <div className="mb-5">
                <label htmlFor="iban" className="form-label text-black">
                  IBAN Numarası
                </label>
                <input
                  type="text"
                  id="iban"
                  value={CompanyFormData.iban || "TR"}
                  onChange={handleIbanChange}
                  className={`newInput ${
                    CompanyFormData.iban &&
                    !/^TR\d{2} \d{4} \d{4} \d{4} \d{4} \d{4} \d{2}$/.test(
                      CompanyFormData.iban
                    )
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="TRxx xxxx xxxx xxxx xxxx xxxx xx"
                  required
                  maxLength={32}
                />
                {CompanyFormData.iban &&
                  !/^TR\d{2} \d{4} \d{4} \d{4} \d{4} \d{4} \d{2}$/.test(
                    CompanyFormData.iban
                  ) && (
                    <p className="text-red-500 text-sm">
                      Lütfen geçerli bir IBAN girin (TRxx xxxx xxxx xxxx xxxx
                      xxxx xx).
                    </p>
                  )}
              </div>

              <div className="mb-5">
                <label htmlFor="accountName" className="form-label text-black">
                  Hesap Adı
                </label>
                <input
                  type="text"
                  id="accountName"
                  value={CompanyFormData.accountName}
                  onChange={(e) =>
                    setCompanyFormData({
                      ...CompanyFormData,
                      accountName: e.target.value,
                    })
                  }
                  className="newInput"
                  placeholder="Hesap Adı"
                  required
                />
              </div>

              <div className="mb-5">
                <label htmlFor="companyEmail" className="form-label text-black">
                  Şirket İlgili Kişi Mail Adresi
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  value={CompanyFormData.companyEmail}
                  onChange={(e) =>
                    setCompanyFormData({
                      ...CompanyFormData,
                      companyEmail: e.target.value,
                    })
                  }
                  className="newInput"
                  placeholder="Şirket İlgili Kişi Mail"
                  required
                />
              </div>

              <div className="mb-5">
                <label
                  htmlFor="accountantEmail"
                  className="form-label text-black"
                >
                  Muhasebeci Mail Adresi
                </label>
                <input
                  type="email"
                  id="accountantEmail"
                  value={CompanyFormData.accountantEmail}
                  onChange={(e) =>
                    setCompanyFormData({
                      ...CompanyFormData,
                      accountantEmail: e.target.value,
                    })
                  }
                  className="newInput"
                  placeholder="Muhasebeci Mail"
                  required
                />
              </div>

              <div className="my-8">
                <button type="submit" className="BlueButton w-full">
                  İleri
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmitFinal} className="text-start my-8">
              {CompanyFormData.companyType === "Limited&Anonim" && (
                <>
                  <div className="mb-5">
                    <label
                      htmlFor="imzaSirkusu"
                      className="form-label text-black"
                    >
                      İmza Sirküleri
                    </label>
                    <input
                      type="file"
                      id="imzaSirkusu"
                      onChange={(e) =>
                        setCompanyFormData({
                          ...CompanyFormData,
                          imzaSirkusu: e.target.files
                            ? e.target.files[0]
                            : null,
                        })
                      }
                      className="newInput"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="vergiLevha"
                      className="form-label text-black"
                    >
                      Vergi Levhası
                    </label>
                    <input
                      type="file"
                      id="vergiLevha"
                      onChange={(e) =>
                        setCompanyFormData({
                          ...CompanyFormData,
                          vergiLevha: e.target.files ? e.target.files[0] : null,
                        })
                      }
                      className="newInput"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="ticaretSicil"
                      className="form-label text-black"
                    >
                      Ticaret Sicil Gazetesi Yazısı
                    </label>
                    <input
                      type="file"
                      id="ticaretSicil"
                      onChange={(e) =>
                        setCompanyFormData({
                          ...CompanyFormData,
                          ticaretSicilGazetesi: e.target.files
                            ? e.target.files[0]
                            : null,
                        })
                      }
                      className="newInput"
                      required
                    />
                  </div>
                </>
              )}

              {CompanyFormData.companyType === "Şahıs" && (
                <>
                  <div className="mb-5">
                    <label
                      htmlFor="tcFotokopi"
                      className="form-label text-black"
                    >
                      Nüfus Cüzdanı Fotokopisi
                    </label>
                    <input
                      type="file"
                      id="tcFotokopi"
                      onChange={(e) =>
                        setCompanyFormData({
                          ...CompanyFormData,
                          tcFotokopi: e.target.files ? e.target.files[0] : null,
                        })
                      }
                      className="newInput"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="imzaBeyannamesi"
                      className="form-label text-black"
                    >
                      İmza Beyannamesi
                    </label>
                    <input
                      type="file"
                      id="imzaBeyannamesi"
                      onChange={(e) =>
                        setCompanyFormData({
                          ...CompanyFormData,
                          imzaBeyannamesi: e.target.files
                            ? e.target.files[0]
                            : null,
                        })
                      }
                      className="newInput"
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <label
                      htmlFor="vergiLevha"
                      className="form-label text-black"
                    >
                      Vergi Levhası
                    </label>
                    <input
                      type="file"
                      id="vergiLevha"
                      onChange={(e) =>
                        setCompanyFormData({
                          ...CompanyFormData,
                          vergiLevha: e.target.files ? e.target.files[0] : null,
                        })
                      }
                      className="newInput"
                      required
                    />
                  </div>
                </>
              )}

              <div className="my-8">
                <button type="submit" className="BlueButton w-full">
                  Kaydol
                </button>
              </div>
            </form>
          )}

          <div>
            {pathname !== "/login" && (
              <p className="text-black">
                Hesabınız yok mu?{" "}
                <span className="font-bold">
                  <Link href="/login">Giriş Yap</Link>
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withoutToken(Signup);
