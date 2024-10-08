import React from 'react';
import WhiteBottomWrapper from '../../components/Wrappers/WhiteBottomWrapper';

import { useHistoryContext } from '../../context/HistoryContextProvider';

import OpacityWrapper from '../../components/Wrappers/OpacityWrapper';
import HistorySwipeableList from './HistorySwipeableList';
import { fsAPI } from '../../lib/fsAPI';

const HistoryContainer = ({ navigation, route }) => {
    const historyContextData = useHistoryContext();

    const history = historyContextData.data.chatHistory.historyIndexes;

    const chooseChatFromHistory = (chatId) => {
        historyContextData.setChatHistoryId(chatId);
        navigation.goBack();
    }

    const deleteChatFromHistory = async (chatId) => {
        await fsAPI.deleteFilesFromAppStorage(chatId);
        historyContextData.deleteChatHistoryItem(chatId);
    }

    return (
        <WhiteBottomWrapper keyId={'history'} route={route}>
            <OpacityWrapper keyId={'opacityHistory'} >
                <HistorySwipeableList history={history} chooseFromHistory={chooseChatFromHistory} deleteFromHistory={deleteChatFromHistory}
                    subtitle={'Your Chats History'}
                />
            </OpacityWrapper>
        </WhiteBottomWrapper>
    );
};

export default HistoryContainer;