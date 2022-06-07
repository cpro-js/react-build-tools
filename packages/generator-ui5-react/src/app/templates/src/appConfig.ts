/**
 * Static configuration for our three apps.
 */
export const apps = [
  {
    title: "<%= appTitle %>",
    icon: "sap-icon://<%= appIcon %>",
    action: "<%= actionName %>",
    path: "/",
  },
];

export function getIntent(semanticObject: string, action: string, initialPath?: string) {
  return `#${semanticObject}-${action}${initialPath ? `?&${initialPath}` : ""}`;
}

/**
 * Get an app by its action name.
 * The first app is returned by default.
 *
 * @param action
 * @returns
 */
export function getAppByAction(action?: string) {
  return apps.find(app => app.action === action) ?? apps[0];
}

/**
 * Get an app by matching its path attribute as prefix of an actual path.
 * The first app is returned by default.
 *
 * @param path the actual path to match
 * @returns
 */
export function getAppByPath(path: string) {
  if (!path) {
    return apps[0];
  }

  return apps.slice(1).find(app => path.startsWith(app.path)) ?? apps[0];
}
