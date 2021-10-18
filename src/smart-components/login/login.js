import * as React from 'react';
import { LoginForm, LoginPage as PFLoginPage } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import Logo from '../../assets/images/logo-large.svg';
import { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useHistory } from 'react-router';

const LoginPage = (props) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirect, setRedirect] = useState(null);
  const history = useHistory();

  const helperText = (
    <span style={{ color: 'var(--pf-global--danger-color--100)' }}>
      <ExclamationCircleIcon />
      {'   '}
      {errorMessage}
    </span>
  );
  const handleUsernameChange = (value) => {
    setUserName(value);
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
  };

  const onLoginButtonClick = (event) => {
    const token = Buffer.from(`${userName}:${password}`, 'utf8').toString(
      'base64'
    );
    window.catalog.token = token;
    event.preventDefault();
    return history.push('/catalog/portfolios');
  };

  const loginForm = (
    <LoginForm
      showHelperText={!!errorMessage}
      helperText={helperText}
      usernameLabel={`Username`}
      usernameValue={userName}
      onChangeUsername={handleUsernameChange}
      passwordLabel={`Password`}
      passwordValue={password}
      onChangePassword={handlePasswordChange}
      onLoginButtonClick={onLoginButtonClick}
    />
  );

  return (
    <PFLoginPage
      style={{
        backgroundColor: 'var(--pf-global--BackgroundColor--dark-100)'
      }}
      loginTitle={`Log in to your account`}
      brandImgSrc={Logo}
    >
      {loginForm}
    </PFLoginPage>
  );
};

export default LoginPage;
