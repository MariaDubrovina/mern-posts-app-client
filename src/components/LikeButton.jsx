import { useEffect, useState } from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {

    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true);
        } else setLiked(false)
    }, [user, likes]);

    const [likePost] = useMutation(LIKE_POST, {
        variables: { postId: id }
    });

    const likeButton =
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )


    return <>
        {user ? (
            <Button as='div' labelPosition='right' onClick={likePost} >
                {likeButton}
                <Label basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
        ) : (
            <Button as='div' labelPosition='right' >
                <Button as={Link} to='/login' color='teal' basic>
                    <Icon name='heart' />
                </Button>
                <Label basic color='teal' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
        )

        }
    </>

}

const LIKE_POST = gql`
    mutation likePost(
        $postId: ID!
    ) {
        likePost(
            postId: $postId
        ){
            id 
            likes {
               id username
            }
            likeCount
        }
    }
`


export default LikeButton;