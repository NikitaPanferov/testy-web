import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface CustomButtonProps extends ButtonProps {}

const Button = ({
	children,
	...props
}: PropsWithChildren<CustomButtonProps>) => {
	return (
		<ChakraButton
			bg="blue.800"
			color="white"
			_hover={{ bg: "blue.700" }}
			{...props}
		>
			{children}
		</ChakraButton>
	);
};

export default Button;
