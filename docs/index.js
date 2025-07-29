// node_modules/hyperapp/index.js
var SSR_NODE = 1;
var TEXT_NODE = 3;
var EMPTY_OBJ = {};
var EMPTY_ARR = [];
var SVG_NS = "http://www.w3.org/2000/svg";
var id = (a) => a;
var map = EMPTY_ARR.map;
var isArray = Array.isArray;
var enqueue = typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : setTimeout;
var createClass = (obj) => {
  var out = "";
  if (typeof obj === "string") return obj;
  if (isArray(obj)) {
    for (var k = 0, tmp; k < obj.length; k++) {
      if (tmp = createClass(obj[k])) {
        out += (out && " ") + tmp;
      }
    }
  } else {
    for (var k in obj) {
      if (obj[k]) out += (out && " ") + k;
    }
  }
  return out;
};
var shouldRestart = (a, b) => {
  for (var k in { ...a, ...b }) {
    if (typeof (isArray(a[k]) ? a[k][0] : a[k]) === "function") {
      b[k] = a[k];
    } else if (a[k] !== b[k]) return true;
  }
};
var patchSubs = (oldSubs, newSubs = EMPTY_ARR, dispatch) => {
  for (var subs = [], i = 0, oldSub, newSub; i < oldSubs.length || i < newSubs.length; i++) {
    oldSub = oldSubs[i];
    newSub = newSubs[i];
    subs.push(
      newSub && newSub !== true ? !oldSub || newSub[0] !== oldSub[0] || shouldRestart(newSub[1], oldSub[1]) ? [
        newSub[0],
        newSub[1],
        (oldSub && oldSub[2](), newSub[0](dispatch, newSub[1]))
      ] : oldSub : oldSub && oldSub[2]()
    );
  }
  return subs;
};
var getKey = (vdom) => vdom == null ? vdom : vdom.key;
var patchProperty = (node2, key, oldValue, newValue, listener, isSvg) => {
  if (key === "style") {
    for (var k in { ...oldValue, ...newValue }) {
      oldValue = newValue == null || newValue[k] == null ? "" : newValue[k];
      if (k[0] === "-") {
        node2[key].setProperty(k, oldValue);
      } else {
        node2[key][k] = oldValue;
      }
    }
  } else if (key[0] === "o" && key[1] === "n") {
    if (!((node2.events || (node2.events = {}))[key = key.slice(2)] = newValue)) {
      node2.removeEventListener(key, listener);
    } else if (!oldValue) {
      node2.addEventListener(key, listener);
    }
  } else if (!isSvg && key !== "list" && key !== "form" && key in node2) {
    node2[key] = newValue == null ? "" : newValue;
  } else if (newValue == null || newValue === false) {
    node2.removeAttribute(key);
  } else {
    node2.setAttribute(key, newValue);
  }
};
var createNode = (vdom, listener, isSvg) => {
  var props = vdom.props;
  var node2 = vdom.type === TEXT_NODE ? document.createTextNode(vdom.tag) : (isSvg = isSvg || vdom.tag === "svg") ? document.createElementNS(SVG_NS, vdom.tag, props.is && props) : document.createElement(vdom.tag, props.is && props);
  for (var k in props) {
    patchProperty(node2, k, null, props[k], listener, isSvg);
  }
  for (var i = 0; i < vdom.children.length; i++) {
    node2.appendChild(
      createNode(
        vdom.children[i] = maybeVNode(vdom.children[i]),
        listener,
        isSvg
      )
    );
  }
  return vdom.node = node2;
};
var patch = (parent, node2, oldVNode, newVNode, listener, isSvg) => {
  if (oldVNode === newVNode) {
  } else if (oldVNode != null && oldVNode.type === TEXT_NODE && newVNode.type === TEXT_NODE) {
    if (oldVNode.tag !== newVNode.tag) node2.nodeValue = newVNode.tag;
  } else if (oldVNode == null || oldVNode.tag !== newVNode.tag) {
    node2 = parent.insertBefore(
      createNode(newVNode = maybeVNode(newVNode), listener, isSvg),
      node2
    );
    if (oldVNode != null) {
      parent.removeChild(oldVNode.node);
    }
  } else {
    var tmpVKid;
    var oldVKid;
    var oldKey;
    var newKey;
    var oldProps = oldVNode.props;
    var newProps = newVNode.props;
    var oldVKids = oldVNode.children;
    var newVKids = newVNode.children;
    var oldHead = 0;
    var newHead = 0;
    var oldTail = oldVKids.length - 1;
    var newTail = newVKids.length - 1;
    isSvg = isSvg || newVNode.tag === "svg";
    for (var i in { ...oldProps, ...newProps }) {
      if ((i === "value" || i === "selected" || i === "checked" ? node2[i] : oldProps[i]) !== newProps[i]) {
        patchProperty(node2, i, oldProps[i], newProps[i], listener, isSvg);
      }
    }
    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldHead])) == null || oldKey !== getKey(newVKids[newHead])) {
        break;
      }
      patch(
        node2,
        oldVKids[oldHead].node,
        oldVKids[oldHead],
        newVKids[newHead] = maybeVNode(
          newVKids[newHead++],
          oldVKids[oldHead++]
        ),
        listener,
        isSvg
      );
    }
    while (newHead <= newTail && oldHead <= oldTail) {
      if ((oldKey = getKey(oldVKids[oldTail])) == null || oldKey !== getKey(newVKids[newTail])) {
        break;
      }
      patch(
        node2,
        oldVKids[oldTail].node,
        oldVKids[oldTail],
        newVKids[newTail] = maybeVNode(
          newVKids[newTail--],
          oldVKids[oldTail--]
        ),
        listener,
        isSvg
      );
    }
    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        node2.insertBefore(
          createNode(
            newVKids[newHead] = maybeVNode(newVKids[newHead++]),
            listener,
            isSvg
          ),
          (oldVKid = oldVKids[oldHead]) && oldVKid.node
        );
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        node2.removeChild(oldVKids[oldHead++].node);
      }
    } else {
      for (var keyed = {}, newKeyed = {}, i = oldHead; i <= oldTail; i++) {
        if ((oldKey = oldVKids[i].key) != null) {
          keyed[oldKey] = oldVKids[i];
        }
      }
      while (newHead <= newTail) {
        oldKey = getKey(oldVKid = oldVKids[oldHead]);
        newKey = getKey(
          newVKids[newHead] = maybeVNode(newVKids[newHead], oldVKid)
        );
        if (newKeyed[oldKey] || newKey != null && newKey === getKey(oldVKids[oldHead + 1])) {
          if (oldKey == null) {
            node2.removeChild(oldVKid.node);
          }
          oldHead++;
          continue;
        }
        if (newKey == null || oldVNode.type === SSR_NODE) {
          if (oldKey == null) {
            patch(
              node2,
              oldVKid && oldVKid.node,
              oldVKid,
              newVKids[newHead],
              listener,
              isSvg
            );
            newHead++;
          }
          oldHead++;
        } else {
          if (oldKey === newKey) {
            patch(
              node2,
              oldVKid.node,
              oldVKid,
              newVKids[newHead],
              listener,
              isSvg
            );
            newKeyed[newKey] = true;
            oldHead++;
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patch(
                node2,
                node2.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
                tmpVKid,
                newVKids[newHead],
                listener,
                isSvg
              );
              newKeyed[newKey] = true;
            } else {
              patch(
                node2,
                oldVKid && oldVKid.node,
                null,
                newVKids[newHead],
                listener,
                isSvg
              );
            }
          }
          newHead++;
        }
      }
      while (oldHead <= oldTail) {
        if (getKey(oldVKid = oldVKids[oldHead++]) == null) {
          node2.removeChild(oldVKid.node);
        }
      }
      for (var i in keyed) {
        if (newKeyed[i] == null) {
          node2.removeChild(keyed[i].node);
        }
      }
    }
  }
  return newVNode.node = node2;
};
var propsChanged = (a, b) => {
  for (var k in a) if (a[k] !== b[k]) return true;
  for (var k in b) if (a[k] !== b[k]) return true;
};
var maybeVNode = (newVNode, oldVNode) => newVNode !== true && newVNode !== false && newVNode ? typeof newVNode.tag === "function" ? ((!oldVNode || oldVNode.memo == null || propsChanged(oldVNode.memo, newVNode.memo)) && ((oldVNode = newVNode.tag(newVNode.memo)).memo = newVNode.memo), oldVNode) : newVNode : text("");
var recycleNode = (node2) => node2.nodeType === TEXT_NODE ? text(node2.nodeValue, node2) : createVNode(
  node2.nodeName.toLowerCase(),
  EMPTY_OBJ,
  map.call(node2.childNodes, recycleNode),
  SSR_NODE,
  node2
);
var createVNode = (tag, { key, ...props }, children, type, node2) => ({
  tag,
  props,
  key,
  children,
  type,
  node: node2
});
var memo = (tag, memo2) => ({ tag, memo: memo2 });
var text = (value, node2) => createVNode(value, EMPTY_OBJ, EMPTY_ARR, TEXT_NODE, node2);
var h = (tag, { class: c, ...props }, children = EMPTY_ARR) => createVNode(
  tag,
  { ...props, ...c ? { class: createClass(c) } : EMPTY_OBJ },
  isArray(children) ? children : [children]
);
var app = ({
  node: node2,
  view,
  subscriptions,
  dispatch = id,
  init = EMPTY_OBJ
}) => {
  var vdom = node2 && recycleNode(node2);
  var subs = [];
  var state;
  var busy;
  var update = (newState) => {
    if (state !== newState) {
      if ((state = newState) == null) dispatch = subscriptions = render = id;
      if (subscriptions) subs = patchSubs(subs, subscriptions(state), dispatch);
      if (view && !busy) enqueue(render, busy = true);
    }
  };
  var render = () => node2 = patch(
    node2.parentNode,
    node2,
    vdom,
    vdom = view(state),
    listener,
    busy = false
  );
  var listener = function(event) {
    dispatch(this.events[event.type], event);
  };
  return (dispatch = dispatch(
    (action, props) => typeof action === "function" ? dispatch(action(state, props)) : isArray(action) ? typeof action[0] === "function" ? dispatch(action[0], action[1]) : action.slice(1).map(
      (fx) => fx && fx !== true && (fx[0] || fx)(dispatch, fx[1]),
      update(action[0])
    ) : update(action)
  ))(init), dispatch;
};

