import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage';
import SuccessPage from './pages/successPage/successPage';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/success' element={<SuccessPage />} />
            </Routes>
        </Router>
    );
}
