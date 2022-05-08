/* eslint-disable @typescript-eslint/no-var-requires */
import { InMemoryStorage, inMemoryStorage } from "../src";

describe("in-memory-storage", () => {
  const object = { foo: "bar" };

  it("getItem()", () => {
    inMemoryStorage.setItem("string", "");
    inMemoryStorage.setItem("object", object);

    expect(inMemoryStorage.getItem("string")).toBe("");
    expect(inMemoryStorage.getItem("object")).toBe(object);
    expect(inMemoryStorage.getItem("does-not-exist")).toBe(null);
  });

  it("getItem() with exported singleton instance", () => {
    inMemoryStorage.setItem("object", object);

    const inMemoryStorage1 = inMemoryStorage;
    const inMemoryStorage2 = require("../src").inMemoryStorage;
    const item1 = inMemoryStorage1.getItem("object");
    const item2 = inMemoryStorage2.getItem("object");

    expect(inMemoryStorage1).toBe(inMemoryStorage2);
    expect(item1).toBe(item2);
  });

  it("getItem() with new storage instantiated with class constructor", () => {
    const inMemoryStorage1 = inMemoryStorage;
    const inMemoryStorage2 = new InMemoryStorage();

    expect(inMemoryStorage1).not.toBe(inMemoryStorage2);

    inMemoryStorage1.setItem("object", object);
    const item1 = inMemoryStorage1.getItem("object");
    const item2 = inMemoryStorage2.getItem("object");

    expect(item1).not.toBe(item2);
  });

  it("setItem() with ttl", () => {
    jest.useFakeTimers();

    inMemoryStorage.setItem("object", object, { ttl: 60 });
    expect(inMemoryStorage.getItem("object")).toBe(object);

    jest.runAllTimers();
    expect(inMemoryStorage.getItem("object")).toBe(null);
  });

  it.todo("benchmark performance vs memory");
});
