import api from "@/constants/Axios";

import { ENTITY_FEED_API, HOME_FEED_API } from "@/constants/Path";

type CALLBACK = (res:any | null) => void

export const get_home_feed = async (query:string | null, cb:CALLBACK) => {
    const url = query?`${HOME_FEED_API}${query}`: HOME_FEED_API;
    console.log(url, "home feed")
    try{
        const res = await api.get(url);
        cb(res)
    }catch(e:any){
        //console.log(e, "what the hell");
        cb(null);
    }
}

export const get_entity_feed = async (entity_id:number, cb:CALLBACK) => {

    try{
        const res = await api.get(`${ENTITY_FEED_API}${entity_id}/`);
        cb(res)
    }catch(e:any){
        console.log(e, "what");
        cb(null);
    }
}