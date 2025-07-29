import test from 'ava';
import {
    app,
    css,
    extractCss,
    globalCss,
    h,
    html,
    keyframes,
    memo,
    styled,
    text
} from '../index.js';

test('styled.div returns a function that creates an element', t => {
    const Box = styled.div`
    background: red;
  `;
    const node = Box({ id: 'test' }, ['Hello']);
    t.is(node.tag, 'div');
    t.is(node.props.id, 'test');
    t.deepEqual(node.children, ['Hello']);
});

test('css returns a className string', t => {
    const className = css`
    color: green;
  `;
    t.is(className, 'hyper-2');
});

test('globalCss returns a className or ID', t => {
    const className = globalCss`
    body {
      margin: 0;
    }
  `;
    t.is(className, 'hyper-3');
});

test('extractCss returns accumulated CSS as string', t => {
    css`color: blue;`;
    const extracted = extractCss();
    t.assert(typeof extracted === 'string');
    t.is(extracted, 'body{margin:0;}.hyper-1{background:red;}.hyper-2{color:green;}.hyper-4{color:blue;}');
});

test('html renders template with variables', t => {
    const name = 'World';
    const vnode = html`<h1>Hello ${name}</h1>`;
    t.is(vnode.tag, 'h1');
    t.deepEqual(vnode.children, [
        {
            children: [],
            key: undefined,
            node: undefined,
            props: {},
            tag: 'Hello ',
            type: 3,
        },
        {
            children: [],
            key: undefined,
            node: undefined,
            props: {},
            tag: 'World',
            type: 3,
        }
    ]);

});


test('text returns string as vnode child', t => {
    const result = text('hi');
    t.deepEqual(result, {
        children: [],
        key: undefined,
        node: undefined,
        props: {},
        tag: 'hi',
        type: 3,
    });
});
