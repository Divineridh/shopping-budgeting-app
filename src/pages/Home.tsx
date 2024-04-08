import { Button } from "@nextui-org/react";
import ShopItem from "../components/ShopItem";


export default function Home() {
	return (
		<div className="flex flex-row min-h-screen text-gray-200">
			<div className="flex flex-col w-1/5 p-4 border-r-2 border-zinc-700 min-h-full">
				<div className="flex flex-row justify-center">
					<Button color="success">Add Item</Button>
				</div>
			</div>
			<div className="flex flex-col gap-4 w-4/5 p-4 px-10">
				<ShopItem />
				<ShopItem />
				<ShopItem />
				<ShopItem />
			</div>
		</div>
	)
}
