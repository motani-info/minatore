import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import { Provider } from './components/ui/provider';
import App from './App';
import { registerRotationPlugin } from './plugins/rotation';
import { registerOverlayPlugin } from './plugins/overlay';
import { registerPuzzlePlugin } from './plugins/puzzle';

// プラグイン登録
registerRotationPlugin();
registerOverlayPlugin();
registerPuzzlePlugin();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
);
