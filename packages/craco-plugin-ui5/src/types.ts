export interface LaunchpadTile {
  semanticObject: string;
  action: string;
  title: string;
  subtitle: string;
  info: string;
  icon: string;
  defaultParameters?: {
    [name: string]: string;
  };
  additionalParameters?: boolean;
}
