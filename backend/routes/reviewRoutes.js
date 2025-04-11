import express from 'express';
import ReviewController from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', (req, res) => ReviewController.addReview(req, res));

router.get('/', (req, res) => ReviewController.getAllReviews(req, res));

router.put('/', (req, res) => ReviewController.editReview(req, res));

router.delete('/', (req, res) => ReviewController.deleteReview(req, res));

export default router;