import { Button, Icon, Confirm } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useState } from 'react';
import { FETCH_POSTS_QUERY } from '../util/graphql';

const DeleteButton = ({postId, commentId, callback}) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false);
            if (!commentId) {
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
    
                proxy.writeQuery({ 
                    query: FETCH_POSTS_QUERY, 
                    data: {
                        getPosts: [...data.getPosts.filter(p => p.id !== postId)]
                    } });
            }
            
            
            if (callback) callback();
        },
        variables: {postId, commentId}});

    return (
        <>
        <Button as='div' color='red' floated='right' onClick={() => setConfirmOpen(true)}>
            <Icon name='trash' style={{ margin: 0 }} />
        </Button>
        <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
      </>
    )
}

const DELETE_POST = gql`
    mutation deletePost(
        $postId: ID!
    ) {
        deletePost(
            postId: $postId
        )
    }
`

const DELETE_COMMENT = gql`
    mutation deleteComment(
        $postId: ID!
        $commentId: ID!
    ) {
        deleteComment(
            postId: $postId
            commentId: $commentId
        ){
            id 
            comments {
               id username createdAt body
            }
            commentCount
            
        }
    }
`

export default DeleteButton;