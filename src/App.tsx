import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainView } from './containers/MainView';
import { FAQView } from './containers/FaqView';
import { AuthProvider } from './context/AuthContext';
import { ConferenceView } from './containers/ConferenceView';
import { DetailConferenceView } from './containers/ConferenceView/DetailConferenceView';
import SetPasswordView from './components/SetPasswordView/index';
import UserPanel from './components/UserPanel';
import ForgotPasswordModal from './components/ForgotPassword';
import ResetPasswordModal from './components/ResetPassword';
import { CreatePageView } from './containers/PageView/CreatePageView';
import { CreateConferenceView } from './containers/ConferenceView/CreateConferenceView';
import { EditConferenceView } from './containers/ConferenceView/UpdateConferenceView';
import { UpdatePageView } from './containers/PageView/UpdatePageView';
import AdminPanel from './containers/AdminPanelView';
import Users from './containers/AdminPanelView/UserAdminView';
import Conferences from './containers/AdminPanelView/ConfernceAdminView';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainView />} />
                    <Route path="/faq/" element={<FAQView />} />
                    <Route path='/conferences/' element={<ConferenceView />} />
                    <Route path="/conferences/:id" element={<DetailConferenceView />} />
                    <Route path="/conferences/:id/create-page" element={<CreatePageView />} />
                    <Route path="/conferences-create" element={<CreateConferenceView />} />
                    <Route path="/conferences/:id/edit" element={<EditConferenceView />} />
                    <Route path="/conferences/:id/edit-page/:pageId" element={<UpdatePageView />} />

                    <Route path="/panel" element={<UserPanel />} />
                    <Route path="/set-password" element={<SetPasswordView />} />
                    <Route path="/admin" element={<AdminPanel />}>
                        <Route path="users" element={<Users />} />
                        <Route path="conferences" element={<Conferences />} />
                        <Route index element={<Navigate to="users" replace />} />
                    </Route>
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