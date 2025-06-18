interface Review {
  gameId: number;
  userId: number;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const mockGameService = {
  getReviews: (): Review[] => {
    const reviews = localStorage.getItem('gameReviews');
    return reviews ? JSON.parse(reviews) : [];
  },

  getUserReviews: (username: string): Record<number, Review> => {
    const reviews = mockGameService.getReviews();
    return reviews
      .filter(review => review.username === username)
      .reduce((acc, review) => ({
        ...acc,
        [review.gameId]: review
      }), {});
  },

  saveReview: (review: Review) => {
    const reviews = mockGameService.getReviews();

    // Remover avaliação existente do mesmo usuário para o mesmo jogo
    const filteredReviews = reviews.filter(r =>
      !(r.gameId === review.gameId && r.username === review.username)
    );

    const newReviews = [...filteredReviews, review];
    localStorage.setItem('gameReviews', JSON.stringify(newReviews));
  }
};