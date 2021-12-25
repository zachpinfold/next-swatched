import { GetSwatchesActions } from "../types/types";
import { Swatches } from "../types/swatches";

const inititalState: Swatches = {
  swatches: [],
  initialSwatches: [],
  loading: false,
};

const swatches = (
  state: Swatches = inititalState,
  action: GetSwatchesActions
): Swatches => {
  const { payload, type } = action;

  switch (type) {
    case "GET_SWATCHES":
      return {
        ...state,
        swatches: payload.constructor === Array ? payload : [],
        loading: false,
      };
    case "GET_INITIAL_SWATCHES":
      return {
        ...state,
        initialSwatches: payload.constructor === Array ? payload : [],
        loading: false,
      };
    case "ADD_SWATCH":
      const newArrayWithoutFirst = state.swatches.slice(1);
      const firstElement = state.swatches[0];

      return {
        ...state,
        initialSwatches:
          "colourId" in payload ? [payload, ...newArrayWithoutFirst] : [],
        swatches:
          "colourId" in payload
            ? [firstElement, payload, ...newArrayWithoutFirst]
            : [],
        loading: false,
      };
    case "DELETE_SWATCH":
      return {
        ...state,
        swatches:
          "colourId" in payload
            ? state.swatches.filter((e) => e.colourId !== payload.colourId)
            : [],
        loading: false,
      };
    default:
      return state;
  }
};

export { swatches };
