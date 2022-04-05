// import { Box, VStack, Center } from "native-base";
import React from 'react';
import { View, Text } from '../components/Themed';
// import { View, Text } from "../components/Themed";

export function UserName(name: string) {
  return <View>
    <Text>{name}</Text>
  </View >
}
