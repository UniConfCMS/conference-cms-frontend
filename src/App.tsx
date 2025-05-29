import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainView } from './containers/MainView';
import { FAQView } from './containers/FaqView';
import { ConferenceView } from './containers/ConferenceView';
import { DetailConferenceView } from './containers/ConferenceView/DetailConferenceView';
import { CreateNewspaperView } from './containers/ConferenceView/CreateNewspaperView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<MainView />} />
        <Route path="/faq/" element={<FAQView />} />
        <Route path='/newspaper/' element={<ConferenceView />} />
        <Route path="/newspaper/:id" element={<DetailConferenceView />} />
        <Route path="/newspaper/create" element={<CreateNewspaperView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
