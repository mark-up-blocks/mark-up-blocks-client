function setUp({ serverURL }) {
  jest.resetModules();
  process.env.REACT_APP_API_SERVER_URI = serverURL;

  // re-import axios because of jest.resetModules();
  // eslint-disable-next-line global-require
  const axios = require("axios");

  jest.spyOn(axios, "get")
    .mockImplementation(() => ({ data: null }));

  // importing getChallengeList should be going after setting env
  // eslint-disable-next-line global-require
  const { getChallengeList } = require(".");

  return { axios, getChallengeList };
}

describe("api isUsingGithubAPI option test", () => {
  it("getChallengeList get index file when isUsingGithubAPI is false", async () => {
    const mockBaseURL = "https://localhost:3000";
    const { axios, getChallengeList } = setUp({ serverURL: mockBaseURL });

    expect(axios.get).toBeCalledTimes(0);

    await getChallengeList();

    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(`${mockBaseURL}/challenges`);
  });

  it("getChallengeList get index file when isUsingGithubAPI is true", async () => {
    const mockBaseURL = "https://raw.githubusercontent.com";
    const { axios, getChallengeList } = setUp({ serverURL: mockBaseURL });

    expect(axios.get).toBeCalledTimes(0);

    await getChallengeList();

    expect(axios.get).toBeCalledTimes(1);
    expect(axios.get).toBeCalledWith(`${mockBaseURL}/challenges/index`);
  });
});
