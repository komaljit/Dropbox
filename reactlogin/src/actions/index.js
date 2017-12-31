
export const LOGIN = 'LOGIN';
export const ADDFILE = 'ADDFILE';
export const DELETE_FILE = 'DELETE_FILE';
export const UPDATE_USER = 'UPDATE_USER';

export function afterlogin(userdata) {

    return {
        type : LOGIN,
        payload : userdata
    }
};



export function addFile(filedata) {

    return {
        type : ADDFILE,
        payload : filedata
    }
};


export function deleteFile(index) {

    return {
        type : DELETE_FILE,
        payload : index
    }
};


export function updateUser(data) {

    return {
        type : UPDATE_USER,
        payload : data
    }
};
