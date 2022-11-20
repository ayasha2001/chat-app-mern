import React from 'react';
import { useEffect, useState } from "react";
import { ChatState } from './Context/ChatProvider'
import { Box, Text  } from '@chakra-ui/react'
import { getSender } from '../config/chatLogic'
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import axios from 'axios';
import ScrollableChat from "./ScrollableChat"
import './styles.css'

const SingleChats = ({fetchAgain, setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const{ user , selectedChat , setSelectedChat} = ChatState()
    const toast = useToast();

    
    const fetchMessages = async () => {
      
      if (!selectedChat) return;
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        setLoading(true);
  
        const { data } = await axios.get(
          `/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
        setLoading(false);
        console.log("chla fetchmessage chla")
        console.log(data)
  
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
          try {
            // const config = {
            //   headers: {
            //     "Content-type": "application/json",
            //     Authorization: `Bearer ${user.token}`,
            //   },
            // };
            // setNewMessage("");
            // const { data } = await axios.post(
            //   "/api/message",
            //   {
            //     content: newMessage,
            //     chatId: selectedChat,
            //   },
            //   config
            
            // );
            const options = {
                method: "POST",
                headers: {
                    'content-type': "application/json"  ,
                     Authorization: `Bearer ${user.token}`,
                    },
                body:JSON.stringify({
                  content: newMessage,
                  chatId: selectedChat,
                })
                
              };
            const { data } = fetch('/message', options)
            .then((res)=>{
              console.log(res)
            })
            .catch(()=>
            {
              console.log("Error")
            })
            console.log(data)
            console.log("i am data")
          
            setMessages([...messages, data]);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to send the Message",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
          }
        }
      };
      const typingHandler= async (event)=>{
        setNewMessage(event.target.value)
      }
    
      useEffect(() => {
        fetchMessages();
      }, [selectedChat]);


    
  return ( 
  <>
  {selectedChat?(
    <>
        <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat?(
                <>
                  hi
                </>
            ):(
                <>
                {selectedChat.chatName.toUpperCase()}
                </>
            )}


          </Text>
          <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
          {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              // <div className="messages">
              //   {/* <ScrollableChat messages={messages} /> */}
              // </div>
              <></>
              
            )}
          
          </Box>

    </>
  ):(
    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
       start chat
    </Text>
  </Box>
  )}

  </>
 )
}

export default SingleChats;