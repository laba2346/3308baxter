import callApi from '../../util/apiCaller';
/**
    A constant containing the string 'INVALID_FIELD'; used in reducer
*/
export const INVALID_FIELD = 'INVALID_FIELD';
/**
    A constant containing the string 'RESET_INVALID_STATUS'; used in reducer
*/
export const RESET_INVALID_STATUS = 'RESET_INVALID_STATUS';
/**
    A constant containing the string 'CHANGE_THEME'; used in reducer
*/
export const CHANGE_THEME = 'CHANGE_THEME';
/**
    A constant containing the string 'RESET_SETTINGS; used in reducer
*/
export const RESET_SETTINGS = 'RESET_SETTINGS';
/**
    A constant containing the string 'SUCCESS'; used in reducer
*/
export const SUCCESS = 'SUCCESS';
/**
    A constant containing the string 'RESET_SUCCESS'; used in reducer
*/
export const RESET_SUCCESS = 'RESET_SUCCESS';
/**
    A constant containing the string 'IMPORT_THEME'; used in reducer
*/
export const IMPORT_THEME = 'IMPORT_THEME';
/**
    Returns an object with type CHANGE_THEME and a new theme color.
    @param {String} themeColor color code for the new theme color.
*/
export function changeTheme(themeColor){
    return {
        type: CHANGE_THEME,
        themeColor
    }
}

export function changeProfilePicRequest(formState){
  var reader = new FileReader();
  const apiUrl = 'updateProfilePic';
  reader.addEventListener("load", function (dispatch) { return callApi(apiUrl, "post", {profile_pic: reader.result})}, false);
  reader.readAsDataURL(formState.profile_pic);
}

/**
    Makes an API call to update the settings. If successful, it dispatches success
    @param {Object} formState Object containing information from the submitted settings form
*/
export function changeSettingRequest(formState){
    const apiUrl = 'updateSettings';
    return (dispatch) => {
        return callApi(apiUrl, "post", formState).then(res => {
            if(res.success){
                dispatch(success());
            }
        });
    }
}

/**
    Updates the state with the user's current themeColor.
    @param {Object} user The user object for the current user
*/
export function importTheme(user){
    return {
        type: IMPORT_THEME,
        user
    }
}

/**
    Dispatches an action that imports the user and dispatches actions
    to update the state
*/
export function importSettings(){
    const apiUrl = 'loadSettings';
    return (dispatch) => {
        return callApi(apiUrl).then(res => {
            if(res){
                dispatch(importTheme(res));
            }
        });
    }
}

/**
    Returns an object with type SUCCESS so that the state can change.
*/
export function success(){
    return {
        type: SUCCESS,
    }
}

/**
    Returns an object with type RESET_SUCCESS so that the state can change.
*/
export function resetSuccess(){
    return {
        type: RESET_SUCCESS,
    }
}

export function checkIfProfilePicValid(formState){
  return (dispatch) => {
    if (formState.profile_pic !== null){
      return true;
    }
    else return false;
  }
}

/**
    Confirms that the formState has valid inputs.
    @param {Object} formstate Object containing information from the submitted settings form
*/
export function checkIfFieldsValid(formState){
    return (dispatch) => {

        var emailreg = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        var usernamereg = /(?=^.{8,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/
        var passwordreg = /(?=^.{8,80}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/

        if (formState.email !== '' && emailreg.exec(formState.email) === null){
            dispatch(invalidField("email"));
            return false;
        }

        if (formState.password1 !== formState.password2){
            dispatch(invalidField("password"));
            return false;
        }

        if (formState.username !== '' & usernamereg.exec(formState.username) === null){
            dispatch(invalidField("username"));
            return false;
        }

        if (passwordreg.exec(formState.password) === null){
            dispatch(invalidField("password"))
            return false;
        }

        if (formState.email == '' && formState.username == '' && formState.password1 == '' && formState.password2 == '' && formState.color == ''){
            return false;
        }
        // TODO: import this from Landing.js?
        //dispatch(resetInvalidStatus())
        dispatch(resetSettings())
        return true;
    }
}

/**
    Returns an object with type INVALID_FIELD and the field that was invalid.
    @param {String} field The field that was incorrect in checkIfFieldsValid.
*/
export function invalidField(field){
    console.log("invalid field: " + field)
    return {
        type: INVALID_FIELD,
        field
    }
}
/**
    Returns an object with type RESET_SETTINGS.
*/
export function resetSettings(){
    return {
        type: RESET_SETTINGS,
    }
}
