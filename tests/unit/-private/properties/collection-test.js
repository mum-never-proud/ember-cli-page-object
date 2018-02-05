import { moduleForProperty } from '../../../helpers/properties';
import { create, collection, text, hasClass } from 'ember-cli-page-object';
import withIteratorSymbolDefined from '../../../helpers/with-iterator-symbol-defined';

moduleForProperty('collection', function(test) {
  test('generates a length property', function(assert) {
    let page = create({
      foo: collection('span')
    });

    this.adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo.length, 2);
  });

  test('Works with zero length', function(assert) {
    let page = create({
      foo: collection('span')
    });

    this.adapter.createTemplate(this, page, `
      <div>Lorem</div>
      <div>Ipsum</div>
    `);

    assert.equal(page.foo.length, 0);
  });

  test('returns an item', function(assert) {
    let page = create({
      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo.objectAt(0).text, 'Lorem');
    assert.equal(page.foo.objectAt(1).text, 'Ipsum');
  });

  test('collects an array of items', function(assert) {
    let page = create({
      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    let array = page.foo.toArray();
    assert.equal(array.length, 2);
    assert.equal(array[0].text, 'Lorem');
    assert.equal(array[1].text, 'Ipsum');

    let proxyArray = page.foo.toArray();
    assert.equal(proxyArray.length, 2);
    assert.equal(proxyArray[0].text, 'Lorem');
    assert.equal(proxyArray[1].text, 'Ipsum');
  });

  test('produces an iterator for items', function(assert) {
    let page = create({
      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    let textContents = [];
    withIteratorSymbolDefined(() => {
      for (let item of page.foo) {
        textContents.push(item.text);
      }
    });

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('looks for elements inside the scope', function(assert) {
    let page = create({
      scope: '.scope',

      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <span>Lorem</span>
      </div>
      <div class="scope">
        <span>Ipsum</span>
      </div>
    `);

    assert.equal(page.foo.objectAt(0).text, 'Ipsum');
  });

  test('looks for elements inside multiple scopes', function(assert) {
    let page = create({
      scope: '.scope',

      foo: collection('li', {
        bar: {
          scope: '.another-scope',

          text: text('li', { at: 0 })
        }
      })
    });

    this.adapter.createTemplate(this, page, `
      <ul>
        <li>Blah</li>
        <li>
          <ul class="another-scope">
            <li>Lorem<li>
          </ul>
        </li>
      </ul>
      <ul class="scope">
        <li>Ipsum</li>
        <li>
          <ul>
            <li>Dolor</li>
          </ul>
          <ul class="another-scope">
            <li>Sit</li>
            <li>Amet</li>
          </ul>
        </li>
      </ul>
    `);

    assert.equal(page.foo.objectAt(1).bar.text, 'Sit');
  });

  test('resets scope for items', function(assert) {
    let page = create({
      scope: 'div',

      foo: collection('span', {
        resetScope: true,
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <div>
        <span>Ipsum</span>
      </div>
    `);

    assert.equal(page.foo.objectAt(0).text, 'Lorem');
  });

  test('sets correct scope to child collections', function(assert) {
    let page = create({
      scope: '.scope',

      foo: collection('span', {
        bar: collection('em', {
          text: text()
        })
      })
    });

    this.adapter.createTemplate(this, page, `
      <div><span><em>Lorem</em></span></div>
      <div class="scope"><span><em>Ipsum</em></span></div>
    `);

    assert.equal(page.foo.objectAt(0).bar.objectAt(0).text, 'Ipsum');
  });

  test("throws an error when the item's element doesn't exist", function(assert) {
    let page = create({
      foo: {
        bar: collection('span', {
          baz: {
            qux: text('span')
          }
        })
      }
    });

    this.adapter.createTemplate(this, page);

    assert.throws(() => page.foo.bar.objectAt(1).baz.qux, /page\.foo\.bar\.objectAt\(1\)/);
  });

  test('iterates over scoped items with a for loop', function(assert) {
    let page = create({
      scope: 'div',
      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <span>Lorem</span>
        <span>Ipsum</span>
      </div>
    `);

    let textContents = [];

    for (let i = 0; i < page.foo.length; i++) {
      let item = page.foo.objectAt(i);
      textContents.push(item.text);
    }

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('iterates over scoped items with a for of loop', function(assert) {
    let page = create({
      scope: 'div',
      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <span>Lorem</span>
        <span>Ipsum</span>
      </div>
    `);

    let textContents = [];

    withIteratorSymbolDefined(() => {
      for (let item of page.foo) {
        textContents.push(item.text);
      }
    });

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('iterates over scoped items with a forEach loop', function(assert) {
    let page = create({
      scope: 'div',

      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <div>
        <span>Lorem</span>
        <span>Ipsum</span>
      </div>
    `);

    let textContents = [];

    page.foo.forEach((item) => {
      textContents.push(item.text);
    });

    assert.deepEqual(textContents, ['Lorem', 'Ipsum']);
  });

  test('does not mutate definition object', function(assert) {
    let prop = text('.baz');

    let expected = {
      bar: prop,
      baz: {
        qux: prop
      }
    };

    let actual = {
      bar: prop,
      baz: {
        qux: prop
      }
    };

    let page = create({
      foo: collection('.another-scope', actual)
    });

    this.adapter.createTemplate(this, page);

    assert.deepEqual(actual, expected);
  });

  test('looks for elements within test container specified', function(assert) {
    assert.expect(2);

    let expectedContext = '#alternate-ember-testing';
    let page;

    page = create({
      foo: collection('span', {
        testContainer: expectedContext,
      })
    });

    this.adapter.createTemplate(
      this,
      page,
      '<span>Lorem</span><span>ipsum</span>',
      { useAlternateContainer: true }
    );

    assert.equal(page.foo.length, 2);
    assert.equal(page.foo.objectAt(0).text, 'Lorem');
  });

  test('objectAt returns an item', function(assert) {
    let page = create({
      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo.objectAt(0).text, 'Lorem');
    assert.equal(page.foo.objectAt(1).text, 'Ipsum');
  });

  test('forEach works correctly', function(assert) {
    let page = create({
      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span class="special">Lorem</span>
      <span>Ipsum</span>
    `);

    let textArray = [];
    page.foo.forEach((i) => {
      textArray.push(i.text);
    });

    assert.deepEqual(textArray, ['Lorem', 'Ipsum']);
  });

  test('map works correctly', function(assert) {
    let page = create({
      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.deepEqual(page.foo.map((i) => i.text), ['Lorem', 'Ipsum']);
  });

  test('mapBy works correctly', function(assert) {
    let page = create({
      foo: collection('span', {
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.deepEqual(page.foo.mapBy('text'), ['Lorem', 'Ipsum']);
  });

  test('filter works correctly', function(assert) {
    let page = create({
      foo: collection('span', {
        isSpecial: hasClass('special'),
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span class="special">Lorem</span>
      <span>Ipsum</span>
    `);

    assert.deepEqual(page.foo.filter((i) => i.isSpecial).map((i) => i.text), ['Lorem']);
    assert.deepEqual(page.foo.filter((i) => i.isFoo).map((i) => i.text), []);
  });

  test('filterBy works correctly', function(assert) {
    let page = create({
      foo: collection('span', {
        isSpecial: hasClass('special'),
        text: text()
      })
    });

    this.adapter.createTemplate(this, page, `
      <span class="special">Lorem</span>
      <span>Ipsum</span>
    `);

    assert.deepEqual(page.foo.filterBy('isSpecial').map((i) => i.text), ['Lorem']);
    assert.deepEqual(page.foo.filterBy('isFoo').map((i) => i.text), []);
  });

  test('uses array accessor', function(assert) {
    let page = create({
      foo: collection('span')
    });

    this.adapter.createTemplate(this, page, `
      <span>Lorem</span>
      <span>Ipsum</span>
    `);

    assert.equal(page.foo[0].text, 'Lorem');
    assert.equal(page.foo[1].text, 'Ipsum');
  });
});
