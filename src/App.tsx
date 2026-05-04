import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './framework/components/HomeScreen';
import { QuestionScreen } from './framework/components/QuestionScreen';
import { ProfileScreen } from './framework/components/ProfileScreen';
import { RandomQuizScreen } from './framework/components/RandomQuizScreen';
import { HistoryScreen } from './framework/components/HistoryScreen';
import { SeesawScreen } from './plugins/seesaw/components/SeesawScreen';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/question/seesaw" element={<SeesawScreen />} />
        <Route path="/question/:typeId" element={<QuestionScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/random" element={<RandomQuizScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
