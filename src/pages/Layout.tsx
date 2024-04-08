import { Outlet } from "react-router-dom"
import Header from "../components/Header"

export default function Layout() {
	return (
		<div className="flex flex-col w-screen">
			<Header />
			<Outlet />
		</div>
	)
}
