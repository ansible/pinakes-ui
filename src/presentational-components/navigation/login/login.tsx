import * as React from 'react';

import { LoginForm, LoginPage as PFLoginPage } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import Logo from '../../../assets/images/default-logo.svg';
import { useState } from 'react';

const LoginPage = () => {
  const [errorMessage, setLoginErrorMessage] = useState(undefined);
  const [usernameValue, setUserNameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');

  const helperText = (
    <span style={{ color: 'var(--pf-global--danger-color--100)' }}>
      <ExclamationCircleIcon />
      {'   '}
      {errorMessage}
    </span>
  );

  const handleUsernameChange = (value: string) => {
    setUserNameValue(value);
  };

  const handlePasswordChange = (passwordValue: string) => {
    setPasswordValue(passwordValue);
  };

  const onLoginButtonClick = () => {
    setPasswordValue('');
    setLoginErrorMessage('Invalid login credentials.' as any);
  };

  const loginForm = (
    <LoginForm
      showHelperText={!!errorMessage}
      helperText={helperText}
      usernameLabel={`Username`}
      usernameValue={usernameValue}
      onChangeUsername={handleUsernameChange}
      passwordLabel={`Password`}
      passwordValue={passwordValue}
      onChangePassword={handlePasswordChange}
      onLoginButtonClick={onLoginButtonClick}
    />
  );

  return (
    <PFLoginPage
      style={{
        backgroundColor: 'var(--pf-global--BackgroundColor--dark-100)'
      }}
      loginTitle={'Log in to your account'}
      brandImgSrc={Logo}
    >
      {loginForm}
    </PFLoginPage>
  );
};

export default LoginPage;
