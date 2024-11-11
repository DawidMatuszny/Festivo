import Form from "../components/Form";

function Login() {
    return <Form route="/userapi/token/" method="login" />;
}

export default Login;