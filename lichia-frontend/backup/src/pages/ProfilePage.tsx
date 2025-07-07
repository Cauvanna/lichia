import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

// Você criará esses componentes a seguir
// import FriendList from '../components/Friend/FriendList';
// import FriendRequestList from '../components/Friend/FriendRequestList';

export const ProfilePage = () => {
    const { user } = useAuth();
    // const [friends, setFriends] = useState([]);
    // const [requests, setRequests] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     Promise.all([
    //         api.get('/friends'),
    //         api.get('/friends/requests')
    //     ]).then(([friendsResponse, requestsResponse]) => {
    //         setFriends(friendsResponse.data);
    //         setRequests(requestsResponse.data);
    //     }).catch(err => console.error(err))
    //       .finally(() => setLoading(false));
    // }, []);

    // if (loading) return <CircularProgress />;

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 4 }}>
                Perfil de {user?.nome}
            </Typography>

            {/* Onde a lista de solicitações de amizade será renderizada */}
            <Box>
                <Typography variant="h5">Solicitações de Amizade</Typography>
                {/* <FriendRequestList requests={requests} /> */}
            </Box>

            {/* Onde a lista de amigos será renderizada */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5">Amigos</Typography>
                {/* <FriendList friends={friends} /> */}
            </Box>
        </Container>
    );
};

export default ProfilePage;