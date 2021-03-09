import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import {
  Wrapper,
  Canvas
} from './style';

// import StrokePicker from './components/stroke-picker';

const App = () => {

  const canvasRef = useRef(null);

  const Paint = (e) => {
    const canvas = canvasRef.current;
    const { left, top } = canvas.getBoundingClientRect();

    const x = e.clientX - left, y = e.clientY - top;

    console.log(e);

    console.log(e.clientX , e.clientY);
    console.log(left, top);
    console.log(x, y);


    const ctx = canvas.getContext("2d");
    ctx.fillStyle="#FF0000";
    ctx.fillRect(x, y, 5, 5);
    return () => {
      ctx.clearRect(x, y, 5, 5);
    }
  }

  return (
    <Wrapper>
      <canvas
        width="256px"
        height="256px"
        ref={canvasRef}
        onClick={e => Paint(e)}
      >
      </canvas>
    </Wrapper>
  );
}

export default App;
