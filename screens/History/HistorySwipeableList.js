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

const HistorySwipeableList = ({ subtitle, history, chooseFromHistory, deleteFromHistory }) => {

    const renderItemCachedFunc = useCallback(
        ({ item }) => {
            return <ListItem item={item} chooseFromHistory={chooseFromHistory} deleteFromHistory={deleteFromHistory} />
        }, []
    )

    const dataHistoryCached = useMemo(() => {

        return Object.entries(history)
    }, [history])

    return (

        <View style={styles.container}>
            <View style={styles.subTitleContainer}>
                <SubtitleHeading value={subtitle} />
            </View>
            <Animated.FlatList
                itemLayoutAnimation={layoutTransition}
                data={dataHistoryCached}
                style={styles.flatListStyle}
                keyExtractor={item => item[0]}
                renderItem={renderItemCachedFunc}
                ItemSeparatorComponent={() => <DividerStyled />}
            >
            </Animated.FlatList>
        </View>
    );
};

export default HistorySwipeableList;


const ListItem = ({ item, chooseFromHistory, deleteFromHistory }) => {


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
                            deleteFromHistory={() => deleteFromHistory(item[0])}
                        />
                }
            >
                <View style={styles.listItemContainer}>
                    <TouchableOpacity onPress={() => chooseFromHistory(item[0])} >
                        <View style={styles.listItemRow}>
                            <View style={styles.dateTimeContainer}>
                                <Text style={styles.historyDateText}>{timeStampCache.date}</Text>
                                <Text style={styles.historyDateText}>{timeStampCache.time}</Text>
                            </View>
                            <Ionicons name="chevron-forward-outline" size={13} color="gray" />
                        </View>
                        <Text style={styles.historyQuoteText}>{(item[1]).slice(0, 40)}...</Text>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        </Animated.View>
    )
}

const RightSwipeActionsContainer = ({ deleteFromHistory, animatedStyles }) => {
    return (
        <View style={styles.rightSwipeContainer}>
            <TouchableOpacity
                onPress={deleteFromHistory}
                style={[styles.rightSwipeButtonContainer, { backgroundColor: "#ff0000", }]}>
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
    flatListStyle: { width: '100%', backgroundColor: 'transparent', height: '100%' },
    subTitleContainer: { width: '100%', marginBottom: 10 },
    listItemContainer: { paddingHorizontal: 10, paddingVertical: 15, marginBottom: 0, backgroundColor: 'white' },
    listItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 },
    dateTimeContainer: { alignItems: 'flex-end', marginRight: 5, flexDirection: 'row', columnGap: 10 },

    historyDateText: {
        fontSize: 13,
        color: 'gray'
    },
    historyQuoteText: {
        fontSize: 16
    },

    rightSwipeContainer: { alignItems: 'center', justifyContent: 'center' },

    rightSwipeButtonContainer: {
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