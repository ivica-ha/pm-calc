import { createGlobalStyle} from "styled-components"
export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.themeColor};
    color: ${({ theme }) => theme.text};
  }
  .calculator {
    background-color: ${({ theme }) => theme.calcBgColor};
    .calculator--theme-switch {
      img.active {
        filter: drop-shadow(0px 0px 2px ${({ theme }) => theme.calcSwitchCol});
      }
    }
    .calculator--results {
      .expression {
        color: ${({ theme }) => theme.calcExpressionCol};
      }  
      .result {
        color: ${({ theme }) => theme.calcResultCol};
      }
    }
    .calculator--display {
      border-color: ${({ theme }) => theme.borderColor};
      .calculator--results {
        .expression, .result {
          background-color: transparent;
        }
      }
    }
    .calculator--btn {
      background-color: ${({ theme }) => theme.calcNumBtnBg};
      color: ${({ theme }) => theme.calcNumBtnCol};
      &.nav {
        background-color: ${({ theme }) => theme.calcNavBtnBg};
        color: ${({ theme }) => theme.calcNavBtnCol};
      }
      &.func {
        background-color: ${({ theme }) => theme.calcFuncBtnBg};
        color: ${({ theme }) => theme.calcFuncBtnCol};
      }
      &.operator, &.equal {
        background-color: ${({ theme }) => theme.calcOptionBtnBg};
        color: ${({ theme }) => theme.calcOptionBtnCol};
      }
    }
  }
  `