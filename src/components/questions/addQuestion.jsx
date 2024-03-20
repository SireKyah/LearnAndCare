import React, { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Textarea,
} from '@chakra-ui/react';
import supabase from './../../lib/helper/supabaseClient'; // Import Supabase client

function CreateQuestion() {
    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [answerChoices, setAnswerChoices] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [difficultyLevelId, setDifficultyLevelId] = useState(1);
    const [languageId, setLanguageId] = useState(1);

    const handleSubmit = async () => {
        try {
            const { data, error } = await supabase.from('questions').insert({
                question_text: questionText,
                question_type: questionType,
                answer_choices: answerChoices,
                correct_answer: correctAnswer,
                difficulty_level_id: difficultyLevelId,
                language_id: languageId,
            });
            if (error) throw error;
            console.log('Question added successfully:', data);
            // Reset form fields after successful submission
            setQuestionText('');
            setQuestionType('');
            setAnswerChoices('');
            setCorrectAnswer('');
            setDifficultyLevelId(1);
            setLanguageId(1);
        } catch (error) {
            console.error('Error adding question:', error.message);
        }
    };

    return (
        <Box p={4} borderWidth={1} borderRadius={8} boxShadow='lg'>
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
                <FormLabel>Question Type</FormLabel>
                <Select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    placeholder='Select question type...'>
                    <option value='Multiple Choice'>Multiple Choice</option>
                    <option value='Single Choice'>Single Choice</option>
                    {/* Add more options if needed */}
                </Select>
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
            <FormControl mb={4}>
                <FormLabel>Difficulty Level ID</FormLabel>
                <Input
                    type='number'
                    value={difficultyLevelId}
                    onChange={(e) =>
                        setDifficultyLevelId(Number(e.target.value))
                    }
                    placeholder='Enter difficulty level ID...'
                />
            </FormControl>
            <FormControl mb={4}>
                <FormLabel>Language ID</FormLabel>
                <Input
                    type='number'
                    value={languageId}
                    onChange={(e) => setLanguageId(Number(e.target.value))}
                    placeholder='Enter language ID...'
                />
            </FormControl>
            <Button colorScheme='teal' onClick={handleSubmit}>
                Submit
            </Button>
        </Box>
    );
}

export default CreateQuestion;
