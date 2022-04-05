import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MyGlobalContext } from './Provider/MyGlobalContext';
import { NativeBaseProvider } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import React from 'react';



export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [workId, setWorkId] = useState<string>('');
  const [team, setTeam] = useState<string>('');
  const [group, setGroup] = useState<string>('');



  React.useEffect(() => {
    async function getData(key: string) {
      try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
          switch (key) {
            case 'workId':
              setWorkId(value);
              break;
            case 'team':
              setTeam(value);
              break;
            case 'group':
              setGroup(value);
              break;

            default:
              break;
          }

        } else {
          // console.log('nothing...');
        }
      } catch (e) {
      }
    }

    getData('workId');
    getData('team');
    getData('group');
  }, []);


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NativeBaseProvider>
        <MyGlobalContext.Provider value={{ workId, setWorkId, team, setTeam, group, setGroup }}>

          <SafeAreaProvider>
            <Navigation
              colorScheme={colorScheme}
            // colorScheme='dark'
            />
            <StatusBar />
          </SafeAreaProvider>

        </MyGlobalContext.Provider>
      </NativeBaseProvider>
    );
  }
}
