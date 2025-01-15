import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
    return (
        <div id="main">
            <h1>Płatność anulowana</h1>
            <p>Rejestracja na wydarzenie została anulowana. Spróbuj ponownie.</p>
            <Link to="/">Wróć do strony głównej</Link>
        </div>
    );
};

export default PaymentCancel;