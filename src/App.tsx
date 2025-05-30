import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainView } from './containers/MainView';
import { FAQView } from './containers/FaqView';
import { AuthProvider } from './context/AuthContext';
import { ConferenceView } from './containers/ConferenceView';
import { DetailConferenceView } from './containers/ConferenceView/DetailConferenceView';
import { CreateNewspaperView } from './containers/ConferenceView/CreateNewspaperView';
import SetPasswordView from './components/SetPasswordView/index';
import UserPanel from './components/UserPanel';
import ForgotPasswordModal from './components/ForgotPassword';
import ResetPasswordModal from './components/ResetPassword';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainView />} />
                    <Route path="/faq/" element={<FAQView />} />
                    <Route path="/newspaper/" element={<ConferenceView />} />
                    <Route path="/newspaper/:id" element={<DetailConferenceView />} />
                    <Route path="/newspaper/create" element={<CreateNewspaperView />} />
                    <Route path="/panel" element={<UserPanel />} />
                    <Route path="/set-password" element={<SetPasswordView />} />
                    <Route
                        path="/forgot-password"
                        element={
                            <>
                                <MainView />
                                <ForgotPasswordModal isOpen={true} onClose={() => window.location.href = '/'} />
                            </>
                        }
                    />
                    <Route
                        path="/reset-password/:token"
                        element={
                            <>
                                <MainView />
                                <ResetPasswordModal isOpen={true} onClose={() => window.location.href = '/'} />
                            </>
                        }
                    />
                    <Route path="*" element={<MainView />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;