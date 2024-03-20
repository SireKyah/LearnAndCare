import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from './../../lib/helper/supabaseClient';

export default function successPage() {
    const [user, setUsers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function getUserData() {
            await supabase.auth.getUser().then((value) => {
                if (value.data?.user) {
                    console.log(value.data.user);
                    setUsers(value.data.user);
                }
            });
        }
        getUserData();
    }, []);

    async function signOutUser() {
        const { error } = await supabase.auth.signOut();
        navigate('/');
    }

    return (
        <div>
            {Object.keys(user).length !== 0 ? (
                <>
                    <h1>successPage</h1>
                    <p>Welcome, {user.email}</p>
                    
                    <button onClick={() => signOutUser()}>Sign Out</button>
                </>
            ) : (
                <>
                    <h1>What is you doin here</h1>
                    <button
                        onClick={() => {
                            navigate('/');
                        }}>
                        Get Out
                    </button>
                </>
            )}
        </div>
    );
}
