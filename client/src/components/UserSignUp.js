import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserSignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className='bounds'>
      <div className='grid-33 centered signin'>
        <h1>Sign Up</h1>
        <div>
          <form>
            <div>
              <input
                id='firstName'
                name='firstName'
                type='text'
                placeholder='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <input
                id='lastName'
                name='lastName'
                type='text'
                placeholder='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div>
              <input
                id='emailAddress'
                name='emailAddress'
                type='text'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div>
              <input
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className='grid-100 pad-bottom'>
              <button className='button' type='submit'>
                Sign Up
              </button>
              <Link className='button button-secondary' to='/'>
                Cancel
              </Link>
            </div>
          </form>
        </div>
        <p>&nbsp;</p>
        <p>
          Already have a user account? <Link to='/signin'>Click here </Link> to
          sign in!
        </p>
      </div>
    </div>
  );
};

export default UserSignUp;
