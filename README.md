# dpp-ext-packspec

This ext implements packspec support.

https://github.com/neovim/packspec

NOTE: Plugin dependencies are only supported.
NOTE: Plugins must be installed to load packspec files.

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### dpp.vim

https://github.com/Shougo/dpp.vim

## Configuration

```typescript
const [context, options] = await args.contextBuilder.get(args.denops);

const packspecPlugins = await args.dpp.extAction(
  args.denops,
  context,
  options,
  "packspec",
  "load",
  {
    basePath,
    plugins,
  },
) as Plugin[] | undefined;
```
