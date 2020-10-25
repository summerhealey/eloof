import axios from "axios";
import React, { useEffect, useState } from "react";
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import {
  Card,
  Container,
  Grid,
  Header,
  Image,
  Button,
  Form,
  Segment,
} from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import { LOADING, UNSET_USER } from "../store/actions";
import { useStoreContext } from "../store/store";
//import { listIndexes } from '../../../database/models/user';

const Profile = () => {
  const [state, dispatch] = useStoreContext();
  const history = useHistory();

  const [publicList, setPublicList] = useState([]);
  const [kidsList, setKidsList] = useState([]);
  const [pageState, setPageState] = useState("elf");
  const [search, setSearch] = useState({
    username: ''
  });
  const [wishList, setToWishList] = useState([]);
  const [userData, setUserData] = useState([]);

  /*
  useEffect(() => {
    dispatch({ type: LOADING });
    axios.get('/api/users').then((response) => {
      if (response.data.user) {
        dispatch({ type: SET_USER, user: response.data.user });
        history.push('/');
      } else {
        dispatch({ type: UNSET_USER });
        //history.push('/login');
      }
    });
  }, [dispatch, history]);
  */
  const logout = (event) => {
    event.preventDefault();

    dispatch({ type: LOADING });

    axios
      .post("/api/users/logout")
      .then((response) => {
        if (response.status === 200) {
          dispatch({ type: UNSET_USER });
          history.replace("/");
        }
      })
      .catch((error) => {
        console.log("Logout error");
      });
  };

  const handleSubmit = () => {
    setPageState("elf");
    axios
      .get("/api/users/all")
      .then((response) => {
        setPublicList(response.data.filter(user => user.usertype === 'believer' && user.username === search.username));
      })
      .catch((error) => {
        console.log("submit error: ", error);
      })

  };

  const getPublic = () => {
    //alert("Pressed Public");
    setPageState("elf");
    axios
      .get("/api/users/all")
      .then((response) => {
        if(response.status === 200) {
          setPublicList(response.data.filter(user => user.usertype === 'believer'));
          //setPublicList(response.data);
          console.log("profile.js success");
          console.log("response",response);
        }
      })
      .catch((error) => {
        console.log("profile.js error");
      });
  };
  const handleProfile = (index) => {
    console.log("index = ", index);
    console.log("publicList[" + index + "] = ", publicList[index]);

    setPageState("kids")
    setKidsList(...publicList[index].wishlist)
    console.log("kidslist = ", kidsList);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearch({ ...search, [name]: value });

  }
  //{publicList.length > 0 ? (<p>{res.username}</p>) : (<p>Empty</p>)}
  
  useEffect(() => {
    setUserData(state.user);
    axios
      .get("/api/gifts/" + state.user._id)
      .then((res) => {
        console.log("setting wish list");
        setToWishList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [state.user]);
  return (
    <div>
      <Navigation />
      <div>
      <Container text>
      <div>
      <Segment fluid inverted style={{ minHeight: '200'}}>
        <Header as='h2' icon textAlign='center'>
        <p style={{marginBottom: '1em'}}>
        <Image
          centered
          circular
          size='small'
          src='./images/christmas.png'
          style={{ marginTop: '1.5em', marginBottom: '2em'}}
        />
        </p>
        <Header.Content>Happy Holidays {state.user.childName}. You're an {state.user.usertype}!</Header.Content>
        </Header>
        </Segment>
      </div>
      {state.user.usertype === "elf" ? (
        <div>
          <Grid.Row>
            <Grid.Column width={4} centered>
              <Form>
                <Form.Field>
                  <label>Child's Name</label>
                  <input 
                    placeholder='Name'
                    onChange={handleChange}
                    name='username'
                    value={search.name}
                  />
                </Form.Field>
                <Button onClick={handleSubmit}>Submit</Button>
                <Button onClick={getPublic}>Or View Public Listings</Button>
              </Form>
            </Grid.Column>
          </Grid.Row>
          {pageState === 'elf' ? (
            <Card.Group style={{ marginTop: '2em' }} itemsPerRow={3}>
              {publicList.map((res,index) => (
                <Card>
                  <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                    <Card.Content>
                      <Card.Description>
                        {publicList.length > 0 ? (<Button onClick={() => handleProfile(index)}>{res.username}</Button>) : (<p>Empty</p>)}
                      </Card.Description>
                    </Card.Content>
                  </Card>
              ))}
            </Card.Group>
        ) : (
          <Button onClick={() => setPageState("elf")}>return</Button>
        )}
        </div>
        ) : (
          <div>
          <Grid columns={3} widths='equal'>
            <Grid.Row textAlign='center' style={{ marginTop: '1em', marginBottom: '2em'}}>
              <Grid.Column>
              {userData.childAge} years old
              </Grid.Column> 
              <Grid.Column>
                |       {userData.childLocation}       | </Grid.Column> 
              <Grid.Column>
                Status: Naughty
              </Grid.Column>
            </Grid.Row>
          </Grid>
            <Container textAlign="center">
              <Segment vertical style={{ minHeight: 500, padding: '1em 0em' }}>
              <Card.Header as="h2">My Wish List</Card.Header>
              <Card.Group style={{ marginTop: "2em" }} itemsPerRow={3}>
                {wishList.map((wishList) => (
                  <Card key={wishList.name}>
                    <Image src={wishList.picture} wrapped ui={false} />
                    <Card.Content>
                      <Card.Header as="h2">{wishList.name}</Card.Header>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Group>
              </Segment>
            </Container>
          </div>
        )}
        </Container>
      </div>
      <Footer />
    </div>
  );
};
export default Profile;
