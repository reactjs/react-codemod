class SomeClass {
  constructor() {
    (this: any)._isLoaded = false;
  }

  isLoaded = (): boolean => {
    return this._isLoaded;
  };
}
