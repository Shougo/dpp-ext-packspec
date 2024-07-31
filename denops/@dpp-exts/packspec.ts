import {
  Actions,
  BaseExt,
  Denops,
  Plugin,
} from "jsr:@shougo/dpp-vim@1.0.0/types";
import {
  isDirectory,
  safeStat,
} from "jsr:@shougo/dpp-vim@1.0.0/utils";

import { basename } from "jsr:@std/path@1.0.2";

type Packspec = {
  name?: string;
  description?: string;
  engines?: Record<string, string>;
  repository: {
    type: string;
    url: string;
  };
  dependencies?: Record<string, string>;
};

type Params = Record<string, never>;

type PackspecArgs = {
  basePath: string;
  plugins: Plugin[];
};

export class Ext extends BaseExt<Params> {
  override actions: Actions<Params> = {
    load: {
      description: "Load Packspec files",
      callback: async (args: {
        denops: Denops;
        actionParams: unknown;
      }) => {
        const params = args.actionParams as PackspecArgs;
        const plugins = [];
        const depends = new Set<string>();
        const pluginNames = new Set<string>();

        for (const plugin of params.plugins) {
          pluginNames.add(plugin.name);

          // Set default path from basePath
          const pluginPath = plugin.path ??
            `${params.basePath}/repos/${plugin.repo ?? plugin.name}`;
          const specPath = `${pluginPath}/pkg.json`;
          if (!await isDirectory(pluginPath) || !await safeStat(specPath)) {
            continue;
          }

          // Load packspec.
          const packspec = JSON.parse(
            await Deno.readTextFile(specPath),
          ) as Packspec;

          const packspecPlugin = {
            name: packspec.name ?? basename(packspec.repository.url),
            repo: packspec.repository.url,
          } as Plugin;

          if (packspec.dependencies) {
            // Add dependencies
            packspecPlugin.depends = Object.keys(packspec.dependencies).map((
              depend,
            ) => basename(depend));
            for (const url of Object.keys(packspec.dependencies)) {
              depends.add(url);
            }
          }

          plugins.push(packspecPlugin);
        }

        // Convert dependencies to plugins
        for (const url of depends) {
          const name = basename(url);
          if (!pluginNames.has(name)) {
            plugins.push({
              name: name,
              repo: url,
            });
          }
        }

        return plugins;
      },
    },
  };

  override params(): Params {
    return {};
  }
}
