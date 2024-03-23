import React, { useEffect, useState } from 'react';
import { Box, Button, Center, Heading, Text, Input } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import supabase from './../../lib/helper/supabaseClient'; // Import Supabase client

function QuestioningApp({ user }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [updatedQuestionText, setUpdatedQuestionText] = useState('');
    const [updatedChoices, setUpdatedChoices] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        console.log(user);
        fetchQuestions();
        fetchUserPoints();
    }, []);

    const fetchUserPoints = async () => {
        try {
            const { data, error } = await supabase
                .from('points')
                .select('pointValue')
                .eq('user_id', user.id)
                .single();
            if (error) throw error;
            setPoints(data?.pointValue || 0); // Set user points or default to 0 if not found
        } catch (error) {
            console.error('Error fetching user points:', error.message);
        }
    };

    const fetchQuestions = async () => {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select('*')
                .eq('user_id', user.id);
            if (error) throw error;
            setQuestions(data || []); // Make sure to handle empty data case
        } catch (error) {
            console.error('Error fetching questions:', error.message);
        }
    };

    const handleChoiceSelect = (choice) => {
        setSelectedChoice(choice);
    };

    const handleNextQuestion = async () => {
        if (selectedChoice === questions[currentQuestionIndex].correct_answer) {
            setScore(score + 1);
            const newPoints = points + 1;
            await updatePoints(newPoints);
            setPoints(newPoints); // Update points in the front end after successful update
        }
        setSelectedChoice('');
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    const updatePoints = async (newPoints) => {
        try {
            const { data, error } = await supabase
                .from('points')
                .update([{ user_id: user.id, pointValue: newPoints }])
                .eq('user_id', user.id);
            if (error) throw error;
            console.log('Points updated successfully');
            return newPoints; // Return updated points
        } catch (error) {
            console.error('Error updating points:', error.message);
            return points; // Return previous points in case of error
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedChoice('');
        setShowResult(false);
        setScore(0);
    };

    const handleInputChange = (event) => {
        const choices = event.target.value
            .split(',')
            .map((choice) => choice.trim());
        setUpdatedChoices(choices);
    };

    const handleUpdateQuestion = async (index) => {
        const questionToUpdate = questions[index];
        try {
            const { data, error } = await supabase
                .from('questions')
                .update({
                    question_text: updatedQuestionText,
                    answer_choices: updatedChoices,
                })
                .eq('question_id', questionToUpdate.question_id);
            if (error) throw error;
            // Update the question text and answer choices in the questions array
            const updatedQuestions = [...questions];
            updatedQuestions[index].question_text = updatedQuestionText;
            updatedQuestions[index].answer_choices = updatedChoices;
            setQuestions(updatedQuestions);
            setIsEditing(false); // Exit editing mode after update
            console.log('Question updated successfully');
        } catch (error) {
            console.error('Error updating question:', error.message);
        }
    };

    const handleEditQuestion = (index) => {
        const questionToEdit = questions[index];
        // Set the updated question text and choices when entering edit mode
        setUpdatedQuestionText(questionToEdit.question_text);
        setUpdatedChoices(questionToEdit.answer_choices);
        setIsEditing(true);
    };

    const handleDeleteQuestion = async (index) => {
        const questionToDelete = questions[index];
        try {
            const { data, error } = await supabase
                .from('questions')
                .delete()
                .eq('question_id', questionToDelete.question_id);
            if (error) throw error;
            // Remove the deleted question from the questions array
            setQuestions(questions.filter((_, i) => i !== index));
            console.log('Question deleted successfully');
        } catch (error) {
            console.error('Error deleting question:', error.message);
        }
    };

    if (questions.length === 0) {
        return (
            <Center h='100vh'>
                <Box p={8} borderWidth={1} borderRadius={8} boxShadow='lg'>
                    <Text>
                        Still Loading....
                        <br></br>
                        Or no questions available.{' '}
                        <Link
                            to='/question/create'
                            style={{
                                color: 'blue',
                                textDecoration: 'underline',
                            }}>
                            <Text
                                as='span'
                                color='blue'
                                textDecoration='underline'>
                                Make one here
                            </Text>
                        </Link>
                        .
                    </Text>
                </Box>
            </Center>
        );
    }

    return (
        <Center h='100vh'>
            <Box p={8} borderWidth={1} borderRadius={8} boxShadow='lg'>
                {showResult ? (
                    <>
                        <Heading mb={4}>Result</Heading>
                        <Text mb={4}>
                            Your score: {score}/{questions.length}
                        </Text>
                        <Button onClick={handleRestart}>Restart</Button>
                    </>
                ) : (
                    <>
                        {isEditing ? (
                            <Box>
                                <Text mb={4}>Edit question below:</Text>
                                <Input
                                    placeholder='Enter updated question text'
                                    value={updatedQuestionText}
                                    onChange={handleInputChange}
                                    size='lg' // Adjust the size to make it larger
                                />
                                <Text mt={4} mb={4}>
                                    Edit choices below:
                                </Text>
                                <Center flexDirection='column'>
                                    <Input
                                        placeholder='Enter updated choices separated by commas'
                                        value={updatedChoices.join(', ')}
                                        onChange={handleInputChange}
                                        size='lg' // Adjust the size to make it larger
                                    />
                                </Center>
                                <Button
                                    mt={4}
                                    colorScheme='blue'
                                    onClick={() =>
                                        handleUpdateQuestion(
                                            currentQuestionIndex
                                        )
                                    }>
                                    Update
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Heading mb={4}>
                                    Question {currentQuestionIndex + 1}/
                                    {questions.length}
                                </Heading>
                                <Text mb={4}>
                                    {
                                        questions[currentQuestionIndex]
                                            ?.question_text
                                    }
                                </Text>
                                <Center flexDirection='column'>
                                    {questions[
                                        currentQuestionIndex
                                    ]?.answer_choices.map((choice, index) => (
                                        <Button
                                            key={index}
                                            onClick={() =>
                                                handleChoiceSelect(choice)
                                            }
                                            mb={2}
                                            variant={
                                                selectedChoice === choice
                                                    ? 'solid'
                                                    : 'outline'
                                            }
                                            colorScheme={
                                                selectedChoice === choice
                                                    ? 'teal'
                                                    : undefined
                                            }>
                                            {choice}
                                        </Button>
                                    ))}
                                </Center>
                                <Button
                                    mt={4}
                                    colorScheme='teal'
                                    onClick={handleNextQuestion}
                                    isDisabled={!selectedChoice}>
                                    Next
                                </Button>
                                <Button
                                    mt={4}
                                    colorScheme='blue'
                                    onClick={() =>
                                        handleEditQuestion(currentQuestionIndex)
                                    }>
                                    Update
                                </Button>

                                <Button
                                    mt={4}
                                    colorScheme='red'
                                    onClick={() =>
                                        handleDeleteQuestion(
                                            currentQuestionIndex
                                        )
                                    }>
                                    Delete
                                </Button>
                            </>
                        )}
                    </>
                )}
            </Box>
        </Center>
    );
}

export default QuestioningApp;
