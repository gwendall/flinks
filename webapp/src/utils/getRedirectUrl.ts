import axios from "axios";
import { get } from "lodash";

export default async function getRedirectUrl(url: string): Promise<string> {
    const response = await axios.get(url);
    return get(response, 'request.res.responseUrl') || url;
}