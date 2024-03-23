import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Center,
} from '@chakra-ui/react';
import supabase from './../../lib/helper/supabaseClient'; // Import Supabase client

function CreateQuestion({ user }) {
    const [questionText, setQuestionText] = useState('');
    const [answerChoices, setAnswerChoices] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');

    const handleSubmit = async () => {
        try {
            // Split answer choices by commas and trim each choice
            const choices = answerChoices
                .split(',')
                .map((choice) => choice.trim());
            console.log(user);
            const { data, error } = await supabase.from('questions').insert([
                {
                    question_text: questionText,
                    answer_choices: choices,
                    correct_answer: correctAnswer,
                    user_id: user.id,
                },
            ]);
            if (error) throw error;
            console.log('Question added successfully:', data);
            // Reset form fields after successful submission
            setQuestionText('');
            setAnswerChoices('');
            setCorrectAnswer('');
        } catch (error) {
            console.error('Error adding question:', error.message);
        }
    };

    return (
        <Center>
            <Box
                p={4}
                borderWidth={1}
                borderRadius={8}
                boxShadow='lg'
                maxW='500px'>
                <FormControl mb={4}>
                    <FormLabel>Question Text</FormLabel>
                    <Textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder='Enter your question text...'
                        rows={4}
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Answer Choices</FormLabel>
                    <Textarea
                        value={answerChoices}
                        onChange={(e) => setAnswerChoices(e.target.value)}
                        placeholder='Enter answer choices separated by commas...'
                        rows={3}
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Correct Answer</FormLabel>
                    <Input
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        placeholder='Enter the correct answer...'
                    />
                </FormControl>
                <Button colorScheme='teal' onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Center>
    );
}

export default CreateQuestion;
