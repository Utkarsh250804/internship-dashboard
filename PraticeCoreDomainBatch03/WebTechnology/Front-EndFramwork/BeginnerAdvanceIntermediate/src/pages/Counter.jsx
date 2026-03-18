import React, { useState } from "react";

function Counter() {

  const [count, setCount] = useState(0);

  return (
    <div className="container text-center mt-5">

      <h2>Button Click Counter</h2>

      <h1>{count}</h1>

      <button
        className="btn btn-primary"
        onClick={() => setCount(count + 1)}
      >
        Click Me
      </button>

    </div>
  );
}

export default Counter;