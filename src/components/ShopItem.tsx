import { Button, Card, CardBody, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Input, Link, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { IoMdPricetag } from "react-icons/io";
import { MdDeleteOutline, MdQueue, MdOutlineDone, MdEdit, MdCancel } from "react-icons/md";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { getTags } from "../query/getTags"
import { useCategories } from "../query/useCategories"

interface propTypes {
	shopItemId: number,
	itemName: string,
	details: string,
	priority: number,
	onQueue: boolean,
	purchased: boolean,
	price: number,
	referenceLink: string,
	tag: string,
	category: string,
	addToQueue: () => void,
	togglePurchased: () => void,
	deleteItem: () => void,
	setPriority: (newPriority: React.Key) => void,
	handleEdit: (itemName: string, details: string, price: number, link: string) => void,
	handleItemTagChange: (tagId: number) => void,
	handleItemCategoryChange: (categoryId: number) => void
}

interface editItem {
	name: string,
	details: string,
	price: number,
	referenceLink: string
}

interface Tag {
	tagId: number,
	tagName: string
}

interface Category {
	categoryId: number,
	categoryName: string
}

export default function ShopItem(props: propTypes) {

	const { data: tagsData, isLoading: isLoadingTags, isError: isErrorTags } = getTags()

	if (isLoadingTags) {
		console.log("Loading tags...")
	}

	if (isErrorTags) {
		console.log("Error loading tags")
	}

	const { data: categoriesData, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories()

	if (isLoadingCategories) {
		console.log("Loading categories...")
	}

	if (isErrorCategories) {
		console.log("Error loading categories")
	}

	const [selectedKeys, setSelectedKeys] = useState([props.priority.toString()])
	const [showDescription, setShowDescription] = useState(false)
	const [isEditable, setIsEditable] = useState(false)
	const [selectedTags, setSelectedTags] = useState(new Set([props.tag]))
	const [selectedCategories, setSelectedCategories] = useState(new Set([props.category]))

	const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditItem((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value
		}))
	}

	const [editItem, setEditItem] = useState<editItem>({
		name: '',
		details: '',
		price: 0,
		referenceLink: ''
	})

	const handleEditPress = () => {
		setIsEditable(!isEditable)
		setEditItem({
			name: props.itemName,
			details: props.details,
			price: props.price,
			referenceLink: props.referenceLink
		})
	}

	const handleEditSubmit = () => {
		props.handleEdit(editItem.name, editItem.details, editItem.price, editItem.referenceLink)
		handleEditPress()
	}

	const handleEditCancel = () => {
		setEditItem({
			name: '',
			details: '',
			price: 0,
			referenceLink: ''
		})
		handleEditPress()
	}

	const handleTagChange = (tagId: number) => {
		props.handleItemTagChange(tagId)
	}

	const handleCategoryChange = (categoryId: number) => {
		props.handleItemCategoryChange(categoryId)
	}

	// const categoryList = categories.map((category: Category) => {
	// 	return (
	// 		<DropdownItem
	// 			key={category.categoryId}
	// 			value={category.categoryName}
	// 		>{category.categoryName}</DropdownItem>
	// 	)
	// })

  	return (
		<Card className="dark flex flex-row">
			{/* <div className="h-full w-6 bg-purple-800 hover:opacity-75 active:brightness-150"></div> */}
			<div className="w-6 h-full">
				<Dropdown classNames={{
					content: "p-0"
				}}>
					<DropdownTrigger>
						<Button 
							color={props.priority === 1 ? "danger" : props.priority === 2 ? "warning" : props.priority === 3 ? "success" : "secondary"}
							className="h-full p-0 rounded-r-none"
							size="sm"
						></Button>
					</DropdownTrigger>
					<DropdownMenu
						aria-label="Priority edit"
						variant="flat"
						disallowEmptySelection
						selectionMode="single"
						hideSelectedIcon
						selectedKeys={selectedKeys}
						//@ts-ignore
						onSelectionChange={setSelectedKeys} 
						onAction={props.setPriority}
						name="priority"
					>
						<DropdownItem key="1">1</DropdownItem>
						<DropdownItem key="2">2</DropdownItem>
						<DropdownItem key="3">3</DropdownItem>
						<DropdownItem key="4">4</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
			<Card classNames={{
				base: "rounded-l-none w-full"
			}}>
				<CardBody className="flex flex-row justify-between items-center px-20">
					<div className="w-1/4 flex flex-row justify-between items-center pr-4">
						{isEditable ? 
							<div className="flex flex-col gap-2">
								<Input type="text" label="Item name" name="name" size="sm" onChange={handleEditChange} value={editItem.name} />
								<Input type="text" label="Details" name="details" size="sm" onChange={handleEditChange} value={editItem.details} />
							</div> :
							<div className="w-full flex flex-row justify-between items-center">
								{showDescription ? props.details === "" ? <span className="text-xl">No details available</span> : <span className="text-sm">{props.details}</span> : <span className="text-xl">{props.itemName}</span>}
								<Tooltip content="Switch to item description" className="dark text-gray-200">
									<Button isIconOnly variant="flat" color="primary" radius="full" onPress={() => setShowDescription(!showDescription)}>{showDescription ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}</Button>
								</Tooltip>
							</div>
						}
					</div>
					<Divider orientation="vertical" className="w-[2px] h-12 min-h-full" />
					<div className="flex flex-row gap-20 px-6 items-center text-gray-300 w-1/3">
						{ isEditable ?
							<div className="flex flex-col gap-2">
								{/* @ts-ignore */}
								<Input type="number" label="Price" name="price" size="sm" onChange={handleEditChange} value={editItem.price} />
								<Input type="text" label="Reference link" name="referenceLink" size="sm" onChange={handleEditChange} value={editItem.referenceLink} />
							</div> :
							<div className="flex flex-col gap-1">
								{props.referenceLink !== "" ? <Link isExternal href={props.referenceLink} showAnchorIcon className="font-bold">Estimated price</Link> : <span className="font-bold text-gray-300">Estimated price</span>}
								<span className="text-sm">$ {props.price}</span>
							</div>
						}
					</div>
					<Divider orientation="vertical" className="w-[2px] h-12 min-h-full" />
					<div className="flex flex-row gap-4 justify-end items-center w-1/3">
						<div>
							{!isEditable ? 
								<Button isIconOnly variant="flat" onPress={handleEditPress}>{isEditable ? <MdOutlineDone size={20} /> : <MdEdit size={20} />}</Button>
								: 
								<div className="flex flex-row gap-4">
									<Button isIconOnly variant="flat" color="success" onPress={handleEditSubmit}><MdOutlineDone size={20} /></Button>
									<Button isIconOnly variant="flat" onPress={handleEditCancel}><MdCancel size={20} /></Button>
								</div>
							}

						</div>
						<Dropdown className="">
							<DropdownTrigger>
								<Button isIconOnly color="primary" variant="flat"><IoMdPricetag size={20} /></Button>
							</DropdownTrigger>
							<DropdownMenu 
								aria-label="Tag edit"
								variant="flat"
								disallowEmptySelection
								selectionMode="single"
								selectedKeys={selectedTags}
								//@ts-ignore
								onSelectionChange={setSelectedTags}
								//@ts-ignore
								onAction={handleTagChange} 
								name="tag"
							>
								<DropdownSection title={`Edit tag. Currently: ${props.tag}`}>
									{tagsData && tagsData.map((tag: Tag) => (
										<DropdownItem key={tag.tagId}>{tag.tagName}</DropdownItem>
									))}
								</DropdownSection>
							</DropdownMenu>
						</Dropdown>
						<Dropdown className="">
							<DropdownTrigger>
							<Button isIconOnly color="secondary" variant="flat"><IoMdPricetag size={20} /></Button>
							</DropdownTrigger>
							<DropdownMenu 
								aria-label="Category edit"
								variant="flat"
								disallowEmptySelection
								selectionMode="single"
								selectedKeys={selectedCategories}
								//@ts-ignore
								onSelectionChange={setSelectedCategories}
								//@ts-ignore
								onAction={handleCategoryChange} 
								name="category"
							>
								<DropdownSection title={`Edit category. Currently: ${props.category}`}>
									{categoriesData && categoriesData.map((category: Category) => (
										<DropdownItem key={category.categoryId}>{category.categoryName}</DropdownItem>
									))}
								</DropdownSection>
							</DropdownMenu>
						</Dropdown>
						<Tooltip content="Add to queue" className="dark text-gray-200">
							<Button isIconOnly color="warning" variant="flat" onPress={props.addToQueue}><MdQueue size={20} /></Button>
						</Tooltip>
						<Tooltip content="Delete item" className="dark text-gray-200">
							<Button isIconOnly color="danger" variant="flat" onPress={props.deleteItem}><MdDeleteOutline size={20} /></Button>
						</Tooltip>
						<Tooltip content="Set as purchased" className="dark text-gray-200">
							<Button isIconOnly color="success" variant="flat" onPress={props.togglePurchased}><MdOutlineDone size={20} /></Button>
						</Tooltip>
					</div>
				</CardBody>
			</Card>
		</Card>
  	)
}
