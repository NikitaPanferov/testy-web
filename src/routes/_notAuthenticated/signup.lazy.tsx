import { createLazyFileRoute } from '@tanstack/react-router'
import { SignUpPage } from '../../pages/SignUpPage/SignUpPage'

export const Route = createLazyFileRoute('/_notAuthenticated/signup')({
	component: SignUpPage,
})
