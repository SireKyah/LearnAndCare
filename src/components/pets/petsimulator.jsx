import React, { useState, useEffect } from 'react';
import { Box, Button, Center, Text, Image, Tooltip } from '@chakra-ui/react';
import supabase from './../../lib/helper/supabaseClient';
import { Link } from 'react-router-dom';

const PetSimulator = ({ user }) => {
    // Check if user is null and render loading state or return null

    const [petData, setPetData] = useState(null);
    const [petState, setPetState] = useState('');
    const [petResponseState, setPetResponseState] = useState('');
    const [loading, setLoading] = useState(true);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        if (user) {
            fetchPetData(user.id);
            fetchUserPoints();
        }
    }, [user]);

    const fetchPetData = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('pets')
                .select('name, image_url')
                .eq('user_id', userId)
                .single();
            if (error) throw error;
            const { data: imageData } = await supabase.storage
                .from('petImage')
                .getPublicUrl(data.image_url);
            data.image_url = imageData.publicUrl;
            setPetData(data);
            setPetResponseState('');
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pet data:', error.message);
            setLoading(false);
        }
    };

    const fetchUserPoints = async () => {
        try {
            const { data, error } = await supabase
                .from('points')
                .select('pointValue')
                .eq('user_id', user.id)
                .single();

            if (error) {
                throw error;
            }

            if (!data) {
                // If no points record is found, create a new one with an initial value of 0
                await supabase
                    .from('points')
                    .insert([{ user_id: user.id, pointValue: 0 }]);
                setPoints(0); // Set points to 0
            } else {
                setPoints(data.pointValue || 0);
            }
        } catch (error) {
            console.error('Error fetching user points:', error.message);
        }
    };

    const handleAction = async (action) => {
        let responseMessage = '';
        let actionPoints = 0;
        switch (action) {
            case 'feed':
                responseMessage = petState.includes('hungry')
                    ? 'Thanks for feeding me!'
                    : "I don't need food right now, but thanks!";
                actionPoints = 1; // Adjust the points required for feeding
                break;
            case 'water':
                responseMessage = petState.includes('thirsty')
                    ? 'Thanks for giving me water!'
                    : "I don't need water right now, but thanks!";
                actionPoints = 1; // Adjust the points required for watering
                break;
            case 'clean':
                responseMessage = petState.includes('dirty')
                    ? 'Thanks for cleaning me!'
                    : "I'm not dirty right now, but thanks!";
                actionPoints = 1; // Adjust the points required for cleaning
                break;
            case 'play':
                responseMessage = petState.includes('sad')
                    ? 'Yay, let’s play!'
                    : "I'm not sad right now, but thanks!";
                actionPoints = 1; // Adjust the points required for playing
                break;
            default:
                break;
        }

        // Check if the user has enough points to perform the action
        if (points >= actionPoints) {
            setPetResponseState(responseMessage);
            await updatePoints(points - actionPoints); // Deduct points after performing action
        } else {
            setPetResponseState(
                "You don't have enough points to perform this action."
            );
        }
    };

    const updatePoints = async (newPoints) => {
        try {
            // Check if the user already has a points record in the database
            const { data: existingPoints, error } = await supabase
                .from('points')
                .select('point_id')
                .eq('user_id', user.id)
                .single();

            if (error) throw error;

            if (existingPoints) {
                // If the user already has a points record, update the existing row
                await supabase
                    .from('points')
                    .update({ pointValue: newPoints })
                    .eq('user_id', user.id);
            } else {
                // If the user doesn't have a points record, insert a new row
                await supabase
                    .from('points')
                    .insert([{ user_id: user.id, pointValue: newPoints }]);
            }

            setPoints(newPoints);
        } catch (error) {
            console.error('Error updating points:', error.message);
        }
    };

    const getRandomPetState = () => {
        const states = [
            `${petData.name} is hungry, can you feed it?`,
            `${petData.name} is thirsty, can you give it water?`,
            `${petData.name} is dirty, can you clean it?`,
            `${petData.name} is feeling sad, can you play with it?`,
        ];
        const randomIndex = Math.floor(Math.random() * states.length);
        setPetState(states[randomIndex]);
        setPetResponseState('');
    };

    return (
        <Center flexDirection='column'>
            {loading ? (
                <Text>Loading...</Text>
            ) : petData ? (
                <div>
                    <Text fontSize='xl' mb={4} textAlign='center'>
                        {petState}
                    </Text>
                    <Image
                        src={petData.image_url}
                        alt={petData.name}
                        width='200px'
                        mb={4}
                    />
                    {petResponseState && (
                        <Tooltip label={petResponseState} placement='top'>
                            <Text fontSize='xl' textAlign='center' mb={4}>
                                {petData.name} response...💬
                            </Text>
                        </Tooltip>
                    )}
                    <Box>
                        <Button
                            mr={4}
                            onClick={() => handleAction('feed')}
                            disabled={!petState.includes('hungry')}>
                            Feed -1 P
                        </Button>
                        <Button
                            mr={4}
                            onClick={() => handleAction('water')}
                            disabled={!petState.includes('thirsty')}>
                            Water -1 P
                        </Button>
                        <Button
                            mr={4}
                            onClick={() => handleAction('clean')}
                            disabled={!petState.includes('dirty')}>
                            Clean -1 P
                        </Button>
                        <Button
                            onClick={() => handleAction('play')}
                            disabled={!petState.includes('sad')}>
                            Play -1 P
                        </Button>
                    </Box>
                </div>
            ) : (
                <Box textAlign='center'>
                    <Text mb={4}>
                        You don't have a pet yet. Click the button below to
                        create one!
                    </Text>
                    <Button as={Link} to='/pet/create' colorScheme='teal'>
                        Create Pet
                    </Button>
                </Box>
            )}
            {petData && (
                <Button mt={4} onClick={getRandomPetState}>
                    Next Task
                </Button>
            )}
        </Center>
    );
};

export default PetSimulator;
