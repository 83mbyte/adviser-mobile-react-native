//
// api to work with APP file system
//

import * as FileSystem from 'expo-file-system';

const USER_FOLDER = FileSystem.documentDirectory + process.env.EXPO_PUBLIC_APP_USER_FOLDER;
const USER_FOLDER_FILES = USER_FOLDER + 'files/';

async function verifyFolder(folder) {
    let dirInfo = await FileSystem.getInfoAsync(folder);

    //if no folder =>  it will create empty
    if (!dirInfo.exists) {
        console.log("directory doesn't exist, creating…");
        await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
    }
    return true
}


export const fsAPI = {
    moveAttachmentsFromCache: async (attachmentsArray, historyId) => {

        const attachFolder = USER_FOLDER_FILES + historyId;
        await verifyFolder(attachFolder);

        // let dirInfo = await FileSystem.getInfoAsync(attachFolder);

        // //if no attachFolder =>  it will create empty
        // if (!dirInfo.exists) {
        //     console.log("directory doesn't exist, creating…");
        //     await FileSystem.makeDirectoryAsync(attachFolder, { intermediates: true });
        // }
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
    downloadImageToUserFolder: async (fileUrl, historyId) => {
        try {

            if (fileUrl && historyId) {
                const folderToSave = USER_FOLDER_FILES + historyId;

                await verifyFolder(folderToSave);
                const regexPattern = /[-0-9A-Za-z]*\.[a-z]{3,4}\?/g;
                let fileName = fileUrl.match(regexPattern)[0].slice(0, -1);

                return await FileSystem.downloadAsync(fileUrl, folderToSave + '/' + fileName)
                    .then((res) => {
                        if (res.status == 200) {
                            return { type: 'Success', payload: res.uri }
                        } else {
                            throw new Error('Error while trying to download an image file..')
                        }
                    });

            } else {
                throw new Error('No Id or fileUrl provided..')
            }

        } catch (error) {
            // console.error(`Couldn't download file:`, error);
            return { status: 'Error', message: error }
        }



    },
    deleteFileInUserFolder: async (fileUrl) => {
        // const folder = USER_FOLDER_FILES + folderId;

        return await FileSystem.deleteAsync(fileUrl, { idempotent: true })
            .then(() => {
                return { status: 'Success' }
            })
            .catch(err => console.log('error while deleting single file..', err))
    },
    deleteFilesFromAppStorage: async (folderId) => {
        const folder = USER_FOLDER_FILES + folderId;
        return await FileSystem.deleteAsync(folder, { idempotent: true })
            .then(() => { return { status: 'Success' } })
            .catch(err => console.log('error while removing attachments from history..'))


    },
    deleteUserAllFiles: async () => {
        await FileSystem.deleteAsync(USER_FOLDER_FILES, { idempotent: true })
            .then(() => { return { status: 'Success' } })
            .catch(err => console.log('error while removing user files folder..'))
    }
}