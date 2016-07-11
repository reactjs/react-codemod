class SomeClass {
  constructor() {
    (this: any)._isLoaded = false;
    (this: any).isLoaded = this.isLoaded.bind(this);
  }

  isLoaded(): boolean {
    return this._isLoaded;
  }
}
