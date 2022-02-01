import axios from "axios";

const baseURL = process.env.REACT_APP_API_SERVER_URI;
const isUsingGithubAPI = baseURL.startsWith("https://raw.githubusercontent.com");

async function getChallengeList() {
  try {
    const requestURL = isUsingGithubAPI ? `${baseURL}/challenges/index` : `${baseURL}/challenges`;
    const res = await axios.get(requestURL);

    return res.data;
  } catch (err) {
    if (err.status >= 500) {
      throw new Error("internal server error");
    }

    throw err;
  }
}

async function getChallenge(id) {
  try {
    const res = await axios.get(`${baseURL}/challenges/${id}`);

    return res.data;
  } catch (err) {
    if (err.status >= 500) {
      throw new Error("internal server error");
    }

    throw err;
  }
}

export { getChallengeList, getChallenge };
