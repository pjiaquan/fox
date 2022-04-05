import { StyleSheet, Switch, useColorScheme } from 'react-native';
import { Text } from './Themed';
import { Input, Button, Modal, FormControl, Box, Pressable, useToast, HStack, VStack, Center } from 'native-base';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Autolunch } from '../background_tasks/Autolunch';

export function EditProfile({ ...props }) {
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();
  const colorScheme = useColorScheme();

  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
    }
  }

  // React.useEffect(() => {
  // }, []);

  const getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        switch (key) {
          case 'workId':
            props.setWorkId(value);
            break;
          case 'team':
            props.setTeam(value);
            break;
          case 'group':
            props.setGroup(value);
            break;

          default:
            break;
        }

      } else {
      }
    } catch (e) {
    }
  }

  function HandlerInput(id: string): void {
    switch (props.title) {
      case 'workId':
        if (id.length === 1 && (id.charAt(0) === 'i' || id.charAt(0) === 'I')) {
          props.setWorkId('IGA1-');
          return;
        }
        storeData(props.title, id.toUpperCase());
        props.setWorkId(id.toUpperCase());
        break;
      case 'team':
        storeData(props.title, id.toUpperCase());
        props.setTeam(id.toString());
        break;
      case 'group':
        storeData(props.title, id.toUpperCase());
        props.setGroup(id);
        break;
      default:
        console.log('error!');
    }

  }

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  function renderSwitch(param: string) {
    try {
      getData(param);
    } catch (error) {
      console.log('error: ', error)
    }


    switch (param) {
      case 'workId':
        return (
          <Pressable onPress={() => setShowModal(true)} pb='0'>
            <Text style={[styles.title, themeTextStyle]}>工號</Text>
            <Text style={[styles.text, themeTextStyle]}>{props.workId}</Text>
          </Pressable>
        );
      case 'team':
        return (
          <Pressable onPress={() => setShowModal(true)} pb='0'>
            <Text style={[styles.title, themeTextStyle]}>隊碼</Text>
            <Text style={[styles.text, themeTextStyle]}>{props.team}</Text>
          </Pressable>
        );
      case 'group':
        return (
          <Pressable onPress={() => setShowModal(true)} pb='0'>
            <Text style={[styles.title, themeTextStyle]}>組別</Text>
            <Text style={[styles.text, themeTextStyle]}>{props.group}</Text>
          </Pressable>
        );
      case 'lunchAuto':
        return (
          <Pressable onPress={showTimepicker} pb='0'>
            <HStack justifyContent="space-between" >

              <VStack>
                <Text style={[styles.title, themeTextStyle]}>午餐自動訂餐時間</Text>
                <Text style={[styles.text, themeTextStyle]}>{date.toTimeString()}</Text>
                <Autolunch />
                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                  />
                )}
              </VStack>

              <Center>
                <Switch

                // defaultIsChecked colorScheme="primary"
                // style={{ borderColor: 'red' }}
                // offTrackColor="orange.100" onTrackColor="orange.200" onThumbColor="orange.500" offThumbColor="orange.50"

                />
              </Center>

            </HStack>
          </Pressable>
        );
      default:
        return <Text></Text>;
    }
  }

  function renderHeader(param: string) {
    switch (param) {
      case 'workId':
        return <Modal.Header>工號修改</Modal.Header>
      case 'team':
        return <Modal.Header>隊碼修改</Modal.Header>
      case 'group':
        return <Modal.Header>組別修改</Modal.Header>
      default:
        return <Text></Text>;
    }
  }

  function renderInput(param: string) {
    switch (param) {
      case 'workId':
        return <Input value={props.workId} onChangeText={id => HandlerInput(id)} />
      case 'team':
        return <Input value={props.team} onChangeText={id => HandlerInput(id)} />
      case 'group':
        return <Input value={props.group} onChangeText={id => HandlerInput(id)} />
      default:
        return <Text></Text>;
    }
  }

  return <Box mx="8">
    {renderSwitch(props.title)}

    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        {renderHeader(props.title)}
        <Modal.Body>
          <FormControl>
            {renderInput(props.title)}
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={0}>
            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setShowModal(false);
            }}>
              取消
            </Button>
            <Button onPress={() => {
              setShowModal(false);
              toast.show({
                description: '修改成功!',
                status: 'success',
                duration: 1000
              })
            }}>
              儲存
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  </Box >;
}


const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  lightContainer: {
    backgroundColor: '#d0d0c0',
  },
  darkContainer: {
    backgroundColor: '#242c40',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  },
});



