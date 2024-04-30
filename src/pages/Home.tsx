import { Button, Checkbox, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Progress, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import ShopItem from "../components/ShopItem";
import { CiSquarePlus } from "react-icons/ci";

interface Item {
	shopItemId: number
	itemName: string
	details: string
	priority: number
	onQueue: boolean
	purchased: boolean
	price: number
	referenceLink: string
	tag: string
	category: string
}

interface NewItem {
	itemName: string
	details: string
	price: number
	tagId: number
	categoryId: number
}

interface Tag {
	tagId: number,
	tagName: string
}

interface Category {
	categoryId: number,
	categoryName: string
}

interface Filters {
	tagId: number,
	categoryId: number,
	purchased: boolean,
	onQueue: boolean,
	priority: number
}

export default function Home() {

	const [itemData, setItemData] = useState([])
	const [itemTotalCount, setItemTotalCount] = useState(0)
	const [itemPurchasedCount, setItemPurchasedCount] = useState(0)
	const [queueItemData, setQueueItemData] = useState([])
	const [filters, setFilters] = useState<Filters>({
		tagId: 0,
		categoryId: 0,
		purchased: false,
		onQueue: false,
		priority: 0,
	})
	const [tagData, setTagData] = useState([])
	const [categoryData, setCategoryData] = useState([])
	const {isOpen, onOpen, onOpenChange} = useDisclosure()
	const [newItem, setNewItem] = useState<NewItem>({
		itemName: '',
		details: '',
		price: 0,
		tagId: 0,
		categoryId: 0
	})
	const [selectedTag, setSelectedTag] = useState(new Set([]))
	const [selectedCategory, setSelectedCategory] = useState(new Set([]))
	const [selectedFilterTag, setSelectedFilterTag] = useState(new Set([]))
	const [selectedFilterCategory, setSelectedFilterCategory] = useState(new Set([]))
	const [purchasedFilterIsSelected, setPurchasedFilterIsSelected] = useState(false)
	const [selectedFilterPriority, setSelectedFilterPriority] = useState(new Set([]))
	const [newTag, setNewTag] = useState('')
	const [newCategory, setNewCategory] = useState('')
	const [queuePrice, setQueuePrice] = useState(0)

	const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewItem((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value
		}))
	}

	const handleNewItemSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		const submitItem : NewItem = {
			itemName: newItem.itemName,
			details: newItem.details,
			price: newItem.price,
			tagId: selectedTag.values().next().value,
			categoryId: selectedCategory.values().next().value
		} 
		axios.post('https://localhost:7143/api/shopItems', submitItem)
		.then((response) => {
			console.log("Item added successfully:", response.data)
			fetchData()
		})
		.catch((error) => {
			console.error('Error adding item:', error)
		})
	}

	const handleNewTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTag(e.target.value)		
	}

	//TODO: Show example of state snapshotting. If i set filters inside this effect and refresh data in the same effect, it fetches with previous filters.
	//TODO extra: get rid of useEffect
	useEffect(() => {
		setFilters((prevData) => ({
			...prevData,
			tagId: selectedFilterTag.values().next().value
		}))
	}, [selectedFilterTag])

	useEffect(() => {
		setFilters((prevData) => ({
			...prevData,
			purchased: purchasedFilterIsSelected,
		}))
	}, [purchasedFilterIsSelected])

	const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewCategory(e.target.value)
	}
		
	//TODO: get rid of useEffect
	useEffect(() => {
		setFilters((prevData) => ({
			...prevData,
			categoryId: selectedFilterCategory.values().next().value
		}))
	}, [selectedFilterCategory])
	
	useEffect(() => {
		setFilters((prevData) => ({
			...prevData,
			priority: selectedFilterPriority.values().next().value
		}))
	}, [selectedFilterPriority])
	

	useEffect(() => {
		fetchData()
	}, [filters])

	const fetchData = async () => {
		axios.get('https://localhost:7143/api/shopItems/filters', {params: filters})
		.then((response) => {
			console.log("Data updated with filters:" + filters.tagId + filters.categoryId + filters.purchased + filters.onQueue, response.data)
			setItemData(response.data)
		})
		.catch((error) => {
			console.error('Error fetching items data:', error)
		})
	}

	const fetchTagData = async () => {
		axios.get('https://localhost:7143/api/tags')
		.then((response) => {
			setTagData(response.data)
		})
		.catch((error) => {
			console.error('Error fetching tag data:', error)
		})
	}

	const fetchCategoryData = async () => {
		axios.get('https://localhost:7143/api/categories')
		.then((response) => {
			setCategoryData(response.data)
		})
		.catch((error) => {
			console.error('Error fetching category data:', error)
		})
	}

	const fetchQueueData = async () => {
		axios.get('https://localhost:7143/api/shopItems/filters', {params: {onQueue: true}})
		.then((response) => {
			setQueueItemData(response.data)
		})
		.catch((error) => {
			console.error('Error fetching queue data:', error)
		})
	}

	const fetchDataCount = async () => {
		axios.get('https://localhost:7143/api/shopItems/totalCount')
		.then((response) => {
			setItemTotalCount(response.data)
		})
		.catch((error) => {
			console.error('Error fetching item count:', error)
		})
	}

	const fetchPurchasedCount = async () => {
		axios.get('https://localhost:7143/api/shopItems/purchasedCount')
		.then((response) => {
			setItemPurchasedCount(response.data)
		})
		.catch((error) => {
			console.error('Error fetching purchased count:', error)
		})
	}

	const addToQueue = async (shopItemId: number) => {
		axios.put(`https://localhost:7143/api/shopItems/updateQueueStatus/${shopItemId}`)
		.then(() => {
			console.log('Item added to queue successfully')
			fetchQueueData()
			fetchData()
		})
		.catch((error) => {
			console.error('Error adding item to queue:', error)
		})
	}

	const setAsPurchased = async (shopItemId: number) => {
		axios.put(`https://localhost:7143/api/shopItems/updatePurchased/${shopItemId}`)
		.then(() => {
			console.log('Item set as purchased successfully')
			fetchData()
			fetchQueueData()
		})
		.catch((error) => {
			console.error('Error setting item as purchased:', error)
		})
	}

	const deleteItem = async (shopItemId: number) => {
		axios.delete(`https://localhost:7143/api/shopItems/${shopItemId}`)
		.then(() => {
			console.log('Item deleted successfully')
			fetchData()
			fetchQueueData()
		})
		.catch((error) => {
			console.error('Error deleting item:', error)
		})
	}

	const setPriority = async (shopItemId: number, priority: number) => {
		axios.put(`https://localhost:7143/api/shopItems/updatePriority/${shopItemId}`, null, {params: { shopItemId: shopItemId, newPriority: priority }})
		.then(() => {
			console.log('Item priority updated successfully')
			fetchData()
		})
		.catch((error) => {
			console.error('Error updating item priority:', error)
		})
	}

	const handleItemTagChange = async (shopItemId: number, tagId: number) => {
		axios.put(`https://localhost:7143/api/shopItems/updateTag/${shopItemId}`, null, {params: { shopItemId: shopItemId, tagId: tagId }})
		.then(() => {
			console.log('Item tag updated successfully')
			fetchData()
		})
		.catch((error) => {
			console.error('Error updating item tag:', error)
		})
	}

	const handleItemCategoryChange = async (shopItemId: number, categoryId: number) => {
		axios.put(`https://localhost:7143/api/shopItems/updateCategory/${shopItemId}`, null, {params: { shopItemId: shopItemId, categoryId: categoryId }})
		.then(() => {
			console.log('Item category updated successfully')
			fetchData()
		})
		.catch((error) => {
			console.error('Error updating item category:', error)
		})
	}

	const handleNewTagSubmit = async () => {
		axios.post('https://localhost:7143/api/tags', null, {params: { tagName: newTag }})
		.then((response) => {
			console.log("Tag added successfully:", response.data)
			fetchTagData()
		})
		.catch((error) => {
			console.error('Error adding tag:', error)
		})
	}

	const handleNewCategorySubmit = async () => {
		axios.post('https://localhost:7143/api/categories', null, {params: { categoryName: newCategory }})
		.then((response) => {
			console.log("Category added successfully:", response.data)
			fetchCategoryData()
		})
		.catch((error) => {
			console.error('Error adding category:', error)
		})
	}

	const handleEditSubmit = async (shopItemId: number, itemName: string, details: string, price: number, link: string) => {
		axios.put(`https://localhost:7143/api/shopItems/${shopItemId}`, null, {params: { shopItemId: shopItemId, newName: itemName, newDetails: details, newPrice: price, newLink: link }})
		.then(() => {
			console.log('Item updated successfully')
			fetchData()
		})
		.catch((error) => {
			console.error('Error updating item:', error)
		})
	}

	const handleClearFilters = () => {
		setFilters({
			tagId: 0,
			categoryId: 0,
			purchased: false,
			priority: 0,
			onQueue: false
		})
		setSelectedFilterCategory(new Set([]))
		setSelectedFilterTag(new Set([]))
		setSelectedFilterPriority(new Set([]))
		setPurchasedFilterIsSelected(false)
	}

	const fetchQueuePrice = async () => {
		axios.get('https://localhost:7143/api/shopItems/queueTotalPrice')
		.then((response) => {
			setQueuePrice(response.data)
		})
		.catch((error) => {
			console.error('Error fetching queue price:', error)
		})
	}

	useEffect(() => {
		fetchData()
		fetchQueueData()
		fetchTagData()
		fetchCategoryData()
		fetchQueuePrice
	}, [])

	useEffect(() => {
		fetchDataCount()
		fetchPurchasedCount()
	}, [itemData])

	useEffect(() => {
		fetchQueuePrice()
	}, [queueItemData])

	const tagsRender = tagData.map((tag: Tag) => {
		return (
			<SelectItem
				key={tag.tagId}
				value={tag.tagName}
			>{tag.tagName}</SelectItem>
		)
	})

	const categoriesRender = categoryData.map((category: Category) => {
		return (
			<SelectItem
				key={category.categoryId}
				value={category.categoryName}
			>{category.categoryName}</SelectItem>
		)
	})

	const itemsRender = itemData.map((item: Item) => {
		return (
			<ShopItem
				key={item.shopItemId}
				shopItemId={item.shopItemId}
				itemName={item.itemName}
				details={item.details}
				priority={item.priority}
				onQueue={item.onQueue}
				purchased={item.purchased}
				price={item.price}
				referenceLink={item.referenceLink}
				tag={item.tag}
				category={item.category}
				addToQueue={() => addToQueue(item.shopItemId)}
				togglePurchased={() => setAsPurchased(item.shopItemId)}
				deleteItem={() => deleteItem(item.shopItemId)}
				//@ts-ignore
				setPriority={(newPriority: number) => setPriority(item.shopItemId, newPriority)}
				handleEdit={(itemName: string, details: string, price: number, link: string) => handleEditSubmit(item.shopItemId, itemName, details, price, link)}
				handleItemTagChange={(tagId: number) => handleItemTagChange(item.shopItemId, tagId)}
				handleItemCategoryChange={(categoryId: number) => handleItemCategoryChange(item.shopItemId, categoryId)}
			/>
		)
	})

	const queueItemsRender = queueItemData.map((item: Item) => {
		return (
			<ShopItem 
				key={item.shopItemId}
				shopItemId={item.shopItemId}
				itemName={item.itemName}
				details={item.details}
				priority={item.priority}
				onQueue={item.onQueue}
				purchased={item.purchased}
				price={item.price}
				referenceLink={item.referenceLink}
				tag={item.tag}
				category={item.category}
				addToQueue={() => addToQueue(item.shopItemId)}
				togglePurchased={() => setAsPurchased(item.shopItemId)}
				deleteItem={() => deleteItem(item.shopItemId)}
				//@ts-ignore
				setPriority={(newPriority: number) => setPriority(item.shopItemId, newPriority)}
				handleEdit={(itemName: string, details: string, price: number, link: string) => handleEditSubmit(item.shopItemId, itemName, details, price, link)}
				handleItemTagChange={(tagId: number) => handleItemTagChange(item.shopItemId, tagId)}
				handleItemCategoryChange={(categoryId: number) => handleItemCategoryChange(item.shopItemId, categoryId)}
			/>
		)
	})

	return (
		<div className="flex flex-row min-h-full text-gray-200">
			<div className="flex flex-col gap-2 w-1/5 p-4 border-r-2 border-zinc-700 min-h-full">
				<div className="flex flex-row justify-around items-center">
					<Button className="bg-green-900 text-lime-400" onPress={onOpen}>Add Item</Button>
					<Modal
						isOpen={isOpen}
						onOpenChange={onOpenChange}
						placement="top-center"
						className="dark"
					>
						<ModalContent>
							{(onClose) => (
								<form onSubmit={handleNewItemSubmit}>
									<ModalHeader className="text-gray-200">Add new item</ModalHeader>
									<ModalBody>
										<Input autoFocus label="Item name" name="itemName" size="sm" onChange={handleNewItemChange} value={newItem.itemName} />
										<div className="flex flex-row justify-between gap-3">
											{/* @ts-ignore */}
											<Input size="sm" label="Estimated price" name="price" type="number" onChange={handleNewItemChange} value={newItem.price} />
										</div>
										{/* @ts-ignore */}
										<Select label="Select a tag" size="sm" selectedKeys={selectedTag} onSelectionChange={setSelectedTag}>
											{tagsRender}
										</Select>
										{/* @ts-ignore */}
										<Select label="Select a category" size="sm" selectedKeys={selectedCategory} onSelectionChange={setSelectedCategory}>
											{categoriesRender}
										</Select>
									</ModalBody>
									<ModalFooter className="flex flex-row justify-between">
										<Button color="danger" onPress={onClose}>Cancel</Button>
										<Button id="addButton" color="success" onPress={onClose} type="submit">Confirm</Button>
									</ModalFooter>
								</form>
							)}
						</ModalContent>
					</Modal>
					<div className="flex flex-col w-1/3">
						<Input size="sm" variant="bordered" label="New tag" name="newTag" onChange={handleNewTagChange} value={newTag} 
							endContent={<Button isIconOnly variant="light" color="success" className="" onPress={handleNewTagSubmit}><CiSquarePlus size={30} /></Button>} 
						/>
					</div>
					<div className="flex flex-col w-1/3">
						<Input size="sm" variant="bordered" label="New category" name="newCategory" onChange={handleNewCategoryChange} value={newCategory} 
							endContent={<Button isIconOnly variant="light" color="success" className="" onPress={handleNewCategorySubmit}><CiSquarePlus size={30} /></Button>} 
						/>
					</div>
				</div>
				<Divider className="dark mt-2" />
				<div className="flex flex-col gap-2 px-6">
					<span className="text-lg px-2">Filters</span>
					<div>
						<Checkbox isSelected={purchasedFilterIsSelected} onValueChange={setPurchasedFilterIsSelected} className="dark text-gray-200" radius="none" size="md">Show only purchased</Checkbox>
					</div>
					{/* @ts-ignore */}
					<Select label="Select a tag" size="sm" className="dark" selectedKeys={selectedFilterTag} onSelectionChange={setSelectedFilterTag}>
						{tagsRender}
					</Select>
					{/* @ts-ignore */}
					<Select label="Select a category" size="sm" className="dark" selectedKeys={selectedFilterCategory} onSelectionChange={setSelectedFilterCategory}>
						{categoriesRender}
					</Select>
					{/* @ts-ignore */}
					<Select label="Select a priority" size="sm" className="dark" selectedKeys={selectedFilterPriority} onSelectionChange={setSelectedFilterPriority}>
						<SelectItem key="1" value="1">1 (highest)</SelectItem>
						<SelectItem key="2" value="2">2</SelectItem>
						<SelectItem key="3" value="3">3</SelectItem>
						<SelectItem key="4" value="4">4 (lowest)</SelectItem>
					</Select>
					<Button onPress={handleClearFilters}>Clear filters</Button>
				</div>
			</div>
			<div className="flex flex-col gap-4 w-4/5 p-4 px-10">
				<div className="flex flex-col">
					<div className="flex flex-row justify-between">
						<span>Total purchases completion</span>
						<span>{itemPurchasedCount} / {itemTotalCount}</span>
					</div>
					<Progress size="sm" value={itemPurchasedCount} maxValue={itemTotalCount} />
				</div>
				<div className="flex flex-col">
					<span className="text-lime-500 font-bold">Currently on queue - Remaining budget: {queuePrice}</span>
					<div className="flex flex-col gap-2 border border-lime-600 p-6 px-10 rounded-lg">
						{queueItemsRender.length == 0 ? <span className="text-center text-3xl text-lime-600">No items on queue</span> : queueItemsRender}
					</div>
				</div>
				<Divider className="dark" />
				<div className="flex flex-col gap-2 px-10">
					{itemsRender.length == 0 ? <span className="text-center text-3xl">No items found matching current filters</span> : itemsRender}
				</div>
			</div>
		</div>
	)
}
