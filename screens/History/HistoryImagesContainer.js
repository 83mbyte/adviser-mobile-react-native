import React from 'react';
import WhiteBottomWrapper from '../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../components/Wrappers/OpacityWrapper';
import HistorySwipeableList from './HistorySwipeableList';
import { useHistoryContext } from '../../context/HistoryContextProvider';

const HistoryImagesContainer = ({ navigation, route }) => {
    const historyContextData = useHistoryContext();
    const history = historyContextData.data.imagesHistory.historyIndexes;

    const chooseFromHistory = (id) => {
        historyContextData.setImagesHistoryId(id);
        navigation.goBack();
    }
    const deleteFromHistory = (historyId) => {
        historyContextData.deleteImagesHistoryItem(historyId);
    }
    return (



        <WhiteBottomWrapper keyId={'historyImages'} route={route}>
            <OpacityWrapper keyId={'opacityHistoryImages'} >
                <HistorySwipeableList history={history} subtitle={'Images History'} chooseFromHistory={chooseFromHistory} deleteFromHistory={deleteFromHistory} />

            </OpacityWrapper>
        </WhiteBottomWrapper>
    );
};

export default HistoryImagesContainer;