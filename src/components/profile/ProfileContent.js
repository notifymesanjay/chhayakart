import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import api from '../../api/api'
import { motion } from 'framer-motion'
import Cookies from 'universal-cookie'
import { ActionTypes } from '../../model/action-type'


const ProfileContent = (props) => {

    const user = useSelector(state => (state.user));

    //initialize Cookies
    const cookies = new Cookies();

    const dispatch = useDispatch();

    const [username, setusername] = useState(user.user.name)
    const [useremail, setuseremail] = useState(user.user.email)
    const [selectedFile, setselectedFile] = useState()


    const getCurrentUser = (token) => {
        api.getUser(token)
            .then(response => response.json())
            .then(result => {
                if (result.status === 1) {
                    dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: result.user });
                    props.setisupdating(false);
                }
            })
    }

    const handleUpdateUser = (e) => {
        e.preventDefault()

        props.setisupdating(true)
        if (cookies.get('jwt_token') !== undefined) {
            api.editProfile(username, useremail, selectedFile, cookies.get('jwt_token'))
                .then(response => response.json())
                .then(result => {
                    if (result.status === 1) {
                        getCurrentUser(cookies.get('jwt_token'));
                    }
                    else {
                    }
                })
        }
        setuseremail("")
        setselectedFile()
        setusername("")
    }

    return (
        <div className='d-flex flex-column'>
            <div className='heading'>
                My Profile
            </div>
            <div className='actual-content my-5'>
                {user.status === 'loading'
                    ? (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    )
                    : (
                        <form onSubmit={handleUpdateUser}>
                            <div className='inputs-container'>
                                <input type='text' placeholder='user name' value={username} onChange={(e) => {
                                    setusername(e.target.value)
                                }} required />
                                <input type='email' placeholder='email address' value={useremail} onChange={(e) => {
                                    setuseremail(e.target.value)
                                }} required />
                                <input type='tel' placeholder='mobile number' value={user.user.mobile} readOnly style={{color:"var(--sub-text-color)"}}/>
                                {/* accept={'image/*'} */}
                                <input type="file" id="file" onChange={(e) => { setselectedFile(e.target.files[0]) }} />
                            </div>
                            <button whileTap={{ scale: 0.8 }} type='submit' disabled={props.isupdating} >update profile</button>
                        </form>
                    )}

            </div>
        </div>
    )
}

export default ProfileContent
