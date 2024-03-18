import { useEffect, useState } from 'react';
import { supabase } from './lib/helper/supabaseClient'; // Assuming you have the Supabase client configured

const AllPets = () => {
    const [allPets, setAllPets] = useState([]);

    useEffect(() => {
        const fetchAllPets = async () => {
            try {
                // Fetch all pets from the 'pets' table along with the associated user_id from the 'users' table
                const { data: pets, error } = await supabase
                    .from('pets')
                    .select('*');

                if (error) throw error;

                // Set the retrieved pets data to the state
                setAllPets(pets);
            } catch (error) {
                console.error('Error fetching all pets:', error.message);
            }
        };

        fetchAllPets();
    }, []);

    return (
        <div>
            <h2>All Pets</h2>
            <ul>
                {allPets.map((pet) => (
                    <li key={pet.pet_id}>
                        <strong>Name:</strong> {pet.name},{' '}
                        <strong>User ID:</strong> {pet.user_id}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AllPets;
