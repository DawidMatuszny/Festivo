import React from "react";
import { Link } from "react-router-dom";

const PaymentsSuccess = () => {
    return (
            <div id="main">
                <div className="payments-result-container">
                    <div className="payments-result-text">
                        <h1>Płatność zakończona sukcesem!</h1>
                        <p>Dziękujemy za zapisanie się na wydarzenie. Czekamy na Ciebie!</p>
                        <Link to="/">Wróć na stronę główną</Link>
                    </div>
                </div>
            </div>
        );
};

export default PaymentsSuccess;