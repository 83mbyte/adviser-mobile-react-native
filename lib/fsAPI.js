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

        console.log('starting copy');

        // make copies to app storage from attachments cache
        attachmentsArray.forEach(async (item) => {
            let fileName = item.split('/').pop();
            await FileSystem.copyAsync({ from: item, to: attachFolder + '/' + fileName })
                .catch(err => {
                    console.log('error while files copy', err);
                    return null
                })
        })
        let arrayFilesInFolder = await FileSystem.readDirectoryAsync(attachFolder)
            .then((arrayFiles) => {
                return arrayFiles
            });

        let uriArray = [];
        if (arrayFilesInFolder) {
            for (let index = 0; index < arrayFilesInFolder.length; index++) {
                const element = arrayFilesInFolder[index];
                await FileSystem.getInfoAsync(attachFolder + '/' + element)
                    .then(res => {
                        if (res.exists) {
                            uriArray.push(res.uri);
                        }
                    }).catch(err => console.log('error while getting a new uri', err))
            }
        }


        if (uriArray.length > 0) {
            return uriArray   // must return data with urls to files in user folder
        } else {
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