// node_modules/hyperlit/index.js
var NEXT = 0;
var TEXT = 1;
var TAG = 2;
var CLOSINGTAG = 3;
var TAGNAME = 4;
var PROPS = 5;
var SELFCLOSING = 6;
var PROPNAME = 7;
var PROPVAL = 8;
var PROPVALSTR = 9;
var ws = (c) => c == " " || c == "	" || c == "\n" || c == "\r";
var parse = (strs, vals) => {
  let tagname, propname, props, parent, list = [], ch, buffer = "", mode = NEXT, newline = true;
  const listpush = (x) => (x || x === 0) && list.push(typeof x == "string" ? text(x) : typeof x == "number" ? text("" + x) : x);
  const pushnode = (ch2, children = ch2.flat(2)) => {
    listpush(tagname.call ? tagname(props, children) : h(tagname, props, children));
    mode = NEXT;
  };
  const gotText = (trim2) => {
    if (trim2) buffer = buffer.trimEnd();
    buffer && listpush(buffer);
    newline = false;
    buffer = "";
  };
  const open = () => {
    parent = [list, tagname, props, parent];
    list = [];
    mode = NEXT;
  };
  const gotTagName = (m = mode) => {
    tagname = buffer;
    buffer = "";
    props = {};
    mode = m;
  };
  const defaultProp = (m = mode) => {
    props[buffer] = true;
    mode = m;
    buffer = "";
  };
  const gotProp = (v) => {
    props[propname] = v;
    mode = PROPS;
    buffer = "";
  };
  const close = () => {
    let children = list;
    [list, tagname, props, parent] = parent;
    pushnode(children);
  };
  for (let j = 0; j < strs.length; j++) {
    for (let i = 0; i < strs[j].length; i++) {
      ch = strs[j][i];
      if (mode == NEXT) {
        if (ch == "<") {
          mode = TAG;
        } else if (!ws(ch)) {
          mode = TEXT;
          buffer = ch;
        } else if (ch == "\n") {
          newline = true;
        } else if (!newline) {
          mode = TEXT;
          buffer = ch;
        }
      } else if (mode == TEXT) {
        if (ch == "<") {
          mode = TAG;
        } else if (ch == "\n") {
          gotText(false);
          newline = true;
          mode = NEXT;
        } else {
          buffer += ch;
        }
      } else if (mode == TAG) {
        if (ch == "/") {
          mode = CLOSINGTAG;
          gotText(true);
        } else {
          mode = TAGNAME;
          gotText(false);
          buffer = ch;
        }
      } else if (mode == CLOSINGTAG) {
        if (ch == ">") close();
      } else if (mode == TAGNAME) {
        if (ws(ch)) {
          gotTagName(PROPS);
        } else if (ch == "/") {
          gotTagName(SELFCLOSING);
        } else if (ch == ">") {
          gotTagName();
          open();
        } else {
          buffer += ch;
        }
      } else if (mode == SELFCLOSING) {
        if (ch == ">") {
          pushnode([]);
        }
      } else if (mode == PROPS) {
        if (ch == ".") {
        } else if (ch == "/") {
          mode = SELFCLOSING;
        } else if (ch == ">") {
          open();
        } else if (!ws(ch)) {
          buffer = ch;
          mode = PROPNAME;
        }
      } else if (mode == PROPNAME) {
        if (ch == "=") {
          propname = buffer;
          mode = PROPVAL;
        } else if (ch == ">") {
          defaultProp();
          open();
        } else if (ch == "/") {
          defaultProp(SELFCLOSING);
        } else if (ws(ch)) {
          defaultProp(PROPS);
        } else {
          buffer += ch;
        }
      } else if (mode == PROPVAL) {
        if (ch == '"') {
          mode = PROPVALSTR;
          buffer = "";
        }
      } else if (mode == PROPVALSTR) {
        if (ch == '"') {
          gotProp(buffer);
        } else {
          buffer += ch;
        }
      }
    }
    if (mode == TAG) {
      tagname = vals[j];
      props = {};
      mode = PROPS;
    } else if (mode == TEXT) {
      gotText(!vals[j]);
      listpush(vals[j]);
    } else if (mode == PROPS) {
      props = { ...props, ...vals[j] };
    } else if (mode == PROPVAL) {
      gotProp(vals[j]);
    } else if (mode == PROPVALSTR) {
      buffer += vals[j];
    } else if (mode == NEXT && vals[j] != null) {
      listpush(vals[j]);
    }
  }
  list = list.flat(2);
  return list.length > 1 ? list : list[0];
};
var hyperlit_default = (strs, ...vals) => parse(strs, vals);

