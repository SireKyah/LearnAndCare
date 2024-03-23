import React, { useState, useEffect } from 'react';
import { Box, Center, Text } from '@chakra-ui/react';
import supabase from './../../lib/helper/supabaseClient'; // Import Supabase client

function QuestionAnswer({ user }) {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (user) {
            fetchQuestions(user.id);
        }
    }, [user]);

    const fetchQuestions = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('user_id', userId); // Filter questions by user_id
            if (error) throw error;
            setQuestions(data || []); // Make sure to handle empty data case
        } catch (error) {
            console.error('Error fetching questions:', error.message);
        }
    };

    return (
        <Center>
            <Box p={8} borderWidth={1} borderRadius={8} boxShadow='lg'>
                <Text fontSize='xl' fontWeight='bold' mb={4}>
                    Your Questions and Answers
                </Text>
                {questions.map((question, index) => (
                    <Box key={index} mb={4}>
                        <Text fontSize='lg' fontWeight='bold' mb={2}>
                            Question {index + 1}:
                        </Text>
                        <Text mb={2}>{question.question_text}</Text>
                        <Text fontWeight='bold'>Correct Answer:</Text>
                        <Text>{question.correct_answer}</Text>
                    </Box>
                ))}
            </Box>
        </Center>
    );
}

export default QuestionAnswer;
