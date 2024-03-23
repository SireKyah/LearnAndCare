import React from 'react';
import { Box, Heading, Text, Button, Link } from '@chakra-ui/react';

const HomePage = ({ user }) => {
    return (
        <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
            p='6'>
            <Box>
                <Heading as='h1' size='xl' mb='4'>
                    Learn And Care
                </Heading>
                <Text fontSize='lg' mb='4'>
                    Welcome to Learn and Care, where you learn by caring.
                </Text>
                {user ? ( // Check if user is logged in
                    <Text fontSize='md'>Logged in as: {user.email}</Text>
                ) : (
                    <Link as={Button} colorScheme='dark blue' href='/'>
                        Sign in
                    </Link>
                )}
            </Box>
            {/* Placeholder for image */}
            <Box w='200px' h='200px' bg='gray.200' borderRadius='md'>
                <img
                    src='/public/a-man-and-woman-learning-and-studying-while-caring-upscaled.jpg'
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'md',
                    }}
                    alt='Learn And Care'
                />
            </Box>
        </Box>
    );
};

export default HomePage;
