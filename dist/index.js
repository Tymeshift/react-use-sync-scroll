(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = global || self, global.useSyncScroll = factory(global.React));
}(this, (function (React) { 'use strict';

  React = React && Object.prototype.hasOwnProperty.call(React, 'default') ? React['default'] : React;

  function syncScroll(target, others, TopLeft, WidthHeight) {
    const percentage = target[`scroll${TopLeft}`] / (target[`scroll${WidthHeight}`] - target[`offset${WidthHeight}`]);
    window.requestAnimationFrame(() => {
      others.forEach(el => {
        el[`scroll${TopLeft}`] = Math.round(percentage * (el[`scroll${WidthHeight}`] - el[`offset${WidthHeight}`]));
      });
    });
  }

  function syncVerticalScroll(target, others) {
    syncScroll(target, others, "Top", "Height");
  }

  function syncHorizontalScroll(target, others) {
    syncScroll(target, others, "Left", "Width");
  }

  function useSyncScroll({
    vertical,
    horizontal
  }) {
    const refsRef = React.useRef([]);
    const locksRef = React.useRef(0);
    React.useEffect(() => {
      if (refsRef.current.length < 2) return;

      function handleScroll({
        target
      }) {
        if (locksRef.current > 0) {
          locksRef.current -= 1; // Release lock by 1

          return;
        }

        locksRef.current = refsRef.current.length - 1; // Acquire lock

        const others = refsRef.current.filter(ref => ref !== target);
        if (vertical) syncVerticalScroll(target, others);
        if (horizontal) syncHorizontalScroll(target, others);
      }

      const elements = refsRef.current;
      elements.forEach(el => el.addEventListener("scroll", handleScroll));
      return () => {
        elements.forEach(el => el.removeEventListener("scroll", handleScroll));
      };
    }, [refsRef, vertical, horizontal, locksRef]);
    return ref => refsRef.current.push(ref);
  }

  return useSyncScroll;

})));
