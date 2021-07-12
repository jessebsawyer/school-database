import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Context from '../context/context';

const UserSignIn = (props) => {
  // Initialize Context
  const userSignInContext = useContext(Context);

  const { user, isAuthenticated, userLogin, userLogout, error } =
    userSignInContext;

  const [userName, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    // Context call goes here...
    userLogin(userName, password);
  };

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/');
    }

    if (error) {
      console.log(error);
    }
  }, [props.history, isAuthenticated]);

  return (
    <div className='bounds'>
      <div className='grid-33 centered signin'>
        <h1>Sign In</h1>
        <div>
          <form onSubmit={submitHandler}>
            {error && <h2>{error}</h2>}
            <div>
              <input
                id='emailAddress'
                name='emailAddress'
                type='text'
                placeholder='Email Address'
                value={userName}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id='password'
                name='password'
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className='grid-100 pad-bottom'>
              <button className='button' type='submit'>
                Sign In
              </button>
              <Link className='button button-secondary' to='/'>
                Cancel
              </Link>
            </div>
          </form>
        </div>
        <p>&nbsp;</p>
        <p>
          Don't have a user account? <Link to='/signup'>Click here </Link>to
          sign up!
        </p>
      </div>
    </div>
  );
};

export default UserSignIn;
