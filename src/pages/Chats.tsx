import {
  Box,
  Button,
  Grid,
  IconButton,
  List,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ChatItem from "../components/ChatItem";
import { ArrowBackSharp, Send } from "@mui/icons-material";
import Message from "../components/Message";
import { onValue, ref, set } from "firebase/database";
import { auth, realDB } from "../firebase";
import { useEffect, useState } from "react";

import { v4 as uuid } from "uuid";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Chats = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [activeUser, setActiveUser] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [text, setText] = useState<string>("");
  useEffect(() => {
    const usersRef = ref(realDB, "users/");
    if (auth.currentUser?.email) {
      const actualUser = auth.currentUser.email.slice(0, -10);
      onValue(usersRef, snap => {
        setUsers(Object.keys(snap.val()).filter(obj => obj != actualUser));
      });
    }
  }, []);

  const handleChat = (user: any) => {
    if (auth.currentUser?.email) {
      const audio = new Audio("/sms-sound.mp3");
      setActiveUser(user);
      const actualUser = auth.currentUser.email.slice(0, -10);
      const chat = actualUser > user ? actualUser + user : user + actualUser;

      const chatRef = ref(realDB, `chats/${chat}`);
      onValue(chatRef, snap => {
        const data = snap.val();
        if (data) {
          audio.play();
          setMessages(Object.values(data));
        }
      });
    }
  };

  const sendMessage = () => {
    if (auth.currentUser?.email) {
      const actualUser = auth.currentUser.email.slice(0, -10);
      const chat =
        actualUser > activeUser
          ? actualUser + activeUser
          : activeUser + actualUser;

      const chatRef = ref(realDB, `chats/${chat}/${uuid()}`);
      set(chatRef, {
        from: actualUser,
        text,
        date: Date.now(),
      });

      setText("");
    }
  };

  const logOut = () => {
    signOut(auth);
    navigate("/login");
  };
  return (
    <Grid container>
      <Grid item xs={12} sm={4}>
        <List sx={{}}>
          {users.map(user => (
            <ChatItem onClick={() => handleChat(user)} key={user} user={user} />
          ))}
        </List>
        <Button onClick={logOut}>Log out</Button>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Paper
          sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
        >
          {/* Chat header */}
          <Paper sx={{ py: 1, px: 2 }}>
            <Box display="flex" alignItems={"center"} gap={1}>
              <IconButton sx={{ display: { sm: "none" } }} color="primary">
                <ArrowBackSharp />
              </IconButton>
              <Typography>{activeUser}</Typography>
            </Box>
          </Paper>

          <Stack justifyContent={"flex-end"} spacing={2} sx={{ p: 2, flex: 1 }}>
            {messages
              .sort((a: any, b: any) => a.date - b.date)
              .map((message: any, index: number) => (
                <Message
                  key={index}
                  text={message.text}
                  right={auth.currentUser?.email?.slice(0, -10) == message.from}
                />
              ))}
          </Stack>
          <Box display={"flex"} m={2}>
            <TextField
              fullWidth
              label="Message..."
              variant="outlined"
              size="small"
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <IconButton color="primary" onClick={sendMessage}>
              <Send />
            </IconButton>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Chats;
