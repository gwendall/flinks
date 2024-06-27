import PageContainer from "@/components/PageContainer";
import Link from "next/link";

export default function SupportPage() {
    return (
        <PageContainer>
            <Link href="/">← Back to Home</Link>
            <h1>Support</h1>
            <div>Email: <a href="mailto:gwendall@metahood.xyz">gwendall@metahood.xyz</a></div>
        </PageContainer>
    )
}