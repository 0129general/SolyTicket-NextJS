// import ExpiredStorage from 'expired-storage';
// import useLocalStorage from '../hooks/useLocalStorage';



export class ClientStorage {
  public static setItem(key: string, value: any, expirationSeconds?: number) {
    const jsonVal = JSON.stringify(value);

    if (expirationSeconds) {
      ClientStorage.getInstance()?.setItem(key, jsonVal);
    } else {
      ClientStorage.getInstance()?.setItem(key, jsonVal);
    }
  }

  public static getItem(key: string): any {
    const jsonData = ClientStorage.getInstance()?.getItem(key);

    if (jsonData) {
      return JSON.parse(jsonData || '');
    }

    return undefined;
  }

  public static hasItem(key: string): boolean {
    const keys = ClientStorage.getKeys();

    if (keys) {
      return keys.indexOf(key) >= 0;
    }

    return false;
  }

  public static removeItem(key: string) {
    ClientStorage.getInstance()?.removeItem(key);
  }

  public static removeAll() {
    ClientStorage.getInstance()?.clear();
  }

  public static getKeys() {
    return ClientStorage.getInstance()?.keys(false);
  }

  public static getInstance() {
    if (typeof window !== "undefined") {
      return localStorage;
    }

    return undefined;
  }
}
