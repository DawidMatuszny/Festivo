import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api'; 

const stripePromise = loadStripe('pk_test_51Qgs3lFg3k8Ik01dQj3qTHQWu6cSJuvwtmjvnzFpniU2FdhBVhohaztqzQQQ7glhpULbPW1UTwlcfViMQSUOldbs00Qp5VsBYx');

const PaymentButton = () => {
  const handlePayment = async () => {
    const stripe = await stripePromise;


    const response = await api.post('/create-checkout-session/');
    const { id } = response.data;


    const result = await stripe.redirectToCheckout({ sessionId: id });
    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
  <div id="main">
  <button onClick={handlePayment}>Zapłać</button>
  </div>);
};

export default PaymentButton;