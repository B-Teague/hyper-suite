import {
  html,
  styled,
  globalCss
} from '../dist/index.js';

globalCss`
@import "https://unpkg.com/water.css@2/out/light.min.css";

body {
  display: grid;
  font-size: 1.5em;
  place-items: center;
  height: 100vh;
}
`;

// Styled components
const Main = styled.main`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.2em;
  font-size: 1.5em;
  place-items: center;
`;

const Display = styled.div`
  grid-column: span 4;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 2.5em;
  padding: 0.2em 0.4em;
  text-align: right;
  gap: 0.1em;
`;

const Keys = styled.div`
  grid-column: span 4;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.1em;
  width: 100%;
  box-sizing: border-box;
`;

const FunctionKey = styled.button`
  background: lightgray;
`;

const EqualKey = styled.button`
  background: rgb(75, 150, 255);
  grid-column: -2;
  grid-row: 2 / span 4;
`;

const ZeroKey = styled.button`
  grid-column: span 2;
`;

// Calculator logic
const computer = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "×": (a, b) => a * b,
  "÷": (a, b) => a / b,
};

const initialState = {
  fn: "",
  carry: 0,
  value: 0,
  hasCarry: false,
};

const Clear = () => initialState;

const NewDigit = (state, number) => ({
  ...state,
  hasCarry: false,
  value: (state.hasCarry ? 0 : state.value) * 10 + number,
});

const NewFn = (state, fn) => ({
  ...state,
  fn,
  hasCarry: true,
  carry: state.value,
  value:
    state.hasCarry || !state.fn
      ? state.value
      : computer[state.fn](state.carry, state.value),
});

const Equal = (state) => ({
  ...state,
  hasCarry: true,
  carry: state.hasCarry ? state.carry : state.value,
  value: state.fn
    ? computer[state.fn](
        state.hasCarry ? state.value : state.carry,
        state.hasCarry ? state.carry : state.value
      )
    : state.value,
});

const FunctionKeyButton = ({ fn }) => html`
  <${FunctionKey} onclick=${[NewFn, fn]}>${fn}<//>
`;

const DigitButton = ({ digit }) => html`
  <button onclick=${[NewDigit, digit]}>${digit}</button>
`;

export const init = initialState;
export const view = (state) => html`
  <${Main}>
    <${Display}>${state.value}<//>
    <${Keys}>
      ${Object.keys(computer).map(fn => FunctionKeyButton({ fn }))}
      ${[7,8,9,4,5,6,1,2,3].map(digit => DigitButton({ digit }))}
      <${ZeroKey} onclick=${[NewDigit, 0]}>0<//>
      <button onclick=${Clear}>AC</button>
      <${EqualKey} onclick=${Equal}>=<//>
    <//>
  <//>
`;