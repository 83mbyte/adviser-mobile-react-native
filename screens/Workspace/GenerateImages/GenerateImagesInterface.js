import React, { useRef, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import DividerStyled from '../../../components/Divider/DividerStyled';
import FooterInteractionContainer from '../../../components/FooterInteraction/FooterInteractionContainer';
import animationLibrary from '../../../lib/animationConfig';
import ImageActionButton from '../../../components/Buttons/ImageActionButton';
import ImagesHeaderRightButtons from '../../../components/Buttons/ImagesHeaderRightButtons';


const layoutTransition = animationLibrary.layoutTransition.linear;
const enterTransition = animationLibrary.Stretch.entering;
const exitTransition = animationLibrary.Stretch.exiting;


const GenerateImagesInterface = ({ navigation, data, historyIndexes, zoomButtonPress, downloadButtonPress, deleteButtonPress, startNewButtonPress, submitImagesForm, settingsButtonPress, historyButtonPress, isLoading, micButtonPress }) => {
    const scrollRef = useRef(null);

    const renderItemCachedFunc = useCallback(
        (data) => {

            return <ImageCard item={data.item} zoomButtonPress={zoomButtonPress} deleteButtonPress={deleteButtonPress} downloadButtonPress={downloadButtonPress} key={data.item.id} />
        }, [data]
    )

    useEffect(() => {
        navigation.setOptions({
            headerRight:
                () => {
                    return <ImagesHeaderRightButtons
                        color={'#FFF'}
                        onPressStartNew={() => startNewButtonPress(true)}
                        isHistory={historyIndexes && Object.keys(historyIndexes).length > 0}
                        onSettingsButtonPress={() => settingsButtonPress()}
                        onHistoryButtonPress={() => historyButtonPress()}
                    />
                }

        })
    }, [navigation])

    return (
        <>
            <Animated.View style={styles.cardBody} layout={LinearTransition}>

                <Animated.FlatList
                    showsVerticalScrollIndicator={false}
                    scrollsToTop={true}
                    ref={(it) => (scrollRef.current = it)}
                    onContentSizeChange={() =>
                        scrollRef.current?.scrollToEnd({ animated: true })
                    }
                    itemLayoutAnimation={layoutTransition}
                    data={data}
                    style={styles.flatListStyle}
                    keyExtractor={item => item.id}
                    renderItem={renderItemCachedFunc}
                    ItemSeparatorComponent={() => <DividerStyled />}
                >
                </Animated.FlatList>

            </Animated.View >
            <FooterInteractionContainer icon='brush' screenName='Generate Images' callback={submitImagesForm} isLoading={isLoading} micButtonPress={micButtonPress} />
        </>
    );
};

export default GenerateImagesInterface;


const ImageCard = ({ item, zoomButtonPress, downloadButtonPress, deleteButtonPress }) => {
    const [noImage, setNoImage] = useState(false);
    return (
        <Animated.View
            entering={enterTransition}
            exiting={exitTransition}
            style={styles.imageResultContainer}
            key={item.id}
        >

            <Text style={styles.imageTitle}>"{item.title.slice(0, 55)} ..."</Text>
            <View style={styles.imageView}>
                {
                    (item.source && !noImage)
                        ? <Image
                            resizeMode={'contain'}
                            style={styles.imageStyle}
                            src={item.source}
                            onError={() => setNoImage(true)}
                        />
                        : <View style={styles.noImage}>
                        </View>
                }
            </View>

            <View style={styles.buttonsWrapp}>
                <ImageActionButton icon={'download'} callback={() => downloadButtonPress(item.source, item.mime)} />
                <ImageActionButton icon={'zoom-plus'} callback={() => zoomButtonPress(item.source, item.size)} />
                <ImageActionButton icon={'trash'} callback={() => deleteButtonPress(item.source)} />
            </View>
        </Animated.View>
    )
}



const styles = StyleSheet.create({
    cardBody: {
        paddingHorizontal: 15,
        flex: 1,
    },
    flatListStyle: { width: '100%', backgroundColor: 'transparent', height: '100%' },

    imageResultContainer: {
        paddingHorizontal: 10,
        paddingTop: 25,
        paddingBottom: 10,
        backgroundColor: 'white',
        marginVertical: 20,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderTopWidth: 0,
        minHeight: 300,
        borderColor: 'lightgray',
        borderRadius: 35,
        flexDirection: 'column',
        zIndex: 9999,
    },
    imageTitle: { backgroundColor: 'transparent', textAlign: 'center', paddingTop: 2, paddingBottom: 15, paddingHorizontal: 3, color: 'gray', fontStyle: 'italic' },

    imageView: {
        minHeight: 240,
        // flex: 1
    },
    imageStyle: { flex: 1, borderColor: 'red', borderWidth: 0, padding: 0 },
    noImage: { backgroundColor: 'lightgray', flex: 1 },
    buttonsWrapp: {
        flexDirection: 'row', columnGap: 20, alignItems: 'center', justifyContent: 'space-around', marginTop: 5
    },
})


