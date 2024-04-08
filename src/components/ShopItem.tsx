import { Button, Card, CardBody, CardHeader, Checkbox, Divider } from "@nextui-org/react";
import { IoMdPricetag } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";

export default function ShopItem() {
  return (
	<Card className="dark">
		<CardHeader className="flex flex-row justify-between px-16 py-1">
			<span className="text-xl font-bold">Item name</span>
			<div className="flex flex-row items-center gap-8">
				<Button color="success" variant="flat" size="sm">Add to queue</Button>
				<div className="flex flex-row items-center gap-2">
					<span className="text-sm">Purchased</span>
					<Checkbox size="sm" radius="none" color="success" />
				</div>
				<Button isIconOnly color="danger" variant="flat"><MdDeleteOutline size={20} /></Button>
			</div>
		</CardHeader>
		<Divider />
		<CardBody className="flex flex-row justify-between items-center px-20">
			<div className="flex flex-row gap-20">
				<div className="flex flex-col gap-1">
					<span className="font-bold">Low price</span>
					<span className="text-sm">$450.000</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="font-bold">Mid price</span>
					<span className="text-sm">$500.000</span>
				</div>
				<div className="flex flex-col gap-1">
					<span className="font-bold">High price</span>
					<span className="text-sm">$550.000</span>
				</div>
			</div>
			<div className="flex flex-row gap-4">
				<Button startContent={<IoMdPricetag size={20} />} color="primary" variant="flat">Object Tag</Button>
				<Button startContent={<IoMdPricetag size={20} />} color="secondary" variant="flat">Shopping Category</Button>
			</div>
		</CardBody>
	</Card>
  )
}
