import Form from "../components/Form";
import { useUser } from "../UserContext";
import { useNavigate } from 'react-router-dom';

function Login() {
    const { isLogin } = useUser();
	const navigate = useNavigate();
    if (!isLogin) {
		return <Form route="userapi/user/login/" method="login" />;
	} else {
		navigate('/');
	}
}

export default Login;