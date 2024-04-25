import React from 'react';
import { View } from 'react-native';
import SubtitleHeading from '../SubtitleHeading/SubtitleHeading';

const SectionInnerBlock = ({ subtitle, children }) => {

    return (
        <View style={{ marginBottom: 15 }}>

            {
                (subtitle && subtitle.length > 0) && <SubtitleHeading value={subtitle} />
            }
            {children}
        </View>
    )
}

export default SectionInnerBlock;