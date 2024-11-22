export interface IKeyValuePair<T> {
  [key: string]: T;
}

export class KeyValuePair<T> {
  private values: IKeyValuePair<T>;

  constructor(initializer?: { key: string; value: T }[]) {
    this.values = {};

    if (initializer && initializer.length > 0) {
      for (const item of initializer) {
        if (item && item.key) {
          this.values[item.key] = item.value;
        }
      }
    }
  }

  public clear() {
    this.values = {};
  }

  public getKeys(): string[] {
    return Object.keys(this.values);
  }

  public add(key: string, value: T) {
    this.values[key] = value;
  }

  public getByKey(key: string): T {
    return this.values[key];
  }

  public setByKey(key: string, value: T) {
    this.values[key] = value;
  }

  public removeByKey(key: string) {
    delete this.values[key];
  }

  public containsKey(key: string): boolean {
    return Object.keys(this.values).indexOf(key) >= 0;
  }

  public getByIndex(index: number): T {
    const key = Object.keys(this.values)[index];
    return this.getByKey(key);
  }

  public hasValue(): boolean {
    return Object.keys(this.values).length > 0;
  }

  public length(): number {
    return Object.keys(this.values).length;
  }

  public getValues(): T[] {
    const values: T[] = [];
    for (let i = 0; i < this.length(); i++) {
      values.push(this.getByIndex(i));
    }
    return values;
  }

  // public orderBy(expression: Many<ListIterator<T, NotVoid>>): T[] {
  //     let values: T[] = [];
  //     for (let i = 0; i < this.length(); i++) {
  //         values.push(this.getByIndex(i));
  //     }
  //     values = _.orderBy(values, expression, ["asc"]);
  //     return values;
  // }

  // public orderByDescending(expression: Many<ListIterator<T, NotVoid>>): T[] {
  //     let values: T[] = [];
  //     for (let i = 0; i < this.length(); i++) {
  //         values.push(this.getByIndex(i));
  //     }
  //     values = _.orderBy(values, expression, ["desc"]);
  //     return values;
  // }

  public join(): any {
    const obj: any = {};
    for (const key in this.values) {
      if (this.values.hasOwnProperty(key)) {
        obj[key] = this.values[key];
      }
    }
    return obj;
  }
}