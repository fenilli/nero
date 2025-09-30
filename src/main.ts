import * as $ from '../lib';

const uuid = () => crypto.randomUUID();

const root_3 = $.template(' ');
const Item = (item: { title: string }, index: number) => {
  const text = root_3();
  $.setText(text, `${index}:${item.title}`);

  return text;
};

const root_2 = $.template(' ');
const Consequent = () => {
  const [count, setCount] = $.signal(0);

  const i = setInterval(() => setCount((v) => v + 1), 1000);

  const text = root_2();

  $.effect(() => {
    $.setText(text, `Count: ${count()}`);
  });

  $.onDestroy(() => clearInterval(i));

  return text;
};

const root_1 = $.template('Alternate');
const Alternate = () => root_1();

const root = $.template('<div> <div><!></div><div><!></div><button type="button">Append</button><button type="button">Reorder</button></div>');
const App = () => {
  const [cond, setCond] = $.signal(false);
  const [items, setItems] = $.signal([{ id: uuid(), title: 'Hello World' }, { id: uuid(), title: 'Second Hello World' }]);

  const i = setInterval(() => {
    setCond((v) => !v);
  }, 5000);

  const div = root();
  const text = $.child(div);

  const div_1 = $.sibling(text);
  const mark = $.child(div_1);

  {
    const consequent = () => Consequent();
    const alternate = () => Alternate();

    $.when(mark, (render) => {
      if (cond()) render(consequent);
      else render(alternate);
    });
  }

  const div_2 = $.sibling(div_1);
  const mark_1 = $.child(div_2);

  {
    $.each(mark_1, items, (item) => item.id, Item);
  }

  const button = $.sibling<HTMLButtonElement>(div_2);
  const button_on = $.on(button, 'click', () => {
    setItems((v) => [...v, { id: uuid(), title: 'Append Me' }]);
  });

  const button_1 = $.sibling<HTMLButtonElement>(button);
  const button_1_on = $.on(button_1, 'click', () => {
    setItems((v) => {
      const arr = [...v];
      [arr[0], arr[1]] = [arr[1], arr[0]];
      return arr;
    });
  });

  $.effect(() => {
    $.setText(text, `Cond: ${cond()}`);
  });

  $.onDestroy(() => {
    $.off(button_on);
    $.off(button_1_on);
    clearInterval(i);
  });

  return div;
};

$.render(App, document.getElementById('app')!);