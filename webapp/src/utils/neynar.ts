import axios from "axios";

export const neynar = axios.create({
    baseURL: "https://api.neynar.com/v2",
    headers: {
        api_key: process.env.NEYNAR_API_KEY,
    },
});
