# dpp-ext-local

This ext implements packspec support.

https://github.com/neovim/packspec

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
    plugins,
  },
) as Plugin[];
```
