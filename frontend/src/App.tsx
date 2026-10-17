
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AskView } from './features/ask/AskView';
import { IngestionView } from './features/ingestion/IngestionView';
import { SettingsView } from './features/settings/SettingsView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<AskView />} />
          <Route path="ingestion" element={<IngestionView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
