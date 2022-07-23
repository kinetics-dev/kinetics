import * as utils from "../src/utils";

describe("utils", () => {
  it.todo("validates options schema");

  it("parses appIdentifier correctly", () => {
    expect(utils.parseAppIdentifier("@orgName/projectName")).toStrictEqual([
      "orgName",
      "projectName",
    ]);
  });
});
