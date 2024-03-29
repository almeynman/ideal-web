import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/combineLatest';

const combineTemplate = (template = {}) => {
  const streams = [];
  const funcs = [];
  const current = ctxStack => ctxStack[ctxStack.length - 1];
  const setValue = (ctxStack, key, value) =>
    current(ctxStack)[key] = value;
  const applyStreamValue = (key, index) =>
    (ctxStack, values) => setValue(ctxStack, key, values[index]);
  const mkContext = value => Array.isArray(value) ? [] : {};
  const pushContext = (key, value) => (ctxStack) => {
    const newContext = mkContext(value);
    setValue(ctxStack, key, newContext);
    return ctxStack.push(newContext);
  };
  const constantValue = (key, value) => ctxStack => setValue(ctxStack, key, value);
  const compile = (value, key) => {
    if (value && value.subscribe && value.publish) {
      streams.push(value);
      return funcs.push(applyStreamValue(key, streams.length - 1));
    } else if (value && (value.constructor === Object || value.constructor === Array)) {
      const popContext = (ctxStack) => ctxStack.pop();
      funcs.push(pushContext(key, value));
      compileTemplate(value); // eslint-disable-line
      return funcs.push(popContext);
    }
    return funcs.push(constantValue(key, value));
  };
  const compileTemplate = tmpl => {
    if (Array.isArray(tmpl)) {
      template.forEach(compile);
    } else {
      Object.keys(template).forEach(key => compile(template[key], key));
    }
  };
  const combinator = (...values) => {
    const rootContext = mkContext(template);
    const ctxStack = [rootContext];
    for (let i = 0, f; i < funcs.length; i++) {
      f = funcs[i];
      f(ctxStack, values);
    }
    return rootContext;
  };

  compileTemplate(template);
  return Observable.combineLatest(...streams, combinator);
};

export default combineTemplate;
