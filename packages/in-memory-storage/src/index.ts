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
 * Subscription to value by key.
 */
type Listener = <T = string>(value: T | null) => void;

/**
 * Options that can be passed to `setItem()`
 */
type SetItemOptions = {
  /**
   * Time to live in milliseconds
   */
  ttl: number;
};

const EMPTY_OBJECT = {};

/**
 * InMemoryStorage is similar to SessionStorage that also implements the Web Storage interface.
 */
class InMemoryStorage implements Storage {
  [x: string]: any;
  private items: Map<string, any> | Record<string, any>;
  private listeners: Map<string, Set<Listener>> = new Map<
    string,
    Set<Listener>
  >();

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

    this.listeners.get(key)?.forEach((listener) => listener(null));
  }

  setItem<T>(key: string, value: T, options?: Partial<SetItemOptions>) {
    if (this.config.mode === "performance") {
      this.items.set(key, value);
    } else {
      (<Record<string, any>>this.items)[key] = value;
    }

    this.listeners.get(key)?.forEach((listener) => listener(value));

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

  onItemChange(key: string, listener: Listener) {
    let set = this.listeners.get(key);

    if (!set) {
      set = new Set<Listener>()
      this.listeners.set(key, set)
    }

    set?.add(listener);
    return () => {
      set?.delete(listener)
    };
  }
}

/**
 * Singleton
 */
const inMemoryStorage = new InMemoryStorage();

export { InMemoryStorage, inMemoryStorage };
