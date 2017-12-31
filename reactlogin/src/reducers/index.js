import {LOGIN} from "../actions/index";
import {ADDFILE} from "../actions/index";
import {DELETE_FILE} from "../actions/index";
import {UPDATE_USER} from "../actions/index";


// https://github.com/reactjs/react-redux/blob/d5bf492ee35ad1be8ffd5fa6be689cd74df3b41e/src/components/createConnect.js#L91
const initialState = {

    firstName: '',
    lastName: '',
    password: '',
    email: '',
    contactNo: '',
    interests:'',
    lastLoginTime:'',

    files :[],

    groups: [],

    userLog:[]


};

const userdata = (state = initialState, action) => {
    console.log("xxxxxxxxxxxxxxxxxxxxx");
    console.log(action.payload);
    switch (action.type) {

        case LOGIN :
            return {
                firstName: action.payload.firstname,
                lastName: action.payload.lastname,
                email: action.payload.email,
                password: action.payload.password,
                contactNo: action.payload.contactno,
                interests:action.payload.interests,
                lastLoginTime:action.payload.lastlogin,

                files :action.payload.files,

                groups: action.payload.groups,

                userLog:action.payload.userlog

            };

        case ADDFILE :
            return {
                ...state,
                files:[
                    ...state.files,
                    action.payload
                ]
            }

        case DELETE_FILE :
            return {
                ...state,
                files:[
                    ...state.files.slice(0, action.payload),
                    ...state.files.slice(action.payload + 1)
                ]
            }

        case UPDATE_USER :
            return {
                ...state,
                firstName: action.payload.firstname,
                lastName: action.payload.lastname,
                contactNo: action.payload.contact,
                interests:action.payload.interests
            }
        default :
            return state;

    }
};

export default userdata;