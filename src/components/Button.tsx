import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};

export function Button({ isOutlined = false, ...props }: ButtonProps) {
    // const [counter, setCounter] = useState(0);

    // function increment() {
    //     setCounter(counter + (num || 1));
    //     console.log(counter)
    // }

    return (
        <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props} />
    );
}

// name exported