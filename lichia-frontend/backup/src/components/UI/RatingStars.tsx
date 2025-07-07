import { Box, Rating, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

interface RatingStarsProps {
  rating: number | null;
  onRatingChange?: (newValue: number | null) => void;
  readOnly?: boolean;
}

export const RatingStars = ({ rating, onRatingChange, readOnly = false }: RatingStarsProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Rating
        name="game-rating"
        value={rating}
        precision={0.5}
        onChange={(_, newValue) => onRatingChange && onRatingChange(newValue)}
        readOnly={readOnly}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {rating !== null && (
        <Typography variant="body2" sx={{ ml: 1 }}>
          {rating.toFixed(1)}
        </Typography>
      )}
    </Box>
  );
};