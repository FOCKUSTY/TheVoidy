export interface Activity {
  text: string;
  type: string;
}

export interface FeatureActivityFile {
  type: string;
  activities: string[];
}

export interface ActivitiesWithFile {
  file: string;
  activities: Activity[];
}
