import { Button, Input, Tab, Tabs, Link, Modal, ModalContent, Card, CardBody, useDisclosure } from "@nextui-org/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
	username: string,
	email: string,
	password: string,
}

interface LoginUser {
	username: string,
	password: string,
}

export default function LoginPage() {

	const [selected, setSelected] = useState<string>("login")
	const handleSelectionChange = (key: React.Key) => {
		setSelected(key as string)
	}

	const {isOpen, onOpen, onOpenChange} = useDisclosure()

	const [newUser, setNewUser] = useState<User>({
		username: '',
		email: '',
		password: '',
	})
	const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewUser((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value
		}))
	}
	const handleSignupSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault()
		setNewUser
	}

	const [loginUser, setLoginUser] = useState<LoginUser>({
		username: '',
		password: '',
	})
	const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLoginUser((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value
		}))
	}

	const navigate = useNavigate()
	const handleLoginSubmit = () => {
		navigate('/home')
	}

  	return (
		<div className="flex flex-row h-screen">
			<div className="w-3/4 flex justify-center items-center bg-gradient-to-br from-indigo-800 via-purple-800 to-purple-900 text-gray-200">Login page</div>
			<div className="w-1/4 flex flex-col justify-center items-center dark bg-fuchsia-950">
				<Card className="w-[340px] h-[400px]">
					<CardBody className="overflow-hidden">
						<Tabs
						fullWidth
						size="md"
						aria-label="Tabs form"
						selectedKey={selected}
						onSelectionChange={handleSelectionChange}
						>
							<Tab key="login" title="Login">
								<form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
									<Input  label="Username" placeholder="Enter your username" type="text" name="username" value={loginUser.username} onChange={handleLoginChange} />
									<Input  label="Password" placeholder="Enter your password" type="password" name="password" value={loginUser.password} onChange={handleLoginChange} />
									<span className="text-center text-small">
										Need to create an account?{" "}
										<Link className="hover: cursor-pointer" size="sm" onPress={() => setSelected("signup")}>Sign up</Link>
									</span>
									<div className="flex gap-2 justify-end">
										<Button type="submit" fullWidth color="primary">Login</Button>
									</div>
								</form>
							</Tab>
							<Tab key="signup" title="Sign up">
								<form onSubmit={handleSignupSubmit} className="flex flex-col gap-4 h-[300px]">
									<Input isRequired label="Username" placeholder="Enter your username" type="text" name="username" value={newUser.username} onChange={handleSignupChange} />
									<Input isRequired label="Email" placeholder="Enter your email" type="email" name="email" value={newUser.email} onChange={handleSignupChange} />
									<Input isRequired label="Password" placeholder="Enter your password" type="password" name="password" value={newUser.password} onChange={handleSignupChange} />
									<span className="text-center text-small">
										Already have an account?{" "}
										<Link className="hover: cursor-pointer" size="sm" onPress={() => setSelected("login")}>Login</Link>
									</span>
									<div className="flex gap-2 justify-end">
										<Button type="submit" fullWidth color="primary" onPress={onOpen}>Sign up</Button>
										<Modal
											isOpen={isOpen}
											onOpenChange={onOpenChange}
											placement="top-center"
										>
											<ModalContent>
												{() => (
													<Card>
														<CardBody>
															<span>User created!</span>
														</CardBody>
													</Card>
												)}
											</ModalContent>
										</Modal>
									</div>
								</form>
							</Tab>
						</Tabs>
					</CardBody>
				</Card>
			</div>
		</div>
  	)
}
