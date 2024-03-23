import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import supabase from './../../lib/helper/supabaseClient';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

const PetCreate = ({ user }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [hasPet, setHasPet] = useState(false); // State to track if the user already has a pet
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        checkForExistingPet();
    }, [user]);

    const checkForExistingPet = async () => {
        try {
            const { data: existingPet, error } = await supabase
                .from('pets')
                .select('pet_id')
                .eq('user_id', user.id)
                .single();

            if (error) {
                console.error(
                    'Error checking for existing pet:',
                    error.message
                );
                return;
            }

            setHasPet(!!existingPet); // Set hasPet to true if existingPet is not null
        } catch (error) {
            console.error('Error checking for existing pet:', error.message);
        } finally {
            setLoading(false); // Update loading state after the check is done
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if the user already has a pet
        if (hasPet) {
            toast({
                title: 'Error',
                description: 'You already have a pet',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Proceed with pet creation if the user doesn't have a pet

        // Upload image to Supabase storage
        const { data, error } = await supabase.storage
            .from('petImage')
            .upload(`public/${image.name}`, image);

        if (error) {
            console.error('Error uploading image:', error.message);
            toast({
                title: 'Error',
                description: 'Failed to upload image',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        // Get the URL of the uploaded image
        const imageUrl = data.path;

        // Save pet information to the pet table with the user's id
        const { data: petData, error: petError } = await supabase
            .from('pets')
            .insert([{ name, image_url: imageUrl, user_id: user.id }]);
        console.log(petData);

        if (petError) {
            console.error('Error creating pet:', petError.message);
            toast({
                title: 'Error',
                description: 'Failed to create pet',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        toast({
            title: 'Success',
            description: 'Pet created successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
        });

        // Clear form fields
        setName('');
        setImage(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // Render the form only if the user doesn't have a pet
    return (
        <>
            {!hasPet && (
                <form onSubmit={handleSubmit}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Image</FormLabel>
                        <Input
                            type='file'
                            accept='image/*'
                            onChange={handleImageChange}
                        />
                    </FormControl>
                    <Button mt={4} colorScheme='blue' type='submit'>
                        Submit
                    </Button>
                </form>
            )}
            {hasPet && <div>You already have a pet. Maybe in the future</div>}
        </>
    );
};

export default PetCreate;
