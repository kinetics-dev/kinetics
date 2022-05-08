/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 *
 */
type Configuration = {
  /**
   * By default, it favors performance over memory usage.
   *
   * @remarks
   *
   * This may not be very concise at the moment as we haven't benchmark this library in different
   * modes.
   *
   * @see {@link https://stackoverflow.com/questions/18541940/map-vs-object-in-javascript/43305977}
   *
   */
  mode: "performance" | "memory";
};

/**
 * Options that can be passed to `setItem()`
 */
type SetItemOptions = {
  /**
   * Time to live
   */
  ttl: number;
};

const EMPTY_OBJECT = {};

/**
 * InMemoryStorage is similar to SessionStorage that also implements the Web Storage interface.
 * The difference is that the reference it's not accessible in devTools.
 */
class InMemoryStorage implements Storage {
  private items: Map<string, any> | Record<string, any>;

  constructor(
    private readonly config: Configuration = {
      mode: "performance",
    }
  ) {
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
    if (this.config.mode === "performance") {
      return Array.from<string>(this.items.keys())[index] ?? null;
    } else {
      // Properties in an object is not in order so we cannot determine the nth key of it
      return null;
    }
  }

  removeItem(key: string): void {
    if (this.config.mode === "performance") {
      this.items.delete(key);
    } else {
      delete (<Record<string, any>>this.items)[key];
    }
  }

  setItem<T>(key: string, value: T, options?: Partial<SetItemOptions>) {
    if (this.config.mode === "performance") {
      this.items.set(key, value);
    } else {
      (<Record<string, any>>this.items)[key] = value;
    }

    // Post setItem
    if (options?.ttl) {
      setTimeout(() => {
        this.removeItem(key);
      }, options.ttl);
    }
  }

  getItem<T>(key: string): T | null {
    if (this.config.mode === "performance") {
      return this.items.get(key) ?? null;
    } else {
      return (<Record<string, any>>this.items)[key] ?? null;
    }
  }
}

/**
 * Singleton
 */
const inMemoryStorage = new InMemoryStorage();

export { InMemoryStorage, inMemoryStorage };
