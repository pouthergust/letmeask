import { useState } from "react";

type ButtonProps = {
    num?: number;
}

export function Button({ num }: ButtonProps) {
    // let counter = 0;
    const [counter, setCounter] = useState(0);

    function increment() {
        setCounter(counter + (num || 1));
        console.log(counter)
    }

    return (
        <button onClick={increment} >
            {counter}
        </button>
    );
}

// name exported