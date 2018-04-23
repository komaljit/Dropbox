
export const LOGIN = 'LOGIN';
export const ADDFILE = 'ADDFILE';
export const DELETE_FILE = 'DELETE_FILE';
export const UPDATE_USER = 'UPDATE_USER';


// action to dispatch after a user login
export function afterlogin(userdata) {

    return {
        type : LOGIN,
        payload : userdata
    }
}


// action to dispatch when a user adds a file
export function addFile(filedata) {

    return {
        type : ADDFILE,
        payload : filedata
    }
}


// action to dipatch when user deletes a fule
export function deleteFile(index) {

    return {
        type : DELETE_FILE,
        payload : index
    }
}


// action when user update profile information
export function updateUser(data) {

    return {
        type : UPDATE_USER,
        payload : data
    }
}
