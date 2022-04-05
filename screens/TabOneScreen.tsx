import { StyleSheet } from 'react-native';

import { RootTabScreenProps } from '../types';
import {
  Box, VStack,
  Input, Button, useToast,
  ScrollView, Divider, Skeleton, Center
} from "native-base";
import React from 'react';
import { load } from 'cheerio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../Provider/MyGlobalContext';
import { UserName } from './UserName';
import { Text, View } from '../components/Themed';

const baseUrl = 'http://60.248.16.74/btftz/';


export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  // const { workId, team, group } = useGlobalContext();
  const { workId, setWorkId, team, setTeam, group, setGroup } = useGlobalContext();

  const toast = useToast();
  const [viewState, setViewState] = React.useState('');
  const [eventValidation, setEventValidation] = React.useState('');
  const [hfDay, setHfDay] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [temp, setTemp] = React.useState(["36.0", "36.1", "36.2", "36.3", "36.4", "36.5"]);
  const [fullTemp, setFullTemp] = React.useState('');
  const [loc, setLoc] = React.useState('HC');
  const [t3, setT3] = React.useState('');
  const [gridData, setGridData] = React.useState<Array<MyPara> | null>([]);
  const [loading, setLoading] = React.useState(false);

  type MyPara = {
    date: string;
    morning: string;
    afternoon: string;
    lunch: string;
    dinner: string;
    location: string;
  }

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
        console.log('nothing...');

        toast.show({
          title: '告警',
          description: '必須填寫工號',
          status: 'warning'
        });

        setLoading(false);
      }
    } catch (e) {
    }
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      console.log('first page is focusing...');
      await getData('workId');
      await getData('team');
      await getData('group');

      await GetUserData();
    });

    return unsubscribe;
  }, [navigation, getData]);

  async function GetUserData() {

    console.log('loading...', workId);

    setGridData([]);

    setLoading(true);

    if (workId === undefined || workId === '' || workId === null) {

      console.log('workId is null: ', workId);



      await getData('workId');
      await getData('team');
      await getData('group');

      toast.show({
        title: '告警',
        description: '必須填寫工號',
        status: 'warning'
      });

      setLoading(false);
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Cookie", `BTUserID=${workId};`);
    myHeaders.append("Pragma", "no-cache");
    myHeaders.append("Cache-Control", "no-cache");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("Accept-Encoding", "gzip, deflate, br");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append("Host", "60.248.16.74");

    fetch(`${baseUrl}daily.aspx?a=2&g=${team}&t=${group}`, {
      method: 'POST',
      headers: myHeaders,
      cache: 'no-cache',
      redirect: 'follow',
      mode: "no-cors",
      credentials: "omit",

    })
      .then(response => response.text())
      .then(result => {
        const $ = load(result);
        setViewState($('input')[0].attribs.value);
        setEventValidation($('input')[1].attribs.value);
        setHfDay($('input')[2].attribs.value);
        setT3($('input')[3].attribs.value);
        setDepartment($('input')[4].attribs.value);
        setUserName($('input')[5].attribs.value);
        GetGridData(result);
      })
      .catch(error => console.log('error', error));
  }

  async function ConfirmLunch() {
    console.log('ConfirmLunch clicked!')
    var myHeaders = new Headers();
    myHeaders.append("Host", "www.ingrasys.com");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Android 12; Mobile; rv:92.0) Gecko/92.0 Firefox/92.0");
    myHeaders.append("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8");
    myHeaders.append("Accept-Language", "en-US,zh-TW;q=0.5");
    myHeaders.append("Accept-Encoding", "gzip, deflate");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Content-Length", "6675");
    myHeaders.append("Connection", "close");
    myHeaders.append("Upgrade-Insecure-Requests", "1");
    myHeaders.append("DNT", "1");
    myHeaders.append("Sec-GPC", "1");
    myHeaders.append("Cookie", `BTUserID=${workId}`);

    var raw = "__EVENTTARGET=&__EVENTARGUMENT=&__LASTFOCUS=" +
      "&__VIEWSTATE=" + encodeURIComponent(viewState) +
      "&__EVENTVALIDATION=" + encodeURIComponent(eventValidation) +
      "&hf_day=" + hfDay +
      "&t3=" + t3 +
      "&t1=" + department +
      "&t2id=" + workId +
      "&t7=" + userName +
      "&xxhf=" +
      "&lckb=" +
      "&t5=" + temp[Math.floor(Math.random() * temp.length)].toString() +
      "&t6=" + temp[Math.floor(Math.random() * temp.length)].toString() +
      "&loc=" + loc +
      "&t51=&t61=" +
      "&ro=0&t4=&Button1=Submit&empwork=&vgt=&flo=";

    fetch(`${baseUrl}daily.aspx?a=2&g=${team}&t=${group}`, {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
      credentials: 'omit',
      mode: 'no-cors',
    })
      .then(response => response.text())
      .then(result => {
        try {
          GetUserData();
        } catch (error) {
          console.log('error', error)
        }
      })
      .catch(error => console.log('error', error));
  }

  function GetGridData(dataText: string) {
    const $ = load(dataText);
    try {
      var gData = $('font').map((index, item) => {
        if (index === 0 || index === 1) {
          return;
        }
        return $(item).text().trim();
      });

      let a: Array<MyPara> = [];

      for (let index = 6; index < gData.length; index += 6) {

        let b: MyPara = {
          date: gData[index + 0],
          morning: gData[index + 1],
          afternoon: gData[index + 2],
          lunch: gData[index + 3],
          dinner: gData[index + 4],
          location: gData[index + 5]
        };

        a.push(b);
      }

      setGridData(a);

      setLoading(false);

    } catch (error) {
      console.log('error', error);
    }
  }


  const GridTable = <VStack
    space={1}
    alignItems="center"
    direction="column"
    style={styles.card}
    _web={{
      shadow: 2,
      borderWidth: 0
    }}
  >
    <Box
    // mb="4"
    >
      <VStack space="4" divider={<Divider />} direction="row">
        <Box mx='1' w='10'>
          <Text>
            日期
          </Text>
        </Box>
        <Box w='8'>
          <Text>
            早上
          </Text>
        </Box>
        <Box w='8'>
          <Text>
            下午
          </Text>
        </Box>
        <Box w='7'>
          <Text >
            午餐
          </Text>
        </Box>
        <Box w='7'>
          <Text >
            晚餐
          </Text>
        </Box>
        <Box mx='1' pb="4" w='8'>
          <Text >
            地點
          </Text>
        </Box>
      </VStack>
    </Box>
    {
      gridData?.map(i => (
        <Box
          key={i.date}
          borderRadius="md">
          <VStack space="4" divider={<Divider />} direction="row">
            <Box mx='1' w='10'><Text>{i.date}</Text></Box>
            <Box w='8'><Text>{i.morning}</Text></Box>
            <Box w='8'><Text>{i.afternoon}</Text></Box>
            <Box w='7'><Text>{i.lunch === 'V' ? '❤️' : ' '}</Text></Box>
            <Box w='7'><Text>{i.dinner === 'V' ? '❤️' : ' '}</Text></Box>
            <Box mx='1' pb="4" w='8'><Text>{i.location}</Text></Box>
          </VStack>
        </Box>
      ))
    }
  </VStack >;

  return (
    <View style={styles.container}>
      {(gridData?.length === 0) ? <Box w="100%" h="460">
        <VStack w="94%" m="auto" my="8" borderWidth="1" space={0} overflow="hidden" rounded="md" _dark={{
          borderColor: "coolGray.500"
        }} _light={{
          borderColor: "coolGray.200"
        }}>
          <Skeleton.Text px="8" py="8" my="6" h="40" />
          <Skeleton px="8" my="8" rounded="md" startColor="primary.100" />
        </VStack>
      </Box> : <Center my="8">
        {UserName(userName)}
        {GridTable}
        <Button
          borderRadius="md"
          py="2"
          mx="1"
          my="4"
          onPress={ConfirmLunch}>
          確認訂餐
        </Button>
      </Center>}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 8,
    marginTop: 16,
    borderColor: 'lightgrey',
  }
});

