import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Frame } from "frames.js";

export default function useFrameData(url: string) {
    return useQuery({
        queryKey: ["frame", url],
        queryFn: async () => {
            const response = await axios.get('/api/frames', {
                params: {
                    url
                }
            });
            return response.data as {
                status: string;
                frame: Frame;
            };
        },
        enabled: !!url,
    });
}