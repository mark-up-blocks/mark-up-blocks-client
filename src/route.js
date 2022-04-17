const route = {
  home: "/",
  tutorialMain: "/0",
  tutorial: "/0/:id",
  puzzleMain: "/:index",
  puzzle: "/:index/:id",
  selectedPuzzle: (index) => `/${index}`,
  nextIndex: (index) => `/${index + 1}`,
  selectedChallenge: (index, challengeId) => `/${index}/${challengeId}`,
};

export default route;