// node_modules/stylis/src/Enum.js
var COMMENT = "comm";
var RULESET = "rule";
var DECLARATION = "decl";
var IMPORT = "@import";
var NAMESPACE = "@namespace";
var KEYFRAMES = "@keyframes";
var LAYER = "@layer";

// node_modules/stylis/src/Utility.js
var abs = Math.abs;
var from = String.fromCharCode;
function trim(value) {
  return value.trim();
}
function replace(value, pattern, replacement) {
  return value.replace(pattern, replacement);
}
function indexof(value, search, position2) {
  return value.indexOf(search, position2);
}
function charat(value, index) {
  return value.charCodeAt(index) | 0;
}
function substr(value, begin, end) {
  return value.slice(begin, end);
}
function strlen(value) {
  return value.length;
}
function sizeof(value) {
  return value.length;
}
function append(value, array) {
  return array.push(value), value;
}

// node_modules/stylis/src/Tokenizer.js
var line = 1;
var column = 1;
var length = 0;
var position = 0;
var character = 0;
var characters = "";
function node(value, root, parent, type, props, children, length2, siblings) {
  return { value, root, parent, type, props, children, line, column, length: length2, return: "", siblings };
}
function char() {
  return character;
}
function prev() {
  character = position > 0 ? charat(characters, --position) : 0;
  if (column--, character === 10)
    column = 1, line--;
  return character;
}
function next() {
  character = position < length ? charat(characters, position++) : 0;
  if (column++, character === 10)
    column = 1, line++;
  return character;
}
function peek() {
  return charat(characters, position);
}
function caret() {
  return position;
}
function slice(begin, end) {
  return substr(characters, begin, end);
}
function token(type) {
  switch (type) {
    // \0 \t \n \r \s whitespace token
    case 0:
    case 9:
    case 10:
    case 13:
    case 32:
      return 5;
    // ! + , / > @ ~ isolate token
    case 33:
    case 43:
    case 44:
    case 47:
    case 62:
    case 64:
    case 126:
    // ; { } breakpoint token
    case 59:
    case 123:
    case 125:
      return 4;
    // : accompanied token
    case 58:
      return 3;
    // " ' ( [ opening delimit token
    case 34:
    case 39:
    case 40:
    case 91:
      return 2;
    // ) ] closing delimit token
    case 41:
    case 93:
      return 1;
  }
  return 0;
}
function alloc(value) {
  return line = column = 1, length = strlen(characters = value), position = 0, [];
}
function dealloc(value) {
  return characters = "", value;
}
function delimit(type) {
  return trim(slice(position - 1, delimiter(type === 91 ? type + 2 : type === 40 ? type + 1 : type)));
}
function whitespace(type) {
  while (character = peek())
    if (character < 33)
      next();
    else
      break;
  return token(type) > 2 || token(character) > 3 ? "" : " ";
}
function escaping(index, count) {
  while (--count && next())
    if (character < 48 || character > 102 || character > 57 && character < 65 || character > 70 && character < 97)
      break;
  return slice(index, caret() + (count < 6 && peek() == 32 && next() == 32));
}
function delimiter(type) {
  while (next())
    switch (character) {
      // ] ) " '
      case type:
        return position;
      // " '
      case 34:
      case 39:
        if (type !== 34 && type !== 39)
          delimiter(character);
        break;
      // (
      case 40:
        if (type === 41)
          delimiter(type);
        break;
      // \
      case 92:
        next();
        break;
    }
  return position;
}
function commenter(type, index) {
  while (next())
    if (type + character === 47 + 10)
      break;
    else if (type + character === 42 + 42 && peek() === 47)
      break;
  return "/*" + slice(index, position - 1) + "*" + from(type === 47 ? type : next());
}
function identifier(index) {
  while (!token(peek()))
    next();
  return slice(index, position);
}

