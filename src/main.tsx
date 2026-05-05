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
import { registerCompareLengthPlugin } from './plugins/compare-length';
import { registerCompareSpringPlugin } from './plugins/compare-spring';
import { registerSymbolRotationPlugin } from './plugins/rotation/symbolRotationIndex';
import { registerOverlayAdvancedPlugin } from './plugins/overlay-advanced';
import { registerOverlayShapePlugin } from './plugins/overlay-shape';
import { registerLineOverlayPlugin } from './plugins/line-overlay';
import { registerWaterVolumePlugin } from './plugins/water-volume';
import { registerAreaComparePlugin } from './plugins/area-compare';
import { registerRotationSequencePlugin } from './plugins/rotation-sequence';
import { registerShapeCompositionPlugin } from './plugins/shape-composition';

// プラグイン登録
registerRotationPlugin();
registerSymbolRotationPlugin();
registerRotationSequencePlugin();
registerOverlayPlugin();
registerOverlayAdvancedPlugin();
registerOverlayShapePlugin();
registerLineOverlayPlugin();
registerPuzzlePlugin();
registerSeesawPlugin();
registerShapeKartaPlugin();
registerOverlayCancelPlugin();
registerSyllableCountPlugin();
registerOneToOnePlugin();
registerCompareLengthPlugin();
registerCompareSpringPlugin();
registerWaterVolumePlugin();
registerAreaComparePlugin();
registerShapeCompositionPlugin();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
);
