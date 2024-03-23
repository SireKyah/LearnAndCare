import React from 'react';
import {
    Flex,
    Box,
    Heading,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import AvailablePoints from '../points/availablePoints';

const Navbar = ({ user }) => {
    return (
        <Flex p='4' bg='blue.500' color='white' alignItems='center'>
            {/* Logo */}
            <Box>
                <img
                    src='/circle-logo-with-the-learn-above-the-circle-an-upscaled.jpg'
                    alt='Logo'
                    width='50px'
                    height='auto'
                />
            </Box>
            {/* Links */}
            <Box ml='auto'>
                <Button as={Link} to='/home' variant='ghost'>
                    Home
                </Button>
                <Button as={Link} to='/question' variant='ghost'>
                    Questions
                </Button>
                <Button as={Link} to='/pet' variant='ghost'>
                    Your Pet
                </Button>
                <Menu>
                    <MenuButton
                        as={Button}
                        variant='ghost'
                        _active={{
                            color: 'white',
                            backgroundColor: 'blue.400',
                        }}>
                        More Links
                    </MenuButton>
                    <MenuList>
                        <MenuItem as={Link} to='/question/answer' color='black'>
                            Answer
                        </MenuItem>
                        <MenuItem as={Link} to='/question/create' color='black'>
                            Create Questions
                        </MenuItem>
                        <MenuItem as={Link} to='/pet/create' color='black'>
                            Create Pet
                        </MenuItem>
                        <MenuItem as={Link} to='/signout' color='red'>
                            Sign Out
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            {/* Available Points */}
            <Box ml='4' textAlign='center'>
                {user && <AvailablePoints user={user} />}
            </Box>
        </Flex>
    );
};

export default Navbar;
