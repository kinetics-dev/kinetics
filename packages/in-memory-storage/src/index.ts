/* eslint-disable @typescript-eslint/no-explicit-any */

type Configuration = {
  mode: "performance" | "memory";
};

const EMPTY_OBJECT = {};

/**
 * InMemoryStorage is similar to SessionStorage that also implements the Web Storage interface.
 * The difference is that the reference it's not accessible in devTools.
 */
class InMemoryStorage implements Storage {
  private items: Map<string, any> | Record<string, any>;

  constructor(private readonly config: Configuration) {
    this.items = (() => {
      switch (config.mode) {
        case "performance":
          return new Map<string, any>();
        case "memory":
          return EMPTY_OBJECT;
      }
    })();
  }

  get length() {
    return this.items.size;
  }

  clear(): void {
    if (this.config.mode === "performance") {
      this.items.clear();
    } else {
      this.items = EMPTY_OBJECT;
    }
  }

  key(index: number): string | null {
    throw new Error("Method not implemented.");
  }

  removeItem(key: string): void {
    if (this.config.mode === "performance") {
      this.items.delete(key);
    } else {
      delete (<Record<string, any>>this.items)[key];
    }
  }

  setItem<T>(key: string, value: T) {
    if (this.config.mode === "performance") {
      this.items.set(key, value);
    } else {
      (<Record<string, any>>this.items)[key] = value;
    }
  }

  getItem<T>(key: string): T {
    if (this.config.mode === "performance") {
      return this.items.get(key);
    } else {
      return (<Record<string, any>>this.items)[key];
    }
  }
}

/**
 * Singleton
 */
const inMemoryStorage = new InMemoryStorage({ mode: "performance" });

export { InMemoryStorage, inMemoryStorage };
