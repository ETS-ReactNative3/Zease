//action types
const SET_MARGIN = "SET_MARGIN";

//action creators
export const setMargin = (margin) => {
  return {
    type: SET_MARGIN,
    margin,
  };
};

//reducer
export default function pieChartSliderMargin(state = 15, action) {
  switch (action.type) {
    case SET_MARGIN:
      return action.margin;
    default:
      return state;
  }
}
