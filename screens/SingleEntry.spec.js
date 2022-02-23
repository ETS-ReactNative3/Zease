import React from "react";
import Enzyme, { shallow } from "enzyme";
import Adapter from "wojtekmaj/enzyme-adapter-react-17";
import { Text } from "react-native";
import { expect } from "chai";

import SingleEntry from "./SingleEntry";

Enzyme.configure({ adapter: new Adapter() });
const userEntry = {
  id: 123,
  date: "2022-02-01",
  endtime: "0700",
  notes: "Even though this is a test entry, I slept great!",
  quality: 85,
  startTime: "2130",
  entryFactors: {
    1: {
      category: "chemical",
      name: "melatonin",
    },
    2: {
      category: "practice",
      name: "No Screens",
    },
  },
};

describe("<SingleEntry", () => {
  let singleEntry;
  beforeEach(() => {
    singleEntry = shallow(<SingleEntry entry={userEntry} />);
  });

  it("renders the date in the first Text", () => {
    expect(singleEntry.find("Text").text()).to.be.equal(
      "Overview for Feb 2, 2022"
    );
  });
});
