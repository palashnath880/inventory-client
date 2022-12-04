import { useCookies } from 'react-cookie';

const useCookie = (data) => {
    const [cookies, setCookie, removeCookie] = useCookies(data);
    return { cookies, setCookie, removeCookie };
}

export default useCookie;
