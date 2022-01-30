import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { Form } from 'semantic-ui-react';
import { useForm } from '../util/hooks';
import { useState } from 'react';

const EditForm = (props) => {
    const [error, setError] = useState('');
    const initialState = {
        body: props.body,
        postId: props.postId
    };

    const { onChange, onSubmit, values } = useForm(editPostCallback, initialState);

    const [editPost, { loading }] = useMutation(UPDATE_POST, {
        update(proxy, result) {
            props.closeEditMode();
            
        },
        onError(err) {
            setError(err.graphQLErrors[0].message)
           
        },
        variables: values
    });

    
    function editPostCallback() {
        editPost();
    }

    return (  
        <>     
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''} >
                
                <Form.Field>
                    <Form.Input
                      //  placeholder='Hello World'
                        name='body'
                        type='text'
                        value={values.body}
                        error={error ? true : false}
                        onChange={onChange}
                    />
                </Form.Field>
                <Form.Button primary >Save</Form.Button>

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

const UPDATE_POST = gql`
    mutation updatePost(
        $postId: ID!
        $body: String!
    ) {
        updatePost(
            postId: $postId
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

export default EditForm;