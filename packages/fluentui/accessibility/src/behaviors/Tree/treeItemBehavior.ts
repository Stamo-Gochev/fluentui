import { keyboardKey, SpacebarKey } from '@fluentui/keyboard-key';
import { Accessibility, AriaRole } from '../../types';

import { IS_FOCUSABLE_ATTRIBUTE } from '../../attributes';
import { treeTitleBehavior } from './treeTitleBehavior';

/**
 * @description
 * Triggers 'performClick' action with 'Spacebar' on 'root', when tree item is selectable and has no subtree. In other cases 'performClick' is triggered with 'Spacebar' or 'Enter'.
 * Triggers 'performSelection' action with 'Spacebar' on 'root', when has a opened subtree.
 * @specification
 * Adds attribute 'aria-expanded=true' based on the property 'expanded' if the component has 'hasSubtree' property.
 * Adds attribute 'tabIndex=-1' to 'root' slot if 'hasSubtree' property is true. Does not set the attribute otherwise.
 * Adds attribute 'aria-setsize=3' based on the property 'treeSize' if the component has 'hasSubtree' property.
 * Adds attribute 'aria-posinset=2' based on the property 'index' if the component has 'hasSubtree' property.
 * Adds attribute 'aria-level=1' based on the property 'level' if the component has 'hasSubtree' property.
 * Adds attribute 'role=treeitem' to 'root' slot if 'hasSubtree' property is true. Sets the attribute to 'none' otherwise.
 * Triggers 'performClick' action with 'Enter' or 'Spacebar' on 'root'.
 * Triggers 'expandSiblings' action with '*' on 'root'.
 * Triggers 'focusParent' action with 'ArrowLeft' on 'root', when has a closed subtree.
 * Triggers 'collapse' action with 'ArrowLeft' on 'root', when has an opened subtree.
 * Triggers 'expand' action with 'ArrowRight' on 'root', when has a closed subtree.
 * Triggers 'focusFirstChild' action with 'ArrowRight' on 'root', when has an opened subtree.
 */
export const treeItemBehavior: Accessibility<TreeItemBehaviorProps> = props => {
  const definition = {
    attributes: {
      root: {
        role: 'none',
        ...(props.hasSubtree && {
          'aria-expanded': props.expanded,
          'aria-selected': props.selectable ? props.selected || false : undefined,
          tabIndex: -1,
          [IS_FOCUSABLE_ATTRIBUTE]: true,
          role: 'treeitem' as AriaRole,
          'aria-setsize': props.treeSize,
          'aria-posinset': props.index,
          'aria-level': props.level,
        }),
      },
    },
    keyActions: {
      root: {
        performClick: {
          keyCombinations: [{ keyCode: keyboardKey.Enter }, { keyCode: SpacebarKey }],
        },
        ...(isSubtreeExpanded(props) && {
          collapse: {
            keyCombinations: [{ keyCode: keyboardKey.ArrowLeft }],
          },
          focusFirstChild: {
            keyCombinations: [{ keyCode: keyboardKey.ArrowRight }],
          },
          focusParent: {
            keyCombinations: [{ keyCode: keyboardKey.ArrowLeft }],
          },
        }),
        ...(!isSubtreeExpanded(props) &&
          props.hasSubtree && {
            expand: {
              keyCombinations: [{ keyCode: keyboardKey.ArrowRight }],
            },
            focusParent: {
              keyCombinations: [{ keyCode: keyboardKey.ArrowLeft }],
            },
          }),
        expandSiblings: {
          keyCombinations: [{ keyCode: keyboardKey['*'] }],
        },
        ...(props.selectable && {
          performClick: {
            keyCombinations: props.hasSubtree ? [{ keyCode: keyboardKey.Enter }] : [{ keyCode: SpacebarKey }],
          },
          performSelection: {
            keyCombinations: [{ keyCode: SpacebarKey }],
          },
        }),
      },
    },
    childBehaviors: {
      title: treeTitleBehavior,
    },
  };

  if (process.env.NODE_ENV !== 'production' && !props.hasSubtree) {
    // Override the default trigger's accessibility schema class.
    definition.attributes.root['data-aa-class'] = 'SingleTreeItem';
  }

  return definition;
};

export type TreeItemBehaviorProps = {
  /** If item is a subtree, it indicates if it's expanded. */
  expanded?: boolean;
  level?: number;
  index?: number;
  hasSubtree?: boolean;
  treeSize?: number;
  selectable?: boolean;
  selected?: boolean;
};

/** Checks if current tree item has a subtree and it is expanded */
const isSubtreeExpanded = (props: TreeItemBehaviorProps): boolean => {
  const { hasSubtree, expanded } = props;
  return !!(hasSubtree && expanded);
};
