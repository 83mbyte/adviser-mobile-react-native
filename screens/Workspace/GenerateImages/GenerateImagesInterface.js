import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated from 'react-native-reanimated';

import DividerStyled from '../../../components/Divider/DividerStyled';
import FooterInteractionContainer from '../../../components/FooterInteraction/FooterInteractionContainer';
import animationLibrary from '../../../lib/animationConfig';
import ImageActionButton from '../../../components/Buttons/ImageActionButton';


const layoutTransition = animationLibrary.layoutTransition.linear;
const enterTransition = animationLibrary.Stretch.entering;
const exitTransition = animationLibrary.Stretch.exiting;

const GenerateImagesInterface = ({ data, zoomButtonPress, downloadButtonPress, deleteButtonPress }) => {
    const scrollRef = useRef(null);


    const renderItemCachedFunc = useCallback(
        (data) => {

            return <ImageCard item={data.item} zoomButtonPress={zoomButtonPress} deleteButtonPress={deleteButtonPress} downloadButtonPress={downloadButtonPress} key={data.item.id} />
        }, [data]
    )


    return (
        <>
            <View style={styles.cardBody}>

                <Animated.FlatList
                    showsVerticalScrollIndicator={false}
                    scrollsToTop={true}
                    ref={(it) => (scrollRef.current = it)}
                    // onContentSizeChange={() =>
                    //     scrollRef.current?.scrollToEnd({ animated: true })
                    // }
                    itemLayoutAnimation={layoutTransition}
                    data={data}
                    style={styles.flatListStyle}
                    keyExtractor={item => item.id}
                    renderItem={renderItemCachedFunc}
                    ItemSeparatorComponent={() => <DividerStyled />}
                >
                </Animated.FlatList>
            </View >
            < FooterInteractionContainer icon='brush' />
        </>
    );
};

export default GenerateImagesInterface;


const ImageCard = ({ item, zoomButtonPress, downloadButtonPress, deleteButtonPress }) => {

    return (
        <Animated.View
            entering={enterTransition}
            exiting={exitTransition}
            style={styles.imageContainer}
            key={item.id}
        >
            <Image
                resizeMode={'contain'}
                style={styles.imageStyle}
                src={item.source}
            />
            <View style={styles.buttonsWrapp}>
                <ImageActionButton icon={'download'} callback={() => downloadButtonPress(item.source)} />
                <ImageActionButton icon={'zoom-plus'} size={28} callback={() => zoomButtonPress(item.source)} />
                <ImageActionButton icon={'trash'} callback={() => deleteButtonPress(item.source)} />
            </View>

        </Animated.View>
    )
}




const styles = StyleSheet.create({
    cardBody: {
        paddingHorizontal: 10,
        flex: 1,
    },
    flatListStyle: { width: '100%', backgroundColor: 'transparent', height: '100%' },

    imageContainer: {
        paddingHorizontal: 10,
        paddingTop: 25,
        paddingBottom: 10,
        backgroundColor: 'white',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: '35%',
        minHeight: 300,
        flexDirection: 'column',
        flex: 1, zIndex: 9999,
    },
    imageStyle: { flex: 1, borderColor: 'red', borderWidth: 0, padding: 0 },
    buttonsWrapp: {
        flexDirection: 'row', columnGap: 20, alignItems: 'center', justifyContent: 'space-around', marginTop: 5
    },
})


