import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
import Infobar from '../infobar/infobar';
import Input from '../Input/input';
import Messages from '../Messages/messages';
let socket


const Chat = ({location}) => {
     const [name, setName] = useState('');
     const [room, setRoom] = useState('');
     const [message, setMessage] = useState('');
     const [messages, setMessages] = useState([]);
     const ENDPOINT = 'https://dreygroupchat.herokuapp.com/';

     useEffect (() => {

          const { name, room } = queryString.parse(location.search);

        socket =  io.connect(ENDPOINT, { transports: ['websocket'] })

          setName(name);
          setRoom(room);
          socket.emit('join', {name, room})

          return () =>{
               socket.emit('disconnected');

               socket.off();
          }
     }, [ENDPOINT, location.search]);

     useEffect(() => {
          socket.on('message', (message) => {
               setMessages([...messages, message])
          })
     }, [messages]);
     
     const sendMessage = (event) => {
          event.preventDefault();
          if(message) {
               socket.emit('sendMessage', message, () => setMessage(''))
          }
     }
          console.log(message, messages)
    return ( 
      <div className="outerContainer">
      <div className="container">
           <Infobar room={room} />    
           <Messages messages={messages} name={name}/>
      <Input  sendMessage={sendMessage} setMessage={setMessage} message={message} />
     </div>
  </div>
     );
  
}


export default Chat;