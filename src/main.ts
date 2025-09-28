import * as $ from '../lib';

const logEffect = (effect: $.Effect, ident = '') => {
  console.log(ident + '---- Effect ---');
  console.log(ident + 'name: ' + effect.__name);
  if (effect.__context) console.log(ident + 'context: ' + effect.__context.__name);
};

const logContext = (context: $.Context, ident = '') => {
  console.log(ident + '---- Context ---');
  console.log(ident + 'name: ' + context.__name);
  if (context.__parent) console.log(ident + 'parent: ' + context.__parent.__name);
  const children = Array.from(context.__children);
  children.forEach((child) => logContext(child, '    '));

  const effects = Array.from(context.__effects);
  effects.forEach((effect) => logEffect(effect, '    '));
};

const context = $.context(() => {
  const [show, setShow] = $.signal(false);
  const [items, setItems] = $.signal([0, 1, 2]);

  const i = setInterval(() => {
    setShow(!show());
    setItems((v) => [...v, v.length]);
  }, 3000);

  // console.log('init');

  {
    const consequent = () => $.context(() => {
      console.log('init consequent');

      $.onDestroy(() => console.log('destroy consequent'));
    });

    const alternate = () => $.context(() => {
      console.log('init alternate');

      $.onDestroy(() => console.log('destroy alternate'));
    });

    $.when(show, consequent, alternate);
  }

  {
    const item = (item: number) => $.context(() => {
      console.log(item);

      $.onDestroy(() => console.log(`destroy ${item}`));
    });

    $.each(items, $.index, item);
  }

  $.onDestroy(() => {
    clearInterval(i);
    // console.log('destroy');
  });
});

logContext(context);
console.log('');

setTimeout(() => {
  logContext(context);
  context.destroy();
}, 10000);