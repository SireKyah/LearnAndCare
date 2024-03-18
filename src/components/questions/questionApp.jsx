import React, { useState } from 'react';
import {
    Box,
    Button,
    Center,
    ChakraProvider,
    Heading,
    Text,
} from '@chakra-ui/react';

function QuestioningApp() {
    const questions = [
        {
            text: 'What is the capital of France?',
            choices: ['London', 'Berlin', 'Paris', 'Madrid'],
            correctAnswer: 'Paris',
        },
        {
            text: 'What is 2 + 2?',
            choices: ['3', '4', '5', '6'],
            correctAnswer: '4',
        },
    ];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const handleChoiceSelect = (choice) => {
        setSelectedChoice(choice);
    };

    const handleNextQuestion = () => {
        if (selectedChoice === questions[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }
        setSelectedChoice('');
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedChoice('');
        setShowResult(false);
        setScore(0);
    };

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
                        <Heading mb={4}>
                            Question {currentQuestionIndex + 1}
                        </Heading>
                        <Text mb={4}>
                            {questions[currentQuestionIndex].text}
                        </Text>
                        <Center flexDirection='column'>
                            {questions[currentQuestionIndex].choices.map(
                                (choice, index) => (
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
                                        }>
                                        {choice}
                                    </Button>
                                )
                            )}
                        </Center>
                        <Button
                            mt={4}
                            colorScheme='teal'
                            onClick={handleNextQuestion}
                            isDisabled={!selectedChoice}>
                            Next
                        </Button>
                    </>
                )}
            </Box>
        </Center>
    );
}

function App() {
    return (
        <ChakraProvider>
            <QuestioningApp />
        </ChakraProvider>
    );
}

export default App;
