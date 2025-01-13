import React, { useEffect, useState } from 'react';

const SuccessPage = () => {
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');

      const response = await fetch(`http://localhost:8000/payment-details/?session_id=${sessionId}`);
      const data = await response.json();
      setPaymentDetails(data);
    };

    fetchPaymentDetails();
  }, []);

  if (!paymentDetails) return <p>Loading...</p>;

  return (
    <div>
      <h1>Płatność zakończona sukcesem!</h1>
      <p>Dziękujemy za zakup {paymentDetails.product_name}!</p>
      <p>Kwota: {paymentDetails.amount / 100} USD</p>
    </div>
  );
};

export default SuccessPage;
