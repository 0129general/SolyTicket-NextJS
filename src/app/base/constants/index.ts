export class ConfigHelper {
  public static SOLY_USER_TOKEN: string = "SOLY_USER_TOKEN";
  public static SOLY_USER_REFRESH: string = "SOLY_USER_REFRESH";
  public static SOLY_USERNAME: string = "SOLY_USERNAME";
  public static SOLY_USER_TOKEN_CREATE_TIME: string =
    "SOLY_USER_TOKEN_CREATE_TIME";
  public static SOLY_USER_ID: string = "SOLY_USER_ID";
  public static SOLY_USER_ROLE: string = "SOLY_USER_ROLE";
}

export class Pattern {
  public static NUMERIC: string = "[0-9]*";
  public static ALPHABETIC: string = "[a-zA-ZğüşöçİĞÜŞÖÇ]+";
  public static ALPHABETIC_WITH_SPACES: string = "[a-zA-ZğüşöçİĞÜŞÖÇ ]+";
  public static ALPHABETIC_LOWERCASE: string = "[a-zğüşöçİĞÜŞÖÇ]+";
  public static ALPHABETIC_LOWERCASE_WITH_SPACES: string = "[a-zğüşöçİĞÜŞÖÇ ]+";
  public static ALPHABETIC_UPPERCASE: string = "[A-ZğüşöçİĞÜŞÖÇ]+";
  public static ALPHABETIC_UPPERCASE_WITH_SPACES: string = "[A-ZğüşöçİĞÜŞÖÇ ]+";
  public static ALPHANUMERIC: string = "[a-zA-Z0-9ğüşöçİĞÜŞÖÇ]+";
  public static ALPHANUMERIC_WITH_SPACES: string = "[a-zA-Z0-9ğüşöçİĞÜŞÖÇ ]+";
  public static ALPHANUMERIC_LOWERCASE: string = "[a-z0-9ğüşöçİĞÜŞÖÇ]+";
  public static ALPHANUMERIC_LOWERCASE_WITH_SPACES: string =
    "[a-z0-9ğüşöçİĞÜŞÖÇ ]+";
  public static ALPHANUMERIC_UPPERCASE: string = "[A-Z0-9ğüşöçİĞÜŞÖÇ]+";
  public static ALPHANUMERIC_UPPERCASE_WITH_SPACES: string =
    "[A-Z0-9ğüşöçİĞÜŞÖÇ ]+";
  public static EMAIL: string =
    "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{1,63}$";
  public static PRICE: string = "[0-9]+(\\.[0-9][0-9]?)?";
}
