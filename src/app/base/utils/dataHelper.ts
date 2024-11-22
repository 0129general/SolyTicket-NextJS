import { ConfigHelper } from "../constants";
import { ClientStorage } from "../storage";
export function concatenateAll(...args: string[]) {
  return args.join("");
}

const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
const reMsAjax = /^\/Date\((d|-|.*)\)[/|\\]$/;

export function customJsonDateParser(key: any, value: any) {
  if (typeof value === "string") {
    let a = reISO.exec(value);

    if (a) {
      return new Date(value);
    }

    a = reMsAjax.exec(value);

    if (a) {
      const b = a[1].split(/[-+,.]/);

      return new Date(b[0] ? +b[0] : 0 - +b[1]);
    }
  }

  return value;
}

export const uuidv4 = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;

    // eslint-disable-next-line no-mixed-operators
    const v = c === "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
};

export const handleImageUpload = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (data) => {
      // @ts-ignore
      resolve(data.target!.result);
    };

    reader.readAsDataURL(file);
  });
};

export const getUploadFileRequest = async (event: any) => {
  let base64Str: string = "";
  const fileList: any[] = [];

  if (event && event.target && event.target.files) {
    for (const file of event.target.files) {
      base64Str = await handleImageUpload(file);

      const fileReq = {
        Label: file.name,
        Content: base64Str.split(",")[1],
        Extension: file.type
          ? `.${file.type.substr(file.type.lastIndexOf("/") + 1)}`
          : "",
        FileType: file.type,
      };

      fileList.push(fileReq);
    }
  }

  return fileList;
};

export const createImageUrl = (imagePath: string) => {
  if (!imagePath) {
    return "";
  }

  if (imagePath[0] === "/") {
    return `${process.env.REACT_APP_IMAGE_URL ?? ""}${imagePath}`;
  }

  return `${process.env.REACT_APP_IMAGE_URL ?? ""}/${imagePath}`;
};

export const fixDateForApiRequest = (date: Date): Date => {
  if (!date) {
    return new Date();
  }

  const tmpDate = new Date();
  tmpDate.setTime(date.getTime() + 12 * 60 * 60 * 1000);

  return tmpDate;
};

export const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
};

export const isValidIBAN = (input: string) => {

  const iban = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);

  if (!code || iban.length !== {
    AD: 24,
    AE: 23,
    AT: 20,
    AZ: 28,
    BA: 20,
    BE: 16,
    BG: 22,
    BH: 22,
    BR: 29,
    CH: 21,
    CR: 21,
    CY: 28,
    CZ: 24,
    DE: 22,
    DK: 18,
    DO: 28,
    EE: 20,
    ES: 24,
    FI: 18,
    FO: 18,
    FR: 27,
    GB: 22,
    GI: 23,
    GL: 18,
    GR: 27,
    GT: 28,
    HR: 21,
    HU: 28,
    IE: 22,
    IL: 23,
    IS: 26,
    IT: 27,
    JO: 30,
    KW: 30,
    KZ: 20,
    LB: 28,
    LI: 21,
    LT: 20,
    LU: 20,
    LV: 21,
    MC: 27,
    MD: 24,
    ME: 22,
    MK: 19,
    MR: 27,
    MT: 31,
    MU: 30,
    NL: 18,
    NO: 15,
    PK: 24,
    PL: 28,
    PS: 29,
    PT: 25,
    QA: 29,
    RO: 24,
    RS: 22,
    SA: 24,
    SE: 24,
    SI: 19,
    SK: 24,
    SM: 27,
    TN: 24,
    TR: 26,
    AL: 28,
    BY: 28,
    EG: 29,
    GE: 22,
    IQ: 23,
    LC: 32,
    SC: 31,
    ST: 25,
    SV: 28,
    TL: 23,
    UA: 29,
    VA: 22,
    VG: 24,
    XK: 20,
  }[code[1]]) {
    return false;
  }

  let digits: string = (code[3] + code[1] + code[2]).replace(
    /[A-Z]/g,
    (letter: string) => {
      return `${letter.charCodeAt(0) - 55}`;
    }
  );

  return mod97(digits) === 1;
};

