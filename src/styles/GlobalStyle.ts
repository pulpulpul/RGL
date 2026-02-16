import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: Inter, system-ui, -apple-system, sans-serif;
    background: #0f0f1a;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* react-grid-layout base styles */
  .react-grid-layout {
    position: relative;
  }

  /* No transition on initial load — only animate after user interaction */
  .react-grid-item {
    transition: none;
  }

  .react-grid-layout.rgl-animated .react-grid-item {
    transition: transform 150ms ease, width 150ms ease, height 150ms ease;
  }

  .react-grid-item.resizing {
    transition: none;
    z-index: 1;
    will-change: width, height;
  }

  .react-grid-item.react-draggable-dragging {
    transition: none;
    z-index: 3;
    will-change: transform;
  }

  /* SE (bottom-right) resize handle */
  .react-grid-item > .react-resizable-handle-se {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    right: 0;
    cursor: se-resize;
  }

  .react-grid-item > .react-resizable-handle-se::after {
    content: '';
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 5px;
    height: 5px;
    border-right: 2px solid rgba(255, 255, 255, 0.3);
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  }

  /* SW (bottom-left) resize handle */
  .react-grid-item > .react-resizable-handle-sw {
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: 0;
    left: 0;
    cursor: sw-resize;
  }

  .react-grid-item > .react-resizable-handle-sw::after {
    content: '';
    position: absolute;
    left: 3px;
    bottom: 3px;
    width: 5px;
    height: 5px;
    border-left: 2px solid rgba(255, 255, 255, 0.3);
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  }

  .react-grid-placeholder {
    background: #646cff;
    opacity: 0.15;
    border-radius: 6px;
    z-index: 2;
  }

  /* Hide resize handles on the external-drag drop placeholder */
  .react-grid-item.dropping > .react-resizable-handle-se,
  .react-grid-item.dropping > .react-resizable-handle-sw {
    display: none;
  }
`;
