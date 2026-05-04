import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HomeScreen } from './framework/components/HomeScreen';
import { QuestionScreen } from './framework/components/QuestionScreen';
import { QuestionListScreen } from './framework/components/QuestionListScreen';
import { ThemeScreen } from './framework/components/ThemeScreen';
import { ProfileScreen } from './framework/components/ProfileScreen';
import { RandomQuizScreen } from './framework/components/RandomQuizScreen';
import { HistoryScreen } from './framework/components/HistoryScreen';
import { SeesawScreen } from './plugins/seesaw/components/SeesawScreen';
import { WaterVolumeScreen } from './plugins/water-volume/components/WaterVolumeScreen';
import { CompareLengthScreen } from './plugins/compare-length/components/CompareLengthScreen';
import { CompareSpringScreen } from './plugins/compare-spring/components/CompareSpringScreen';
import { AreaCompareScreen } from './plugins/area-compare/components/AreaCompareScreen';

/** ページ遷移時にスクロール位置をトップに戻す */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/theme/:themeId" element={<ThemeScreen />} />
        <Route path="/questions/:typeId" element={<QuestionListScreen />} />
        <Route path="/question/seesaw" element={<SeesawScreen />} />
        <Route path="/question/water-volume" element={<WaterVolumeScreen />} />
        <Route path="/question/compare-length" element={<CompareLengthScreen />} />
        <Route path="/question/compare-spring" element={<CompareSpringScreen />} />
        <Route path="/question/area-compare" element={<AreaCompareScreen />} />
        <Route path="/question/:typeId" element={<QuestionScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/random" element={<RandomQuizScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
