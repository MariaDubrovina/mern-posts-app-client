import { Button, Card, Image, Icon, Label } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { useContext, useState } from 'react';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import EditForm from './EditForm';

const PostCard = ({ post: { id, body, createdAt, username, likeCount, commentCount, likes } }) => {
  const { user } = useContext(AuthContext);
  let [editMode, setEditMode] = useState(false);

  const goToEditMode = () => setEditMode(true);
  const closeEditMode = () => setEditMode(false);

  return (
    <>
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`} >{moment(createdAt).fromNow()}</Card.Meta>
        <Card.Description>
          
        {editMode ? 
        <EditForm body={body} closeEditMode={closeEditMode} postId={id}/> :
        <PostBody body={body} goToEditMode={goToEditMode} user={user} username={username} />
        }
        
        </Card.Description>
      </Card.Content>

      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Button labelPosition='right' as={Link} to={`/posts/${id}`} >
          <Button color='blue' basic>
            <Icon name='comments' />
          </Button>
          <Label basic color='blue' pointing='left'>
            {commentCount}
          </Label>
        </Button>

        {user && user.username === username && (
          <DeleteButton postId={id} />
        )}

      </Card.Content>
    </Card>
    </>
  )
}

const PostBody = ({body, goToEditMode, user, username}) => {
  return (
    <>
      {body}
      {user && user.username === username && (
      <Button onClick={goToEditMode} style={{ border: 0, outline: 0, background: '#FFFFFF'}} >
          <Icon name='edit' color='blue' style={{ margin: 0}} />
      </Button>
       )}
    </>
  )
}

export default PostCard;