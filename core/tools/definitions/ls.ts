import { Tool } from "../..";

import { BUILT_IN_GROUP_NAME, BuiltInToolNames } from "../builtIn";
import { createSystemMessageExampleCall } from "../systemMessageTools/buildToolsSystemMessage";

export const lsTool: Tool = {
  type: "function",
  displayTitle: "ls",
  wouldLikeTo: "list files and folders in {{{ dirPath }}}",
  isCurrently: "listing files and folders in {{{ dirPath }}}",
  hasAlready: "listed files and folders in {{{ dirPath }}}",
  readonly: true,
  isInstant: true,
  group: BUILT_IN_GROUP_NAME,
  function: {
    name: BuiltInToolNames.LSTool,
    description: "List files and folders in a given directory",
    parameters: {
      type: "object",
      properties: {
        dirPath: {
          type: "string",
          description:
            "The directory path relative to the root of the project. Use forward slash paths like '/'. rather than e.g. '.'",
        },
        recursive: {
          type: "boolean",
          description:
            "If true, lists files and folders recursively. To prevent unexpected large results, use this sparingly",
        },
      },
    },
  },
  systemMessageDescription: createSystemMessageExampleCall(
    BuiltInToolNames.LSTool,
    `To list files and folders in a given directory, call the ${BuiltInToolNames.LSTool} tool with "dirPath" and "recursive". For example:`,
    [
      ["dirPath", "path/to/dir"],
      ["recursive", "false"],
    ],
  ),
};
