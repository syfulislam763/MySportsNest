import api from "@/constants/Axios";

import { ENTITY_FEED_API, HOME_FEED_API } from "@/constants/Path";

type CALLBACK = (res:any | null) => void


export const get_entity_details = async (entity_id:number, cb:CALLBACK) => {

    try{
        const res = await api.get(`/api/entities/${entity_id}/`);
        cb(res)
    }catch(e:any){
        console.log(e, "what");
        cb(null);
    }
}

export const get_home_feed = async (query:string | null, cb:CALLBACK) => {
    const url = query?`${HOME_FEED_API}?${query}`: HOME_FEED_API;
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

export const get_entity_status = async (entity_id:number, cb:CALLBACK) => {
    const url = `/api/entities/${entity_id}/stats/`;
    try{
        const res = await api.get(url);
        cb(res)
    }catch(e:any){
        cb(null)
    }
}

export const get_entity_roster = async (entity_id:number, cb:CALLBACK) => {
    const url = `/api/entities/${entity_id}/roster/`;
    try{
        const res = await api.get(url);
        cb(res)
    }catch(e:any){
        cb(null)
    }
}

export const get_entity_fixture = async (entity_id:number, cb:CALLBACK) => {
    const url = `/api/entities/${entity_id}/fixtures/`;
    try{
        const res = await api.get(url);
        cb(res)
    }catch(e:any){
        cb(null)
    }
}
export const get_entity_standings = async (entity_id:number, cb:CALLBACK) => {
    const url = `/api/entities/${entity_id}/standings/`;
    try{
        const res = await api.get(url);
        cb(res)
    }catch(e:any){
        cb(null)
    }
}


export const like_post = async (post_id:number, cb:CALLBACK) => {
    const url = `api/feed/like/`;
    try{
        const res = await api.post(url, {feed_item_id:post_id});
        cb(res)
    }catch(e:any){
        cb(null)
    }
}
export const feedback_post = async (post_id:number, cb:CALLBACK) => {
    const url = `/api/feed/bookmark/`;
    try{
        const res = await api.post(url, {feed_item_id:post_id});
        cb(res)
    }catch(e:any){
        cb(null)
    }
}