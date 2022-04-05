import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>重要聲明</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.text}>主要作为非盈利及教育学习爲目的，如有違背公司規定，將會立即下架。</Text>
      <StatusBar
        style={Platform.OS === 'ios' ? 'light' : 'auto'}
      />
    </View>
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
  text: {
    marginHorizontal: 30,
    fontSize: 16
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
