import { elementDOMIsVisible } from './dom';

type EnchancedEcommerceCreative = {
  name: string;
  id: string | number;
  creative: string;
  position: string | number;
};

type Result = {
  element: HTMLElement | null;
  props: unknown;
};

type Selectors = {
  [key: string]: (element: HTMLElement, parent: HTMLElement, position: number) => Result;
};

type Group = {
  groupSelector: string;
  itemSelectors: Selectors;
};

type Child = {
  element: HTMLElement;
  props: {
    custom: unknown;
    ee: EnchancedEcommerceCreative;
    position: number;
  };
};

type GroupFillled = {
  group: HTMLElement;
  childs: Child[];
};

class Creatives {
  groups: GroupFillled[];
  readonly options: Group[];

  constructor(options: Group[]) {
    this.groups = [];
    this.options = options;
    if (this.options.length) {
      this.getGroups();
    }
  }

  getAllCreatives(): Child[] {
    return this.groups.reduce((stack, group) => {
      stack = stack.concat(group.childs);

      return stack;
    }, []);
  }

  private getGroups() {
    this.groups = this.options
      .map((item) => {
        if (item.groupSelector) {
          const DOMElements = document.querySelectorAll(item.groupSelector);

          if (DOMElements && DOMElements.length) {
            return Object.keys(DOMElements).reduce((stack, groupItem) => {
              if (elementDOMIsVisible(DOMElements[groupItem])) {
                stack.push({
                  group: DOMElements[groupItem],
                  childs: this.getItensInGroup(DOMElements[groupItem], item.itemSelectors),
                });
              }
              return stack;
            }, []);
          }
        }
        return [];
      })
      .reduce((stack, item) => {
        if (item && item.length) {
          return stack.concat(item);
        }
        return stack;
      }, []);
  }

  private getItensInGroup(DOMGroup, selectors) {
    let items = [];
    const keys = Object.keys(selectors);
    if (keys.length) {
      const queryItems = DOMGroup.querySelectorAll(keys.join(', '));
      if (!queryItems) {
        return items;
      }
      let index = 0; // set index here, because the item can be a cloned element
      return [].map
        .call(queryItems, (element) => {
          return keys.reduce((stack, selector) => {
            if (element.matches(selector) && typeof selectors[selector] === 'function') {
              // executa a função criada no custom para a loja
              index++;
              const result = selectors[selector](element, DOMGroup, index);
              stack.push(result);
            }
            return stack;
          }, []);
        })
        .reduce((stack, item) => {
          if (item && item.length) {
            return stack.concat(item);
          }
          return stack;
        }, []);
    }
    return items;
  }
}

export default Creatives;
