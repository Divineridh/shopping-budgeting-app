import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { NextUIProvider } from '@nextui-org/react'
import LoginPage from './pages/Login'
import Layout from './pages/Layout'
import Home from './pages/Home'


function App() {
	const navigate = useNavigate()

    return (
        <div className="flex flex-col overflow-x-hidden">
			<NextUIProvider navigate={navigate}>
				<Routes>
					<Route path="/" element={<LoginPage />} />
					<Route element={<Layout />}>
						<Route path="/home" element={<Home />} />
					</Route>
				</Routes>
			</NextUIProvider>
        </div>
    )
}

export default App
