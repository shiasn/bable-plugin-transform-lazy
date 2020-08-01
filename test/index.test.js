const { transform } = require('@babel/core');
const plugin = require('../src');

const getOptions = (pluginConf) => ({
  babelrc: false,
  plugins: [
    [
      plugin,
      pluginConf
    ]
  ]
});

describe('abnormal', () => {
  it('should do nothing', () => {
    const source = 'import Page from "";';

    const { code } = transform(source, getOptions({ checker: (local) => local === 'any component' }));

    expect(code).toBe(source)
  })
})

describe('transform', () => {
  it('should add react import declaration', () => {
    const source = 'import Page from "./Page";'

    const { code } = transform(source, getOptions({ checker: () => true }));

    expect(code).toBe(`import { lazy } from "react";
const Page = lazy(() => import("./Page"));`);
  });

  it("should add lazy flag", () => {
    const source = `import React from "react"
import Page from "./Page";`;

    const { code } = transform(source, getOptions({ checker: () => true }));

    expect(code).toBe(`import React, { lazy } from "react";
const Page = lazy(() => import("./Page"));`)
  })

  it("should not add lazy flag", () => {
    const source = `import React, { lazy } from 'react';
import Page from "./Page";`

    const { code } = transform(source, getOptions({ checker: () => true }));

    expect(code).toBe(`import React, { lazy } from 'react';
const Page = lazy(() => import("./Page"));`)
  })
})

describe('plugin checker', () => {
  const source = `import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';`;

  it ('should not transfrom any import declaration', () => {
    const { code } = transform(source, getOptions({ checker: () => false }));

    expect(code).toBe(source);
  });

  it ('should transform any import declaration', () => {
    const { code } = transform(source, getOptions({ checker: () => true }));

    expect(code).toBe(`import { lazy } from "react";
const Page1 = lazy(() => import("./Page1"));
const Page2 = lazy(() => import("./Page2"));
const Page3 = lazy(() => import("./Page3"));`);
  })

  it ('should transform Page2', () => {
    const { code } = transform(source, getOptions({ checker: (local) => local === 'Page2' }));

    expect(code).toBe(`import { lazy } from "react";
import Page1 from './Page1';
const Page2 = lazy(() => import("./Page2"));
import Page3 from './Page3';`)
  });
});
