import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<NextUIProvider>
					<App />
				</NextUIProvider>
			</BrowserRouter>
		</QueryClientProvider>
	</React.StrictMode>,
)
