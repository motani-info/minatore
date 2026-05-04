import { HashRouter, Routes, Route } from 'react-router-dom';
import { HomeScreen } from './framework/components/HomeScreen';
import { QuestionScreen } from './framework/components/QuestionScreen';
import { ProfileScreen } from './framework/components/ProfileScreen';
import { RandomQuizScreen } from './framework/components/RandomQuizScreen';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/question/:typeId" element={<QuestionScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/random" element={<RandomQuizScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
