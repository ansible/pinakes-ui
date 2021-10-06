import * as React from 'react';
import { LoginForm, LoginPage as PFLoginPage } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import Logo from './static/images/logo_large.svg';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import axios, { AxiosInstance } from 'axios';
import { stringify } from 'qs';

interface IState {
  usernameValue: string;
  passwordValue: string;
  errorMessage: string;
  redirect?: string;
}

let axiosInstanceStandalone = null;

const LoginPage = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [redirect, setRedirect] = useState('');

  if (redirect) {
    return <Redirect push to={redirect} />;

    const helperText = (
      <span style={{ color: 'var(--pf-global--danger-color--100)' }}>
        <ExclamationCircleIcon />
        {'   '}
        {errorMessage}
      </span>
    );
    const handleUsernameChange = (value: string) => {
      setUserName(value);
    };

    const handlePasswordChange = (password: string) => {
      setPassword(password);
    };

    const onLoginButtonClick = (event: any) => {
      const token = Buffer.from(`${userName}:${password}`, 'utf8').toString(
        'base64'
      );

      const axiosInstance = axios.create({
        paramsSerializer: (params) => stringify(params),
        auth: {
          username: userName,
          password
        },
        Authorization: `Basic ${token}`
      });
      axiosInstanceStandalone = axiosInstance;
      event.preventDefault();
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
  }
};

export default LoginPage;
