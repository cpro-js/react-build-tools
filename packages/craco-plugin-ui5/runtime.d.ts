export interface CustomAppOptions {
  rootNode: Element;
  context: {
    startupParameters: {
      [key: string]: Array<string>;
    };
    locale: string;
    theme: string;
    animationMode: "full" | "basic" | "minimal" | "none";
  };
  /**
   * Launchpad object is available for Apps that were started via Launchpad.
   */
  launchpad?: {
    /**
     * Semantic object of the app
     */
    semanticObject?: string;
    /**
     * Action  of the app
     */
    action?: string;
    /**
     * Set launchpad app title
     * @param title The new title. The default title is set if this argument is not given.
     */
    setTitle(title?: string): Promise<void>;
    /**
     * Displays the given hierarchy in the shell header.
     */
    setHierarchy(
      levels: Array<{
        /**
         * Title to show
         */
        title: string;
        /**
         * Description to show
         */
        subtitle?: string;
        /**
         * Icon to show
         */
        icon?: string;
        /**
         * Launchpad Intent with pattern #{emanticObject-action?start-param&/app-route?app-param
         */
        intent: string;
      }>
    ): Promise<void>;
    /**
     * Register custom function that will handle clicks on the launchpad back button
     * NOTE: You need to
     *
     * @param cb
     */
    setBackNavigation(cb: () => void): Promise<void>;

    /**
     * Checks whether the FLP has performed the first navigation. This method can be used to detect whether the current app was started directly, that is, without a previous navigation to another app, to the FLP home, or another target that adds an entry in the browser history.
     */
    isInitialNavigation(): Promise<boolean>;

    /**
     * Return to the home page of the Fiori launchpad
     */
    navigateToLaunchpad(): Promise<void>;

    /**
     * Navigate to an specified external target (e.g. different launchpad application)
     */
    navigateToExternal(target: {
      semanticObject: string;
      action: string;
      params?: { [key: string]: string };
    }): Promise<void>;
    /**
     * Sets a global dirty flag that prevents the user from loosing unsaved data, e.g. due to navigation away.
     *
     * @param dirty
     */
    setDirtyFlag(dirty: boolean): void;
    /**
     * Returns the current dirty flag
     */
    getDirtyFlag(): boolean;
  };

  /**
   * Apply new theme to UI5 Core/Launchpad.
   *
   * @param theme
   */
  setTheme(theme: string): void;

  /**
   * Attaches an event handler to handle theme changes
   * @param cb
   */
  subscribeToThemeChanges(cb: (theme: string) => void): void;

  /**
   * Apply new locale to UI5 Core/Launchpad.
   *
   * @param locale new locale in BCP-47 language list format, e.g de-DE, de, en-US, en
   */
  setLocale(locale: string): void;

  /**
   * Attaches an event handler to handle locale changes
   * @param cb
   */
  subscribeToLocaleChanges(cb: (locale: string) => void): void;
}

export function registerCustomApp(
  cb: (options: CustomAppOptions) => () => void
): void;
