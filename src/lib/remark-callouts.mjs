// remark-callouts
// ---------------------------------------------------------------------
// Converts container directives (:::note ... :::) into styled callouts.
// Pair this with `remark-directive` (which handles the parsing).
//
// Supported types: note, tip, important, warning, caution, quote, dropdown, definition
// Default title:   the type name, capitalized (an icon is prefixed)
// Custom title:    use a directive label — `:::tip[Save typing]`
//                  For quote callouts, label is the attribution.
//                  For definition callouts, label is the term being defined;
//                  the title renders as "Definition: <term>".
//
// Output (HTML), most types:
//   <aside class="callout callout-note">
//     <span class="callout-label"><span class="callout-icon">ℹ️</span>Note</span>
//     <!-- body -->
//   </aside>
//
// Output (HTML), dropdown — a native collapsible (no icon, keeps its marker):
//   <details class="callout callout-dropdown">
//     <summary class="callout-label">Show more</summary>
//     <!-- body -->
//   </details>

import { visit } from 'unist-util-visit';

const TYPES = new Set(['note', 'tip', 'important', 'warning', 'caution', 'quote', 'dropdown', 'definition']);

// Default Iconify icon per type, rendered as <iconify-icon>. These inherit
// currentColor, so they pick up each callout's accent automatically. Override
// per-callout with a directive attribute: `:::tip[Title]{icon="mdi:bash"}`.
// Dropdown keeps its own chevron; quote has no visible label.
const ICONS = {
  note: 'mdi:information',
  tip: 'mdi:lightbulb-on',
  important: 'mdi:alert-circle',
  warning: 'mdi:alert',
  caution: 'mdi:fire',
  definition: 'mdi:book-open-variant',
};

const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function remarkCallouts() {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      if (!TYPES.has(node.name)) return;

      const isDropdown = node.name === 'dropdown';
      const isDefinition = node.name === 'definition';

      // Pull the directive label out of children if present (`:::tip[Title]`)
      const labelChild = node.children.find((c) => c.data?.directiveLabel);
      const customLabel = labelChild ? labelChild.children : null;
      if (labelChild) {
        node.children = node.children.filter((c) => c !== labelChild);
      }

      // Build the title. Definitions always read "Definition: <term>"; every
      // other type uses its custom label or the capitalized type name.
      let titleChildren;
      if (isDefinition) {
        titleChildren = customLabel
          ? [{ type: 'text', value: 'Definition: ' }, ...customLabel]
          : [{ type: 'text', value: 'Definition' }];
      } else {
        titleChildren = customLabel || [{ type: 'text', value: titleCase(node.name) }];
      }

      // Prefix the type icon as an <iconify-icon>. An explicit `{icon="..."}`
      // attribute on the directive overrides the per-type default.
      const icon = node.attributes?.icon || ICONS[node.name];
      if (icon && !isDropdown) {
        titleChildren = [
          {
            type: 'emphasis',
            data: {
              hName: 'iconify-icon',
              hProperties: { icon, className: ['callout-icon'], 'aria-hidden': 'true' },
            },
            children: [],
          },
          ...titleChildren,
        ];
      }

      // The label row. For dropdowns it's a <summary> (the clickable toggle,
      // which must be the first child of <details>), a <span> otherwise.
      node.children.unshift({
        type: 'paragraph',
        data: {
          hName: isDropdown ? 'summary' : 'span',
          hProperties: { className: ['callout-label'] },
        },
        children: titleChildren,
      });

      // Wrap as <details> for dropdowns, <aside class="callout callout-{type}">
      // for everything else.
      node.data = node.data || {};
      node.data.hName = isDropdown ? 'details' : 'aside';
      node.data.hProperties = {
        className: ['callout', `callout-${node.name}`],
      };
    });
  };
}
