import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { Provider } from './components/ui/provider';
import App from './App';
import { registerRotationPlugin } from './plugins/rotation';
import { registerOverlayPlugin } from './plugins/overlay';
import { registerPuzzlePlugin } from './plugins/puzzle';
import { registerSeesawPlugin } from './plugins/seesaw';
import { registerShapeKartaPlugin } from './plugins/shape-karta';
import { registerOverlayCancelPlugin } from './plugins/overlay-cancel';
import { registerSyllableCountPlugin } from './plugins/syllable-count';
import { registerOneToOnePlugin } from './plugins/one-to-one';
import { registerOddOneOutPlugin } from './plugins/odd-one-out';

// プラグイン登録
registerRotationPlugin();
registerOverlayPlugin();
registerPuzzlePlugin();
registerSeesawPlugin();
registerShapeKartaPlugin();
registerOverlayCancelPlugin();
registerSyllableCountPlugin();
registerOneToOnePlugin();
registerOddOneOutPlugin();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
);
