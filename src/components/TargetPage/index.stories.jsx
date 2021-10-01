import React from "react";
import { Provider } from "react-redux";
import { action } from "@storybook/addon-actions";
import TargetPage from ".";
import store from "../../stories/storeData";

function generateStore(challenge) {
  return {
    getState: () => ({ challenge }),
    subscribe: () => {},
    dispatch: action("dispatch"),
  };
}

const emptyStore = generateStore(store.empty);
const defaultStore = generateStore(store.defaultChallenge);

export default {
  component: TargetPage,
  title: "TargetPage",
};

const Template = () => <TargetPage />;

export const Empty = Template.bind({});

Empty.decorators = [(Story) => (
  <Provider store={emptyStore}>
    <Story />
  </Provider>
)];

export const Default = Template.bind({});

Default.decorators = [(Story) => (
  <Provider store={defaultStore}>
    <Story />
  </Provider>
)];
