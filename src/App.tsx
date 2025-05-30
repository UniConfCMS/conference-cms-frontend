import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainView } from './containers/MainView';
import { FAQView } from './containers/FaqView';
import { AuthProvider } from './context/AuthContext';
import { ConferenceView } from './containers/ConferenceView';
import { DetailConferenceView } from './containers/ConferenceView/DetailConferenceView';

function App() {
  return (
      <AuthProvider>
          <BrowserRouter>
              <Routes>
                  <Route path='*' element={<MainView />} />
                  <Route path="/faq/" element={<FAQView />} />
                  <Route path='/conferences/' element={<ConferenceView />} />
                  <Route path="/conferences/:id" element={<DetailConferenceView />} />
              </Routes>
          </BrowserRouter>
      </AuthProvider>
  );
}

export default App;
