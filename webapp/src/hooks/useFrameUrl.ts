import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useFrameUrl(url: string) {
    return useQuery({
        queryKey: ["frame", "url", url],
        queryFn: async () => {
            const response = await axios.get(`/api/frames/url`, {
                params: {
                    url,
                }
            });
            return response.data as string;
        },
        enabled: !!url,
    })
}