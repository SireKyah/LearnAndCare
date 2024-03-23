import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import supabase from '../../lib/helper/supabaseClient';

const SignoutPage = () => {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function getUserData() {
            const { data: userData, error } = await supabase.auth.getUser();
            if (userData) {
                setUser(userData);
            }
        }
        getUserData();
    }, []);

    async function signOutUser() {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setUser({}); // Clear the user state
            navigate('/');
        } else {
            console.error(error);
        }
    }

    return (
        <Box textAlign='center' p='6'>
            <Heading as='h1' size='xl' mb='4'>
                Sign Out
            </Heading>
            {Object.keys(user).length !== 0 ? (
                <>
                    <Text fontSize='lg' mb='4'>
                        Are you sure you want to sign out, {user.email}?
                    </Text>
                    <Button onClick={() => signOutUser()} colorScheme='red'>
                        Sign Out
                    </Button>
                </>
            ) : (
                <Text fontSize='lg'>You are not signed in.</Text>
            )}
        </Box>
    );
};

export default SignoutPage;
