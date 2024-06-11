import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// The Inter function is used to configure the application's font and its
//options, such as the subsets and variable name and then store the return
//value in the inter variable, which makes it available for use in the app.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "rndi's Shop",
	description: "The go-to shop for anything you need.",
};

/**
 * Renders the root layout of the application.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The content to be rendered within the layout.
 * @return {JSX.Element} The root layout component.
 */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"bg-background min-h-screen font-sans antialiased",
					inter.variable
				)}
			>
				{children}
			</body>
		</html>
	);
}
