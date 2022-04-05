import React from 'react';
import { Text, View } from '../components/Themed';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { BackgroundFetchStatus } from 'expo-background-fetch';
import { Button } from 'native-base';


const BACKGROUND_FETCH_TASK = 'background-fetch-auto-lunch';
// const YOUR_TASK_NAME = 'background-fetch-auto-lunch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const now = Date.now();

    console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);

    // Be sure to return the successful result type!
    return BackgroundFetch.BackgroundFetchResult.NewData;
});

// TaskManager.defineTask(YOUR_TASK_NAME, () => {
//     try {
//         const receivedNewData = "";
//         return receivedNewData ? BackgroundFetch.BackgroundFetchResult.NewData : BackgroundFetch.BackgroundFetchResult.NoData;
//     } catch (error) {
//         return BackgroundFetch.BackgroundFetchResult.Failed;
//     }
// });

// 2. Register the task at some point in your app by providing the same name, and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        // minimumInterval: 60 * 15, // 15 minutes
        minimumInterval: 1, // 15 minutes
        stopOnTerminate: false, // android only,
        startOnBoot: true, // android only
    });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

export default function BackgroundFetchScreen() {
    const [isRegistered, setIsRegistered] = React.useState(false);
    const [status, setStatus] = React.useState<BackgroundFetchStatus | null>(null);

    React.useEffect(() => {
        checkStatusAsync();
    }, []);

    const checkStatusAsync = async () => {
        const status = await BackgroundFetch.getStatusAsync();
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
        console.log('status', status);
        setStatus(status);
        setIsRegistered(isRegistered);
    };

    const toggleFetchTask = async () => {
        if (isRegistered) {
            await unregisterBackgroundFetchAsync();
        } else {
            await registerBackgroundFetchAsync();
        }

        checkStatusAsync();
    };

    return (
        <View >
            <View >
                <Text>
                    Background fetch status:{' '}
                    <Text >
                        {status && BackgroundFetch.BackgroundFetchStatus[status]}
                    </Text>
                </Text>
                <Text>
                    Background fetch task name:{' '}
                    <Text >
                        {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
                    </Text>
                </Text>
            </View>
            <View ></View>
            <Button
                size="lg"
                w="80%"
                m="auto"
                my="8"
                // title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
                onPress={toggleFetchTask}
            >
                {isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
            </Button>
        </View>
    );
}

export function Autolunch() {
    return (
        <Text>lunch</Text>
    )
}
