import React, { useState, useEffect } from 'react';
import { supabase } from './lib/helper/supabaseClient';

export default function App() {
    const [users, setUsers] = useState([]);
    console.log(users);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        const { data } = await supabase.from('users').select('*');
        setUsers(data);
    }

    return <div>App</div>;
}