// node_modules/stylis/src/Parser.js
function compile(value) {
  return dealloc(parse2("", null, null, null, [""], value = alloc(value), 0, [0], value));
}
function parse2(value, root, parent, rule, rules, rulesets, pseudo, points, declarations) {
  var index = 0;
  var offset = 0;
  var length2 = pseudo;
  var atrule = 0;
  var property = 0;
  var previous = 0;
  var variable = 1;
  var scanning = 1;
  var ampersand = 1;
  var character2 = 0;
  var type = "";
  var props = rules;
  var children = rulesets;
  var reference = rule;
  var characters2 = type;
  while (scanning)
    switch (previous = character2, character2 = next()) {
      // (
      case 40:
        if (previous != 108 && charat(characters2, length2 - 1) == 58) {
          if (indexof(characters2 += replace(delimit(character2), "&", "&\f"), "&\f", abs(index ? points[index - 1] : 0)) != -1)
            ampersand = -1;
          break;
        }
      // " ' [
      case 34:
      case 39:
      case 91:
        characters2 += delimit(character2);
        break;
      // \t \n \r \s
      case 9:
      case 10:
      case 13:
      case 32:
        characters2 += whitespace(previous);
        break;
      // \
      case 92:
        characters2 += escaping(caret() - 1, 7);
        continue;
      // /
      case 47:
        switch (peek()) {
          case 42:
          case 47:
            append(comment(commenter(next(), caret()), root, parent, declarations), declarations);
            if ((token(previous || 1) == 5 || token(peek() || 1) == 5) && strlen(characters2) && substr(characters2, -1, void 0) !== " ") characters2 += " ";
            break;
          default:
            characters2 += "/";
        }
        break;
      // {
      case 123 * variable:
        points[index++] = strlen(characters2) * ampersand;
      // } ; \0
      case 125 * variable:
      case 59:
      case 0:
        switch (character2) {
          // \0 }
          case 0:
          case 125:
            scanning = 0;
          // ;
          case 59 + offset:
            if (ampersand == -1) characters2 = replace(characters2, /\f/g, "");
            if (property > 0 && (strlen(characters2) - length2 || variable === 0 && previous === 47))
              append(property > 32 ? declaration(characters2 + ";", rule, parent, length2 - 1, declarations) : declaration(replace(characters2, " ", "") + ";", rule, parent, length2 - 2, declarations), declarations);
            break;
          // @ ;
          case 59:
            characters2 += ";";
          // { rule/at-rule
          default:
            append(reference = ruleset(characters2, root, parent, index, offset, rules, points, type, props = [], children = [], length2, rulesets), rulesets);
            if (character2 === 123)
              if (offset === 0)
                parse2(characters2, root, reference, reference, props, rulesets, length2, points, children);
              else {
                switch (atrule) {
                  // c(ontainer)
                  case 99:
                    if (charat(characters2, 3) === 110) break;
                  // l(ayer)
                  case 108:
                    if (charat(characters2, 2) === 97) break;
                  default:
                    offset = 0;
                  // d(ocument) m(edia) s(upports)
                  case 100:
                  case 109:
                  case 115:
                }
                if (offset) parse2(value, reference, reference, rule && append(ruleset(value, reference, reference, 0, 0, rules, points, type, rules, props = [], length2, children), children), rules, children, length2, points, rule ? props : children);
                else parse2(characters2, reference, reference, reference, [""], children, 0, points, children);
              }
        }
        index = offset = property = 0, variable = ampersand = 1, type = characters2 = "", length2 = pseudo;
        break;
      // :
      case 58:
        length2 = 1 + strlen(characters2), property = previous;
      default:
        if (variable < 1) {
          if (character2 == 123)
            --variable;
          else if (character2 == 125 && variable++ == 0 && prev() == 125)
            continue;
        }
        switch (characters2 += from(character2), character2 * variable) {
          // &
          case 38:
            ampersand = offset > 0 ? 1 : (characters2 += "\f", -1);
            break;
          // ,
          case 44:
            points[index++] = (strlen(characters2) - 1) * ampersand, ampersand = 1;
            break;
          // @
          case 64:
            if (peek() === 45)
              characters2 += delimit(next());
            atrule = peek(), offset = length2 = strlen(type = characters2 += identifier(caret())), character2++;
            break;
          // -
          case 45:
            if (previous === 45 && strlen(characters2) == 2)
              variable = 0;
        }
    }
  return rulesets;
}
function ruleset(value, root, parent, index, offset, rules, points, type, props, children, length2, siblings) {
  var post = offset - 1;
  var rule = offset === 0 ? rules : [""];
  var size = sizeof(rule);
  for (var i = 0, j = 0, k = 0; i < index; ++i)
    for (var x = 0, y = substr(value, post + 1, post = abs(j = points[i])), z = value; x < size; ++x)
      if (z = trim(j > 0 ? rule[x] + " " + y : replace(y, /&\f/g, rule[x])))
        props[k++] = z;
  return node(value, root, parent, offset === 0 ? RULESET : type, props, children, length2, siblings);
}
function comment(value, root, parent, siblings) {
  return node(value, root, parent, COMMENT, from(char()), substr(value, 2, -2), 0, siblings);
}
function declaration(value, root, parent, length2, siblings) {
  return node(value, root, parent, DECLARATION, substr(value, 0, length2), substr(value, length2 + 1, -1), length2, siblings);
}

