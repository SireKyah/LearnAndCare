import React, { useState, useEffect } from 'react';
import { Text } from '@chakra-ui/react';
import supabase from './../../lib/helper/supabaseClient';

const AvailablePoints = ({ user }) => {
    const [points, setPoints] = useState(0);

    useEffect(() => {
        fetchUserPoints();
    }, [user, points]);

    const fetchUserPoints = async () => {
        try {
            const { data, error } = await supabase
                .from('points')
                .select('pointValue')
                .eq('user_id', user.id)
                .single();
            if (error) throw error;
            setPoints(data?.pointValue || 0);
        } catch (error) {
            console.error('Error fetching user points:', error.message);
        }
    };

    return (
        <Text fontSize='lg' fontWeight='bold'>
            Available Points: {points}
        </Text>
    );
};

export default AvailablePoints;