function mod97(digits: string) {
  let checksum: number | string = digits.slice(0, 2);
  let fragment: string = "";

  for (var offset = 2; offset < digits.length; offset += 7) {
    fragment = String(checksum) + digits.substring(offset, offset + 7);
    checksum = parseInt(fragment, 10) % 97;
  }

  return checksum;
}

export const isValidTCKN = (value: string) => {
  if (!/^[1-9]\d{10}$/.test(value)) {
    return false;
  }

  const digits = value.split("");

  const d10 = Number(digits[9]);
  const d11 = Number(digits[10]);

  let sumOf10 = 0;
  let evens = 0;
  let odds = 0;

  for (let index = 0; index < digits.length; index++) {
    let d: string | number = Number(digits[index]);

    if (index < 10) {
      sumOf10 += d;
    }

    if (index < 9) {
      if ((index + 1) % 2 === 0) {
        evens += d;
      } else {
        odds += d;
      }
    }
  }

  if (sumOf10 % 10 !== d11) {
    return false;
  }

  if ((odds * 7 + evens * 9) % 10 !== d10) {
    return false;
  }

  if ((odds * 8) % 10 !== d11) {
    return false;
  }

  return true;
};

export const isValidPostCode = (postCode: string, city: string = "") => {
  if (!postCode || postCode.length !== 5) {
    return false;
  }

  const cityCodes: string[] = [];

  let idx = 1;

  while (idx <= 81) {
    cityCodes.push(`${idx}`.padStart(2, "0"));

    idx++;
  }

  // TODO : Check the postCode and cityCode is match.

  return postCode && cityCodes.indexOf(postCode.substring(0, 2)) > -1;
};

export const isValidVKN = (vkn: string) => {
  if (!/^[0-9]{10}$/.test(vkn)) {
    return false;
  }

  let tmp: number;
  let sum: number = 0;

  let lastDigit: number = Number(vkn.charAt(9));

  for (let index = 0; index < 9; index++) {
    let digit: number = Number(vkn.charAt(index));
    tmp = (digit + 10 - (index + 1)) % 10;
    sum =
      tmp == 9 ? sum + tmp : sum + ((tmp * Math.pow(2, 10 - (index + 1))) % 9);
  }

  return lastDigit === (10 - (sum % 10)) % 10;
};

export const formatPrice = (
  price: number,
  currency: "TRY" | "USD" | "EUR" = "TRY",
  currencyDisplay: "none" | "code" | "name" | "symbol" = "none"
) => {
  const locale =
    currency === "USD" ? "en-US" : currency === "EUR" ? "en-GB" : "tr-TR";

  var formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    currencyDisplay:
      currencyDisplay === "symbol" || currencyDisplay === "none"
        ? undefined
        : currencyDisplay,
  });

  if (currencyDisplay === "symbol") {
    var addSymbol;
    if (currency === "TRY") {
      addSymbol = "₺";
    } else if (currency === "USD") {
      addSymbol = "$";
    } else if (currency === "EUR") {
      addSymbol = "€";
    }

    return (
      `${formatter
        .formatToParts(price)
        .map<string>((part: Intl.NumberFormatPart) =>
          part.type !== "literal" && part.type !== "currency" ? part.value : ""
        )
        .join("")} ` + addSymbol
    );
  }

  return formatter.format(price);
};

export const downloadFile = (
  name: string,
  data: string,
  type: string,
  isBinary: boolean
) => {
  let convertedData: Uint8Array | undefined;

  const byteCharacters = atob(data);

  if (isBinary) {
    const bytes = new Array(byteCharacters.length);

    for (var i = 0; i < byteCharacters.length; i++) {
      bytes[i] = byteCharacters.charCodeAt(i);
    }

    convertedData = new Uint8Array(bytes);
  }

  const blob = new Blob([convertedData ?? data], { type: type });
  const objectURL = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectURL;
  anchor.download = name;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(objectURL);
};

