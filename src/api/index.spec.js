const mockGet = jest.fn();

jest.mock("axios", () => ({
  get: mockGet.mockReturnValue({ data: {} }),
}));

function setUp({ serverURI }) {
  jest.resetModules();
  process.env.REACT_APP_API_SERVER_URI = serverURI;

  // importing getChallengeList should be setting env
  // eslint-disable-next-line global-require
  const { getChallengeList } = require(".");

  return getChallengeList;
}

describe("api isUsingGithubAPI option test", () => {
  it("getChallengeList get index file when isUsingGithubAPI is false", async () => {
    const mockBaseURL = "https://original.url";
    const getChallengeList = setUp({ serverURI: mockBaseURL });

    expect(mockGet).toBeCalledTimes(0);

    await getChallengeList();

    expect(mockGet).toBeCalledTimes(1);
    expect(mockGet).toBeCalledWith(`${mockBaseURL}/challenges`);
  });

  it("getChallengeList get index file when isUsingGithubAPI is true", async () => {
    const mockBaseURL = "https://raw.githubusercontent.com";
    const getChallengeList = setUp({ serverURI: mockBaseURL });

    expect(mockGet).toBeCalledTimes(0);

    await getChallengeList();

    expect(mockGet).toBeCalledTimes(1);
    expect(mockGet).toBeCalledWith(`${mockBaseURL}/challenges/index`);
  });
});
