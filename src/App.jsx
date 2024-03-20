import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/loginPage/loginPage';
import SuccessPage from './pages/successPage/successPage';
import QuestionApp from './components/questions/questionApp';
import CreateQuestion from './components/questions/addQuestion';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/success' element={<SuccessPage />} />
                <Route path='/question' element={<QuestionApp />} />
                <Route path='/create' element={<CreateQuestion />} />
            </Routes>
        </Router>
    );
}
