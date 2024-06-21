//
// api to work with APP file system
//

import * as FileSystem from 'expo-file-system';

const USER_FOLDER = FileSystem.documentDirectory + process.env.EXPO_PUBLIC_APP_USER_FOLDER;
const USER_FOLDER_FILES = USER_FOLDER + 'files/';


export const fsAPI = {
    moveAttachmentsFromCache: async (attachmentsArray, historyId) => {

        const attachFolder = USER_FOLDER_FILES + historyId;

        let dirInfo = await FileSystem.getInfoAsync(attachFolder);

        //if no attachFolder =>  it will create empty
        if (!dirInfo.exists) {
            console.log("directory doesn't exist, creating…");
            await FileSystem.makeDirectoryAsync(attachFolder, { intermediates: true });
        }
        // console.log('starting copy');

        // make copies to app storage from attachments cache

        let uriArray = [];

        for (let index = 0; index < attachmentsArray.length; index++) {
            const element = attachmentsArray[index];

            let fileName = element.split('/').pop();
            let copyToPath = attachFolder + '/' + fileName;

            //copy file from cache to  the App local storage
            await FileSystem.copyAsync({ from: element, to: copyToPath })
                .catch(err => {
                    console.log('error while files copy', err);
                    return null
                });

            await FileSystem.getInfoAsync(copyToPath)
                .then(res => {
                    if (res.exists) {
                        uriArray.push(res.uri);
                    }
                }).catch(err => console.log('error while getting a new uri', err))
        }

        if (uriArray.length > 0) {
            // console.log('FILES COPIED AND CAN BE USED in the app...')
            return uriArray   // must return data with urls to files in user folder
        } else {
            // console.log('uriArray is empty')
            return null
        }
    },

    deleteFilesFromAppStorage: async (folderId) => {
        const attachFolder = USER_FOLDER_FILES + folderId;
        return await FileSystem.deleteAsync(attachFolder, { idempotent: true })
            .then(() => { return { status: 'Success' } })
            .catch(err => console.log('error while removing attachments from history..'))


    },
    deleteUserAllFiles: async () => {
        await FileSystem.deleteAsync(USER_FOLDER_FILES, { idempotent: true })
            .then(() => { return { status: 'Success' } })
            .catch(err => console.log('error while removing user files folder..'))
    }
}