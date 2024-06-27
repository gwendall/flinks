"use client";

import PageContainer from "@/components/PageContainer";
import Link from "next/link";
import Markdown from "react-markdown";
// import styled from "styled-components";

const markdown = `
# Privacy Policy

## Introduction

Welcome to the Flinks Chrome Extension ("the Extension"). Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the Extension. Please read this policy carefully to understand our practices regarding your data and how we will treat it.

## Information We Collect

### Automatically Collected Information

When you install and use the Extension, we may automatically collect certain information for analytics purposes, including but not limited to:

- **Usage Data**: Information about your use of the Extension, including the frequency and duration of usage, features accessed, and any errors encountered.

We do not collect or store any personal information such as your name, email address, or browsing history.

## Use of Information

The information we collect is used solely for the following purposes:

- **Analytics**: To understand how users interact with the Extension and to make improvements.
- **Technical Support**: To diagnose and fix technical issues.

## Disclosure of Information

We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. We may share aggregated, non-personal information with third parties for analysis, research, and other purposes. This data does not identify individual users.

## Data Security

We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no data transmission over the internet or electronic storage method is 100% secure, and we cannot guarantee absolute security.

## Third-Party Services

The Extension may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party websites or services you visit.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Any changes will be effective immediately upon posting the updated policy within the Extension or on our website. We encourage you to periodically review this Privacy Policy to stay informed about our practices.

## Your Consent

By using the Extension, you consent to our Privacy Policy.

## Contact Us

If you have any questions or concerns about this Privacy Policy, please contact us at:

- **Email**: [gwendall@metahood.xyz](mailto:gwendall@metahood.xyz)

Thank you for using the Flinks Chrome Extension.

---

This Privacy Policy was last updated on June 27, 2024.
`;

export default function PrivacyPage() {
    return (
        <PageContainer>
            <Link href="/">← Back to Home</Link>
            <Markdown>{markdown}</Markdown>
        </PageContainer>
    )
}