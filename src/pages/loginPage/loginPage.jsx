import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import supabase from './../../lib/helper/supabaseClient';

export default function loginPage() {
    const navigate = useNavigate();

    supabase.auth.onAuthStateChange(async (event) => {
        if (event == 'SIGNED_IN') {
            navigate('/home');
        }
    });

    return (
        <div>
            <header>
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                    theme='dark'
                    providers={null}
                />
            </header>
        </div>
    );
}
