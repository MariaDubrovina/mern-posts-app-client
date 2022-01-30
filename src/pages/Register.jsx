import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useContext, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';


const Register = (props) => {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({});

    const initialState = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    };

    const { onChange, onSubmit, values } = useForm(registerUser, initialState);

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, result) {
            context.login(result.data.register)
            props.history.push('/');
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.errors)
        },
        variables: values
    });

    function registerUser() {
        addUser();
    }

    return (
        <div className='form-container' >
           <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''} >
               <div className='page-title'>
               <h1>Register</h1>
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
                    label='Email'
                    placeholder='Email'
                    name='email'
                    type='email'
                    error={errors.email ? true : false}
                    value={values.email}
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
                <Form.Input 
                    label='Confirm Password'
                    placeholder='Confirm Password'
                    name='confirmPassword'
                    type='password'
                    error={errors.confirmPassword ? true : false}
                    value={values.confirmPassword}
                    onChange={onChange}
                />
                <Form.Button primary>Register</Form.Button>

           </Form>
           {Object.keys(errors).length > 0 && (
            <div className="ui form error">
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(registerInput: {
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
        }
        ){
            id email token username createdAt
        }
    }
`

export default Register;