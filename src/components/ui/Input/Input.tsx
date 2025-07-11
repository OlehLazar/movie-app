import styles from './Input.module.scss';

interface InputProps {
  type?: string;
  value?: string | number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  accept?: string;
}

const Input = ({ type = "text", value, placeholder, onChange, className, disabled, ref, accept }: InputProps) => {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      className={`${styles.input} ${className ?? ""}`}
      disabled={disabled}
      ref={ref}
      accept={accept}
    />
  );
};

export default Input;
