import React, { useEffect, useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import { setCredentials } from '../redux/slices/authSlice'
import { useUpdateUserMutation } from '../redux/slices/usersApiSlice'

const ProfileScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { userInfo } = useSelector((state) => state.auth)

    const [updateuser, { isLoading }] = useUpdateUserMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setUsername(userInfo.username);
        setEmail(userInfo.email);
    }, [userInfo.setUsername, userInfo.setEmail])

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match")
        } else {
            try {
                const res = await updateuser({
                    _id: userInfo._id,
                    username,
                    email,
                    password
                }).unwrap();
                dispatch(setCredentials({ ...res }));
                toast.success("Profile updated");
                navigate('/')
            } catch (error) {
                toast.error(error?.data?.message || error.error);
            }
        }
    }
    return (
        <FormContainer>
            <h1>Update profile</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='username'>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type='text' placeholder='Enter Username' value={username} onChange={(e) => setUsername(e.target.value)} required></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} required></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} ></Form.Control>
                </Form.Group>

                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='mt-3'>{isLoading ? <Loader /> : 'Update'}</Button>
            </Form>
        </FormContainer>
    )
}

export default ProfileScreen