import api from "@/constants/Axios";
import { useAuthStore } from "@/context/useAuthStore";

import { ADD_NEST_API, GET_NEST_API, PREFERENCE, REMOVE_NEST_API, TRENDING } from "@/constants/Path";


type CALLBACK = (res:any) => void;

type ADD_NEST = {
    entity_id: number
}

type PREFERENCE_TYPE = {
    show_live_scores: boolean,
    breaking_news_only: boolean,
    notification_frequency: string
}

export const OnboardingAPI = {
    get_trending_data: async (query:string | null) => {
        const url = query?`${TRENDING}?q=${query}`:TRENDING;
        return api.get(url);
    },
    get_nest_data: async () => {
        return api.get(GET_NEST_API)
    }
}

export const get_trending_data = async (query:string | null, cb:CALLBACK) => {
    const url = query?`${TRENDING}?q=${query}`:TRENDING;

    try{    
        const res = await api.get(url);
        cb(res.data)
    }catch(e:any){
        cb(null)
        console.log("trending ", JSON.stringify(e, null, 2))
    }

}

export const get_nest_data = async (cb:CALLBACK) => {
    try{    
        const res = await api.get(GET_NEST_API);
        cb(res.data)
    }catch(e:any){
        cb(null)
        console.log("gt nest ", JSON.stringify(e, null, 2))
    }

}

export const add_nest_entity = async (payload:ADD_NEST, cb:CALLBACK) => {
    try{    
        const res = await api.post(ADD_NEST_API, payload);
        cb(res.data)
    }catch(e:any){
        cb(null)
        console.log("trending ", JSON.stringify(e, null, 2))
    }

}

export const remove_nest_entity = async (payload:ADD_NEST, cb:CALLBACK) => {
    try{    
        const res = await api.post(REMOVE_NEST_API, payload);
        cb(res.data)
    }catch(e:any){
        cb(null)
        console.log("rm nest  ", JSON.stringify(e, null, 2))
    }

}

export const set_preference = async (payload:PREFERENCE_TYPE, cb:CALLBACK) => {
    try{    
        const res = await api.put(PREFERENCE, payload);
        cb(res.data)
    }catch(e:any){
        cb(null)
        console.log("preference ", JSON.stringify(e, null, 2))
    }

}