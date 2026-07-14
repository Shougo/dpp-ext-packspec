import type { BaseParams, Plugin } from "@shougo/dpp-vim/types";
import { type Action, BaseExt } from "@shougo/dpp-vim/ext";
import { isDirectory, safeStat } from "@shougo/dpp-vim/utils";

import type { Denops } from "@denops/std";

import { basename } from "@std/path/basename";

export type Params = Record<string, never>;

export type Packspec = {
  name?: string;
  description?: string;
  engines?: Record<string, string>;
  repository: {
    type: string;
    url: string;
  };
  dependencies?: Record<string, string>;
};

export type PackspecArgs = {
  basePath: string;
  plugins: Plugin[];
};

export type ExtActions<Params extends BaseParams> = {
  load: Action<Params, Plugin[]>;
};

export class Ext extends BaseExt<Params> {
  override actions: ExtActions<Params> = {
    load: {
      description: "Load Packspec files",
      callback: async (args: {
        denops: Denops;
        actionParams: BaseParams;
      }) => {
        const params = args.actionParams as PackspecArgs;
        const plugins: Plugin[] = [];
        const depends = new Set<string>();
        const pluginNames = new Set<string>();

        for (const plugin of params.plugins) {
          if (plugin.name) {
            pluginNames.add(plugin.name);
          }

          const pluginPath = plugin.path ??
            `${params.basePath}/repos/${plugin.repo ?? plugin.name}`;
          const specPath = `${pluginPath}/pkg.json`;

          const hasPluginDir = await isDirectory(pluginPath);
          const hasSpecFile = !!await safeStat(specPath);
          if (!hasPluginDir || !hasSpecFile) {
            continue;
          }

          const content = await Deno.readTextFile(specPath);
          const packspec = JSON.parse(content) as Packspec;

          const pluginName = packspec.name ?? basename(packspec.repository.url);
          const packspecPlugin: Plugin = {
            name: pluginName,
            repo: packspec.repository.url,
          };

          if (packspec.dependencies) {
            packspecPlugin.depends = Object.keys(packspec.dependencies).map(
              (depend) => basename(depend),
            );

            for (const url of Object.keys(packspec.dependencies)) {
              depends.add(url);
            }
          }

          plugins.push(packspecPlugin);
        }

        for (const url of depends) {
          const name = basename(url);
          if (pluginNames.has(name)) {
            continue;
          }

          plugins.push({
            name,
            repo: url,
          });
        }

        return plugins;
      },
    },
  };

  override params(): Params {
    return {};
  }
}
