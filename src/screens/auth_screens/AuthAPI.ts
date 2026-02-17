import api from "@/constants/Axios";
import { CHANGE_PASS, DELETE_ACCOUNT, LOGIN, LOGOUT, REFRESH_TOKEN, REGISTER, RESEND_OTP, RESET_PASS_CONFIRM, RESET_PASS_REQ, RESET_PASS_VERIFY, VERIFY_EMAIL } from "@/constants/Path";


type Register = {
    full_name: string,
    email: string,
    password: string,
    password2: string,
}
type VerifyEmail = {
    email: string,
    otp: string
}
type Login = {
    email:string,
    password: string
}
type ResetConfirmPass = {
    email: string,
    otp: string,
    new_password: string,
    new_password2: string
}
type ChangePass = {
    old_password: string,
    new_password: string,
    new_password2: string
}
export const register_user = async (payload:Register, cb:(item:any)=>void) => {
    try {
        const res = await api.post(REGISTER, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "register error")
        cb(null);
    }
}
export const verify_email = async (payload:VerifyEmail, cb:(item:any)=>void) => {
    try {
        const res = await api.post(VERIFY_EMAIL, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "verify email error")
        cb(null);
    }
}

export const login_user = async (payload:Login, cb:(item:any)=>void) => {
    try {
        const res = await api.post(LOGIN, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "login user error")
        cb(null);
    }
}
export const resend_otp = async (payload:{email: string, purpose:string}, cb:(item:any)=>void) => {
    try {
        const res = await api.post(RESEND_OTP, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "resend otp error")
        cb(null);
    }
}

export const refresh_token = async (payload:{refresh: string}, cb:(item:any)=>void) => {
    try {
        const res = await api.post(REFRESH_TOKEN, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "refresh token error")
        cb(null);
    }
}

export const reset_pass_request = async (payload:{email:string}, cb:(item:any)=>void) => {
    try {
        const res = await api.post(RESET_PASS_REQ, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "reset pass request error")
        cb(null);
    }
}

export const verify_reset_pass = async (payload:VerifyEmail, cb:(item:any)=>void) => {
    try {
        const res = await api.post(RESET_PASS_VERIFY, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "reset pass verify otp error")
        cb(null);
    }
}

export const confirm_reset_pass = async (payload:ResetConfirmPass, cb:(item:any)=>void) => {
    try {
        const res = await api.post(RESET_PASS_CONFIRM, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "reset pass confirm error")
        cb(null);
    }
}

export const change_pass = async (payload:ChangePass, cb:(item:any)=>void) => {
    try {
        const res = await api.post(CHANGE_PASS, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "change pass error")
        cb(null);
    }
}

export const logout_user = async (payload:{refresh: string}, cb:(item:any)=>void) => {
    try {
        const res = await api.post(LOGOUT, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "logout user error")
        cb(null);
    }
}


export const delete_user = async (payload:{confirm: string}, cb:(item:any)=>void) => {
    try {
        const res = await api.post(DELETE_ACCOUNT, payload)
        cb(res.data)
    }catch(e){
        console.log(e, "delete user error")
        cb(null);
    }
}









