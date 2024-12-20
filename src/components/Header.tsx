import {
	Avatar,
	Badge,
	Flex,
	Icon,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { IoExitSharp, IoHome } from "react-icons/io5";
import useAuthStore from "../stores/authStore";
import { AddIcon } from "@chakra-ui/icons";

const Header = () => {
	const { user, logout } = useAuthStore((state) => state);
	const navigate = useNavigate();
	const onLogOut = () => {
		logout();
		navigate({ to: "/login" });
	};

	return (
		<Flex
			py={4}
			px={16}
			gap={8}
			alignItems="center"
			justify="space-between"
			style={{
				borderRadius: "0 0 20px 20px",
				boxShadow: "rgba(0, 0, 0, 0.3) 0px 0px 10px 0px",
				position: "sticky",
				top: 0,
				zIndex: 1000,
				backgroundColor: "#fff",
			}}
		>
			<Badge as={Link} to="/" variant="outline" color="blue.700" fontSize="large">
				Testy
			</Badge>
			<Menu>
				<MenuButton as="div" style={{ cursor: "pointer" }}>
					<Avatar name={user?.name} color="white" bg="blue.700" />
				</MenuButton>
				<MenuList>
					<MenuItem
						as={Link}
						to="/"
						icon={<Icon as={IoHome} color="blue.700" />}
					>
						Домашняя страница
					</MenuItem>
					<MenuItem
						as={Link}
						to="/test"
						icon={<AddIcon color="blue.700" />}
					>
						Создать форму
					</MenuItem>
					<MenuDivider />
					<MenuItem
						onClick={onLogOut}
						icon={<Icon as={IoExitSharp} color="blue.700" />}
					>
						Выход
					</MenuItem>
				</MenuList>
			</Menu>
		</Flex>
	);
};

export default Header;
