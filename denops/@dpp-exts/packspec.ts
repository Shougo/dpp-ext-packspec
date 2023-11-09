import {
  Actions,
  BaseExt,
  Plugin,
} from "https://deno.land/x/dpp_vim@v0.0.7/types.ts";
import { Denops } from "https://deno.land/x/dpp_vim@v0.0.7/deps.ts";

type Params = Record<string, never>;

type PackspecArgs = {
  plugins: Plugin[];
};

export class Ext extends BaseExt<Params> {
  override actions: Actions<Params> = {
    load: {
      description: "Load Packspec files",
      callback: async (_args: {
        denops: Denops;
        actionParams: unknown;
      }) => {
        return [];
      },
    },
  };

  override params(): Params {
    return {};
  }
}
