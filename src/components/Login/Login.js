import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
    switch (action.type) {
        case 'USER_INPUT':
            return { value: action.val, isValid: action.val.includes('@')  };
        case 'USER_BLUR':
            return { value: state.value, isValid: state.value.includes('@')  };
        default:
            return { value: '', isValid: false };
  }
};

const passwordReducer = (state, action) => {
    switch (action.type) {
        case 'USER_INPUT':
            return { value: action.val, isValid: action.val.trim().length > 6  };
        case 'USER_BLUR':
            return { value: state.value, isValid: state.value.trim().length > 6 };
        default:
            return { value: '', isValid: false };
  }
};

const Login = (props) => {
  const authCtx = useContext(AuthContext);

  const emailRef = useRef();
  const passwordRef = useRef();

  const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: null });

//  const [enteredEmail, setEnteredEmail] = useState('');
//  const [emailIsValid, setEmailIsValid] = useState();
//  const [enteredPassword, setEnteredPassword] = useState('');
//  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
      const handler = setTimeout(() => {
          console.log("check step");
          setFormIsValid(emailIsValid && passwordIsValid);
      }, 500);

    return () => {
        console.log("cleanup")
        clearTimeout(handler);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    //setEnteredEmail(event.target.value);
    dispatchEmail({val: event.target.value, type: 'USER_INPUT' });

    // setFormIsValid(
    //   emailState.isValid && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
//    setEnteredPassword(event.target.value);
    dispatchPassword({val: event.target.value, type: 'USER_INPUT' });

    // setFormIsValid(
    //   passwordState.isValid && emailState.isValid
    // );
  };

  const validateEmailHandler = () => {
//    setEmailIsValid(emailState.value.includes('@'));
    dispatchEmail({type: 'USER_BLUR' });

  };

  const validatePasswordHandler = () => {
//    setPasswordIsValid(enteredPassword.trim().length > 6);
    dispatchPassword({type: 'USER_BLUR' });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailRef.current.focus();
    } else {
      passwordRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          id="email"
          label="E-mail"
          type="email"
          isValid={emailIsValid}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordIsValid}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
