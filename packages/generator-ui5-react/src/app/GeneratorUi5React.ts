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
  serverUrl: string;
  odataServicePath: string;
  sapClientForDev: number;
  sapClientForDeployment: number;
}

export class Ui5ReactGenerator extends Generator {
  public constructor(args: any, opts: any) {
    super(args, opts);
  }

  public initializing() {
    this.log(
      yosay(
        `Welcome to the ${chalk("UI5 React App generator")} (${pkg.version})`
      )
    );
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
        default: "en",
        message: "Default locale to use for translations and i18n settings:",
      },
      {
        type: "input",
        name: "appIcon",
        default: "decision",
        message:
          'App icon name without the "sap://" prefix (used for launchpad tile):',
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
        default: this.appname,
        message:
          'Semantic object name, e.g. "MyApp" (needed for launchpad & cross navigation):',
      },
      {
        type: "input",
        name: "actionName",
        default: "display",
        message:
          'Action name, e.g. "maintain" (needed for launchpad & cross navigation):',
      },
      {
        type: "input",
        name: "serverUrl",
        default: "https://services.odata.org",
        message: "Server URL",
      },
      {
        type: "input",
        name: "odataServicePath",
        default: "/TripPinRESTierService",
        message:
          "Absolute path to the OData service without host and starting with /:",
      },
      {
        type: "input",
        name: "sapClientForDeployment",
        default: "100",
        message: "Sap client to use for deployment:",
      },
      {
        type: "input",
        name: "sapClientForDev",
        default: "200",
        message: "Sap client to use for development (OData consumption):",
      },
    ]);

    this.options.packageName = answers.appName;
    this.options.appTitle = answers.appTitle;
    this.options.appSubTitle = answers.appSubTitle;
    this.options.appInfo = answers.appInfo;
    this.options.appIcon = answers.appIcon;
    this.options.semanticObject = answers.semanticObject;
    this.options.actionName = answers.actionName;
    this.options.defaultLocale = answers.defaultLocale;
    this.options.serverUrl = answers.serverUrl;
    this.options.odataServicePath = answers.odataServicePath;
    this.options.sapClientForDeployment = answers.sapClientForDeployment;
    this.options.sapClientForDev = answers.sapClientForDev;
  }

  public writing() {
    const staticFiles = [
      ".editorconfig",
      ".env.local",
      ".eslintrc.js",
      ".prettierignore",
      ".prettierrc",
      "craco.config.ts",
      "odata2ts.config.ts",
      "README.md",
      "tsconfig.json",
      "public/robots.txt",
      "src/index.tsx",
      "src/index.ui5.tsx",
      "src/react-app-env.d.ts",
      "src/setupProxy.js",
      "src/config/di.config.ts",
      "src/domain/App.tsx",
      "src/domain/AppRouter.tsx",
      "src/domain/demo/TestScreen.tsx",
      "src/asset/locale/de.i18n.json",
      "src/asset/locale/en.i18n.json",
      "src/asset/locale/en-GB.i18n.json",
      "src/asset/odata/odata-service.xml",
      "src/style/CssStyles.ts",
      "test/http-client.env.json",
      "test/main-odata.http",
    ];

    const templateFiles = [
      ".env",
      ".ui5deployrc",
      "package.json",
      "ui5.config.ts",
      "src/appConfig.ts",
      "src/config/i18n.config.ts",
      "src/config/odata.config.ts",
      "public/index.html",
    ];

    // .gitignore needs special treatment
    this.fs.copy(
      this.templatePath("gitignore"),
      this.destinationPath(".gitignore")
    );

    staticFiles.forEach((staticFile) => {
      this.fs.copy(
        this.templatePath(staticFile),
        this.destinationPath(staticFile)
      );
    });

    templateFiles.forEach((templateFile) => {
      this.fs.copyTpl(
        this.templatePath(templateFile),
        this.destinationPath(templateFile),
        this.options
      );
    });
  }

  public end() {
    this.log("");
    this.log("");
    this.log("Thanks for using the generator!");
    this.log("Have fun creating great UI5 apps with React under the hood...");
  }
}
