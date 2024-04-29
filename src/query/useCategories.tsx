import axios from 'axios'
import { useQuery } from 'react-query'

const fetchCategories = async () => {
	const response = await axios.get('https://localhost:7143/api/categories')
	return response.data
}

export const useCategories = () => {
	return useQuery('categories', fetchCategories)
}