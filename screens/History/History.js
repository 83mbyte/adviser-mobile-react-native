import React from 'react';
import { FlatList, Pressable, View, Text } from 'react-native';
import SubtitleHeading from '../../components/SubtitleHeading/SubtitleHeading';
import { MotiView } from 'moti';
import DeleteButton from '../../components/Buttons/DeleteButton';


const History = ({ history, chooseChatFromHistory, deleteChatFromHistory }) => {

    const renderItems = (historyObject) => {

        return Object.keys(historyObject).map((item, index) => {

            return (
                <MotiView
                    style={{ borderRadius: 0, paddingHorizontal: 10, marginBottom: 30, flexDirection: 'row', flex: 1, justifyContent: 'space-between' }}
                    key={`${item}_${index}`}
                    from={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 700 * (index + 1), duration: 1500 }}
                >
                    <View>
                        <Pressable onPress={() => chooseChatFromHistory(item)}>
                            <Text style={{}}>{(historyObject[item][0].user.content).slice(0, 30)}...</Text>
                        </Pressable>
                    </View>
                    <View>
                        <DeleteButton size={16} color='red' onPress={() => deleteChatFromHistory(item)} />
                    </View>

                </MotiView>
            )
        })
    }

    return (
        <View style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ width: '100%', marginBottom: 10 }}>
                <SubtitleHeading value={'Your Chats History'} />
            </View>
            <FlatList
                data={[history]}
                style={{ width: '100%' }}
                renderItem={({ item }) => renderItems(item)}
            >
            </FlatList>
        </View>
    );
};

export default History;