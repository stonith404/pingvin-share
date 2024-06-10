import mixpanel from 'mixpanel-browser';
export const initMixPanel =()=>{
    if (typeof window !== 'undefined') {
        mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_KEY || '');
    }
}