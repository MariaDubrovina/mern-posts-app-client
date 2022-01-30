import { Card, Comment, Form, Header } from 'semantic-ui-react';
import moment from 'moment';
import DeleteButton from './DeleteButton';
import { useForm } from '../util/hooks';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const Comments = ({ comments, user, postId }) => {
    const initialState = {
        body: '',
        postId: postId
    };

    const { onChange, onSubmit, values } = useForm(addCommentCallback, initialState);

    const [addComment] = useMutation(CREATE_COMMENT, {
        update() {
            values.body = '';
        },

        variables: values
    });


    function addCommentCallback() {
        addComment();
    }

    return (
        <>
            {user && (
                <Card fluid>
                    <Card.Content>
                        <p>Add a comment</p>
                        <Form onSubmit={onSubmit}>
                            <div className="ui action input fluid">
                                <input
                                    type="text"
                                    placeholder="Comment.."
                                    name="body"
                                    value={values.body}
                                    onChange={onChange}

                                />
                                <button
                                    type="submit"
                                    className="ui button primary"
                                    disabled={values.body.trim() === ''}

                                >
                                    Submit
                                </button>
                            </div>
                        </Form>
                    </Card.Content>
                </Card>
            )}
            <Comment.Group>
                <Header as='h3' dividing>
                    Comments
                </Header>

                {comments.map(comment => (
                    <Comment key={comment.id} >
                        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                        <Comment.Content>
                            {user && user.username === comment.username && (
                                <DeleteButton postId={postId} commentId={comment.id} />
                            )
                            }
                            <Comment.Author>{comment.username}</Comment.Author>
                            <Comment.Metadata>
                                <div>{moment(comment.createdAt).fromNow()}</div>
                            </Comment.Metadata>
                            <Comment.Text>{comment.body}</Comment.Text>

                        </Comment.Content>

                    </Comment>
                ))}



            </Comment.Group>
        </>
    );
}

const CREATE_COMMENT = gql`
    mutation createComment(
        $postId: ID!
        $body: String!
    ) {
        createComment(
            postId: $postId
            body: $body
        ){
            id
            comments {
                id body username createdAt
            }
            commentCount
        }
    }
`

export default Comments;