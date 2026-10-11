import { readFileSync } from "fs";
import assert from "assert";

describe("Settings", () => {
  const settingPrefix = "vscode-tui-language-support.";

  const quotedValues = (source: string) => source.match(/"[^"]*"/g);

  // Reads the option keys and their allowed values off a `type` declaration,
  // e.g. `"table-literal": "brace" | "bracket" | "any";`.
  const getOptions = (fileName: string, typeName: string) => {
    const block =
      readFileSync(fileName, "utf-8").match(
        new RegExp(`export type ${typeName} = \\{([^}]*)\\}`),
      )?.[1] ?? "";

    assert(
      block !== "",
      `Could not find a '${typeName}' declaration in '${fileName}'`,
    );

    return block
      .split(";")
      .map((entry) => entry.trim())
      .filter((entry) => !!entry)
      .map((entry) => {
        const separator = entry.indexOf(":");

        return {
          key: entry.slice(0, separator).trim().replace(/"/g, ""),
          values: (values(entry.slice(separator + 1)) ?? []).map((value) =>
            value.replace(/"/g, ""),
          ),
        };
      });
  };

  const values = (source: string) => source.match(/"[^"]*"/g);

  const getConfiguration = () => {
    const properties = JSON.parse(readFileSync("package.json", "utf-8"))
      .contributes.configuration.properties;

    return Object.keys(properties)
      .filter((key) => key.startsWith(settingPrefix))
      .map((key) => ({
        key: key.replace(settingPrefix, ""),
        values: properties[key].enum,
        default: properties[key].default,
        description: properties[key].description,
      }));
  };

  const getReadmeSettings = () =>
    readFileSync("README.md", "utf-8")
      .split("\n")
      .map((line) =>
        line.match(/^\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/),
      )
      .filter((row) => !!row && (row?.[1] ?? "").startsWith(settingPrefix))
      .map((row) => ({
        key: (row?.[1] ?? "").replace(settingPrefix, ""),
        values: (row?.[2]?.match(/`[^`]+`/g) ?? []).map((value) =>
          value.replace(/`/g, ""),
        ),
        description: row?.[3] ?? "",
      }));

  const sameValues = (actual: string[], expected: string[]) =>
    [...actual].sort().join("|") === [...expected].sort().join("|");

  it("FormatterOptions", () => {
    const options = getOptions("src/server/formatter.ts", "FormatterOptions");
    const configuration = getConfiguration();
    const readmeSettings = getReadmeSettings();

    const keys = options.map((option) => option.key);

    assert(
      sameValues(
        keys,
        configuration.map((entry) => entry.key),
      ),
      "FormatterOptions and the package.json settings are out of sync",
    );
    assert(
      sameValues(
        keys,
        readmeSettings.map((entry) => entry.key),
      ),
      "FormatterOptions and the README settings are out of sync",
    );

    options.forEach((option) => {
      const setting = configuration.find((entry) => entry.key === option.key);
      const readmeSetting = readmeSettings.find(
        (entry) => entry.key === option.key,
      );

      assert(
        sameValues(option.values, setting?.values ?? []),
        `The package.json enum for '${option.key}' is out of sync with FormatterOptions`,
      );
      assert(
        sameValues(option.values, readmeSetting?.values ?? []),
        `The README values for '${option.key}' are out of sync with FormatterOptions`,
      );
      assert(
        (setting?.values ?? []).includes(setting?.default),
        `The default for '${option.key}' is not one of its enum values`,
      );
      assert.strictEqual(
        readmeSetting?.description,
        setting?.description,
        `The README description for '${option.key}' differs from package.json`,
      );
    });
  });
});