// node_modules/stylis/src/Serializer.js
function serialize(children, callback) {
  var output = "";
  for (var i = 0; i < children.length; i++)
    output += callback(children[i], i, children, callback) || "";
  return output;
}
function stringify(element, index, children, callback) {
  switch (element.type) {
    case LAYER:
      if (element.children.length) break;
    case IMPORT:
    case NAMESPACE:
    case DECLARATION:
      return element.return = element.return || element.value;
    case COMMENT:
      return "";
    case KEYFRAMES:
      return element.return = element.value + "{" + serialize(element.children, callback) + "}";
    case RULESET:
      if (!strlen(element.value = element.props.join(","))) return "";
  }
  return strlen(children = serialize(element.children, callback)) ? element.return = element.value + "{" + children + "}" : "";
}

// node_modules/hyper-styled/dist/index.js
var _id = 1;
var cache = {};
var _STYLE_ID = "_hyper";
var ssr_sheet = { data: "" };
function getSheet() {
  if (typeof document === "object") {
    return (window[_STYLE_ID] || Object.assign(document.head.appendChild(document.createElement("style")), {
      innerHTML: " ",
      id: _STYLE_ID
    })).firstChild;
  }
  return ssr_sheet;
}
var process = (key, id2, global, keyframes2) => {
  const selector = global ? "" : keyframes2 ? `@keyframes ${id2}` : `.${id2}`;
  const prepend = global || keyframes2;
  const rules = (cache[key] = {
    id: id2,
    rules: serialize(compile(global ? key : `${selector}{${key}}`), stringify)
    //version 4
  }).rules;
  const sheet = getSheet();
  sheet.data = prepend ? rules + sheet.data : sheet.data + rules;
};
function css(strings, ...values) {
  const ctx = this || {};
  let key = "";
  for (const [i, string] of strings.entries()) {
    key += string + (values[i] == null ? "" : values[i]);
  }
  if (cache[key]) return cache[key].id;
  const className = "hyper-" + _id++;
  process(key, className, ctx.g, ctx.k);
  return className;
}
function extractCss() {
  return getSheet().data;
}
var keyframes = css.bind({ k: 1 });
var globalCss = css.bind({ g: 1 });
var tags = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "base",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "link",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meta",
  "meter",
  "nav",
  "noscript",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "param",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "script",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "style",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "track",
  "u",
  "ul",
  "use",
  "var",
  "video",
  "wbr",
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan"
];
function createStyle(tag) {
  return (strings, ...values) => {
    const className = css(strings, ...values);
    return (props = {}, children) => {
      const merged = {
        ...props,
        class: props.class ? `${className} ${props.class}` : className
      };
      return h(tag, merged, children);
    };
  };
}
var styled = Object.fromEntries(
  tags.map((tag) => [tag, createStyle(tag)])
);
export {
  app,
  css,
  extractCss,
  globalCss,
  h,
  hyperlit_default as html,
  keyframes,
  memo,
  styled,
  text
};
