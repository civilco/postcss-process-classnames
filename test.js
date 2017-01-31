import postcss from 'postcss';
import fs from 'fs';
import test from 'ava';

import plugin from './';

test('hash classnames and output the lookup', t => {
  let input = `.container[data-container] {
    position: absolute;
    background-color: black;
    height: 100%;
    width: 100%;
}

.container[data-container] .chromeless {
    cursor: default;
}

[data-player]:not(.nocursor) .container[data-container]:not(.chromeless).pointer-enabled {
    cursor: pointer;
}

.media-control-notransition {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    transition: none !important;
}`;

  let cssOutput = `.c365a80ca6bf1cda187553a114939c5eb[data-container] {
    position: absolute;
    background-color: black;
    height: 100%;
    width: 100%;
}

.c365a80ca6bf1cda187553a114939c5eb[data-container] .c778a8272c39923bc437e43309271db9b {
    cursor: default;
}

[data-player]:not(.cde8fb0558aaf7a108eb848ab75f8df29) .c365a80ca6bf1cda187553a114939c5eb[data-container]:not(.c778a8272c39923bc437e43309271db9b).cef45bf2c20193722bff7895f5bfbb020 {
    cursor: pointer;
}

.c119202022ec1b092abf8d8c0f02747c2 {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    transition: none !important;
}`;


  let output = {
    c365a80ca6bf1cda187553a114939c5eb: 'container',
    c778a8272c39923bc437e43309271db9b: 'chromeless',
    cde8fb0558aaf7a108eb848ab75f8df29: 'nocursor',
    cef45bf2c20193722bff7895f5bfbb020: 'pointer-enabled',
    c119202022ec1b092abf8d8c0f02747c2: 'media-control-notransition',
  };

  return postcss([ plugin({
    file: './test1.json',
  }) ])
  .process(input)
  .then( result => {
    let json = JSON.parse(fs.readFileSync('./test1.json'));

    console.log(result.css);

    t.deepEqual(json, output);
    t.is(result.css, cssOutput);
    t.deepEqual(result.warnings().length, 0);
  })
  .then(()=>new Promise((resolve, reject)=>fs.unlink('./test1.json', resolve)))
});
