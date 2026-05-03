// remark-callouts
// ---------------------------------------------------------------------
// Converts container directives (:::note ... :::) into styled callouts.
// Pair this with `remark-directive` (which handles the parsing).
//
// Supported types: note, tip, important, warning, caution
// Default title:   the type name, capitalized
// Custom title:    use a directive label — `:::tip[Save typing]`
//
// Output (HTML):
//   <aside class="callout callout-note">
//     <p class="callout-label">Note</p>
//     <!-- body -->
//   </aside>

import { visit } from 'unist-util-visit';

const TYPES = new Set(['note', 'tip', 'important', 'warning', 'caution']);

const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function remarkCallouts() {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      if (!TYPES.has(node.name)) return;

      // Pull the directive label out of children if present (`:::tip[Title]`)
      const labelChild = node.children.find((c) => c.data?.directiveLabel);
      const titleChildren = labelChild
        ? labelChild.children
        : [{ type: 'text', value: titleCase(node.name) }];
      if (labelChild) {
        node.children = node.children.filter((c) => c !== labelChild);
      }

      // Prepend a styled label. Rendered as a <span> (matching the About
      // page's <aside class="callout"><span class="callout-label">...
      // pattern) so all callouts on the site share identical markup.
      node.children.unshift({
        type: 'paragraph',
        data: {
          hName: 'span',
          hProperties: { className: ['callout-label'] },
        },
        children: titleChildren,
      });

      // Wrap as <aside class="callout callout-{type}">
      node.data = node.data || {};
      node.data.hName = 'aside';
      node.data.hProperties = {
        className: ['callout', `callout-${node.name}`],
      };
    });
  };
}
