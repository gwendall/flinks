"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function FrameNavForm() {
    const router = useRouter();
    const [input, setInput] = React.useState<string>('');
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value);
    }
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        router.push(`/frames?url=${encodeURIComponent(input)}`);
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={input} onChange={handleChange} placeholder="Enter a frame url" />
            <button type="submit">Submit</button>
        </form>
    );
}
