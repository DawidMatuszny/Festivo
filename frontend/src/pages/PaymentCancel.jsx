import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
    return (
        <div id="main">
            <div className="payments-result-container">
                <div className="payments-result-text">
                    <h1>Płatność anulowana</h1>
                    <p>Rejestracja na wydarzenie została anulowana. Spróbuj ponownie.</p>
                    <Link to="/">Wróć do strony głównej</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;