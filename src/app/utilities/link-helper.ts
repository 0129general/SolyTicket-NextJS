export const generateProductLink = (brandName: string, categoryName: string, productName: string, productGUID: string): string => {
  return `/product/${brandName?.toEncodedUrlWithDash()}-${categoryName?.toEncodedUrlWithDash()}-${productName?.toEncodedUrlWithDash()}-${productGUID?.toEncodedUrlWithDash()}`;
};