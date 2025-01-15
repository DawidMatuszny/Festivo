import React from "react";
import { Link } from "react-router-dom";

const PaymentsSuccess = () => {
    return (
        <div id="main">
            <h1>Płatność zakończona sukcesem!</h1>
            <p>Dziękujemy za zarejestrowanie się na wydarzenie. Czekamy na Ciebie!</p>
            <Link to="/">Wróć na stronę główną</Link>
        </div>
    );
};

export default PaymentsSuccess;