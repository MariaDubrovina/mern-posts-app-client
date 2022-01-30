import gql from 'graphql-tag';
import { useQuery } from "@apollo/client";
import { Grid } from 'semantic-ui-react';
import { Button, Card, Image, Icon, Label } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth';
import { useContext } from 'react';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import Comments from '../components/Comments';

const SinglePost = (props) => {
    const { user } = useContext(AuthContext);
    const postId = props.match.params.postId;
    const { data, loading } = useQuery(FETCH_POST_QUERY, { variables: { postId } });

    const goToHomePage = () => {
        props.history.push('/');
    }

    let postMarkup;
    if (loading) {
        postMarkup = <p>Loading post...</p>
    } else {
        if (data) {
            const { id, body, createdAt, username, likeCount, likes, comments, commentCount } = data.getPost;

            postMarkup = (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={2}>
                            <Image
                                floated='right'
                                size='mini'
                                src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>{username}</Card.Header>
                                    <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>
                                        {body}
                                    </Card.Description>
                                </Card.Content>

                                <Card.Content extra>
                                    <LikeButton user={user} post={{ id, likes, likeCount }} />
                                    <Button labelPosition='right' as='div' >
                                        <Button color='blue' basic>
                                            <Icon name='comments' />
                                        </Button>
                                        <Label basic color='blue' pointing='left'>
                                            {commentCount}
                                        </Label>
                                    </Button>

                                    {user && user.username === username && (
                                        <DeleteButton postId={id} callback={goToHomePage} />
                                    )}

                                </Card.Content>
                            </Card>
                            <Comments user={user} comments={comments} postId={id}/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        }
    }
    return postMarkup;
}

const FETCH_POST_QUERY = gql`
    query getPost($postId: ID!){
        getPost(postId: $postId )
    
         {
            id 
            body 
            createdAt 
            username 
            likeCount
            likes {
                username
            }
            commentCount
            comments {
                id username createdAt body
            }
        }
    
    }
`

export default SinglePost;