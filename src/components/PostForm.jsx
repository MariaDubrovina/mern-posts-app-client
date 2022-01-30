import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Form } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import { useForm } from '../util/hooks';
import { useState } from 'react';

const PostForm = (props) => {
    const [error, setError] = useState('');
    const initialState = {
        body: ''
    };

    const { onChange, onSubmit, values } = useForm(addPostCallback, initialState);

    const [addPost, { loading }] = useMutation(CREATE_POST, {
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            });
            
            proxy.writeQuery({ 
                query: FETCH_POSTS_QUERY, 
                data: {
                    getPosts: [result.data.createPost, ...data.getPosts]
                } });
            
            values.body = '';
        },
        onError(err) {
            setError(err.graphQLErrors[0].message)
           
        },
        variables: values
    });

    
    function addPostCallback() {
        addPost();
    }

    return (  
        <>     
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''} >
               
                <h1>Create a post:</h1>
                
                <Form.Field>
                    <Form.Input
                        placeholder='Hello World'
                        name='body'
                        type='text'
                        value={values.body}
                        error={error ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Button primary>Add Post</Form.Button>

            </Form>
            {error && (
                <div className="ui error message" style={{marginBottom: 20}}>
                    <ul className='list'>
                       
                            <li>{error}</li>
                       
                    </ul>
                </div>
            )}
            
        </>
    );
}

const CREATE_POST = gql`
    mutation createPost(
        $body: String!
    ) {
        createPost(
            body: $body
        ){
            id body username createdAt
            comments {
                id body username createdAt
            }
            likes {
                id username createdAt
            }
            likeCount
            commentCount
        }
    }
`

export default PostForm;