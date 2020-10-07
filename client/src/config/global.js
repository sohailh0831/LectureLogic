
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    *,
    *::after,
    *::before {
        box-sizing: border-box;
    }

    body {
        align-items: center;
        body: '#f5f2f2',
        text: '#363537',
        toggleBorder: '#FFF',
        gradient: 'linear-gradient(#39598A, #79D7ED)',
        button: 'white',
        height: 100vh;
        margin: 0;
        padding: 0;
        font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        transition: all 0.25s linear;
    }
    
    .ui.buttons > .button {
        margin-right: 10px;
        margin-left: 10px;
        width: 20% !important;
        border-radius: .28571429rem;
    }
    .ui.fluid.input>input, .ui.form .field .ui.input input{
        color: black !important;
    }

    .confirmation > *, .confirmation > * > .ui > .ui > label,.ui.inverted.placeholder>:before, #confirmPage, #confirmPage > form,#confirmPage > .header  {
        background: black !important;
        color: white !important;
    }
  `