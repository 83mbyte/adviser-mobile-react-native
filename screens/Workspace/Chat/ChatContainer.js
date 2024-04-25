import React, { } from 'react';
import ChatInterface from './ChatInterface';
import WhiteBottomWrapper from '../../../components/Wrappers/WhiteBottomWrapper';
import OpacityWrapper from '../../../components/Wrappers/OpacityWrapper';

const ChatContainer = ({ navigation, route }) => {

    return (

        <WhiteBottomWrapper keyId={'cardChat'} route={route}>
            <OpacityWrapper keyId={'opacityChat'}>
                <ChatInterface navigation={navigation} />
            </OpacityWrapper>

        </WhiteBottomWrapper>
    );
};

export default ChatContainer;
