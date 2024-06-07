import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Tailwind,
} from "@react-email/components";
import OrderInformation from "./components/OrderInformation";
import React from "react";

type OrderHistoryEmailProps = {
	orders: {
		id: string;
		pricePaidInCents: number;
		createdAt: Date;
		downloadVerificationId: string;
		product: {
			name: string;
			imagePath: string;
			description: string;
		};
	}[];
};

OrderHistoryEmail.PreviewProps = {
	orders: [
		{
			id: crypto.randomUUID(),
			createdAt: new Date(),
			pricePaidInCents: 10000,
			downloadVerificationId: crypto.randomUUID(),
			product: {
				name: "Product name",
				imagePath:
					"/products/89e75f5c-19fe-4de2-bdf1-c0d2d56fa9f2-pediasure-chocolate.jpg",
				description: "Some description",
			},
		},
		{
			id: crypto.randomUUID(),
			createdAt: new Date(),
			pricePaidInCents: 2000,
			downloadVerificationId: crypto.randomUUID(),
			product: {
				name: "Product name 2",
				imagePath:
					"/products/74176f58-c8b5-4009-8ad7-0ed21c6e5cc4-pediasure-strawberry.jpg",
				description: "Some other description",
			},
		},
	],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({ orders }: OrderHistoryEmailProps) {
	return (
		<Html>
			<Preview>Order History & Downloads</Preview>
			<Tailwind>
				<Head />
				<Body className="font-sans bg-white">
					<Container className="max-w-xl">
						<Heading>Order History</Heading>
						{orders.map((order, index) => (
							<React.Fragment key={order.id}>
								<OrderInformation
									key={order.id}
									order={order}
									product={order.product}
									downloadVerificationId={order.downloadVerificationId}
								/>
								{index < orders.length - 1 && <Hr />}
							</React.Fragment>
						))}
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
