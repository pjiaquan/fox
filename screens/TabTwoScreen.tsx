import { StyleSheet } from 'react-native';
import { useGlobalContext } from '../Provider/MyGlobalContext';
import { VStack, Divider, Center, Heading, ScrollView } from 'native-base';
import React from 'react';
import { EditProfile } from '../components/EditProfile';
import { useColorScheme } from 'react-native';
import { Text, View } from '../components/Themed';
import BackgroundFetchScreen from '../background_tasks/Autolunch';


export default function TabTwoScreen() {
  const { workId, setWorkId, team, setTeam, group, setGroup } = useGlobalContext();
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;

  return (
    // <ScrollView style={[styles.container, themeContainerStyle]}>
    <ScrollView >
      <View>
        <VStack space={3} divider={<Divider thickness="1" mx="auto" w="95%" />} >
          <Center mt='4'><Heading style={[styles.title, themeTextStyle]}>個人信息</Heading></Center>
          <EditProfile title="workId" workId={workId} setWorkId={setWorkId}></EditProfile>
          <EditProfile title="team" team={team} setTeam={setTeam}></EditProfile>
          <EditProfile title="group" group={group} setGroup={setGroup}></EditProfile>
          <EditProfile title="lunchAuto"></EditProfile>
          {/* <EditProfile title="" group={group} setGroup={setGroup}></EditProfile> */}

          <Text></Text>
          <BackgroundFetchScreen></BackgroundFetchScreen>
        </VStack >
      </View >
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  separator: {
    // marginVertical: 30,
    // height: 1,
    height: 1,
    margin: 'auto',
    width: '80%',
  },
  lightContainer: {
    // backgroundColor: '#d0d0c0',
    // backgroundColor: '#F8F8FF',
  },
  darkContainer: {
    backgroundColor: '#242c40',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
    // color: '#000',
  },
});
