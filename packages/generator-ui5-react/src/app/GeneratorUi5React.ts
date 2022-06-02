import chalk from "chalk";
import Generator from "yeoman-generator";
import yosay from "yosay";

import pkg from "../../package.json";

interface Answers {
  appName: string;
  appTitle: string;
  appSubTitle: string;
  appIcon: string;
  appInfo: string;
  defaultLocale: string;
  semanticObject: string;
  actionName: string;
}

export class Ui5ReactGenerator extends Generator {
  public constructor(args: any, opts: any) {
    super(args, opts);
  }

  public initializing() {
    this.log(yosay(`Welcome to the ${chalk("UI5 React App generator")} (${pkg.version})`));
  }

  public async prompting() {
    const answers = await this.prompt<Answers>([
      {
        type: "input",
        name: "appName",
        default: this.appname,
        message: "The technical app name used in package.json:",
      },
      {
        type: "input",
        name: "appTitle",
        message: "Human readable app title:",
      },
      {
        type: "input",
        name: "appSubTitle",
        default: "",
        message: "Optional sub title for app (only shown on launchpad tile):",
      },
      {
        type: "input",
        name: "defaultLocale",
        default: "en-US",
        message: "Default locale to use for translations and i18n settings:",
      },
      {
        type: "input",
        name: "appIcon",
        default: "decision",
        message: 'App icon name without the "sap://" prefix (used for launchpad tile):',
      },
      {
        type: "input",
        name: "appInfo",
        default: "",
        message: "Optional app description (used for launchpad tile):",
      },
      {
        type: "input",
        name: "semanticObject",
        message: 'Semantic object name, e.g. "MyApp" (needed for launchpad & cross navigation):',
      },
      {
        type: "input",
        name: "actionName",
        message: 'Action name, e.g. "maintain" (needed for launchpad & cross navigation):',
      },
    ]);

    this.options.packageName = answers.appName;
    this.options.appTitle = answers.appTitle;
    this.options.appSubTitle = answers.appSubTitle;
    this.options.appInfo = answers.appInfo;
    this.options.appIcon = answers.appIcon;
    this.options.semanticObject = answers.semanticObject;
    this.options.actionName = answers.actionName;
  }

  public writing() {
    const staticFiles = [
      ".editorconfig",
      ".eslintrc.js",
      ".gitignore",
      ".prettierignore",
      ".prettierrc",
      "README.md",
      "tsconfig.json",
      "src/index.tsx",
      "src/index.ui5.tsx",
      "src/react-app-env.d.ts",
      "src/config/di.config.ts",
      "src/config/odata.config.ts",
      "src/domain/App.tsx",
      "src/domain/AppRouter.tsx",
      "src/domain/demo/TestScreen.tsx",
      "asset/locale/de.i18n.json",
      "asset/locale/en.i18n.json",
      "public/robots.txt",
    ];

    const templateFiles = [
      "craco.config.ts",
      "package.json",
      "src/appConfig.ts",
      "src/config/i18n.config.ts",
      "public/index.html",
    ];

    staticFiles.forEach(staticFile => {
      this.fs.copy(this.templatePath(staticFile), this.destinationPath(staticFile));
    });

    templateFiles.forEach(templateFile => {
      this.fs.copyTpl(this.templatePath(templateFile), this.destinationPath(templateFile), this.options);
    });
  }

  public end() {
    this.log("");
    this.log("");
    this.log("Thanks for using the generator!");
    this.log("Have fun creating great UI5 apps with React under the hood...");
  }
}
