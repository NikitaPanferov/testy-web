import { Button, ButtonProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface CustomButtonProps extends ButtonProps {}

const OutlineButton = ({
	children,
	...props
}: PropsWithChildren<CustomButtonProps>) => {
	return (
		<Button
			bg="white"
			color="blue.800"
			borderColor="blue.800"
			_hover={{
				color: "blue.700",
				borderColor: "blue.700",
				bg: "blue.50",
			}}
			{...props}
		>
			{children}
		</Button>
	);
};

export default OutlineButton;
