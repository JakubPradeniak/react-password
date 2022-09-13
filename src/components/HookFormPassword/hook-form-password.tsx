import React, { Ref, useState, InputHTMLAttributes, useEffect } from 'react';

type PasswordProps = InputHTMLAttributes<HTMLInputElement>;

const HookFormPassword = React.forwardRef(
  (
    { name, onChange, onBlur, ...props }: PasswordProps,
    ref: Ref<HTMLInputElement>
  ) => {
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

    return (
      <>
        <input
          {...props}
          type="text"
          value={showPassword ? password : inputValue}
          onChange={handleChange}
        />
        <input ref={ref} type="hidden" name={name} onChange={onChange} />
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
  }
);

export default HookFormPassword;
