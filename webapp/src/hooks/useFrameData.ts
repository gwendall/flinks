import { GetFrameResult } from "@frames.js/render";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function useFrameData(url: string) {
    return useQuery({
        queryKey: ["frame", url],
        queryFn: async () => {
            const response = await axios.get('/api/frames', {
                params: {
                    url
                }
            });
            return response.data as GetFrameResult;
        },
        enabled: !!url,
    });
}