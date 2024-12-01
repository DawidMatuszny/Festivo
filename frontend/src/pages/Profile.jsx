import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

function Profile() {
    const [email, setEmail] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);
    const [error, setError] = useState(null);
    const { logout } = useUser();
    const navigate = useNavigate("");

    const fetchEvents = async () => {
        try {
            const response = await api.get('/userapi/profile/');
            setEmail(response.data.email)
            setFirstName(response.data.first_name)
            setLastName(response.data.last_name)
        } catch (error) {
            setError('Failed to fetch event details');
            alert(error.message);
            logout();
            navigate('/login')
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <main id='main'>
        <h1>dzieki</h1>
        {email}
        {firstName}
        {lastName}
        </main>
    )
}

export default Profile