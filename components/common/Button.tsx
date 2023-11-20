import React from 'react';

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  onClick,
  ...attributes
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-700 text-white text-base font-semibold py-2 px-4 rounded-lg"
      {...attributes}
    >
      {children}
    </button>
  );
};

export default Button;
