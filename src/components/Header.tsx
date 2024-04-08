import { Link } from "@nextui-org/react";

export default function Header() {
	return (
		<div className="flex flex-col bg-slate-800 text-gray-200">
			<div className="flex flex-row items-center justify-around p-2 border-b border-zinc-700">
				<Link href="/" className="text-lg text-white">Shopping Budgeting App</Link>
				<span>In development</span>
			</div>
		</div>
	)
}
