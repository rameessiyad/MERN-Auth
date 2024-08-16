import React from 'react'
import { Container, Nav, Navbar, NavDropdown, Badge } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../redux/slices/usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logout } from '../redux/slices/authSlice'

const Header = () => {
    const { userInfo } = useSelector((state) => state.auth)

    const [logoutApiCall] = useLogoutMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/')
            toast.success('You logged out')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <header>
            <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>MERN Auth</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id='basic-navvar-nav'>
                        <Nav className="ms-auto">
                            {userInfo ? (
                                <>
                                    <NavDropdown title={userInfo.username} id='username'>
                                        <LinkContainer to='/profile'>
                                            <NavDropdown.Item>
                                                Profile
                                            </NavDropdown.Item>
                                        </LinkContainer>

                                        <NavDropdown.Item onClick={logoutHandler}>
                                            Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </>
                            ) : (
                                <>
                                    <LinkContainer to='/login'>
                                        <Nav.Link>
                                            Sign in
                                        </Nav.Link>
                                    </LinkContainer>

                                    <LinkContainer to='/register'>
                                        <Nav.Link>
                                            Sign up
                                        </Nav.Link>
                                    </LinkContainer>
                                </>
                            )}


                        </Nav>
                    </Navbar.Collapse>
                </Container >
            </Navbar >
        </header >
    )
}

export default Header