export const downloadFileFromUrl = (name: string, link: string) => {
  const anchor = document.createElement("a");

  anchor.href = link;
  anchor.download = name;

  document.body.appendChild(anchor);
  anchor.click();
  URL.revokeObjectURL(link);
  document.body.removeChild(anchor);
};

export const getDateByTimezoneOffset = (date: Date) => {
  const newDate = new Date(date);
  newDate.setTime(newDate.getTime() - newDate.getTimezoneOffset() * 60 * 1000);

  return newDate;
};

export const formatDate = (date: Date) => {
  var d = new Date(date),
    year = "" + d.getFullYear(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate();
  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;
  return [year, month, day].join("");
};

export enum FormatDateRangeEnum {
  Today = 1,
  Yesterday = 2,
  ThisWeek = 3,
  LastWeek = 4,
  ThisMonth = 5,
  LastMonth = 6,
  Last10Days = 7,
  Last15Days = 8,
  Last30Days = 9,
}

export const formatDateRange = (formatDateRange: FormatDateRangeEnum) => {
  const date = new Date();
  let d1 = new Date();
  let d2 = new Date();

  switch (formatDateRange) {
    case FormatDateRangeEnum.Yesterday:
      date.setDate(date.getDate() - 1);
      d1 = date;
      d2 = date;

      break;
    case FormatDateRangeEnum.ThisWeek:
      d1 = new Date(
        date.setDate(
          date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
        )
      );

      break;
    case FormatDateRangeEnum.LastWeek:
      d1 = new Date(
        date.setDate(
          date.getDate() - date.getDay() + (date.getDay() === 0 ? -13 : -6)
        )
      );

      d1 = date;
      tarih = new Date();
      d2 = new Date(
        tarih.setDate(
          tarih.getDate() - tarih.getDay() + (tarih.getDay() === 0 ? -7 : 0)
        )
      );

      d1 = date;

      break;
    case FormatDateRangeEnum.ThisMonth:
      var month = "" + (date.getMonth() + 1);
      if (month.length < 2) month = "0" + month;
      d1 = new Date(month + "/01/" + date.getFullYear());

      break;
    case FormatDateRangeEnum.LastMonth:
      var tarih = new Date(date.setMonth(date.getMonth() - 1));
      var month = "" + (tarih.getMonth() + 1);

      if (month.length < 2) month = "0" + month;

      d1 = new Date(month + "/01/" + tarih.getFullYear());

      const gun = d2.getDate();
      d2.setDate(d2.getDate() - gun);

      break;
    case FormatDateRangeEnum.Last10Days:
      date.setDate(date.getDate() - 10);
      d1 = date;

      break;
    case FormatDateRangeEnum.Last15Days:
      date.setDate(date.getDate() - 15);
      d1 = date;

      break;
    case FormatDateRangeEnum.Last30Days:
      var tarih = new Date(date.setDate(date.getDate() - 30));
      d1 = tarih;

      break;
    default:
      break;
  }

  return [d1, d2];
};

export function printElement(element: HTMLElement | null) {
  if (!element) {
    return;
  }

  const printFrame = document.getElementById(
    "iframecontentstoprint"
  ) as HTMLIFrameElement;

  const pri = printFrame?.contentWindow;

  pri?.document.open();
  pri?.document.write(element.innerHTML);
  pri?.document.close();
  pri?.focus();
  pri?.print();
}

export const checkImageSize = (
  e: any,
  width: number,
  height: number
): Promise<boolean> => {
  return new Promise<boolean>((resolve) => {
    let file: any;
    let img: any;

    if ((file = e.target.files[0])) {
      img = new Image();
      img.onload = function () {
        if (this.width === width && this.height === height) {
          return resolve(true);
        }

        return resolve(false);
      };

      img.src = (window.URL || window.webkitURL).createObjectURL(file);
    }
  });
};