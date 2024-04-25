import React from 'react';
import WhiteBottomWrapper from '../../components/Wrappers/WhiteBottomWrapper';

import { useHistoryContext } from '../../context/HistoryContextProvider';
import History from './History';
import OpacityWrapper from '../../components/Wrappers/OpacityWrapper';

const HistoryContainer = ({ navigation, route }) => {
    const historyContextData = useHistoryContext();

    const history = historyContextData.data.chatHistory.history;

    const chooseChatFromHistory = (chatId) => {
        historyContextData.setHistoryId(chatId);
        navigation.goBack();
    }

    const deleteChatFromHistory = (chatId) => {
        historyContextData.deleteHistoryItem({ path: 'chatHistory', key: chatId })
    }

    return (
        <WhiteBottomWrapper keyId={'history'} route={route}>
            <OpacityWrapper keyId={'opacityHistory'} >
                <History history={history} chooseChatFromHistory={chooseChatFromHistory} deleteChatFromHistory={deleteChatFromHistory} />
            </OpacityWrapper>
        </WhiteBottomWrapper>
    );
};

export default HistoryContainer;