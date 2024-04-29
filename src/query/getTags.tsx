import axios from 'axios'
import { useQuery } from 'react-query'

const fetchTags = async () => {
	const response = await axios.get('https://localhost:7143/api/tags')
	return response.data
}

export const getTags = () => {
	return useQuery('tags', fetchTags)
}