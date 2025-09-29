import * as $ from '../lib';

const root_1 = () => {
  const h1 = $.text();

  return h1;
}

const Child = () => {
  const [count, setCount] = $.signal(0);

  const h1 = root_1();

  const i = setInterval(() => setCount((v) => v + 1), 1000);

  $.effect(() => {
    h1.textContent = `Count: ${count()}`;
  });

  $.onDestroy(() => clearInterval(i));

  return h1;
};

const AnotherChild = () => {
  const h1 = root_1();
  h1.textContent = 'Alternate';

  return h1;
};

const Item = (item: { title: string }, index: number) => {
  const h1 = root_1();
  h1.textContent = `${index}:${item.title}`;

  return h1;
};

const root = () => {
  const div = $.element('div')
  const h1 = $.text();
  $.append(h1, div);

  const div_1 = $.element('div');
  const conditional = $.comment();
  $.append(div_1, div);
  $.append(conditional, div_1);

  const div_2 = $.element('div');
  const loop = $.comment();
  $.append(div_2, div);
  $.append(loop, div_2);

  const button = $.element('button');
  button.type = 'button';
  button.textContent = 'Append Me';
  $.append(button, div);

  const button_1 = $.element('button');
  button_1.type = 'button';
  button_1.textContent = 'Reorder Me';
  $.append(button_1, div);

  return div;
};

const App = () => {
  const [cond, setCond] = $.signal(false);
  const [items, setItems] = $.signal([{ title: 'Hello World' }, { title: 'Second Hello World' }]);

  const div = root();
  const h1 = $.child(div);

  const div_1 = $.sibling(h1);
  const conditional = $.child(div_1);

  {
    const consequent = () => Child();
    const alternate = () => AnotherChild();

    $.when(conditional, (render) => {
      if (cond()) render(consequent);
      else render(alternate);
    });
  }

  const div_2 = $.sibling(h1, 2);
  const loop = $.child(div_2);

  {
    $.each(loop, items, (item) => item.title, Item);
  }

  const button = $.sibling<HTMLButtonElement>(h1, 3);
  button.onclick = () => {
    setItems((v) => [...v, { title: 'Append Me' }]);
  };

  const button_1 = $.sibling<HTMLButtonElement>(h1, 4);
  button_1.onclick = () => {
    setItems((v) => {
      const arr = [...v];
      [arr[0], arr[1]] = [arr[1], arr[0]];
      return arr;
    });
  };

  const i = setInterval(() => {
    setCond((v) => !v);
  }, 5000);

  $.effect(() => {
    h1.textContent = `Cond: ${cond()}`;
  });

  $.onDestroy(() => clearInterval(i));

  return div;
};

$.render(App, document.getElementById('app'));