import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ReviewProvider } from './context/ReviewContext';
import Header from './components/ui/Header';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Wishlist from './pages/Wishlist';
import Library from './pages/Library';
import GameReviews from './pages/GameReviews';
import UserReviews from './pages/UserReviews';
import GameWishers from './pages/GameWishers';
import ExploreGames from './pages/ExploreGames';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
        <GameProvider> {/* <-- ADICIONE AQUI */}    <WishlistProvider>
              <ReviewProvider>        {/* ... Router ... */}
              </ReviewProvider>    </WishlistProvider>
          </GameProvider> {/* <-- E AQUI */}
      <WishlistProvider>
        <ReviewProvider>
          <Router>
            <div className="min-h-screen bg-gray-900">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<ExploreGames />} />
                  <Route path="/game/:id" element={<GameDetail />} />
                  <Route path="/game/:id/reviews" element={<GameReviews />} />
                  <Route path="/game/:id/wishers" element={<GameWishers />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/user/:id" element={<UserProfile />} />
                  <Route path="/user/:id/reviews" element={<UserReviews />} />
                  <Route path="/user/:id/wishlist" element={<Wishlist />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
            </div>
          </Router>
        </ReviewProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
