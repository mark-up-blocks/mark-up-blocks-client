const route = {
  home: "/",
  tutorial: "/0",
  puzzle: "/:index/:id?",
  selectedPuzzle: (index) => `/${index}`,
  nextIndex: (index) => `/${index + 1}`,
  selectedChallenge: (index, challengeId) => `/${index}/${challengeId}`,
};

export default route;
