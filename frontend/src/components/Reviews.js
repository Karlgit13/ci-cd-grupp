import React, { useState, useEffect, useCallback } from 'react';
import { getReviews, addReview, getCurrentUser } from '../services/api';

const Reviews = ({ meetupId, isAttended, isPast }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const user = getCurrentUser();

    const fetchReviews = useCallback(async () => {
        try {
            const data = await getReviews(meetupId);
            setReviews(Array.isArray(data) ? data : []);

            // If user has already reviewed, pre-fill the form
            if (user && Array.isArray(data)) {
                const userReview = data.find(r => r.username === user.username);
                if (userReview) {
                    setRating(userReview.rating);
                    setComment(userReview.comment || '');
                }
            }
        } catch (err) {
            console.error('Failed to load reviews:', err);
            // Don't show error to user for fetch failure, just show empty reviews
            setReviews([]);
        } finally {
            setLoading(false);
        }
    }, [meetupId, user]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitMessage('');
        setError(null);

        try {
            await addReview(meetupId, { rating, comment });
            setSubmitMessage('Review submitted successfully!');
            await fetchReviews(); // Refresh list to show updated/new review
        } catch (err) {
            setError(err.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const styles = {
        container: {
            marginTop: '40px',
            paddingTop: '40px',
            borderTop: '2px solid #e2e8f0'
        },
        header: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#1a202c'
        },
        form: {
            background: '#f7fafc',
            padding: '24px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '1px solid #edf2f7'
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#4a5568'
        },
        select: {
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            marginBottom: '16px',
            backgroundColor: 'white'
        },
        textarea: {
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
            marginBottom: '16px',
            fontFamily: 'inherit',
            resize: 'vertical'
        },
        button: {
            padding: '10px 20px',
            color: 'white',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            opacity: submitting ? 0.7 : 1,
            fontWeight: '600'
        },
        reviewCard: {
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid #edf2f7'
        },
        stars: {
            color: '#f6ad55',
            letterSpacing: '2px'
        },
        meta: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
        },
        date: {
            fontSize: '12px',
            color: '#a0aec0'
        },
        message: {
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            textAlign: 'center',
            fontWeight: '600'
        }
    };

    // Show form if: LoggedIn AND PastEvent AND Attended
    const showForm = user && isPast && isAttended;

    if (loading) return <p>Loading reviews...</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>Reviews ({reviews.length})</h2>

            {showForm && (
                <div style={styles.form}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                        {reviews.some(r => r.username === user.username) ? 'Update Your Review' : 'Leave a Review'}
                    </h3>

                    {submitMessage && (
                        <div style={{ ...styles.message, background: '#c6f6d5', color: '#22543d' }}>
                            {submitMessage}
                        </div>
                    )}

                    {error && (
                        <div style={{ ...styles.message, background: '#fed7d7', color: '#c53030' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label style={styles.label}>Rating</label>
                            <select
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value))}
                                style={styles.select}
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
                                <option value={4}>⭐⭐⭐⭐ - Good</option>
                                <option value={3}>⭐⭐⭐ - Average</option>
                                <option value={2}>⭐⭐ - Poor</option>
                                <option value={1}>⭐ - Terrible</option>
                            </select>
                        </div>

                        <div>
                            <label style={styles.label}>Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                required
                                style={styles.textarea}
                                placeholder="Share your experience..."
                            />
                        </div>

                        <button type="submit" style={styles.button} disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {!showForm && isPast && !user && (
                <div style={{ ...styles.message, background: '#edf2f7', color: '#4a5568' }}>
                    Please <a href="/login" style={{ color: '#667eea' }}>login</a> to leave a review.
                </div>
            )}

            {reviews.length === 0 ? (
                <p style={{ color: '#718096', fontStyle: 'italic' }}>No reviews yet.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review.id || review.created_at} style={styles.reviewCard}>
                        <div style={styles.meta}>
                            <span style={{ fontWeight: 'bold', color: '#2d3748' }}>{review.username}</span>
                            <span style={styles.stars}>{'⭐'.repeat(review.rating)}</span>
                        </div>
                        <p style={{ color: '#4a5568', lineHeight: '1.6', margin: '0 0 10px 0' }}>{review.comment}</p>
                        <div style={styles.date}>
                            {new Date(review.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Reviews;
