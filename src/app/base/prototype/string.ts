interface String {
  turkishToEnglish(): string;
  toCamelCase(): string;
  toEncodedUrlWithDash(): string;
}

String.prototype.turkishToEnglish = function () {
  return this.replace('Ğ', 'g')
    .replaceAll('Ü', 'u')
    .replaceAll('Ş', 's')
    .replaceAll('I', 'i')
    .replaceAll('İ', 'i')
    .replaceAll('Ö', 'o')
    .replaceAll('Ç', 'c')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ı', 'i')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c');
};

String.prototype.toCamelCase = function (): string {
  return this.replace(/(?:^\w|[A-Z]|-|\b\w)/g,
    (ltr, idx) => idx === 0
      ? ltr.toLowerCase()
      : ltr.toUpperCase()
  ).replace(/\s+|-/g, '');
};

String.prototype.toEncodedUrlWithDash = function (): string {
  return encodeURIComponent(this.toLocaleLowerCase().trim().turkishToEnglish().replaceAll(/\s\s+/g, ' ').replaceAll(/ /g, "-").replaceAll('/', ''));
}