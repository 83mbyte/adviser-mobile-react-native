import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SubtitleHeading from '../../components/SubtitleHeading/SubtitleHeading';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import DividerStyled from '../../components/Divider/DividerStyled';

import animationLibrary from '../../lib/animationConfig';

const layoutTransition = animationLibrary.layoutTransition.linear;
const enteringTransition = animationLibrary.Stretch.entering;
const exitingTransition = animationLibrary.Stretch.exiting;

const HistorySwipeableList = ({ history, chooseChatFromHistory, deleteChatFromHistory }) => {

    const renderItemCachedFunc = useCallback(
        ({ item }) => {
            return <ListItem item={item} chooseChatFromHistory={chooseChatFromHistory} deleteChatFromHistory={deleteChatFromHistory} />
        }, []
    )

    const dataHistoryCached = useMemo(() => {

        return Object.entries(history)
    }, [history])

    return (

        <View style={styles.container}>
            <View style={{ width: '100%', marginBottom: 10 }}>
                <SubtitleHeading value={'Your Chats History'} />
            </View>
            <Animated.FlatList
                itemLayoutAnimation={layoutTransition}
                data={dataHistoryCached}
                style={{ width: '100%', backgroundColor: 'transparent', height: '100%' }}
                keyExtractor={item => item[0]}
                renderItem={renderItemCachedFunc}
                ItemSeparatorComponent={() => <DividerStyled />}
            >
            </Animated.FlatList>
        </View>
    );
};

export default HistorySwipeableList;


const ListItem = ({ item, chooseChatFromHistory, deleteChatFromHistory }) => {


    let timeStampCache = useMemo(() => {

        let fullTime = new Date(Number(item[0]))
        return {
            date: fullTime.toDateString(),
            time: (fullTime.toTimeString()).split(' ')[0]
        }
    }, [item[0]]);


    const opacityShared = useSharedValue(0);

    const durationShared = useSharedValue(0);
    const animatedStyles = useAnimatedStyle(() => {
        return {
            opacity: withTiming(opacityShared.value, { duration: durationShared.value }),
        };
    });

    return (

        <Animated.View
            entering={enteringTransition}
            exiting={exitingTransition}
        >
            <Swipeable
                friction={1}
                onSwipeableWillClose={() => {
                    durationShared.value = 0;
                    opacityShared.value = 0;
                }}
                onActivated={() => {
                    durationShared.value = 500;
                    opacityShared.value = 1;
                }}
                overshootRight={false}
                containerStyle={{ overflow: 'hidden', marginVertical: 5 }}
                renderRightActions={
                    () =>
                        <RightSwipeActionsContainer
                            animatedStyles={animatedStyles}
                            deleteChatFromHistory={() => deleteChatFromHistory(item[0])}
                        />
                }
            >
                <View style={{ paddingHorizontal: 10, paddingVertical: 15, marginBottom: 0, backgroundColor: 'white' }}>
                    <TouchableOpacity onPress={() => chooseChatFromHistory(item[0])} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
                            <View style={{ alignItems: 'flex-end', marginRight: 5, flexDirection: 'row', columnGap: 10 }}>
                                <Text style={styles.historyDateText}>{timeStampCache.date}</Text>
                                <Text style={styles.historyDateText}>{timeStampCache.time}</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={13} color="gray" />
                        </View>
                        <Text style={styles.historyQuoteText}>{(item[1][0].user.content).slice(0, 40)}...</Text>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        </Animated.View>
    )
}

const RightSwipeActionsContainer = ({ deleteChatFromHistory, animatedStyles }) => {
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
                onPress={deleteChatFromHistory}
                style={[styles.rightSwipeContainer, { backgroundColor: "#ff0000", }]}>
                <Animated.View style={[styles.rightSwipeButton, animatedStyles]}>
                    <Ionicons name="trash-outline" size={22} color="white" />
                    <Text
                        style={[styles.rightSwipeButtonText, { color: 'white', }]}>
                        Delete
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: { padding: 10, alignItems: 'center', justifyContent: 'center' },

    itemSeparator: {
        flex: 1,
        height: 1,
        backgroundColor: "#fe3a59",
    },

    historyDateText: {
        fontSize: 13,
        color: 'gray'
    },
    historyQuoteText: {
        fontSize: 16
    },

    rightSwipeContainer: {

        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    rightSwipeButton: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 5,
        rowGap: 2
    },
    rightSwipeButtonText: {
        fontSize: 12,
        fontWeight: "600",
    },

})