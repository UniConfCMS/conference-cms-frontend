import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainView } from './containers/MainView';
import { FAQView } from './containers/FaqView';
import { NewspaperView } from './containers/NewspaperView';
import { DetailNewspaperView } from './containers/NewspaperView/DetailNewspaperView';
import { CreateNewspaperView } from './containers/NewspaperView/CreateNewspaperView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<MainView />} />
        <Route path="/faq/" element={<FAQView />} />
        <Route path='/newspaper/' element={<NewspaperView />} />
        <Route path="/newspaper/:id" element={<DetailNewspaperView />} />
        <Route path="/newspaper/create" element={<CreateNewspaperView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
