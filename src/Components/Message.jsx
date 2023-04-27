import { Avatar, HStack } from '@chakra-ui/react'
import React from 'react'

const Message = ({text, uri, user = "other"}) => {
  return (
    <HStack alignSelf={user === "me" ? "flex-end" : "flex-start"} borderRadius={"base"} bg="gray.100" paddingY={"2"} paddingX={user === "me" ? "4" : "2"}>
        <text is="webview">{text}</text>
        <Avatar src={uri} />
    </HStack>
  )
}

export default Message