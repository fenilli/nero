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

  const i = setInterval(() => {
    setShow(!show());
  }, 3000);

  // console.log('init');

  {
    let mounted: $.Context | null;

    $.effect(() => {
      // console.log('run eff');
      if (show()) {
        if (!mounted)
          mounted = $.context(() => {
            console.log('init 2');

            $.onDestroy(() => console.log('destroy 2'));
          });
      } else {
        if (mounted) {
          mounted.destroy();
          mounted = null;
        }
      }

      // $.onDispose(() => console.log('dipose eff'));
    });
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