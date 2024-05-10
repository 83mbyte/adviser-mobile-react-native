import React from 'react';
import WhiteBottomWrapper from '../../components/Wrappers/WhiteBottomWrapper';

import { useHistoryContext } from '../../context/HistoryContextProvider';

import OpacityWrapper from '../../components/Wrappers/OpacityWrapper';
import HistorySwipeableList from './HistorySwipeableList';

const HistoryContainer = ({ navigation, route }) => {
    const historyContextData = useHistoryContext();

    const history = historyContextData.data.chatHistory.history;

    const chooseChatFromHistory = (chatId) => {
        historyContextData.setHistoryId({ path: 'chatHistory', key: chatId });
        navigation.goBack();
    }

    const deleteChatFromHistory = (chatId) => {
        historyContextData.deleteHistoryItem({ path: 'chatHistory', key: chatId })
    }

    return (
        <WhiteBottomWrapper keyId={'history'} route={route}>
            <OpacityWrapper keyId={'opacityHistory'} >
                <HistorySwipeableList history={history} chooseChatFromHistory={chooseChatFromHistory} deleteChatFromHistory={deleteChatFromHistory} />
            </OpacityWrapper>
        </WhiteBottomWrapper>
    );
};

export default HistoryContainer;