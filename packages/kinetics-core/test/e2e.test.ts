import { verifyToken } from "../src";

const run = (describe: jest.Describe) =>
  process.env.IS_E2E ? describe : describe.skip;

const numberOfRuns = process.env.IS_E2E_LOAD_TESTING ? 100 : 1;

if (process.env.IS_E2E_LOAD_TESTING) {
  jest.setTimeout(1000 * 60);
}

run(describe)("E2E tests", () => {
  it("functions correctly if using real values", async () => {
    const apiKey = process.env.KINETICS_API_KEY;
    const token = process.env.KINETICS_TOKEN;

    expect(apiKey).not.toBe(undefined);
    expect(token).not.toBe(undefined);

    for (let i = 0; i < numberOfRuns; i++) {
      // We only assert the decoded JWT payload because it's standardised to Firebase
      await expect(verifyToken(token)).resolves.toEqual(
        expect.objectContaining({
          data: expect.objectContaining(decode(token)),
        })
      );
    }
  });
});

const decode = (token: string) =>
  JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
