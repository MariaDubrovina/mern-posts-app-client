import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useContext, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';


const Login = (props) => {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const initialState = {
        username: '',
        password: ''
    };

    const { onChange, onSubmit, values } = useForm(loginUserCallback, initialState);

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, result) {
            context.login(result.data.login)
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        variables: values
    });

    function loginUserCallback() {
        loginUser();
    }

    return (
        <div className='form-container' >
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''} >
                <div className='page-title'>
                    <h1>Login</h1>
                </div>
                <Form.Input
                    label='Username'
                    placeholder='Username'
                    name='username'
                    type='text'
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange}
                />
                <Form.Input
                    label='Password'
                    placeholder='Password'
                    name='password'
                    type='password'
                    error={errors.password ? true : false}
                    value={values.password}
                    onChange={onChange}
                />
                <Form.Button primary>Login</Form.Button>

            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className='list'>
                        {Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username
            password: $password
        ){
            id email token username createdAt
        }
    }
`

export default Login;