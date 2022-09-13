import React, { useState, InputHTMLAttributes, useEffect } from 'react';

type PasswordProps = InputHTMLAttributes<HTMLInputElement> & {
  onChange?: (value: string) => void;
};

const Password: React.FC<PasswordProps> = (props) => {
  const [password, setPassword] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    const newChar = newValue.slice(-1);

    setPassword((prevState: string) => {
      if (newValue.length < prevState.length)
        return prevState.substring(0, newValue.length);
      else if (newValue.length === prevState.length + 1)
        return prevState + newChar;
      else
        return (
          prevState + newValue.substring(prevState.length, newValue.length)
        );
    });

    if (inputValue.length + 1 === newValue.length) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setInputValue(newValue.slice(0, -1).replace(/./g, '•') + newChar);
      } else setInputValue(newValue);

      setTimeoutId(
        setTimeout(() => {
          setInputValue((prevState) => prevState.slice(0, -1) + '•');
          setTimeoutId(undefined);
        }, 500)
      );
    } else if (inputValue.length + 1 < newValue.length) {
      setInputValue(newValue.replace(/./g, '•'));
    } else {
      setInputValue(newValue);
    }
  };

  useEffect(() => {
    if (props.onChange) props.onChange(password);
  }, [password]);

  return (
    <>
      <input
        {...props}
        type="text"
        value={showPassword ? password : inputValue}
        onChange={handleChange}
      />
      <span
        style={{ userSelect: 'none', cursor: 'pointer' }}
        onMouseDown={() => setShowPassword(true)}
        onMouseUp={() => setShowPassword(false)}
        onMouseLeave={() => setShowPassword(false)}
      >
        👁
      </span>
    </>
  );
};

export default Password;
