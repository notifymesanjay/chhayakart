import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './notification.css'
import { IoNotifications } from 'react-icons/io5'
import Pagination from 'react-js-pagination';
import api from '../../api/api';
import Cookies from 'universal-cookie'
import Loader from '../loader/Loader';
// import No_Notification from '../../utils/zero-state-screens/No_Notification.svg'
import No_Notification from '../../utils/zero-state-screens/No_Notification.svg'

const Notification = () => {
  const user = useSelector(state => (state.user))

  const total_notification_per_page = 10;

  //initialize cookies
  const cookies = new Cookies();

  const [totalNotification, settotalNotification] = useState(null)
  const [currPage, setcurrPage] = useState(1)
  const [notification, setnotifications] = useState(null)
  const [offset, setoffset] = useState(0)
  const [isLoader, setisLoader] = useState(false)

  const fetchNotification = () => {
    api.getNotification(cookies.get('jwt_token'), total_notification_per_page, offset)
      .then(response => response.json())
      .then(result => {
        if (result.status === 1) {
          setisLoader(false)
          setnotifications(result.data)
          settotalNotification(result.total)
        }
      })
      .catch(error => console.log(error))
  }

  useEffect(() => {
    if (cookies.get('jwt_token') !== undefined && user.user !== null) {
      fetchNotification()
    }
  }, [user])

  useEffect(() => {
    setisLoader(true)
    fetchNotification()
  }, [offset])


  //page change
  const handlePageChange = (pageNum) => {
    setcurrPage(pageNum);
    setoffset(pageNum * total_notification_per_page - total_notification_per_page)
  }

  return (
    <div className='notification'>
      {notification === null
        ? (
          <Loader screen='full' />
        )
        : (
          <div className='notification-container container'>
            <div className='heading'> All Notification</div>
            {notification.length === 0
              ? (<div className='notification-body no-notification'>
                <img src={No_Notification} alt='no-notification'></img>
                <p>No Notification Found!!</p>
              </div>)
              : (
                <>
                  {isLoader ? <Loader width='100%' height='300px' /> : (
                    <div className='notification-body'>
                      {notification.map((ntf, index) => (
                        <div key={index} className='wrapper'>
                          {ntf.image_url === "" ? <div className='logo' style={{ background: "var(--secondary-color)" }}><IoNotifications fill='#fff' fontSize='5rem' /></div> : <img src={ntf.image_url} alt='notification'></img>}
                          <div className='content'>
                            <p className='title'>{ntf.title}</p>
                            <p>{ntf.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {notification.length !== 0 ?
                    <Pagination
                      activePage={currPage}
                      itemsCountPerPage={total_notification_per_page}
                      totalItemsCount={totalNotification}
                      pageRangeDisplayed={5}
                      onChange={handlePageChange.bind(this)}
                    />
                    : null}
                </>
              )}
          </div>)}
    </div>
  )
}

export default Notification
