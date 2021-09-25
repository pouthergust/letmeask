import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: ButtonProps) {
    // const [counter, setCounter] = useState(0);

    // function increment() {
    //     setCounter(counter + (num || 1));
    //     console.log(counter)
    // }

    return (
        <button className="button" {...props} />
    );
}

// name exported