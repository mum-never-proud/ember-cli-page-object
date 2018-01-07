---
layout: page
title: Visitable
---

{% raw %}
### Methods


<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [visitable](#visitable)

### visitable

**Parameters**

-   `path` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Full path of the route to visit

**Examples**

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users')
});

// visits '/users'
page.visit();
```

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users/:user_id')
});

// visits '/users/10'
page.visit({ user_id: 10 });
```

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users')
});

// visits '/users?name=john'
page.visit({ name: 'john' });
```

```javascript
const page = PageObject.create({
  visit: PageObject.visitable('/users/:user_id')
});

// visits '/users/1?name=john'
page.visit({ user_id: 1, name: 'john' });
```

-   Throws **any** Will throw an error if dynamic segments are not filled

Returns **Descriptor** 
{% endraw %}