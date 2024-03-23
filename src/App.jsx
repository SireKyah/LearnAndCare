import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Navbar from './components/navbar/navbar';
import LoginPage from './pages/loginPage/loginPage';
import SignoutPage from './pages/signoutPage/signoutPage';
import QuestionApp from './components/questions/questionApp';
import CreateQuestion from './components/questions/addQuestion';
import PetSimulator from './components/pets/petsimulator';
import HomePage from './pages/homePage/homePage';
import PetCreate from './components/pets/petCreate';
import QuestionAnswer from './components/questions/questionAnswers';
import supabase from './lib/helper/supabaseClient';
import './App';

const theme = extendTheme({
    components: {
        Tooltip: {
            baseStyle: {
                borderRadius: '8px',
                bg: 'gray.800',
                color: 'white',
                padding: '8px',
                fontSize: 'md',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            },
        },
    },
});

const customTheme = extendTheme(theme, {
    styles: {
        global: {
            body: {
                backgroundImage: `url('/a-nice-sunny-background-only-background-without-an-upscaled.jpg')`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed', // Ensures the background image stays fixed as the content scrolls
            },
        },
    },
});

export default function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUserData() {
            const { data: userData, error } = await supabase.auth.getUser();
            setUser(userData.user);
        }

        getUserData();
    }, []);

    return (
        <ChakraProvider theme={customTheme}>
            <Router>
                <Navbar user={user} />
                <Routes>
                    <Route path='/' element={<LoginPage />} />
                    <Route path='/signout' element={<SignoutPage />} />
                    <Route
                        path='/question'
                        element={user && <QuestionApp user={user} />}
                    />
                    <Route
                        path='/question/answer'
                        element={<QuestionAnswer user={user} />}
                    />
                    <Route
                        path='/question/create'
                        element={user && <CreateQuestion user={user} />}
                    />
                    <Route path='/pet' element={<PetSimulator user={user} />} />
                    <Route
                        path='/pet/create'
                        element={user && <PetCreate user={user} />}
                    />
                    <Route path='/home' element={<HomePage user={user} />} />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}
