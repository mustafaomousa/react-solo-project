import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import AccountModal from '../AccountModal';
import Modal from 'react-modal';

import SearchResultsPage from '../SearchResultsPage';
import * as sessionActions from '../../store/session';

import './navigation.css';
import { set } from 'js-cookie';

const Navigation = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [accountIsOpen, setAccountIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const sessionUser = useSelector(state => state.session.user);
    const allPosts = useSelector(state => state.posts.allPosts)


    const updateSearch = (e) => setSearch(e.target.value);

    const handleLogout = (e) => {
        e.preventDefault();

        dispatch(sessionActions.logout());
        return history.push('/')
    };

    return (
        <div className='nav-bar-holder'>
            <div className='nav-bar'>
                <div className='nav-buttons-container'>
                    {sessionUser && (
                        <>
                            <div className='buttons-container'>
                                <NavLink to='/discover'>Discover</NavLink>
                                <NavLink to={`/${sessionUser.username}`}>Profile</NavLink>
                            </div>
                            <div className='search-container'>
                                <input onChange={updateSearch} id='search' placeholder='search'></input>
                            </div>

                        </>
                    )}
                </div>
                <div className={'nav-logo-container'}>
                    <h2>Rumblr</h2>
                </div>
                <div className='profile-buttons-container'>
                    {sessionUser && (
                        <>
                            <i onClick={() => setAccountIsOpen(!accountIsOpen)} id='profile-icon' className='fas fa-id-card'></i>
                            <button id='logout' onClick={handleLogout}>Logout</button>
                        </>
                    )}
                </div>

            </div >
            <div className='divider shown' />
            {search && (
                <div className='search-results-container'>
                    <SearchResultsPage searchTerm={search} posts={allPosts} />
                </div>
            )}
            {sessionUser && <Modal animationType='fade' className={'ReactModal__Content'} isOpen={accountIsOpen}>
                <i onClick={() => setAccountIsOpen(false)} className='fas fa-times-circle' id='close-button'></i>
                <AccountModal sessionUser={sessionUser}></AccountModal>
            </Modal>}
        </div>
    )
};

export default Navigation;