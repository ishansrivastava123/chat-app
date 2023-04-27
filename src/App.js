import { Box, Container, Button, VStack, HStack, Input } from '@chakra-ui/react';
import Message from './Components/Message';
import {onAuthStateChanged, getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import {app} from './firebase';
import { useEffect, useRef, useState } from 'react';
import {getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy} from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
}

const logoutHandler = () => signOut(auth);


function App() {
  
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const divForScroll = useRef(null);
  
  const submitHandler = async(e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setMessage("");

      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });

      divForScroll.current?.scrollIntoView({ behavior: 'smooth' });
      // onClick={() => refs.current[0]?.scrollIntoView({ block: 'start', behavior: 'smooth' })}
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));

    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    })

    const unsubscribeForMessages = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeForMessages();
    };
  }, [])
  

  return (
    <Box bg={"red.200"}>
      {
        user ? (
          <Container h={"100vh"} bg={"white"}>
            <VStack h={'full'} paddingY={"4"}>
              <Button w={'full'} colorScheme={'red'} onClick={logoutHandler}>Logout</Button>
              <VStack w={'full'} h={'full'} overflowY={"auto"} css={{"&::-webkit-scrollbar": {display: "none"}}}>
                {messages.map((item) => (
                  <Message
                    key={item.id}
                    user={item.uid === user.uid ? "me" : "other"}
                    text={item.text}
                    uri={item.uri}
                  />
                ))}

                <div ref={divForScroll}></div>
              </VStack>

              <form onSubmit={submitHandler} style={{width: "100%"}}>
                <HStack>
                  <Input placeholder='Enter a Message...' value={message} onChange={(e) => setMessage(e.target.value)} />
                  <Button colorScheme={'purple'} type='submit'>
                    Send
                  </Button>
                </HStack>
              </form>
            </VStack>
          </Container>
        ) : (
          <VStack bg="white" h={"100vh"} justifyContent={"center"}>
            <Button colorScheme={"purple"} onClick={loginHandler}>
              Sign in with Google
            </Button>
          </VStack>
        )}
    </Box>
  );
}

export default App;
