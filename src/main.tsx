import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'jotai'

// CSS
import './index.css'

import ReactUI from './ReactUI.tsx'
import initGame from './initGame.ts'
import { store } from './store.ts' // Global state
  

const ui = document.getElementById('ui');

// check if exist parentElement of ui for the Typescript
const parentElement = ui?.parentElement;
if (parentElement) {
  const resizeObserver = new ResizeObserver(() => {
    const scaleX = (ui?.parentElement?.offsetWidth && ui?.offsetWidth) 
    ? ui.parentElement.offsetWidth / ui.offsetWidth 
    : 1;

    const scaleY = (ui?.parentElement?.offsetHeight && ui?.offsetHeight) 
      ? ui.parentElement.offsetHeight / ui.offsetHeight 
      : 1;

    const smallerScale = Math.min(scaleX, scaleY); // return a number
    
    document.documentElement.style.setProperty(
      "--scale",
      `${smallerScale}` // convert Number to String
    );
  });

  resizeObserver.observe(parentElement);
}

createRoot(ui!).render(
  <StrictMode>
    <Provider store={store}> {/* Synchronizes ReactUI with the store (atom, global state) */}
      <ReactUI />
    </Provider>
  </StrictMode>,
)

initGame();